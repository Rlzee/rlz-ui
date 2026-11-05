"use client";

import * as React from "react";

import { Slider } from "@rlz/ui/components/ui/slider";
import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";

// The number a typed box holds, if it holds one yet. A decimal comma reads as a
// number too, because the box is typed by hand: `0,575` is the same radius.
function parsedNumber(raw: string) {
  return Number.parseFloat(raw.trim().replace(",", "."));
}

export function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  showLabel,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  /** for a section holding several rows: Shadows names each box it slides. */
  showLabel?: boolean;
}) {
  // The box keeps its own text: `0,` or an emptied field is not a value yet, and
  // writing one into the draft would be worse than keeping what it had - the whole
  // Tailwind radius and spacing scale is computed from these two numbers.
  const [text, setText] = React.useState(String(value));

  // Re-seed only when the number moved elsewhere (the slider, a Reset, an imported
  // preset), never over a half-written text that reads as that same number.
  React.useEffect(
    () =>
      setText((current) =>
        parsedNumber(current) === value ? current : String(value)
      ),
    [value]
  );

  const type = (raw: string) => {
    setText(raw);

    const number = parsedNumber(raw);

    if (Number.isFinite(number)) onChange(number);
  };

  return (
    <div className="flex items-center gap-3 px-2 py-2">
      {showLabel && (
        <span className="w-16 shrink-0 text-xs text-muted-foreground">
          {label}
        </span>
      )}

      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        aria-label={label}
        onValueChange={(value) => onChange(value[0])}
      />

      <InputGroup className="w-38 h-7">
        <Input
          value={text}
          step={step}
          min={min}
          max={max}
          aria-label={`${label} value`}
          onChange={(e) => type(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
            if (event.key === "Escape") setText(String(value));
          }}
          unstyled
          className="truncate font-mono text-xs"
        />

        <InputGroup.Addon align="inline-end">
          <InputGroup.Text>{unit}</InputGroup.Text>
        </InputGroup.Addon>
      </InputGroup>
    </div>
  );
}
