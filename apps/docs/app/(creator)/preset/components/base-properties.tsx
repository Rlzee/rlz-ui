"use client";

import * as React from "react";
import { useAtom } from "jotai";
import { Plus } from "lucide-react";

import { CollapsibleProperties } from "./colapsible-properties";
import { ClassesField } from "./classes-field";

import { Label } from "@rlz/ui/components/ui/label";
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

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      {/* <Label className="text-xs w-16 flex shrink-0 text-muted-foreground">
        {label}
      </Label> */}

      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(value) => onChange(value[0])}
      />

      <InputGroup className="w-38 h-7">
        <Input
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
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
