"use client";

import { useAtomValue, useSetAtom } from "jotai";
import type { PresetComponentCustomization } from "@rlz/registry";
import { Button } from "@rlz/ui/components/ui/button";
import { useSelectedComponent } from "@/hooks/use-selected-component";
import { getCapabilities } from "@/lib/component-capabilities";
import { partsOf } from "@rlz/ui/registry/resolve-capabilities";
import { slugFromId } from "../../lib/slug";
import { currentBool, titleCase } from "../../lib/component-edits";
import { appearanceFields, setAppearanceValue } from "../../lib/appearance";
import { componentEditsAtom, setComponentEditAtom } from "../../preset-builder";
import { animationStudioOpenAtom } from "../animation-studio/panel-state";
import { CollapsibleProperties } from "../colapsible-properties";
import { VariantList } from "./components/variant-list";
import { AppearancePart } from "./components/appearance-part";
import { PartRow } from "./components/part-row";
import { BoolRow } from "./components/bool-row";

export function ComponentProperties() {
  const [selected] = useSelectedComponent();
  const edits = useAtomValue(componentEditsAtom);
  const setEdit = useSetAtom(setComponentEditAtom);
  const openAnimationStudio = useSetAtom(animationStudioOpenAtom);

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

      <CollapsibleProperties name="Animations" defaultOpen>
        <div className="px-2 py-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => openAnimationStudio(true)}
          >
            Open Animation Studio
          </Button>
        </div>
      </CollapsibleProperties>

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
