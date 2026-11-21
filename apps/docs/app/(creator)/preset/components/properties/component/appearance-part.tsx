"use client";

import * as React from "react";
import type { AppearanceField as AppearanceFieldModel } from "../../../lib/appearance";
import { isRounded } from "../../../lib/appearance";
import { cn } from "@rlz/ui/lib/cn";
import { Button } from "@rlz/ui/components/ui/button";
import { Combobox } from "@rlz/ui/components/ui/combobox";
import { Plus } from "lucide-react";
import { AppearanceField } from "./appearance-field";

type FieldGroup = { title: string; fields: AppearanceFieldModel[] };

// The same families supported by lib/appearance.ts. Only absent families can be added.
const ADDABLE = [
  ["p", "Padding"],
  ["px", "Padding X"],
  ["py", "Padding Y"],
  ["pt", "Padding Top"],
  ["pr", "Padding Right"],
  ["pb", "Padding Bottom"],
  ["pl", "Padding Left"],
  ["ps", "Padding Start"],
  ["pe", "Padding End"],
  ["gap", "Gap"],
  ["gap-x", "Gap X"],
  ["gap-y", "Gap Y"],
  ["rounded", "Rounded"],
  ["rounded-t", "Rounded Top"],
  ["rounded-r", "Rounded Right"],
  ["rounded-b", "Rounded Bottom"],
  ["rounded-l", "Rounded Left"],
  ["rounded-s", "Rounded Start"],
  ["rounded-e", "Rounded End"],
  ["rounded-tl", "Rounded Top Left"],
  ["rounded-tr", "Rounded Top Right"],
  ["rounded-bl", "Rounded Bottom Left"],
  ["rounded-br", "Rounded Bottom Right"],
  ["rounded-ss", "Rounded SS"],
  ["rounded-se", "Rounded SE"],
  ["rounded-es", "Rounded ES"],
  ["rounded-ee", "Rounded EE"],
] as const;

function groupFields(fields: AppearanceFieldModel[]): FieldGroup[] {
  const padding = fields.filter(
    (field) =>
      field.prefix === "p" || /^p(?:x|y|t|r|b|l|s|e)$/.test(field.prefix)
  );
  const gap = fields.filter(
    (field) =>
      field.prefix === "gap" ||
      field.prefix === "gap-x" ||
      field.prefix === "gap-y"
  );
  const radius = fields.filter((field) => isRounded(field.prefix));
  return [
    { title: "Padding", fields: padding },
    { title: "Gap", fields: gap },
    { title: "Border radius", fields: radius },
  ].filter((group) => group.fields.length > 0);
}

/** Appearance controls grouped by family, with an option to add missing utilities. */
export function AppearancePart({
  slot,
  label,
  fields,
  edited,
  onValue,
}: {
  slot: string;
  label: string;
  fields: AppearanceFieldModel[];
  edited: boolean;
  onValue: (prefix: string, value: string) => void;
}) {
  const [adding, setAdding] = React.useState(false);
  const available = ADDABLE.filter(
    ([prefix]) => !fields.some((field) => field.prefix === prefix)
  );
  const groups = groupFields(fields);
  const addableGroups = [
    {
      title: "Padding",
      options: available.filter(
        ([prefix]) => prefix === "p" || /^p[xytrblse]$/.test(prefix)
      ),
    },
    {
      title: "Gap",
      options: available.filter(([prefix]) => prefix.startsWith("gap")),
    },
    {
      title: "Border radius",
      options: available.filter(([prefix]) => isRounded(prefix)),
    },
  ].filter((group) => group.options.length > 0);

  function addProperty(prefix: string) {
    if (!available.some(([option]) => option === prefix)) return;
    // Non-empty initial values ensure a real utility is created immediately.
    // The field becomes editable as soon as the parent recomputes appearanceFields.
    onValue(
      prefix,
      isRounded(prefix) ? "lg" : prefix.startsWith("gap") ? "2" : "4"
    );
    setAdding(false);
  }

  return (
    <div className="min-w-0">
      <div title={slot} className="px-1.5 pt-2">
        <span
          className={cn(
            "block truncate text-xs font-medium",
            edited ? "text-primary" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
      </div>

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
              <div
                aria-hidden="true"
                className="h-px min-w-0 flex-1 bg-border/60"
              />
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
                  items={available.map(([, name]) => name)}
                  value={null}
                  onValueChange={(name) => {
                    const found = available.find(([, label]) => label === name);
                    if (found) addProperty(found[0]);
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
                      {addableGroups.map((group, index) => (
                        <React.Fragment key={group.title}>
                          <Combobox.Group>
                            <Combobox.GroupLabel>
                              {group.title}
                            </Combobox.GroupLabel>
                            {group.options.map(([prefix, name]) => (
                              <Combobox.Item key={prefix} value={name}>
                                <Combobox.ItemText>{name}</Combobox.ItemText>
                              </Combobox.Item>
                            ))}
                          </Combobox.Group>
                        </React.Fragment>
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
