"use client";

import * as React from "react";
import { CircleAlert, LoaderCircle, RotateCcw } from "lucide-react";
import { Button } from "@rlz/ui/components/ui/button";
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
    <div data-source-preview={slug} className="flex min-h-full flex-col">
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-border/60 border-dashed bg-background/60 backdrop-blur-2xl px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <h2 className="truncate text-sm font-medium capitalize">
            {slug.replaceAll("-", " ")}
          </h2>
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          {pending ? (
            <span
              role="status"
              data-preview-status="pending"
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <LoaderCircle
                className="size-3 animate-spin"
                aria-hidden="true"
              />
              Updating
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={`size-1.5 rounded-full ${
                  error ? "bg-destructive" : "bg-emerald-500"
                }`}
                aria-hidden="true"
              />
              {error ? "Update failed" : "Live preview"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {view && (
            <Select
              value={chosenScenario}
              onValueChange={(value) => {
                if (typeof value === "string") setChosenScenario(value);
              }}
            >
              <Select.Trigger
                size="sm"
                className="w-44 text-xs"
                aria-label="Preview scenario"
              >
                <Select.Value>
                  {view.scenarios.find(({ id }) => id === chosenScenario)
                    ?.label ?? "All"}
                </Select.Value>
                <Select.Icon />
              </Select.Trigger>
              <Select.Popup>
                <Select.List>
                  {[{ id: "", label: "All" }, ...view.scenarios].map(
                    ({ id, label }) => (
                      <Select.Item key={id} value={id}>
                        <Select.ItemIndicator />
                        <Select.ItemText>{label}</Select.ItemText>
                      </Select.Item>
                    )
                  )}
                </Select.List>
              </Select.Popup>
            </Select>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={reset}
            aria-label="Reset source preview"
            title="Reset preview"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>
      {(error ||
        scenarioOnly.length > 0 ||
        unsupported.length > 0 ||
        !!view?.warnings.length) && (
        <div className="space-y-2 border-b bg-muted/20 px-5 py-3 text-xs text-muted-foreground">
          {error && (
            <p
              role="alert"
              data-preview-status="error"
              className="flex items-start gap-2 text-destructive"
            >
              <CircleAlert
                className="mt-0.5 size-3.5 shrink-0"
                aria-hidden="true"
              />
              <span>
                {error} {view && "Keeping the last valid components."}
              </span>
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
      )}
      {view && (
        <SourcePreviewBoundary key={epoch} reset={reset}>
          <section aria-label="Preset preview" className="flex-1 px-5 sm:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col divide-y divide-border/50">
              {(chosenScenario
                ? view.scenarios.filter(({ id }) => id === chosenScenario)
                : view.scenarios
              ).map(({ id, label, Component, warning }) => (
                <div
                  key={id}
                  data-preview-scenario={id}
                  className="min-w-0 py-5"
                >
                  <h3 className="text-xs font-medium text-muted-foreground">
                    {label}
                  </h3>
                  <div className="flex min-h-44 items-center justify-center py-8">
                    <div className="flex w-full max-w-xl flex-col items-center gap-4">
                      {warning ? (
                        <p
                          role="status"
                          className="rounded-md border border-dashed bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground"
                        >
                          {warning}
                        </p>
                      ) : (
                        Component && <Component />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
