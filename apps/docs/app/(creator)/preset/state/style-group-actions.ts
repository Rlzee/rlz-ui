import { atom } from "jotai";
import { appearanceFields, setAppearanceValue } from "../lib/appearance";
import { appearanceProperty } from "../lib/appearance-options";
import {
  editGroupParts,
  restoreGroupProperty,
  replaceSharedClasses,
  animateGroupParts,
  applySavedGroupStyles,
  validGroupMembers,
  type StyleGroup,
  type GroupMember,
} from "../lib/style-groups";
import type { AnimationPhase } from "../lib/animation-compiler";
import type { SavedAnimation, AnimationSettings } from "./animation-state";
import { animationSettingsAtom, animationSettingKey } from "./animation-state";
import { componentEditsAtom, presetBuilderAtom } from "./preset-builder";
import { styleGroupsAtom } from "./style-group-state";

function saveGroup(groups: StyleGroup[], group: StyleGroup) {
  return groups.map((item) => (item.id === group.id ? group : item));
}

function savedSettings(
  settings: AnimationSettings,
  group: StyleGroup,
  members: GroupMember[]
) {
  const next = { ...settings };
  for (const member of validGroupMembers(members)) {
    for (const phase of ["enter", "exit"] as const) {
      const saved = group.animations?.[phase];
      if (saved) {
        const key = animationSettingKey(member.component, member.part, phase);
        next[key] = structuredClone({
          ...saved,
          animation: saved.animation ?? settings[key]?.animation,
        });
      }
    }
  }
  return next;
}

/** Adding members applies the saved settings only to these new members. */
export const updateStyleGroupAtom = atom(
  null,
  (get, set, id: string, patch: Partial<StyleGroup>) => {
    const groups = get(styleGroupsAtom);
    const previous = groups.find((group) => group.id === id);
    if (!previous) return;
    const group = { ...previous, ...patch };
    group.members = validGroupMembers(group.members);
    const added = group.members.filter(
      (member) =>
        !previous.members.some(
          (item) =>
            item.component === member.component && item.part === member.part
        )
    );
    if (added.length) {
      const result = applySavedGroupStyles(
        get(presetBuilderAtom),
        get(componentEditsAtom),
        group,
        added
      );
      set(presetBuilderAtom, result.preset);
      set(componentEditsAtom, result.edits);
      set(
        animationSettingsAtom,
        savedSettings(get(animationSettingsAtom), group, added)
      );
    }
    set(styleGroupsAtom, saveGroup(groups, group));
  }
);

export const applyGroupAppearanceAtom = atom(
  null,
  (get, set, id: string, prefix: string, value: string | undefined) => {
    const groups = get(styleGroupsAtom);
    const group = groups.find((item) => item.id === id);
    if (!group || !appearanceProperty(prefix)) return;
    const nextValue = value?.trim();
    if (
      nextValue &&
      !appearanceFields(setAppearanceValue("", prefix, nextValue)).some(
        (field) => field.prefix === prefix
      )
    )
      return;
    const edits = editGroupParts(
      get(componentEditsAtom),
      group.members,
      (current, original) =>
        nextValue
          ? setAppearanceValue(current, prefix, nextValue)
          : restoreGroupProperty(current, original, prefix)
    );
    const values = { ...group.values };
    if (nextValue) values[prefix] = nextValue;
    else delete values[prefix];
    set(componentEditsAtom, edits);
    set(
      styleGroupsAtom,
      saveGroup(groups, {
        ...group,
        values,
        classes: setAppearanceValue(group.classes ?? "", prefix, ""),
      })
    );
  }
);

export const applyGroupClassesAtom = atom(
  null,
  (get, set, id: string, classes: string) => {
    const groups = get(styleGroupsAtom);
    const group = groups.find((item) => item.id === id);
    if (!group) return;
    const next = classes.trim();
    const edits = editGroupParts(
      get(componentEditsAtom),
      group.members,
      (current) => replaceSharedClasses(current, group.classes ?? "", next)
    );
    const values = { ...group.values };
    for (const field of appearanceFields(next)) delete values[field.prefix];
    set(componentEditsAtom, edits);
    set(
      styleGroupsAtom,
      saveGroup(groups, { ...group, classes: next, values })
    );
  }
);

export const applyGroupAnimationAtom = atom(
  null,
  (
    get,
    set,
    id: string,
    phase: AnimationPhase,
    saved: SavedAnimation | undefined
  ) => {
    const groups = get(styleGroupsAtom);
    const group = groups.find((item) => item.id === id);
    if (!group) return;
    const animations = { ...group.animations };
    if (saved) {
      const result = animateGroupParts(
        get(presetBuilderAtom),
        get(componentEditsAtom),
        group.members,
        phase,
        saved
      );
      set(presetBuilderAtom, result.preset);
      set(componentEditsAtom, result.edits);
      animations[phase] = structuredClone(saved);
      // Update only this phase; do not rewrite the group's other saved animation.
      set(
        animationSettingsAtom,
        savedSettings(
          get(animationSettingsAtom),
          { ...group, animations: { [phase]: saved } },
          group.members
        )
      );
    } else delete animations[phase];
    set(styleGroupsAtom, saveGroup(groups, { ...group, animations }));
  }
);

export const reapplyStyleGroupAtom = atom(null, (get, set, id: string) => {
  const group = get(styleGroupsAtom).find((item) => item.id === id);
  if (!group) return;
  const result = applySavedGroupStyles(
    get(presetBuilderAtom),
    get(componentEditsAtom),
    group
  );
  set(presetBuilderAtom, result.preset);
  set(componentEditsAtom, result.edits);
  set(
    animationSettingsAtom,
    savedSettings(get(animationSettingsAtom), group, group.members)
  );
});
