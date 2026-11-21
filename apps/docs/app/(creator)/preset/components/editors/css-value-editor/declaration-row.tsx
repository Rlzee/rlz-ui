"use client";

import type { CssEntry, CssTarget } from "../../../lib/preset-css";

import { Line } from "./line";
import { ValueInput } from "./value-input";

// A color is a color whether it is a token or the shadow box drawn in it.
function isColorEntry(entry: CssEntry) {
  return (
    entry.target.kind === "color" ||
    (entry.target.kind === "shadow" && entry.target.key === "color")
  );
}

/**
 * A locked custom property (`--background:`) whose value alone is editable, shown
 * with the same swatch the Colors panel uses so a color reads as a color here too.
 */
export function DeclarationRow({
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
      {isColorEntry(entry) && (
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
