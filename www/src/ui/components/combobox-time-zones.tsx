"use client";

import { useState } from "react";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
} from "./combobox";

const timezones = Intl.supportedValuesOf("timeZone");

interface ComboboxTimezonesProps {
  onChange?: (value: string) => void;
}

export const ComboboxTimezones = ({ onChange }: ComboboxTimezonesProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange?.(value); // trigger callback if provided
  };

  return (
    <Combobox>
      <ComboboxTrigger placeholder={selected ?? "Select a timezone"} />
      <ComboboxContent>
        <ComboboxInput placeholder="Search timezone..." />
        <ComboboxList>
          <ComboboxGroup>
            {timezones.map((tz) => (
              <ComboboxItem key={tz} onSelect={() => handleSelect(tz)}>
                {tz}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
