"use client";

import * as React from "react";

import { Input } from "@rlz/ui/components/ui/input";

/**
 * One editable value. It commits when the field is left, so a half-typed `oklch(0`
 * never reaches the draft, and Escape takes the stored value back without writing
 * it - the field is reverted before it blurs, and the blur must not undo that.
 */
export function ValueInput({
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
