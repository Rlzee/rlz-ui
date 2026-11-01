"use client";

import * as React from "react";
import { useAtomValue, useSetAtom } from "jotai";

import type {
  ComponentVariant,
  PresetComponentCustomization,
} from "@rlz/registry";

import { useSelectedComponent } from "@/hooks/use-selected-component";
import { getCapabilities } from "@/lib/component-capabilities";
import { partsOf } from "@rlz/ui/registry/resolve-capabilities";

import { slugFromId } from "../lib/slug";
import {
  currentBool,
  currentVariantOptions,
  currentVariantValue,
  titleCase,
  withVariantClasses,
  type VariantOption,
} from "../lib/component-edits";
import {
  variantClassSections,
  variantSectionClasses,
  type VariantClassSection,
} from "../lib/variant-classes";
import {
  appearanceFields,
  setAppearanceValue,
  type AppearanceField,
} from "../lib/appearance";
import { componentEditsAtom, setComponentEditAtom } from "../preset-builder";

import { Button } from "@rlz/ui/components/ui/button";
import { Input } from "@rlz/ui/components/ui/input";
import { NumberField } from "@rlz/ui/components/ui/number-field";
import { Switch } from "@rlz/ui/components/ui/switch";
import { Toggle } from "@rlz/ui/components/ui/toggle";
import { cn } from "@rlz/ui/lib/cn";

import { Code, Plus, X } from "lucide-react";

import { CollapsibleProperties } from "./colapsible-properties";
import { ClassesField } from "./classes-field";

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

  // A box that sizes itself with padding/gap/radius utilities gets an Appearance
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

/**
 * Editable list of the values an axis offers: one row per value, plus an "add"
 * field. A row is applied with one click, renamed in place, restyled (the
 * Tailwind classes of each part the value styles) and deleted. Everything is
 * stored on the preset (`customization.variants`) so the registry manifest keeps
 * the design system's built-in values untouched, and the applied value always
 * stays one of the listed ones: renaming the active row keeps it active,
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

  // A renamed value has nothing to inherit from, so every class list it had -
  // its own override or the built-in classes of the old name - is snapshotted
  // onto it, part by part.
  function inheritClasses(option: VariantOption, from: string, to: string) {
    return variantClassSections(slug, axis, { ...option, value: from }).reduce(
      (next, section) =>
        withVariantClasses(next, section.part, variantSectionClasses(section)),
      { value: to } satisfies VariantOption
    );
  }

  function rename(from: string, to: string) {
    // An empty or already-taken name is refused (the row restores its value).
    if (!to || options.some((option) => option.value === to)) return false;

    writeList(
      options.map((option) =>
        option.value === from ? inheritClasses(option, from, to) : option
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
    // A brand-new value has no styling at all, so its class editors open right
    // away.
    setOpenValue(value);
  }

  function setClasses(
    value: string,
    classes: string,
    section: VariantClassSection
  ) {
    const next = classes.trim();

    writeList(
      options.map((option) =>
        option.value === value
          ? // Writing the built-in classes back drops the override, so this
            // section keeps inheriting what the design system ships.
            withVariantClasses(
              option,
              section.part,
              next === section.builtIn ? undefined : next
            )
          : option
      ),
      active
    );
  }

  return (
    <div className="flex flex-col gap-1 py-2 px-2">
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
            sections={variantClassSections(slug, axis, option)}
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
 * Row = inline-editable name + one class editor per styled part + delete.
 * Clicking anywhere on the row line applies the value, so the highlighted row is
 * the one in the preview. Both fields commit on blur and cancel on Escape, so a
 * half-typed value never lands in the preset.
 */
