"use client";

import * as React from "react";
import { useAtom } from "jotai";
import { Plus } from "lucide-react";

import {
  designSystemShadowBox,
  designSystemShadowFields,
  type PresetShadowConfig,
} from "@rlz/registry";

import { CollapsibleProperties } from "./colapsible-properties";
import { ClassesField } from "./classes-field";
import { TailwindColorsSelector } from "@/components/tailwind-colors-selector";

import { Slider } from "@rlz/ui/components/ui/slider";
import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Button } from "@rlz/ui/components/ui/button";
import { cn } from "@rlz/ui/lib/cn";

import { presetBuilderAtom } from "../preset-builder";
import {
  addUtility,
  removeUtility,
  utilitiesOf,
  utilityName,
  writeCssValue,
} from "../lib/preset-css";

// What each numeric field of the shadow box is worth sliding to: an alpha has no
// reach beyond one, a blur only grows one way. The units and labels come from the
// registry, so the form and the sheet can never name the box differently.
const SHADOW_SCALES = {
  opacity: { min: 0, max: 1, step: 0.01 },
  blur: { min: 0, max: 48, step: 1 },
  spread: { min: -24, max: 24, step: 1 },
  offsetX: { min: -32, max: 32, step: 1 },
  offsetY: { min: -32, max: 32, step: 1 },
} satisfies Record<
  Exclude<keyof PresetShadowConfig, "color">,
  { min: number; max: number; step: number }
>;

// The box as the form holds it: the color is picked, the rest are slid.
const SHADOW_FIELDS = designSystemShadowFields.flatMap(
  ({ key, label, unit }) =>
    key === "color" ? [] : [{ key, label, unit, ...SHADOW_SCALES[key] }]
);

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

  // The box the draft carries, or the one the design system ships: a field shows
  // what the app would draw if the preset said nothing about shadows.
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

        <CollapsibleProperties name="SHADOWS" defaultOpen>
          <div className="flex flex-col gap-0.5 px-2 py-2">
            <span className="px-2 text-[11px] text-muted-foreground">
              Each shadow-* step is drawn from this box.
            </span>

            <div className="flex items-center gap-2 px-2 py-1.5">
              <span className="w-16 shrink-0 text-xs text-muted-foreground">
                Color
              </span>

              <div
                className="size-5 shrink-0 rounded-sm border"
                style={{ background: shadow.color }}
              />

              <Input
                value={shadow.color}
                spellCheck={false}
                aria-label="Shadow color"
                onChange={(event) => updateShadow("color", event.target.value)}
                className="h-7 min-w-0 flex-1 truncate font-mono text-xs"
              />

              <TailwindColorsSelector
                value={shadow.color}
                onChange={(value) => updateShadow("color", value)}
              />
            </div>

            {SHADOW_FIELDS.map((field) => (
              <SliderRow
                key={field.key}
                showLabel
                label={field.label}
                value={shadow[field.key]}
                min={field.min}
                max={field.max}
                step={field.step}
                unit={field.unit}
                onChange={(value) => updateShadow(field.key, String(value))}
              />
            ))}
          </div>
        </CollapsibleProperties>

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

/**
 * The declaration of a utility of the preset's own. Only the name is asked for
 * here: the classes are written in the field that appears under it, so a new class
 * is authored exactly the way a shared one is retuned.
 */
function NewUtilityRow({
  name,
  error,
  onName,
  onAdd,
}: {
  name: string;
  error: string;
  onName: (name: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-border pt-2.5">
      <div className="flex items-center gap-2">
        <Input
          value={name}
          spellCheck={false}
          aria-label="Name of the new utility"
          placeholder="my-utility"
          onChange={(event) => onName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onAdd();
          }}
          className="h-8 flex-1 text-xs **:data-[slot=input]:h-8 **:data-[slot=input]:leading-8"
        />

        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus />
          Add
        </Button>
      </div>

      <span
        className={cn(
          "text-[11px]",
          error ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {error ||
          "Declares a class of the preset's own, written into @layer utilities."}
      </span>
    </div>
  );
}

// The number a typed box holds, if it holds one yet. A decimal comma reads as a
// number too, because the box is typed by hand: `0,575` is the same radius.
function parsedNumber(raw: string) {
  return Number.parseFloat(raw.trim().replace(",", "."));
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  showLabel,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  /** for a section holding several rows: Shadows names each box it slides. */
  showLabel?: boolean;
}) {
  // The box keeps its own text: `0,` or an emptied field is not a value yet, and
  // writing one into the draft would be worse than keeping what it had - the whole
  // Tailwind radius and spacing scale is computed from these two numbers.
  const [text, setText] = React.useState(String(value));

  // Re-seed only when the number moved elsewhere (the slider, a Reset, an imported
  // preset), never over a half-written text that reads as that same number.
  React.useEffect(
    () =>
      setText((current) =>
        parsedNumber(current) === value ? current : String(value)
      ),
    [value]
  );

  const type = (raw: string) => {
    setText(raw);

    const number = parsedNumber(raw);

    if (Number.isFinite(number)) onChange(number);
  };

  return (
    <div className="flex items-center gap-3 px-2 py-2">
      {showLabel && (
        <span className="w-16 shrink-0 text-xs text-muted-foreground">
          {label}
        </span>
      )}

      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        aria-label={label}
        onValueChange={(value) => onChange(value[0])}
      />

      <InputGroup className="w-38 h-7">
        <Input
          value={text}
          step={step}
          min={min}
          max={max}
          aria-label={`${label} value`}
          onChange={(e) => type(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
            if (event.key === "Escape") setText(String(value));
          }}
          unstyled
          className="truncate font-mono text-xs"
        />

        <InputGroup.Addon align="inline-end">
          <InputGroup.Text>{unit}</InputGroup.Text>
        </InputGroup.Addon>
      </InputGroup>
    </div>
  );
}
