"use client";

import * as React from "react";
import { Select } from "@rlz/ui/components/ui/select";
import { capabilitiesOf } from "@rlz/ui/registry/resolve-capabilities";
import { previewSelection } from "../../lib/source-preview/selection";
import type { PlaygroundState } from "../../lib/playground-state";
import { SourcePreviewRuntime } from "../../lib/source-preview/runtime";
import { sourcePreviewExternals } from "../../lib/source-preview/externals";
import type { SourcePreviewBundle } from "../../lib/source-preview/types";

type RenderedExample = {
  id: string;
  label: string;
  Component?: React.ComponentType;
  warning?: string;
  primary?: boolean;
};

export function SourceComponentPreview({
  slug,
  edits,
  onApplied,
}: Pick<PlaygroundState, "edits"> & {
  slug: string;
  onApplied: (edits: PlaygroundState["edits"]) => void;
}) {
  const [runtime, setRuntime] = React.useState(
    () => new SourcePreviewRuntime()
  );
  const [epoch, setEpoch] = React.useState(0);
  const [view, setView] = React.useState<{
    scenarios: RenderedExample[];
    warnings: string[];
  }>();
  const [error, setError] = React.useState("");
  const [pending, setPending] = React.useState(true);
  const [chosenScenario, setChosenScenario] = React.useState("");
  const serialized = JSON.stringify(edits);

  React.useEffect(() => {
    const controller = new AbortController();
    setPending(true);
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/preset/preview/source/compile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, edits: JSON.parse(serialized) }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(await response.text());
        const bundle: SourcePreviewBundle = await response.json();
        if (controller.signal.aborted) return;
        const next = runtime.load(bundle, sourcePreviewExternals(bundle));
        const snapshot = JSON.parse(serialized) as PlaygroundState["edits"];
        runtime.setSelection(previewSelection(slug, snapshot[slug]));
        setView({
          scenarios: next.scenarios,
          warnings: bundle.warnings,
        });
        onApplied(snapshot);
        setError("");
      } catch (error) {
        if (!controller.signal.aborted)
          setError(error instanceof Error ? error.message : String(error));
      } finally {
        if (!controller.signal.aborted) setPending(false);
      }
    }, 180);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [slug, serialized, runtime, onApplied]);

  const reset = () => {
    setRuntime(new SourcePreviewRuntime());
    setView(undefined);
    setError("");
    setEpoch((value) => value + 1);
  };
  const axes = new Set(
    capabilitiesOf(slug)?.variants?.map((axis) => axis.name)
  );
  const editable = new Set(capabilitiesOf(slug)?.editableProperties);
  const scenarioOnly = Object.keys(edits[slug]?.props ?? {}).filter(
    (key) => !axes.has(key) && editable.has(key)
  );
  const unsupported = Object.keys(edits[slug]?.props ?? {}).filter(
    (key) => !axes.has(key) && !editable.has(key)
  );

  return (
    <div data-source-preview={slug} className="flex flex-col">
      <div className="border-b p-3 text-xs">
        <strong>Source preview</strong>
        <p>Real transformed components, using the CLI preset engine.</p>
        <button className="mt-2 underline" onClick={reset}>
          Reset source preview
        </button>
        {pending && (
          <p role="status" data-preview-status="pending">
            Compiling source preview…
          </p>
        )}
        {error && (
          <p role="alert" data-preview-status="error">
            {error} {view && "Keeping the last valid components."}
          </p>
        )}
        {scenarioOnly.length > 0 && (
          <p role="status">
            Preview-only props, not installed defaults:{" "}
            {scenarioOnly.join(", ")}.
          </p>
        )}
        {unsupported.length > 0 && (
          <p role="status">
            Props not applied by this preview: {unsupported.join(", ")}.
          </p>
        )}
        {view?.warnings.map((warning, index) => (
          <p role="status" key={index}>
            {warning}
          </p>
        ))}
      </div>
      {view && (
        <SourcePreviewBoundary key={epoch} reset={reset}>
          <section aria-label="Preset preview" className="p-6">
            <h2 className="mb-6 text-xs text-muted-foreground">
              Preset preview · selected props
            </h2>
            <div className="mb-6 flex items-center gap-2 text-xs">
              <span>Scenario</span>
              <Select
                value={chosenScenario}
                onValueChange={(value) => {
                  if (typeof value === "string") setChosenScenario(value);
                }}
              >
                <Select.Trigger
                  size="xs"
                  className="max-w-60"
                  aria-label="Preview scenario"
                >
                  <Select.Value>
                    {view.scenarios.find(({ id }) => id === chosenScenario)
                      ?.label ?? "Default states"}
                  </Select.Value>
                  <Select.Icon />
                </Select.Trigger>
                <Select.Popup>
                  <Select.List>
                    {[
                      { id: "", label: "Default states" },
                      ...view.scenarios,
                    ].map(({ id, label }) => (
                      <Select.Item key={id} value={id}>
                        <Select.ItemIndicator />
                        <Select.ItemText>{label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.List>
                </Select.Popup>
              </Select>
            </div>
            {(chosenScenario
              ? view.scenarios.filter(({ id }) => id === chosenScenario)
              : view.scenarios.filter(({ primary }) => primary)
            ).map(({ id, label, Component, warning }) => (
              <div key={id} data-preview-scenario={id} className="mb-6">
                <h3 className="mb-3 text-xs text-muted-foreground">{label}</h3>
                {warning ? (
                  <p role="status" className="text-xs">
                    {warning}
                  </p>
                ) : (
                  Component && <Component />
                )}
              </div>
            ))}
          </section>
        </SourcePreviewBoundary>
      )}
    </div>
  );
}

class SourcePreviewBoundary extends React.Component<
  React.PropsWithChildren<{ reset: () => void }>,
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error)
      return (
        <div role="alert" data-preview-status="error" className="p-4 text-sm">
          The preview components could not render.{" "}
          <button className="underline" onClick={this.props.reset}>
            Reset source preview
          </button>
        </div>
      );
    return this.props.children;
  }
}
