import type {
  PresetComponentCustomization,
  RegistryPreset,
} from "@rlz/registry";
import { partsOf } from "@rlz/ui/registry/resolve-capabilities";
import { cn } from "@rlz/ui/lib/cn";
import {
  appearanceFields,
  setAppearanceValue,
  splitClasses,
} from "./appearance";
import { setPartAnimation } from "./animation-apply";
import type { AnimationPhase } from "./animation-compiler";
import type { SavedAnimation } from "../state/animation-state";

// Creator-only batch selections. No group information belongs to a preset schema.
export type GroupMember = { component: string; part: string };
export type StyleGroup = {
  id: string;
  name: string;
  description?: string;
  members: GroupMember[];
  values: Record<string, string>;
  classes?: string;
  animations?: Partial<Record<AnimationPhase, SavedAnimation>>;
};
export type ComponentEdits = Record<string, PresetComponentCustomization>;

export function defaultStyleGroups(): StyleGroup[] {
  const suggestions = [
    {
      id: "dialog-popups",
      name: "Dialog layout & transitions",
      description:
        "Only the layout and enter/exit classes repeated in all three dialog popups. Their different max-widths, padding and surfaces stay independent.",
      members: ["dialog", "alert-dialog", "command"].map((component) => ({
        component,
        part: "Popup",
      })),
    },
    {
      id: "selection-items",
      name: "Selection items",
      description:
        "Shared item typography, vertical padding, touch sizing and highlighted/hover states. Each component keeps its own horizontal spacing and indicators.",
      members: ["select", "combobox", "autocomplete"].map((component) => ({
        component,
        part: "Item",
      })),
    },
    {
      id: "floating-popups",
      name: "Floating popup surfaces",
      description:
        "The same border, radius, background, foreground and shadow in Select, Combobox and Menu. Popup padding, positioning and dimensions are not shared.",
      members: ["select", "combobox", "menu"].map((component) => ({
        component,
        part: "Popup",
      })),
    },
    {
      id: "option-group-labels",
      name: "Option group labels",
      description:
        "The identical group-label classes in Select, Combobox, Autocomplete and Menu.",
      members: ["select", "combobox", "autocomplete", "menu"].map(
        (component) => ({ component, part: "GroupLabel" })
      ),
    },
    {
      id: "selection-separators",
      name: "Selection separators",
      description:
        "The identical separator classes in Select, Combobox and Autocomplete. Menu is excluded because its horizontal margins differ.",
      members: ["select", "combobox", "autocomplete"].map((component) => ({
        component,
        part: "Separator",
      })),
    },
  ];
  return suggestions.flatMap((suggestion) => {
    const members = validGroupMembers(suggestion.members);
    if (members.length < 2) return [];
    const shared = sharedPartStyles(
      members.map(
        ({ component, part }) =>
          partsOf(component).find(({ name }) => name === part)!.classes
      )
    );
    if (!shared.classes && !Object.keys(shared.values).length) return [];
    return [{ ...suggestion, members, ...shared }];
  });
}

/** Suggestions contain only literal classes and effective values present in every member. */
export function sharedPartStyles(classLists: string[]) {
  if (classLists.length < 2)
    return { classes: "", values: {} as Record<string, string> };
  const tokens = classLists.map((classes) => new Set(splitClasses(classes)));
  const fields = classLists.map(
    (classes) =>
      new Map(
        appearanceFields(classes).map((field) => [field.prefix, field.value])
      )
  );
  const common = [...tokens[0]!].filter((token) => {
    if (!tokens.every((list) => list.has(token))) return false;
    // A stale duplicate utility is not a shared effective appearance setting.
    return appearanceFields(token).every((field) =>
      fields.every((list) => list.get(field.prefix) === field.value)
    );
  });
  let classes = common.join(" ");
  const values: Record<string, string> = {};
  for (const field of appearanceFields(classes)) {
    if (field.value === "") continue; // Preserve bare `border` / `rounded` as classes.
    values[field.prefix] = field.value;
    classes = setAppearanceValue(classes, field.prefix, "");
  }
  return { classes, values };
}
export function validGroupMembers(members: GroupMember[]) {
  const seen = new Set<string>();
  return members.filter(({ component, part }) => {
    const key = JSON.stringify([component, part]);
    if (seen.has(key) || !partsOf(component).some(({ name }) => name === part))
      return false;
    seen.add(key);
    return true;
  });
}

