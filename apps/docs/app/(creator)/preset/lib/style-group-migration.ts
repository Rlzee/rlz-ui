import { partsOf } from "@rlz/ui/registry/resolve-capabilities";
import {
  appearanceFields,
  setAppearanceValue,
  splitClasses,
} from "./appearance";
import { APPEARANCE_PROPERTIES, utilityPrefix } from "./appearance-options";
import {
  defaultStyleGroups,
  groupsForPart,
  type StyleGroup,
  type ComponentEdits,
} from "./style-groups";

/** Replace only untouched initial proposals; never overwrite custom group settings. */
export function refreshLegacyGroupSuggestions(groups: StyleGroup[]) {
  const legacy = [
    {
      id: "dialog-popups",
      name: "Dialog popups",
      members: ["dialog", "alert-dialog", "command"],
      part: "Popup",
    },
    {
      id: "selection-items",
      name: "Selection items",
      members: ["select", "combobox", "autocomplete", "menu"],
      part: "Item",
    },
    {
      id: "floating-popups",
      name: "Floating popups",
      members: ["select", "combobox", "autocomplete", "menu", "popover"],
      part: "Popup",
    },
    {
      id: "text-fields",
      name: "Text fields",
      members: ["input", "textarea"],
      part: "Root",
    },
  ];
  const untouched = (group: StyleGroup) =>
    legacy.some(
      (proposal) =>
        proposal.id === group.id &&
        proposal.name === group.name &&
        !group.classes &&
        !Object.keys(group.values).length &&
        !Object.keys(group.animations ?? {}).length &&
        group.members.length === proposal.members.length &&
        proposal.members.every((component) =>
          group.members.some(
            (member) =>
              member.component === component && member.part === proposal.part
          )
        )
    );
  if (!groups.some(untouched)) return groups;
  const suggestions = defaultStyleGroups();
  const refreshed = groups.flatMap((group) => {
    if (!untouched(group)) return [group];
    const replacement = suggestions.find(({ id }) => id === group.id);
    return replacement ? [replacement] : [];
  });
  for (const suggestion of suggestions) {
    if (!refreshed.some(({ id }) => id === suggestion.id))
      refreshed.push(suggestion);
  }
  return refreshed;
}

/** One-time conversion of the first, layered group draft into ordinary edits. */
export function materializeLegacyGroupDraft(
  groups: StyleGroup[],
  edits: ComponentEdits,
  overrides: Record<string, Record<string, Record<string, string | null>>>
) {
  const next = structuredClone(edits);
  const components = new Set([
    ...groups.flatMap((group) =>
      group.members.map(({ component }) => component)
    ),
    ...Object.keys(overrides),
  ]);
  const replace = (classes: string, prefix: string, value: string | null) =>
    value === ""
      ? `${setAppearanceValue(classes, prefix, "")} ${utilityPrefix(
          prefix
        )}`.trim()
      : setAppearanceValue(classes, prefix, value ?? "");
  for (const component of components) {
    for (const part of partsOf(component)) {
      let classes = part.classes;
      for (const group of groupsForPart(groups, component, part.name)) {
        for (const [prefix, value] of Object.entries(group.values))
          classes = setAppearanceValue(classes, prefix, value);
      }
      const personal = edits[component]?.partClasses?.[part.name];
      if (personal !== undefined) {
        const originalTokens = splitClasses(part.classes);
        const personalTokens = splitClasses(personal);
        const removed = new Set(
          originalTokens.filter((token) => !personalTokens.includes(token))
        );
        classes = [
          ...splitClasses(classes).filter((token) => !removed.has(token)),
          ...personalTokens.filter((token) => !originalTokens.includes(token)),
        ].join(" ");
        const before = new Map(
          appearanceFields(part.classes).map((field) => [
            field.prefix,
            field.value,
          ])
        );
        const after = new Map(
          appearanceFields(personal).map((field) => [field.prefix, field.value])
        );
        for (const { prefix } of APPEARANCE_PROPERTIES) {
          if (before.get(prefix) !== after.get(prefix))
            classes = replace(classes, prefix, after.get(prefix) ?? null);
        }
      }
      for (const [prefix, value] of Object.entries(
        overrides[component]?.[part.name] ?? {}
      ))
        classes = replace(classes, prefix, value);
      const partClasses = { ...next[component]?.partClasses };
      if (classes === part.classes) delete partClasses[part.name];
      else partClasses[part.name] = classes;
      if (Object.keys(partClasses).length || next[component])
        next[component] = {
          ...next[component],
          partClasses: Object.keys(partClasses).length
            ? partClasses
            : undefined,
        };
    }
  }
  return next;
}
