"use client";

import * as React from "react";
import type { AppearanceField as AppearanceFieldModel } from "../../../lib/appearance";
import {
  APPEARANCE_PROPERTIES,
  APPEARANCE_GROUPS,
  appearanceProperty,
} from "../../../lib/appearance-options";
import { Separator } from "@rlz/ui/components/ui/separator";
import { Button } from "@rlz/ui/components/ui/button";
import { Combobox } from "@rlz/ui/components/ui/combobox";
import { Plus } from "lucide-react";
import { AppearanceField } from "./appearance-field";

/** Appearance controls and the add menu share the parser's property registry. */
export function AppearancePart({
  label,
  fields,
  onValue,
}: {
  slot: string;
  label: string;
  fields: AppearanceFieldModel[];
  edited: boolean;
  onValue: (prefix: string, value: string) => void;
}) {
  const [adding, setAdding] = React.useState(false);
  const available = APPEARANCE_PROPERTIES.filter(
    ({ prefix }) => !fields.some((field) => field.prefix === prefix)
  );
  const groups = APPEARANCE_GROUPS.map((title) => ({
    title,
    fields: fields.filter(
      (field) => appearanceProperty(field.prefix)?.group === title
    ),
  })).filter((group) => group.fields.length > 0);
  const addableGroups = APPEARANCE_GROUPS.map((title) => ({
    title,
    options: available.filter((field) => field.group === title),
  })).filter((group) => group.options.length > 0);

  return (
    <div className="min-w-0">
      <div className="flex min-w-0 flex-col gap-2.5 px-1.5 pb-2 pt-1.5">
        {groups.map((group) => (
          <section
            key={group.title}
            aria-label={`${label}: ${group.title}`}
            className="min-w-0"
          >
            <div className="mb-1.5 flex items-center gap-2">
              <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                {group.title}
              </span>
              <Separator />
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              {group.fields.map((field) => (
                <AppearanceField
                  key={field.prefix}
                  field={field}
                  onValue={(value) => onValue(field.prefix, value)}
                />
              ))}
            </div>
          </section>
        ))}

        {available.length > 0 && (
          <div className="min-w-0 pt-0.5">
            {!adding ? (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="h-7 justify-start gap-1.5 px-1.5 text-xs text-muted-foreground"
                onClick={() => setAdding(true)}
                aria-label={`Add appearance property to ${label}`}
              >
                <Plus className="size-3.5" />
                Add property
              </Button>
            ) : (
              <div className="flex min-w-0 items-center gap-1.5">
                <Combobox
                  items={available.map(({ label }) => label)}
                  value={null}
                  onValueChange={(name) => {
                    const property = available.find(
                      ({ label }) => label === name
                    );
                    if (!property) return;
                    onValue(property.prefix, property.value);
                    setAdding(false);
                  }}
                >
                  <Combobox.Field
                    autoFocus
                    placeholder="Search properties…"
                    aria-label={`Search appearance properties for ${label}`}
                    className="min-w-0 flex-1"
                  />
                  <Combobox.Popup
                    positionerProps={{ side: "bottom", sideOffset: 4 }}
                  >
                    <Combobox.Empty>No properties found.</Combobox.Empty>
                    <Combobox.List className="max-h-64">
                      {addableGroups.map((group) => (
                        <Combobox.Group key={group.title}>
                          <Combobox.GroupLabel>
                            {group.title}
                          </Combobox.GroupLabel>
                          {group.options.map(({ prefix, label }) => (
                            <Combobox.Item key={prefix} value={label}>
                              <Combobox.ItemText>{label}</Combobox.ItemText>
                            </Combobox.Item>
                          ))}
                        </Combobox.Group>
                      ))}
                    </Combobox.List>
                  </Combobox.Popup>
                </Combobox>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="text-xs text-muted-foreground"
                  onClick={() => setAdding(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
