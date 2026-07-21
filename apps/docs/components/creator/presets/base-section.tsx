"use client";

import * as React from "react";

import { CollapsibleItem } from "./collapsible-item";
import { FontSelect } from "@/components/font-select";
import { IconLibSelect } from "@/components/icon-lib-select";
import { Label } from "@rlz/ui/components/ui/label";
import { Slider } from "@rlz/ui/components/ui/slider";
import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";

import { defaultPreset } from "@rlz/ui/styles/presets";
const BASE = defaultPreset.base;
const RECOMMENDATIONS = defaultPreset.recommendations;

export function BaseSection() {
  return (
    <section id="editor-base" className="h-full">
      <div className="px-2 py-3 flex flex-col gap-2 border-b border-dashed mx-2">
        <CollapsibleItem triggerName="LETTER SPACING" defaultOpen>
          <SliderRow
            label="Tracking"
            value={BASE.typography.letterSpacing}
            min={-0.1}
            max={0.5}
            step={0.01}
            unit="em"
          />
        </CollapsibleItem>

        <CollapsibleItem triggerName="RADIUS" defaultOpen>
          <SliderRow
            label="Radius"
            value={BASE.layout.radius}
            min={0}
            max={2}
            step={0.05}
            unit="rem"
          />
        </CollapsibleItem>

        <CollapsibleItem triggerName="SPACING" defaultOpen>
          <SliderRow
            label="Spacing"
            value={BASE.layout.spacing}
            min={0}
            max={1}
            step={0.05}
            unit="rem"
          />
        </CollapsibleItem>
      </div>
      <div className="px-4 py-3 flex flex-col gap-2">
        <label className="text-center text-md">RECOMMENDATIONS</label>
        <CollapsibleItem triggerName="TYPOGRAPHY" defaultOpen>
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Label className="text-xs w-16 flex shrink-0 text-muted-foreground">
              Heading
            </Label>
            <FontSelect
              defaultValue={RECOMMENDATIONS?.typography?.headingFont}
            />
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Label className="text-xs w-16 flex shrink-0 text-muted-foreground">
              Body
            </Label>
            <FontSelect defaultValue={RECOMMENDATIONS?.typography?.bodyFont} />
          </div>
        </CollapsibleItem>

        <CollapsibleItem triggerName="ICON LIBRARY" defaultOpen>
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Label className="text-xs w-16 flex shrink-0 text-muted-foreground">
              Library
            </Label>
            <IconLibSelect defaultValue={RECOMMENDATIONS?.icons?.library} />
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
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}) {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <Label className="text-xs w-16 flex shrink-0 text-muted-foreground">
        {label}
      </Label>
      <Slider min={min} max={max} step={step} value={value} />
      <InputGroup className="w-38 h-7">
        <Input
          value={value}
          step={step}
          min={min}
          max={max}
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
