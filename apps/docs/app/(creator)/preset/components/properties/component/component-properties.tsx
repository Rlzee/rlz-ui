"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Select } from "@rlz/ui/components/ui/select";
import type { PresetComponentCustomization } from "@rlz/registry";
import { useSelectedComponent } from "@/hooks/use-selected-component";
import { getCapabilities } from "@/lib/component-capabilities";
import { partsOf } from "@rlz/ui/registry/resolve-capabilities";
import { slugFromId } from "../../../lib/slug";
import { currentBool, titleCase } from "../../../lib/component-edits";
import { appearanceFields, setAppearanceValue } from "../../../lib/appearance";
import {
  componentEditsAtom,
  setComponentEditAtom,
} from "../../../state/preset-builder";
import { CollapsibleProperties } from "../../shared/collapsible-properties";
import { AnimationProperties } from "./animation-properties";
import { VariantList } from "./variant-list";
import { AppearancePart } from "./appearance-part";
import { PartRow } from "./part-row";
import { BoolRow } from "./bool-row";

export function ComponentProperties() {
  const [selected] = useSelectedComponent();
  const edits = useAtomValue(componentEditsAtom);
  const setEdit = useSetAtom(setComponentEditAtom);
  const [appearanceParts, setAppearanceParts] = useState<
    Record<string, string>
  >({});
  const slug = selected ? slugFromId(selected.id) : "";
  const capabilities = getCapabilities(slug);
  const parts = partsOf(slug);
  if (!selected || !capabilities) return null;

  const edit = edits[slug];
  const update = (patch: PresetComponentCustomization) => setEdit(slug, patch);
  const appearanceBoxes = parts.map((part) => {
    const override = edit?.partClasses?.[part.name];
    const effective = override ?? part.classes;
    return { part, override, effective, fields: appearanceFields(effective) };
  });
  const selectedAppearance =
    appearanceBoxes.find(({ part }) => part.name === appearanceParts[slug]) ??
    appearanceBoxes[0];
  const partLabel = (name: string) =>
    name === "Root" ? selected.name : titleCase(name);

  return (
    <section id="editor-component" className="flex flex-col gap-2 px-2 py-3">
      {capabilities.variants?.map((axis) => (
        <CollapsibleProperties
          key={axis.name}
          name={titleCase(axis.name)}
          defaultOpen
        >
          <VariantList slug={slug} axis={axis} edit={edit} onUpdate={update} />
        </CollapsibleProperties>
      ))}
      {appearanceBoxes.length > 0 && (
        <CollapsibleProperties name="Appearance" defaultOpen>
          <div className="flex flex-col gap-3 px-2 py-2">
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-xs text-muted-foreground">
                Part
              </span>
              <Select
                value={selectedAppearance?.part.name ?? ""}
                onValueChange={(next) => {
                  if (
                    typeof next === "string" &&
                    parts.some((part) => part.name === next)
                  )
                    setAppearanceParts((current) => ({
                      ...current,
                      [slug]: next,
                    }));
                }}
              >
                <Select.Trigger
                  size="xs"
                  className="ml-auto min-w-0 max-w-52 flex-1"
                  aria-label="Appearance part"
                >
                  <Select.Value>
                    {selectedAppearance
                      ? partLabel(selectedAppearance.part.name)
                      : "Select part"}
                  </Select.Value>
                  <Select.Icon />
                </Select.Trigger>
                <Select.Popup
                  positionerProps={{ align: "start", className: "z-[60]" }}
                >
                  <Select.List>
                    {parts.map((part) => (
                      <Select.Item key={part.name} value={part.name}>
                        <Select.ItemIndicator />
                        <Select.ItemText>
                          {partLabel(part.name)}
                        </Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.List>
                </Select.Popup>
              </Select>
            </div>
            {appearanceBoxes
              .filter((box) => box === selectedAppearance)
              .map(({ part, override, effective, fields }) => (
                <AppearancePart
                  key={part.name}
                  slot={part.slot}
                  label={partLabel(part.name)}
                  fields={fields}
                  classes={effective}
                  edited={override !== undefined}
                  onValue={(prefix, value) => {
                    const next = setAppearanceValue(effective, prefix, value);
                    update({
                      partClasses: {
                        [part.name]: next === part.classes ? undefined : next,
                      },
                    });
                  }}
                />
              ))}
          </div>
        </CollapsibleProperties>
      )}
      <CollapsibleProperties name="Animations" defaultOpen>
        <AnimationProperties />
      </CollapsibleProperties>
      {parts.length > 0 && (
        <CollapsibleProperties name="Classes">
          <div className="flex flex-col gap-1 px-2 py-2">
            {parts.map((part) => (
              <PartRow
                key={part.name}
                part={part}
                label={partLabel(part.name)}
                override={edit?.partClasses?.[part.name]}
                onClasses={(classes) =>
                  update({
                    partClasses: {
                      [part.name]:
                        classes === part.classes ? undefined : classes,
                    },
                  })
                }
              />
            ))}
          </div>
        </CollapsibleProperties>
      )}
      {capabilities.editableProperties &&
        capabilities.editableProperties.length > 0 && (
          <CollapsibleProperties name="Properties" defaultOpen>
            <div className="flex flex-col">
              {capabilities.editableProperties.map((key) => (
                <BoolRow
                  key={key}
                  label={titleCase(key)}
                  checked={currentBool(key, edit)}
                  onChange={(checked) =>
                    update({ props: { [key]: checked ? "true" : "false" } })
                  }
                />
              ))}
            </div>
          </CollapsibleProperties>
        )}
    </section>
  );
}
