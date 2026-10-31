"use client";

import { useAtom } from "jotai";

import { CollapsibleProperties } from "./colapsible-properties";
import { ClassesField } from "./classes-field";

import { designSystemUtilities } from "@rlz/ui/styles/utilities";
import type { DesignSystemUtility } from "@rlz/ui/styles/utilities";

import { Label } from "@rlz/ui/components/ui/label";
import { Slider } from "@rlz/ui/components/ui/slider";
import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";

import { presetBuilderAtom } from "../preset-builder";
import { writeCssValue } from "../lib/preset-css";

// The shared utility classes, in the order the design system's own sheet declares
// them: the four recipes its components borrow instead of restating.
const UTILITIES = Object.entries(designSystemUtilities) as [
  DesignSystemUtility,
  string,
][];

export function BaseProperties() {
  const [preset, setPreset] = useAtom(presetBuilderAtom);

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

  const updateUtility = (name: DesignSystemUtility, classes: string) => {
    // The same write the CSS editor makes, so what counts as a rewrite of a shared
    // class - and what drops back to the design system's own - lives in one place.
    setPreset((prev) =>
      writeCssValue(prev, { kind: "utility", name }, classes)
    );
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
            {UTILITIES.map(([name, builtIn]) => (
              <ClassesField
                key={name}
                target={{
                  subject: "shared utility",
                  part: `.${name}`,
                  builtIn,
                  override: preset.base.utilities?.[name],
                }}
                onClasses={(classes) => updateUtility(name, classes)}
              />
            ))}
          </div>
        </CollapsibleProperties>
      </div>
    </section>
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
