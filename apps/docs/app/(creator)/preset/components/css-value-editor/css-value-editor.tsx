"use client";

import * as React from "react";
import { useSetAtom } from "jotai";
import type { RegistryPreset } from "@rlz/registry";

import {
  cssSheet,
  writeCssValue,
  type CssTarget,
} from "../../lib/preset-css";
import { presetBuilderAtom } from "../../preset-builder";

import { Line } from "./components/line";
import { DeclarationRow } from "./components/declaration-row";
import { UtilityRow } from "./components/utility-row";

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