export function groupsForPart(
  groups: StyleGroup[],
  component: string,
  part: string
) {
  return groups.filter((group) =>
    group.members.some(
      (member) => member.component === component && member.part === part
    )
  );
}

/** Writes ordinary partClasses, preserving every unrelated component edit. */
export function editGroupParts(
  edits: ComponentEdits,
  members: GroupMember[],
  transform: (current: string, original: string) => string
): ComponentEdits {
  const next = structuredClone(edits);
  for (const { component, part } of validGroupMembers(members)) {
    const original = partsOf(component).find(
      ({ name }) => name === part
    )!.classes;
    const current = next[component]?.partClasses?.[part] ?? original;
    const classes = transform(current, original);
    if (classes === current) continue;
    const partClasses = { ...next[component]?.partClasses };
    if (classes === original) delete partClasses[part];
    else partClasses[part] = classes;
    next[component] = {
      ...next[component],
      partClasses: Object.keys(partClasses).length ? partClasses : undefined,
    };
  }
  return next;
}

export function restoreGroupProperty(
  classes: string,
  original: string,
  prefix: string
) {
  const belongs = (token: string) =>
    appearanceFields(token).some((field) => field.prefix === prefix);
  return [
    ...splitClasses(classes).filter((token) => !belongs(token)),
    ...splitClasses(original).filter(belongs),
  ].join(" ");
}

export function replaceSharedClasses(
  current: string,
  previous: string,
  next: string
) {
  const removed = new Set(splitClasses(previous));
  return cn(
    splitClasses(current)
      .filter((token) => !removed.has(token))
      .join(" "),
    next
  );
}

/** Prepare the whole batch before committing: a compiler error changes nothing. */
export function animateGroupParts(
  preset: RegistryPreset,
  edits: ComponentEdits,
  members: GroupMember[],
  phase: AnimationPhase,
  saved: SavedAnimation
) {
  let nextPreset = preset;
  let nextEdits = structuredClone(edits);
  for (const { component, part } of validGroupMembers(members)) {
    const result = setPartAnimation(
      nextPreset,
      nextEdits[component],
      component,
      part,
      phase,
      saved.mode,
      saved.animation,
      nextEdits
    );
    nextPreset = result.preset;
    const partClasses = { ...nextEdits[component]?.partClasses };
    if (result.partClasses === undefined) delete partClasses[part];
    else partClasses[part] = result.partClasses;
    nextEdits[component] = {
      ...nextEdits[component],
      partClasses: Object.keys(partClasses).length ? partClasses : undefined,
    };
  }
  return { preset: nextPreset, edits: nextEdits };
}

export function applySavedGroupStyles(
  preset: RegistryPreset,
  edits: ComponentEdits,
  group: StyleGroup,
  members = group.members
) {
  let nextEdits = editGroupParts(edits, members, (current) => {
    let classes = group.classes ? cn(current, group.classes) : current;
    for (const [prefix, value] of Object.entries(group.values))
      classes = setAppearanceValue(classes, prefix, value);
    return classes;
  });
  let nextPreset = preset;
  for (const phase of ["enter", "exit"] as const) {
    const saved = group.animations?.[phase];
    if (saved) {
      const result = animateGroupParts(
        nextPreset,
        nextEdits,
        members,
        phase,
        saved
      );
      nextPreset = result.preset;
      nextEdits = result.edits;
    }
  }
  return { preset: nextPreset, edits: nextEdits };
}
