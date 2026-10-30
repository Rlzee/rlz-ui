"use client";

import * as React from "react";
import { useAtomValue, useSetAtom } from "jotai";

import type {
  ComponentStyleProperty,
  ComponentVariant,
  PresetComponentCustomization,
} from "@rlz/registry";

import { useSelectedComponent } from "@/hooks/use-selected-component";
import { getCapabilities } from "@/lib/component-capabilities";

import { slugFromId } from "../lib/slug";
import {
  currentBool,
  currentStyleValue,
  currentVariantOptions,
  currentVariantValue,
  titleCase,
  type VariantOption,
} from "../lib/component-edits";
import { builtinVariantClasses } from "../lib/variant-classes";
import { componentEditsAtom, setComponentEditAtom } from "../preset-builder";

import { Badge } from "@rlz/ui/components/ui/badge";
import { Button } from "@rlz/ui/components/ui/button";
import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Slider } from "@rlz/ui/components/ui/slider";
import { Switch } from "@rlz/ui/components/ui/switch";
import { Textarea } from "@rlz/ui/components/ui/textarea";
import { cn } from "@rlz/ui/lib/cn";

import { Code, Plus, X } from "lucide-react";

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
      {capabilities.variants?.map((axis) => (
        <CollapsibleProperties
          key={axis.name}
          name={titleCase(axis.name)}
          defaultOpen
        >
          <VariantList
            slug={slug}
            axis={axis}
            edit={edit}
            onUpdate={update}
          />
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

/**
 * Editable list of the values an axis offers: one row per value, plus an "add"
 * field. A row is applied with one click, renamed in place, restyled (its
 * Tailwind classes) and deleted. Everything is stored on the preset
 * (`customization.variants`) so the registry manifest keeps the design system's
 * built-in values untouched, and the applied value always stays one of the
 * listed ones: renaming the active row keeps it active under its new name,
 * deleting it falls back to the first remaining one.
 */
function VariantList({
  slug,
  axis,
  edit,
  onUpdate,
}: {
  slug: string;
  axis: ComponentVariant;
  edit?: PresetComponentCustomization;
  onUpdate: (patch: PresetComponentCustomization) => void;
}) {
  const options = currentVariantOptions(axis, edit);
  const active = currentVariantValue(axis, edit);
  const [draft, setDraft] = React.useState("");
  // Only one class editor is expanded at a time: the panel is narrow.
  const [openValue, setOpenValue] = React.useState<string | null>(null);

  // Classes the design system ships for this value ("" when it has none, e.g. a
  // component with no cva config or a value the Creator just created).
  function builtIn(value: string) {
    return builtinVariantClasses(slug, axis, value) ?? "";
  }

  // A list edit replaces the whole axis, then keeps the selection valid.
  function writeList(next: VariantOption[], nextActive: string) {
    onUpdate({
      variants: { [axis.name]: next },
      props: { [axis.name]: nextActive },
    });
  }

  // Applying a value only moves the chosen one, so the JSON stays lean.
  function apply(value: string) {
    onUpdate({ props: { [axis.name]: value } });
  }

  function rename(from: string, to: string) {
    // An empty or already-taken name is refused (the row restores its value).
    if (!to || options.some((option) => option.value === to)) return false;

    writeList(
      options.map((option) =>
        option.value === from
          ? // The new name has nothing to inherit from, so the classes the value
            // had until now (override or built-in) are snapshotted onto it.
            {
              value: to,
              classes: option.classes ?? (builtIn(from) || undefined),
            }
          : option
      ),
      active === from ? to : active
    );

    if (openValue === from) setOpenValue(to);

    return true;
  }

  function remove(value: string) {
    const next = options.filter((option) => option.value !== value);
    // An axis with no value left has nothing to select or export.
    if (next.length === 0) return;

    writeList(next, active === value ? next[0].value : active);

    if (openValue === value) setOpenValue(null);
  }

  function add() {
    const value = draft.trim();
    if (!value || options.some((option) => option.value === value)) return;

    writeList([...options, { value }], active);
    setDraft("");
    // A brand-new value has no styling at all, so its class editor opens right
    // away.
    setOpenValue(value);
  }

  function setClasses(value: string, classes: string) {
    const next = classes.trim();
    const inherited = builtIn(value);

    writeList(
      options.map((option) =>
        option.value === value
          ? // Matching the built-in classes again drops the override, so the
            // value keeps inheriting the design system.
            { value, classes: next === inherited ? undefined : next }
          : option
      ),
      active
    );
  }

  return (
    <div className="flex flex-col gap-1 px-2 py-2">
      <div
        role="group"
        aria-label={titleCase(axis.name)}
        className="flex flex-col gap-0.5"
      >
        {options.map((option) => (
          <VariantRow
            key={option.value}
            option={option}
            active={option.value === active}
            removable={options.length > 1}
            open={openValue === option.value}
            builtInClasses={builtIn(option.value)}
            onApply={() => apply(option.value)}
            onToggleOpen={() =>
              setOpenValue(openValue === option.value ? null : option.value)
            }
            onRename={rename}
            onRemove={() => remove(option.value)}
            onClasses={setClasses}
          />
        ))}
      </div>

      <form
        className="flex items-center gap-1.5"
        onSubmit={(event) => {
          event.preventDefault();
          add();
        }}
      >
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={`New ${axis.name}`}
          aria-label={`New value for ${titleCase(axis.name)}`}
          className="h-7 text-xs"
        />
        <Button
          type="submit"
          variant="outline"
          size="icon-xs"
          aria-label="Add value"
          disabled={!draft.trim()}
        >
          <Plus />
        </Button>
      </form>
    </div>
  );
}

/**
 * Row = inline-editable name + class editor + delete. Clicking anywhere on the
 * row line applies the value, so the highlighted row is the one in the preview.
 * Both fields commit on blur and cancel on Escape, so a half-typed value never
 * lands in the preset. The class field starts from the built-in classes of the
 * value; editing it stores an override, putting them back removes it.
 */
function VariantRow({
  option,
  active,
  removable,
  open,
  builtInClasses,
  onApply,
  onToggleOpen,
  onRename,
  onRemove,
  onClasses,
}: {
  option: VariantOption;
  active: boolean;
  removable: boolean;
  open: boolean;
  builtInClasses: string;
  onApply: () => void;
  onToggleOpen: () => void;
  onRename: (from: string, to: string) => boolean;
  onRemove: () => void;
  onClasses: (value: string, classes: string) => void;
}) {
  const { value, classes } = option;
  const overridden = classes !== undefined;
  // Classes in effect: the Creator's override, else what the design system ships.
  const effective = classes ?? builtInClasses;

  const [text, setText] = React.useState(value);
  const [css, setCss] = React.useState(effective);

  // Keep the fields in sync with the stored values when they change elsewhere
  // (Reset, JSON import, another row).
  React.useEffect(() => setText(value), [value]);
  React.useEffect(() => setCss(effective), [effective]);

  function commitName() {
    const next = text.trim();
    if (!onRename(value, next)) setText(value);
  }

  function commitClasses() {
    onClasses(value, css);
  }

  return (
    <div
      className={cn(
        "rounded transition-colors",
        active ? "bg-accent/70" : "hover:bg-accent/40"
      )}
    >
      <div
        title={active ? "Applied value" : "Click to apply"}
        onClick={onApply}
        className="flex cursor-pointer items-center gap-2 px-1.5 py-1"
      >
        <Input
          value={text}
          unstyled
          aria-label={`Rename ${value}`}
          onChange={(event) => setText(event.target.value)}
          onBlur={commitName}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              // Nothing to rename on this press, so Enter confirms the row and
              // applies it; a pending rename is left to the blur commit.
              if (text.trim() === value) onApply();
              event.currentTarget.blur();
            }
            if (event.key === "Escape") {
              setText(value);
              event.currentTarget.blur();
            }
          }}
          className="truncate font-mono text-xs"
        />

        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Classes of ${value}`}
          aria-expanded={open}
          // Opening the editor is not a way to apply the value.
          onClick={(event) => {
            event.stopPropagation();
            onToggleOpen();
          }}
          className={cn(
            "shrink-0",
            overridden
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Code />
        </Button>

        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Remove ${value}`}
          disabled={!removable}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X />
        </Button>
      </div>

      {open && (
        <div className="flex flex-col gap-1.5 px-1.5 pb-2">
          <Textarea
            value={css}
            rows={2}
            aria-label={`Classes of ${value}`}
            placeholder={
              builtInClasses || `No classes yet - define ${value}`
            }
            onChange={(event) => setCss(event.target.value)}
            onBlur={commitClasses}
            onKeyDown={(event) => {
              // Enter writes a newline here, so apply with Ctrl/Cmd+Enter.
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.currentTarget.blur();
              }
              if (event.key === "Escape") {
                setCss(effective);
                event.currentTarget.blur();
              }
            }}
            className="font-mono text-xs"
          />

          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground">
              {overridden
                ? "Custom classes"
                : builtInClasses
                  ? "Built-in classes"
                  : "No classes yet"}
            </span>
            {overridden && (
              <Button
                variant="ghost"
                size="xs"
                className="text-[11px]"
                onClick={() => onClasses(value, builtInClasses)}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
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
