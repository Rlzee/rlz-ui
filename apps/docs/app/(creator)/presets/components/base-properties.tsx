"use client";

import { useAtom } from "jotai";

import { CollapsibleItem } from "./collapsible-item";
import { FontSelect } from "@/components/font-select";
import { IconLibSelect } from "@/components/icon-lib-select";

import { Label } from "@rlz/ui/components/ui/label";
import { Slider } from "@rlz/ui/components/ui/slider";
import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";

import { presetBuilderAtom } from "../preset-builder";

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

  const updateTypography = (
    key: "fontSans" | "fontHeading" | "fontMono",
    value: string
  ) => {
    setPreset((prev) => ({
      ...prev,
      recommendations: {
        ...prev.recommendations,
        typography: {
          fontSans: prev.recommendations?.typography?.fontSans ?? "",
          fontHeading: prev.recommendations?.typography?.fontHeading ?? "",
          fontMono: prev.recommendations?.typography?.fontMono ?? "",
          [key]: value,
        },
      },
    }));
  };

  const typography = {
    fontSans: preset.recommendations?.typography?.fontSans ?? "",
    fontHeading: preset.recommendations?.typography?.fontHeading ?? "",
    fontMono: preset.recommendations?.typography?.fontMono ?? "",
  };

  const iconLibrary = preset.recommendations?.icons?.library ?? "";

  return (
    <section id="editor-base" className="h-full">
      <div className="px-2 py-3 flex flex-col gap-2 border-b border-dashed mx-2">
        <CollapsibleItem triggerName="LETTER SPACING" defaultOpen>
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
        </CollapsibleItem>

        <CollapsibleItem triggerName="RADIUS" defaultOpen>
          <SliderRow
            label="Radius"
            value={preset.base.layout.radius}
            min={0}
            max={2}
            step={0.05}
            unit="rem"
            onChange={(value) => updateBase("layout", "radius", value)}
          />
        </CollapsibleItem>

        <CollapsibleItem triggerName="SPACING" defaultOpen>
          <SliderRow
            label="Spacing"
            value={preset.base.layout.spacing}
            min={0}
            max={1}
            step={0.05}
            unit="rem"
            onChange={(value) => updateBase("layout", "spacing", value)}
          />
        </CollapsibleItem>
      </div>

      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="grid gap-0 text-left pb-2">
          <label className="text-sm font-medium">RECOMMENDATIONS</label>

          <p className="text-xs text-muted-foreground">
            Optional defaults suggested when using this preset.
          </p>
        </div>

        <CollapsibleItem triggerName="TYPOGRAPHY" defaultOpen>
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Label className="text-xs w-16 shrink-0 text-muted-foreground">
              Sans
            </Label>

            <FontSelect
              value={typography.fontSans}
              onValueChange={(value) => updateTypography("fontSans", value)}
            />
          </div>

          <div className="flex items-center gap-3 px-2 py-1.5">
            <Label className="text-xs w-16 shrink-0 text-muted-foreground">
              Heading
            </Label>

            <FontSelect
              value={typography.fontHeading}
              onValueChange={(value) => updateTypography("fontHeading", value)}
            />
          </div>

          <div className="flex items-center gap-3 px-2 py-1.5">
            <Label className="text-xs w-16 shrink-0 text-muted-foreground">
              Mono
            </Label>

            <FontSelect
              value={typography.fontMono}
              onValueChange={(value) => updateTypography("fontMono", value)}
            />
          </div>
        </CollapsibleItem>

        <CollapsibleItem triggerName="ICON LIBRARY" defaultOpen>
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Label className="text-xs w-16 shrink-0 text-muted-foreground">
              Library
            </Label>

            <IconLibSelect value={iconLibrary} onValueChange={() => {}} />
          </div>
        </CollapsibleItem>
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
      <Label className="text-xs w-16 flex shrink-0 text-muted-foreground">
        {label}
      </Label>

      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onChange(values[0] ?? value)}
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
