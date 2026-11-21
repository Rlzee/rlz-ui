"use client";

import * as React from "react";

import type {
  ComponentVariant,
  PresetComponentCustomization,
} from "@rlz/registry";

import {
  currentVariantOptions,
  currentVariantValue,
  titleCase,
  withVariantClasses,
  type VariantOption,
} from "../../../lib/component-edits";
import {
  variantClassSections,
  variantSectionClasses,
  type VariantClassSection,
} from "../../../lib/variant-classes";

import { Button } from "@rlz/ui/components/ui/button";
import { Input } from "@rlz/ui/components/ui/input";

import { Plus } from "lucide-react";

import { VariantRow } from "./variant-row";

/**
 * Editable list of the values an axis offers: one row per value, plus an "add"
 * field. A row is applied with one click, renamed in place, restyled (the
 * Tailwind classes of each part the value styles) and deleted. Everything is
 * stored on the preset (`customization.variants`) so the registry manifest keeps
 * the design system's built-in values untouched, and the applied value always
 * stays one of the listed ones: renaming the active row keeps it active,
 * deleting it falls back to the first remaining one.
 */
export function VariantList({
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
