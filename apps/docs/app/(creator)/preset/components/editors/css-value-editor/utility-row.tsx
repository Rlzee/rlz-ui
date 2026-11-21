"use client";

import type { CssEntry, CssTarget } from "../../../lib/preset-css";

import { Line } from "./line";
import { ValueInput } from "./value-input";

/**
 * A utility class of the preset's own: the selector and the `@apply` keyword are
 * locked, and only the class list written between them is editable.
 */
export function UtilityRow({
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
