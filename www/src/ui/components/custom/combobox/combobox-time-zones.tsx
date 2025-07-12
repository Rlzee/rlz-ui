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
  ComboboxTriggerButton,
} from "@/src/ui/components/combobox";
import { Check } from "lucide-react";
import { cn } from "@/src/lib/utils";

const timezones = Intl.supportedValuesOf("timeZone");

interface ComboboxTimezonesProps {
  onChange?: (value: string) => void;
}

const ComboboxTimezones = ({ onChange }: ComboboxTimezonesProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <Combobox open={open} onOpenChange={setOpen}>
      <ComboboxTrigger>
        <ComboboxTriggerButton placeholder={selected || "Select a timezone"} />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput placeholder="Search timezone..." />
        <ComboboxList>
          <ComboboxGroup>
            {timezones.map((tz) => (
              <ComboboxItem
                key={tz}
                onSelect={() => {
                  handleSelect(tz);
                  setOpen(false);
                }}
              >
                <span>{tz}</span>
                <Check
                  className={cn(
                    "ml-auto",
                    selected === tz ? "opacity-100" : "opacity-0"
                  )}
                />
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export { ComboboxTimezones };