function VariantRow({
  option,
  active,
  removable,
  open,
  sections,
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
  sections: VariantClassSection[];
  onApply: () => void;
  onToggleOpen: () => void;
  onRename: (from: string, to: string) => boolean;
  onRemove: () => void;
  onClasses: (
    value: string,
    classes: string,
    section: VariantClassSection
  ) => void;
}) {
  const { value } = option;
  // The icon is lit as soon as any part of the value was restyled.
  const overridden = sections.some((section) => section.override !== undefined);

  const [text, setText] = React.useState(value);

  // Keep the field in sync with the stored value when it changes elsewhere
  // (Reset, JSON import, another row).
  React.useEffect(() => setText(value), [value]);

  function commitName() {
    const next = text.trim();
    if (!onRename(value, next)) setText(value);
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
        className="flex cursor-pointer items-center gap-0.5 pr-1.5 pl-3 py-1"
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
        <div className="flex flex-col gap-2.5 px-1.5 pb-2">
          {sections.map((section) => (
            <VariantClassField
              key={section.part ?? "self"}
              value={value}
              section={section}
              onClasses={onClasses}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The classes one section of a value carries: a part of a compound component, or
 * the whole component when the axis has no parts. Editing it stores an override on
 * that value; writing the built-in classes back removes it.
 */
function VariantClassField({
  value,
  section,
  onClasses,
}: {
  value: string;
  section: VariantClassSection;
  onClasses: (
    value: string,
    classes: string,
    section: VariantClassSection
  ) => void;
}) {
  return (
    <ClassesField
      target={{
        subject: value,
        part: section.part,
        builtIn: section.builtIn,
        override: section.override,
      }}
      onClasses={(classes) => onClasses(value, classes, section)}
    />
  );
}

/**
 * One box of the component - itself, or a part it exports - with the classes it was
 * authored with. Collapsed by default: a component can ship a dozen parts, and the
 * panel stays readable when only what is being tuned is open.
 */
function PartRow({
  part,
  label,
  override,
  onClasses,
}: {
  part: { slot: string; classes: string };
  label: string;
  override?: string;
  onClasses: (classes: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const edited = override !== undefined;

  return (
    <div
      className={cn(
        "rounded border border-border/60 transition-colors",
        open && "bg-accent/30"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        title={part.slot}
        className="flex w-full items-center gap-2 px-1.5 py-1 text-left"
      >
        <span
          className={cn(
            "flex-1 truncate text-xs",
            edited ? "text-primary" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
        <span className="shrink-0 text-[11px] text-muted-foreground">
          {edited ? "Custom" : part.classes ? "Built-in" : "Empty"}
        </span>
        <Code className="size-3.5 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="px-1.5 pb-2">
          <ClassesField
            target={{ subject: label, builtIn: part.classes, override }}
            onClasses={onClasses}
          />
        </div>
      )}
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

/**
 * One box's Appearance: a field for each padding/gap/radius family its classes
 * carry. The box is named like the Classes editor names it, and each field edits
 * only its own utility family, leaving the rest of the class string untouched.
 */
function AppearancePart({
  slot,
  label,
  fields,
  edited,
  onValue,
}: {
  slot: string;
  label: string;
  fields: AppearanceField[];
  edited: boolean;
  onValue: (prefix: string, value: string) => void;
}) {
  return (
    <div>
      <div title={slot} className="px-1.5 pt-1">
        <span
          className={cn(
            "block truncate text-xs",
            edited ? "text-primary" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
      </div>

      <div className="flex flex-col gap-3 px-1.5 py-1.5">
        {fields.map((field) => (
          <AppearanceField
            key={field.prefix}
            field={field}
            onValue={(value) => onValue(field.prefix, value)}
          />
        ))}
      </div>
    </div>
  );
}

// The radius scale the Creator offers as a segmented toggle. Tailwind names a
// corner by these steps, so a click writes `rounded-<step>` and the box's own
// value stays lit when it is one of them.
const RADIUS_OPTIONS = ["xs", "sm", "md", "lg", "xl", "full"];

// A gap/padding scale reads back as a number (`6`, `0.5`), so it is edited with a
// NumberField. Anything that is not a plain number - an arbitrary `[0.6rem]`, the
// `px` keyword - falls back to a free text field, so a value is never lost.
function scaleNumber(value: string): number | null {
  if (value.trim() === "") return null;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function isNumericScale(value: string): boolean {
  return value.trim() === "" || scaleNumber(value) !== null;
}

/**
 * One Appearance field: radius is a curated scale picked from a segmented toggle,
 * gap and padding use a NumberField when their value is a plain number, and any
 * other value (an arbitrary `[0.6rem]`, the `px` keyword) falls back to a free
 * text field. The label sits in a fixed column so controls line up.
 */
function AppearanceField({
  field,
  onValue,
}: {
  field: AppearanceField;
  onValue: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs text-muted-foreground">
        {field.label}
      </span>

      {field.prefix === "rounded" ? (
        <RadiusOptions value={field.value} onChange={onValue} />
      ) : isNumericScale(field.value) ? (
        <NumberScaleField
          value={field.value}
          label={field.label}
          onCommit={onValue}
        />
      ) : (
        <ScaleField
          value={field.value}
          label={field.label}
          onCommit={onValue}
        />
      )}
    </div>
  );
}

/**
 * The radius scale as a single-select Toggle group: its outline variant draws the
 * joined, rounded-end segmented bar, the current step stays pressed, and picking
 * one applies it at once. The group reports a wide value (a single string here,
 * since only one step is selected), so it is narrowed before it is written.
 */
function RadiusOptions({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Toggle.Group
      variant="outline"
      size="xs"
      value={value ? [value] : []}
      aria-label="Radius"
      className="flex-1"
      onValueChange={(next) => {
        // A single-select group keeps the whole pressed set, so only one step is
        // ever in it; read that one back as the radius value.
        const picked = next[0];

        if (typeof picked === "string") onChange(picked);
      }}
    >
      {RADIUS_OPTIONS.map((option, index) => (
        <React.Fragment key={option}>
          <Toggle value={option} className="flex-1 font-mono">
            {option}
          </Toggle>

          {index < RADIUS_OPTIONS.length - 1 && <Toggle.GroupSeparator />}
        </React.Fragment>
      ))}
    </Toggle.Group>
  );
}

/**
 * A numeric gap/padding scale, edited with the package NumberField: the steppers
 * and typing both commit on blur, and an emptied field drops the utility. It is
 * keyed by the stored value so a Reset, a sibling edit or the Classes field
 * re-seeds this otherwise uncontrolled input.
 */
function NumberScaleField({
  value,
  label,
  onCommit,
}: {
  value: string;
  label: string;
  onCommit: (value: string) => void;
}) {
  const initial = scaleNumber(value);

  return (
    <NumberField
      key={value}
      min={0}
      step={0.5}
      defaultValue={initial ?? undefined}
      onValueCommitted={(next) =>
        onCommit(next === null || Number.isNaN(next) ? "" : String(next))
      }
    >
      <NumberField.Group className="h-7">
        <NumberField.Decrement className="h-7 [&_svg]:size-3.5" />
        <NumberField.Input aria-label={label} className="h-7 w-full text-xs" />
        <NumberField.Increment className="h-7 [&_svg]:size-3.5" />
      </NumberField.Group>
    </NumberField>
  );
}

/**
 * A free scale value. It commits on blur or Enter and cancels on Escape, so a
 * half-typed value never lands in the preset; an unchanged blur writes nothing,
 * which keeps a bare utility from being dropped by focusing it and tabbing away.
 */
function ScaleField({
  value,
  label,
  onCommit,
}: {
  value: string;
  label: string;
  onCommit: (value: string) => void;
}) {
  const [text, setText] = React.useState(value);

  // Keep the field in sync when the stored value changes elsewhere (Reset, a
  // sibling field of the same box, the Classes editor).
  React.useEffect(() => setText(value), [value]);

  return (
    <Input
      value={text}
      unstyled
      aria-label={label}
      placeholder="—"
      onChange={(event) => setText(event.target.value)}
      onBlur={() => {
        if (text !== value) onCommit(text);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") {
          setText(value);
          event.currentTarget.blur();
        }
      }}
      className="h-7 flex-1 truncate font-mono text-xs"
    />
  );
}
