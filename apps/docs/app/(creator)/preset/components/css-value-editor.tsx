"use client";

import * as React from "react";
import { useSetAtom } from "jotai";
import type { RegistryPreset } from "@rlz/registry";

import { cn } from "@rlz/ui/lib/cn";
import { Input } from "@rlz/ui/components/ui/input";

import {
  cssSheet,
  writeCssValue,
  type CssEntry,
  type CssTarget,
} from "../lib/preset-css";
import { presetBuilderAtom } from "../preset-builder";

/**
 * The sheet the preview shows, with only its values open. Every locked piece of
 * text - the selector, the custom property, the `@apply` keyword - is rendered as
 * what it is here: a label. A value is the only thing in reach, which is the same
 * rule the design system gives its own theme, where a component keeps reading
 * `--background` whatever a preset decides it looks like.
 *
 * Writing goes through `writeCssValue`, so a field here and the slider, picker or
 * class editor that owns the same value cannot drift: they are one draft, seen
 * twice.
 */
export function CssValueEditor({ preset }: { preset: RegistryPreset }) {
  const setPreset = useSetAtom(presetBuilderAtom);
  const rules = React.useMemo(() => cssSheet(preset), [preset]);

  const write = (target: CssTarget, value: string) =>
    setPreset((prev) => writeCssValue(prev, target, value));

  // A block with nothing to edit - no color section, no recommendation - is left
  // out, exactly as the text rendering leaves it out.
  const sheet = rules.filter((rule) =>
    rule.groups.some((group) => group.entries.length > 0)
  );

  return (
    <div className="flex flex-col gap-3 px-4 py-3 font-mono text-xs">
      {sheet.map((rule) => (
        <section key={rule.selector}>
          <Line>{`${rule.selector} {`}</Line>

          {rule.shape === "rules"
            ? rule.groups
                .flatMap((group) => group.entries)
                .map((entry) => (
                  <UtilityRow key={entry.name} entry={entry} onWrite={write} />
                ))
            : rule.groups.map((group) => (
                <div key={group.title}>
                  <Line indent={1} muted>
                    {`/* ${group.title} */`}
                  </Line>

                  {group.entries.map((entry) => (
                    <DeclarationRow
                      key={entry.name}
                      entry={entry}
                      onWrite={write}
                    />
                  ))}
                </div>
              ))}

          <Line>{"}"}</Line>
        </section>
      ))}
    </div>
  );
}

function DeclarationRow({
  entry,
  onWrite,
}: {
  entry: CssEntry;
  onWrite: (target: CssTarget, value: string) => void;
}) {
  return (
    <Line indent={1} gap>
      <span className="shrink-0">{`${entry.name}:`}</span>

      {/* The swatch the Colors panel shows, so a value reads as a color here too. */}
      {entry.target.kind === "color" && (
        <span
          className="size-3.5 shrink-0 rounded-sm border"
          style={{ background: entry.value }}
        />
      )}

      <ValueInput
        label={entry.name}
        value={entry.value}
        onCommit={(value) => onWrite(entry.target, value)}
      />

      <span className="shrink-0">;</span>
    </Line>
  );
}

function UtilityRow({
  entry,
  onWrite,
}: {
  entry: CssEntry;
  onWrite: (target: CssTarget, value: string) => void;
}) {
  return (
    <>
      <Line indent={1}>{`.${entry.name} {`}</Line>

      <Line indent={2} gap>
        <span className="shrink-0">@apply</span>

        <ValueInput
          label={`.${entry.name}`}
          value={entry.value}
          onCommit={(value) => onWrite(entry.target, value)}
        />

        <span className="shrink-0">;</span>
      </Line>

      <Line indent={1}>{"}"}</Line>
    </>
  );
}

function Line({
  children,
  indent = 0,
  muted,
  gap,
}: {
  children: React.ReactNode;
  indent?: 0 | 1 | 2;
  muted?: boolean;
  gap?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-7 items-center whitespace-pre",
        muted && "text-muted-foreground",
        gap && "gap-2",
        indent === 1 && "pl-4",
        indent === 2 && "pl-8"
      )}
    >
      {children}
    </div>
  );
}

/**
 * One editable value. It commits when the field is left, so a half-typed `oklch(0`
 * never reaches the draft, and Escape takes the stored value back without writing
 * it - the field is reverted before it blurs, and the blur must not undo that.
 */
function ValueInput({
  label,
  value,
  onCommit,
}: {
  label: string;
  value: string;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = React.useState(value);
  const reverted = React.useRef(false);

  // Keep the field in sync with the stored value when it moves elsewhere (the
  // Colors panel, a Reset, an imported preset).
  React.useEffect(() => setDraft(value), [value]);

  return (
    <Input
      unstyled
      spellCheck={false}
      aria-label={`Value of ${label}`}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        if (reverted.current) {
          reverted.current = false;
          return;
        }

        onCommit(draft);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.currentTarget.blur();
        }

        if (event.key === "Escape") {
          reverted.current = true;
          setDraft(value);
          event.currentTarget.blur();
        }
      }}
      className="min-w-0 flex-1 text-xs **:data-[slot=input]:h-7"
    />
  );
}
