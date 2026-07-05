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
      <Combobox.Field onChange={(e: any) => setQuery(e?.target?.value ?? "")} />

      <Combobox.Popup
        positionerProps={{
          className: "z-60",
        }}
      >
        <Combobox.Empty>No font found.</Combobox.Empty>

        <Combobox.List>
          <Combobox.Group>
            {filteredFonts.map((font) => (
              <Combobox.Item
                key={font.family}
                value={font.family}
                className="justify-between"
              >
                <Combobox.ItemText className="grid gap-0.5">
                  <span
                  // style={{
                  //   fontFamily: `"${font.family}, ${font.category}`,
                  // }}
                  >
                    {font.family}
                  </span>
                  <span className="text-muted-foreground">{font.category}</span>
                </Combobox.ItemText>
                <Combobox.ItemIndicator className="order-last pr-3" />
              </Combobox.Item>
            ))}
          </Combobox.Group>
        </Combobox.List>
      </Combobox.Popup>
    </Combobox>
  );
}
