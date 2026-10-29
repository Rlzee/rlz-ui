"use client";

import { useAtomValue, useSetAtom } from "jotai";

import type {
  ComponentStyleProperty,
  PresetComponentCustomization,
} from "@rlz/registry";

import { useSelectedComponent } from "@/hooks/use-selected-component";
import { getCapabilities } from "@/lib/component-capabilities";

import { slugFromId } from "../lib/slug";
import {
  currentBool,
  currentStyleValue,
  currentVariantValue,
  titleCase,
} from "../lib/component-edits";
import { componentEditsAtom, setComponentEditAtom } from "../preset-builder";

import { Badge } from "@rlz/ui/components/ui/badge";
import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Slider } from "@rlz/ui/components/ui/slider";
import { Switch } from "@rlz/ui/components/ui/switch";
import { Toggle } from "@rlz/ui/components/ui/toggle";

import { CollapsibleProperties } from "./colapsible-properties";

/**
 * Auto-generated properties editor for a design-system component. It renders
 * ONLY the sections its capabilities declare: no variants -> no Variants block
 * (Card), no parts -> no Parts block (Button). Everything is driven by the
 * declarative manifest, so new components need no bespoke editor.
 */
export function ComponentProperties() {
  const [selected] = useSelectedComponent();
  const edits = useAtomValue(componentEditsAtom);
  const setEdit = useSetAtom(setComponentEditAtom);

  const slug = selected ? slugFromId(selected.id) : "";
  const capabilities = getCapabilities(slug);

  if (!selected || !capabilities) return null;

  const edit = edits[slug];
  const update = (patch: PresetComponentCustomization) => setEdit(slug, patch);

  return (
    <section id="editor-component" className="flex flex-col gap-2 px-2 py-3">
      <div className="flex items-center gap-2 px-2 pb-1">
        <Badge variant="secondary">Detected</Badge>
        <span className="text-xs text-muted-foreground">{selected.name}</span>
      </div>

      {capabilities.variants?.map((axis) => (
        <CollapsibleProperties
          key={axis.name}
          name={titleCase(axis.name)}
          defaultOpen
        >
          <div className="flex flex-col gap-2 px-2 py-2">
            <SegmentedControl
              value={currentVariantValue(axis, edit)}
              options={axis.values}
              onChange={(value) => update({ props: { [axis.name]: value } })}
            />
            {axis.customizable && (
              <span className="text-[11px] text-muted-foreground">
                Customizable - new variants can be added later.
              </span>
            )}
          </div>
        </CollapsibleProperties>
      ))}

      {capabilities.styles && capabilities.styles.length > 0 && (
        <CollapsibleProperties name="Appearance" defaultOpen>
          <div className="flex flex-col">
            {capabilities.styles.map((style) => (
              <SliderRow
                key={style.key}
                style={style}
                value={currentStyleValue(style, edit)}
                onChange={(value) =>
                  update({ styles: { [style.key]: value } })
                }
              />
            ))}
          </div>
        </CollapsibleProperties>
      )}

      {capabilities.parts && capabilities.parts.length > 0 && (
        <CollapsibleProperties name="Parts">
          <div className="flex flex-wrap gap-1.5 px-2 py-2">
            {capabilities.parts.map((part) => (
              <Badge key={part} variant="outline">
                {part}
              </Badge>
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

      {capabilities.states && capabilities.states.length > 0 && (
        <CollapsibleProperties name="States">
          <div className="flex flex-wrap gap-1.5 px-2 py-2">
            {capabilities.states.map((state) => (
              <Badge key={state} variant="secondary">
                {state}
              </Badge>
            ))}
          </div>
        </CollapsibleProperties>
      )}
    </section>
  );
}

// Segmented single-select built on the existing Toggle.Group (the connected
// look from the mock). Selecting the active option is a no-op so one value is
// always kept.
function SegmentedControl({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <Toggle.Group
      variant="outline"
      size="sm"
      className="flex-wrap"
      value={[value]}
      onValueChange={(groupValue) => {
        const next = groupValue[groupValue.length - 1];
        if (next) onChange(next);
      }}
    >
      {options.map((option) => (
        <Toggle key={option} value={option}>
          {option}
        </Toggle>
      ))}
    </Toggle.Group>
  );
}

function SliderRow({
  style,
  value,
  onChange,
}: {
  style: ComponentStyleProperty;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 px-2 py-2">
      <span className="text-xs text-muted-foreground">{style.label}</span>
      <div className="flex items-center gap-3">
        <Slider
          min={style.min}
          max={style.max}
          step={style.step}
          value={[value]}
          onValueChange={(next) => onChange(next[0])}
        />
        <InputGroup className="h-7 w-28">
          <Input
            value={value}
            step={style.step}
            min={style.min}
            max={style.max}
            onChange={(event) => onChange(Number(event.target.value))}
            unstyled
            className="truncate font-mono text-xs"
          />
          <InputGroup.Addon align="inline-end">
            <InputGroup.Text>{style.unit}</InputGroup.Text>
          </InputGroup.Addon>
        </InputGroup>
      </div>
    </div>
  );
}

function BoolRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-2 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
