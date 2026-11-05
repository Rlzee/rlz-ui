"use client";

import { useAtomValue, useSetAtom } from "jotai";

import type { PresetComponentCustomization } from "@rlz/registry";

import { useSelectedComponent } from "@/hooks/use-selected-component";
import { getCapabilities } from "@/lib/component-capabilities";
import { partsOf } from "@rlz/ui/registry/resolve-capabilities";

import { slugFromId } from "../../lib/slug";
import { currentBool, titleCase } from "../../lib/component-edits";
import {
  appearanceFields,
  setAppearanceValue,
} from "../../lib/appearance";
import { componentEditsAtom, setComponentEditAtom } from "../../preset-builder";

import { CollapsibleProperties } from "../colapsible-properties";

import { VariantList } from "./components/variant-list";
import { AppearancePart } from "./components/appearance-part";
import { PartRow } from "./components/part-row";
import { BoolRow } from "./components/bool-row";

/**
 * Auto-generated properties editor for a design-system component. It renders
 * ONLY the sections its capabilities declare: no variants -> no Variants block
 * (Card), no parts -> no Parts block (Button). Everything is driven by what the
 * component source exposes, so new components need no bespoke editor.
 */
export function ComponentProperties() {
  const [selected] = useSelectedComponent();
  const edits = useAtomValue(componentEditsAtom);
  const setEdit = useSetAtom(setComponentEditAtom);

  const slug = selected ? slugFromId(selected.id) : "";
  const capabilities = getCapabilities(slug);
  // Every box of the component, detected: the component itself as `Root`, then the
  // parts it exports. Their names drive the labels, their classes seed the fields.
  const parts = partsOf(slug);

  if (!selected || !capabilities) return null;

  const edit = edits[slug];
  const update = (patch: PresetComponentCustomization) => setEdit(slug, patch);

  // A box that sizes itself with padding/gap/rounded utilities gets an Appearance
  // field per family; a box whose classes carry none has nothing to offer here.
  const appearanceBoxes = parts
    .map((part) => {
      const override = edit?.partClasses?.[part.name];
      const effective = override ?? part.classes;

      return { part, override, effective, fields: appearanceFields(effective) };
    })
    .filter((box) => box.fields.length > 0);

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
          <div className="flex flex-col gap-1 px-2 py-2">
            {appearanceBoxes.map(({ part, override, effective, fields }) => (
              <AppearancePart
                key={part.name}
                slot={part.slot}
                label={
                  part.name === "Root" ? selected.name : titleCase(part.name)
                }
                fields={fields}
                edited={override !== undefined}
                onValue={(prefix, value) => {
                  // Rewrite only this utility inside the box's classes. Writing the
                  // built-in string back drops the override, so the box keeps
                  // inheriting what the design system ships - the Classes rule.
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

      {parts.length > 0 && (
        <CollapsibleProperties name="Classes">
          <div className="flex flex-col gap-1 px-2 py-2">
            {parts.map((part) => (
              <PartRow
                key={part.name}
                part={part}
                label={
                  part.name === "Root" ? selected.name : titleCase(part.name)
                }
                override={edit?.partClasses?.[part.name]}
                onClasses={(classes) =>
                  update({
                    // Writing the built-in classes back drops the override, so the
                    // part keeps inheriting what the design system ships.
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
