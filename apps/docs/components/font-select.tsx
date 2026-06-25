"use client";

import * as React from "react";
import { GOOGLE_FONTS } from "@rlz/fonts";
import { Combobox } from "@rlz/ui/components/ui/combobox";

type FontSelectProps = {
  value?: string;
  onValueChange?: (font: string) => void;
  defaultValue?: string;
};

export function FontSelect({
  value,
  onValueChange,
  defaultValue,
}: FontSelectProps) {
  const [query, setQuery] = React.useState("");

  const filteredFonts = React.useMemo(() => {
    if (!query) return GOOGLE_FONTS.slice(0, 200);
    return GOOGLE_FONTS.filter((f) =>
      f.family.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 200);
  }, [query]);

  const items = React.useMemo(
    () => filteredFonts.map((f) => f.family),
    [filteredFonts]
  );

  return (
    <Combobox
      items={items}
      value={value}
      onValueChange={(font) => font && onValueChange?.(font)}
      defaultValue={defaultValue}
    >
      <Combobox.Field
        clearable
        onChange={(e: any) => setQuery(e?.target?.value ?? "")}
      />

      <Combobox.Popup
        positionerProps={{
          className: "z-60",
        }}
      >
        <Combobox.Empty>No font found.</Combobox.Empty>

        <Combobox.List>
          <Combobox.Group>
            {filteredFonts.map((font) => (
              <Combobox.Item key={font.family} value={font.family}>
                <Combobox.ItemIndicator />

                <Combobox.ItemText
                  style={{
                    fontFamily: `"${font.family}", sans-serif`,
                  }}
                >
                  {font.family}
                </Combobox.ItemText>
              </Combobox.Item>
            ))}
          </Combobox.Group>
        </Combobox.List>
      </Combobox.Popup>
    </Combobox>
  );
}
