"use client";

import * as React from "react";
import { useAtom } from "jotai";

import type { PresetShadowConfig } from "@rlz/registry";

import { CollapsibleProperties } from "../colapsible-properties";
import { ClassesField } from "../classes-field";

import { presetBuilderAtom } from "../../preset-builder";
import {
  addUtility,
  removeUtility,
  utilitiesOf,
  utilityName,
  writeCssValue,
} from "../../lib/preset-css";
import { designSystemShadowBox } from "../../lib/preset-shadows";

import { SliderRow } from "./components/slider-row";
import { ShadowBoxFields } from "./components/shadow-box-fields";
import { NewUtilityRow } from "./components/new-utility-row";

export function BaseProperties() {
  const [preset, setPreset] = useAtom(presetBuilderAtom);

  // The name being typed, why it was refused, and the one just declared: the last
  // of these is what puts the caret in the new field, ready for its classes.
  const [typedName, setTypedName] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [declared, setDeclared] = React.useState("");

  // The design system's four, then any class only this draft declares - the same
  // list the CSS editor shows, since both read the draft through one helper.
  const utilities = utilitiesOf(preset);

  const updateBase = (
    section: "typography" | "layout",
    key: string,
    value: number
  ) => {
    setPreset((prev) => ({
      ...prev,
      base: {
        ...prev.base,
        [section]: {
          ...prev.base[section],
          [key]: value,
        },
      },
    }));
  };

  const updateUtility = (name: string, classes: string) => {
    // The same write the CSS editor makes, so what counts as a rewrite of a shared
    // class - and what drops back to the design system's own - lives in one place.
    setPreset((prev) =>
      writeCssValue(prev, { kind: "utility", name }, classes)
    );
  };

  // The name is checked here so the reason can be shown, and `addUtility` checks it
  // again because it owns what may land in the draft.
  const createUtility = () => {
    const name = utilityName(typedName);

    if (!name) {
      setNameError("Name it with letters, digits, a dash or an underscore.");
      return;
    }

    if (utilities.some((utility) => utility.name === name)) {
      setNameError(`.${name} is already defined.`);
      return;
    }

    setNameError("");
    setTypedName("");
    setDeclared(name);
    setPreset((prev) => addUtility(prev, name));
  };

  const removeOwnUtility = (name: string) => {
    setPreset((prev) => removeUtility(prev, name));

    if (declared === name) setDeclared("");
  };

  // The box the draft carries, or the one the shipped preset declares: a field shows
  // what the app would draw if the preset said nothing about shadows. A design system
  // whose preset names no box has no shadow to edit here, and the section stays out.
  const shadow = preset.base.shadows ?? designSystemShadowBox;

  const updateShadow = (key: keyof PresetShadowConfig, value: string) => {
    // The same write the CSS editor makes, so what counts as a retune of the box -
    // and what drops back to the design system's own - lives in one place.
    setPreset((prev) => writeCssValue(prev, { kind: "shadow", key }, value));
  };

  return (
    <section id="editor-base" className="h-full">
      <div className="px-2 py-3 flex flex-col gap-2">
        <CollapsibleProperties name="LETTER SPACING" defaultOpen>
          <SliderRow
            label="Tracking"
            value={preset.base.typography.letterSpacing}
            min={-0.1}
            max={0.5}
            step={0.01}
            unit="em"
            onChange={(value) =>
              updateBase("typography", "letterSpacing", value)
            }
          />
        </CollapsibleProperties>

        <CollapsibleProperties name="RADIUS" defaultOpen>
          <SliderRow
            label="Radius"
            value={preset.base.layout.radius}
            min={0}
            max={2}
            step={0.05}
            unit="rem"
            onChange={(value) => updateBase("layout", "radius", value)}
          />
        </CollapsibleProperties>

        <CollapsibleProperties name="SPACING" defaultOpen>
          <SliderRow
            label="Spacing"
            value={preset.base.layout.spacing}
            min={0}
            max={1}
            step={0.05}
            unit="rem"
            onChange={(value) => updateBase("layout", "spacing", value)}
          />
        </CollapsibleProperties>

        {shadow && (
          <ShadowBoxFields box={shadow} onChange={updateShadow} />
        )}

        <CollapsibleProperties name="UTILITIES" defaultOpen>
          <div className="flex flex-col gap-2.5 px-2 py-2">
            {utilities.map((utility) => (
              <ClassesField
                key={utility.name}
                autoFocus={utility.name === declared}
                target={{
                  subject: utility.own ? "preset utility" : "shared utility",
                  part: `.${utility.name}`,
                  builtIn: utility.builtIn,
                  override: utility.override,
                }}
                onClasses={(classes) => updateUtility(utility.name, classes)}
                // A class of the design system's own is only ever rewritten; one the
                // preset declared can also be taken back out.
                onRemove={
                  utility.own ? () => removeOwnUtility(utility.name) : undefined
                }
              />
            ))}

            <NewUtilityRow
              name={typedName}
              error={nameError}
              onName={(value) => {
                setTypedName(value);
                // The complaint was about the text that is being changed.
                if (nameError) setNameError("");
              }}
              onAdd={createUtility}
            />
          </div>
        </CollapsibleProperties>
      </div>
    </section>
  );
}
