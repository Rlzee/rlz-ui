import assert from "node:assert/strict";
import { test } from "node:test";
import { createStore } from "jotai";
import { RegistryPresetSchema } from "@rlz/registry";
import { defaultPreset } from "@rlz/ui/styles/presets";
import { partsOf } from "@rlz/ui/registry/resolve-capabilities";
import {
  appearanceFields,
  setAppearanceValue,
  splitClasses,
} from "../lib/appearance";
import {
  defaultStyleGroups,
  validGroupMembers,
  sharedPartStyles,
  type StyleGroup,
} from "../lib/style-groups";
import {
  materializeLegacyGroupDraft,
  refreshLegacyGroupSuggestions,
} from "../lib/style-group-migration";
import {
  componentEditsAtom,
  setComponentEditAtom,
  resetComponentEditsAtom,
  resetPresetAtom,
  importCreatorPresetAtom,
  presetBuilderAtom,
} from "../state/preset-builder";
import { styleGroupsAtom } from "../state/style-group-state";
import {
  applyGroupAppearanceAtom,
  applyGroupClassesAtom,
  applyGroupAnimationAtom,
  updateStyleGroupAtom,
  reapplyStyleGroupAtom,
} from "../state/style-group-actions";
import {
  animationLibraryAtom,
  animationSettingsAtom,
  animationSettingKey,
} from "../state/animation-state";
import { DEFAULT_ANIMATION } from "../lib/animation-model";

const valueOf = (classes: string, prefix: string) =>
  appearanceFields(classes).find((field) => field.prefix === prefix)?.value;
const popup = (component: string) =>
  partsOf(component).find(({ name }) => name === "Popup")!;
function setup() {
  const store = createStore();
  store.set(presetBuilderAtom, structuredClone(defaultPreset));
  store.set(componentEditsAtom, {});
  store.set(animationSettingsAtom, {});
  store.set(styleGroupsAtom, defaultStyleGroups());
  return store;
}
const classesOf = (store: ReturnType<typeof setup>, component: string) =>
  store.get(componentEditsAtom)[component]?.partClasses?.Popup ??
  popup(component).classes;
const animation = {
  ...structuredClone(DEFAULT_ANIMATION),
  keyframes: [
    { offset: 0, opacity: 0, rotate: 0 },
    { offset: 0.4, opacity: 0.8, rotate: 45 },
    { offset: 1, opacity: 1, rotate: 90 },
  ],
};

test("default groups contain actual duplicated classes and effective values, not invented defaults", () => {
  const store = setup();
  const groups = store.get(styleGroupsAtom);
  assert.equal(groups.length, 5);
  assert.ok(!groups.some(({ id }) => id === "text-fields"));
  for (const group of groups) {
    assert.ok(group.members.length >= 2);
    assert.ok(group.classes || Object.keys(group.values).length);
    for (const member of group.members) {
      const original = partsOf(member.component).find(
        ({ name }) => name === member.part
      )!.classes;
      const tokens = new Set(splitClasses(original));
      for (const token of splitClasses(group.classes ?? ""))
        assert.ok(
          tokens.has(token),
          `${group.name}: ${member.component}.${member.part} includes ${token}`
        );
      for (const [prefix, value] of Object.entries(group.values))
        assert.equal(valueOf(original, prefix), value);
    }
    assert.deepEqual(
      validGroupMembers([
        ...group.members,
        ...group.members,
        { component: "missing", part: "Popup" },
      ]),
      group.members
    );
  }
  assert.deepEqual(store.get(componentEditsAtom), {});
});

test("applying an unchanged suggested group preserves the member-specific classes", () => {
  for (const group of defaultStyleGroups()) {
    const store = setup();
    store.set(reapplyStyleGroupAtom, group.id);
    for (const member of group.members) {
      const original = partsOf(member.component).find(
        ({ name }) => name === member.part
      )!.classes;
      const applied =
        store.get(componentEditsAtom)[member.component]?.partClasses?.[
          member.part
        ] ?? original;
      assert.deepEqual(
        new Set(splitClasses(applied)),
        new Set(splitClasses(original)),
        `${group.name}: ${member.component}.${member.part}`
      );
    }
  }
});

test("shared defaults exclude differing padding, sizes and stale duplicate utilities", () => {
  const shared = sharedPartStyles([
    "px-2 px-4 py-2 text-sm hover:opacity-90 border",
    "px-2 px-6 py-2 text-lg hover:opacity-90 border",
  ]);
  assert.deepEqual(shared.values, { py: "2" });
  assert.equal(shared.classes, "hover:opacity-90 border");
  const items = defaultStyleGroups().find(
    ({ id }) => id === "selection-items"
  )!;
  assert.ok(!items.members.some(({ component }) => component === "menu"));
  assert.equal(items.values.py, "2");
  assert.equal(items.values.text, "sm");
  assert.equal(items.values.pl, undefined);
  assert.equal(items.values.gap, undefined);
  const labels = defaultStyleGroups().find(
    ({ id }) => id === "option-group-labels"
  )!;
  assert.deepEqual(labels.values, {
    text: "xs",
    font: "medium",
    px: "2.5",
    py: "1.5",
  });
  assert.equal(labels.classes, "text-muted-foreground");
});

test("refreshing initial proposals preserves customized and intentionally deleted groups", () => {
  const legacy: StyleGroup[] = [
    {
      id: "dialog-popups",
      name: "Dialog popups",
      members: ["dialog", "alert-dialog", "command"].map((component) => ({
        component,
        part: "Popup",
      })),
      values: { px: "2" },
    },
    {
      id: "text-fields",
      name: "Text fields",
      members: ["input", "textarea"].map((component) => ({
        component,
        part: "Root",
      })),
      values: {},
    },
  ];
  const updated = refreshLegacyGroupSuggestions(legacy);
  assert.equal(
    updated.find(({ id }) => id === "dialog-popups"),
    legacy[0]
  );
  assert.ok(!updated.some(({ id }) => id === "text-fields"));
  assert.ok(updated.some(({ id }) => id === "option-group-labels"));
  assert.deepEqual(refreshLegacyGroupSuggestions([]), []);
  const custom: StyleGroup[] = [
    { id: "mine", name: "Mine", members: [], values: {} },
  ];
  assert.equal(refreshLegacyGroupSuggestions(custom), custom);
});

test("appearance edits write ordinary classes to every member and preserve unrelated edits", () => {
  const store = setup();
  store.set(setComponentEditAtom, "dialog", {
    props: { modal: "false" },
    partClasses: { Other: "p-4" },
  });
  store.set(applyGroupAppearanceAtom, "dialog-popups", "px", "2");
  for (const component of ["dialog", "alert-dialog", "command"]) {
    assert.equal(
      classesOf(store, component),
      setAppearanceValue(popup(component).classes, "px", "2")
    );
    assert.equal(
      store.get(componentEditsAtom)[component].partClasses?.Trigger,
      undefined
    );
  }
  assert.equal(store.get(componentEditsAtom).dialog.props?.modal, "false");
  assert.equal(store.get(componentEditsAtom).dialog.partClasses?.Other, "p-4");
  assert.equal(store.get(componentEditsAtom).menu, undefined);
});

test("individual and group edits use the same classes: latest action wins only for the selected property", () => {
  const store = setup();
  store.set(applyGroupAppearanceAtom, "dialog-popups", "px", "2");
  const personal = setAppearanceValue(
    setAppearanceValue(classesOf(store, "dialog"), "px", "4"),
    "font",
    "bold"
  );
  store.set(setComponentEditAtom, "dialog", {
    partClasses: { Popup: personal },
  });
  assert.equal(valueOf(classesOf(store, "dialog"), "px"), "4");
  store.set(applyGroupAppearanceAtom, "dialog-popups", "rounded", "lg");
  assert.equal(valueOf(classesOf(store, "dialog"), "px"), "4");
  assert.equal(valueOf(classesOf(store, "dialog"), "font"), "bold");
  store.set(applyGroupAppearanceAtom, "dialog-popups", "px", "8");
  assert.equal(valueOf(classesOf(store, "dialog"), "px"), "8");
  assert.equal(valueOf(classesOf(store, "dialog"), "font"), "bold");
});

test("shared free classes support state, responsive and custom utilities without replacing the part", () => {
  const store = setup();
  for (const component of ["dialog", "alert-dialog", "command"]) {
    store.set(setComponentEditAtom, component, {
      partClasses: {
        Popup: `${popup(component).classes} unchanged-user-class`,
      },
    });
  }
  store.set(
    applyGroupClassesAtom,
    "dialog-popups",
    "px-2 md:max-w-xl hover:opacity-90 my-dialog-style"
  );
  for (const component of ["dialog", "alert-dialog", "command"]) {
    const classes = classesOf(store, component);
    for (const token of [
      "px-2",
      "md:max-w-xl",
      "hover:opacity-90",
      "my-dialog-style",
    ])
      assert.ok(classes.includes(token));
    assert.ok(classes.includes("unchanged-user-class"));
  }
  store.set(applyGroupClassesAtom, "dialog-popups", "px-4 focus:opacity-100");
  const classes = classesOf(store, "dialog");
  assert.equal(valueOf(classes, "px"), "4");
  assert.ok(!classes.includes("hover:opacity-90"));
  assert.ok(!classes.includes("my-dialog-style"));
  assert.ok(classes.includes("focus:opacity-100"));
});

test("free classes and appearance settings remain consistent", () => {
  const store = setup();
  store.set(applyGroupAppearanceAtom, "dialog-popups", "px", "2");
  store.set(applyGroupClassesAtom, "dialog-popups", "px-4 hover:opacity-90");
  assert.equal(store.get(styleGroupsAtom)[0].values.px, undefined);
  store.set(reapplyStyleGroupAtom, "dialog-popups");
  assert.equal(valueOf(classesOf(store, "dialog"), "px"), "4");
  store.set(applyGroupAppearanceAtom, "dialog-popups", "px", "8");
  assert.ok(!store.get(styleGroupsAtom)[0].classes?.includes("px-4"));
  store.set(reapplyStyleGroupAtom, "dialog-popups");
  assert.equal(valueOf(classesOf(store, "dialog"), "px"), "8");
  assert.ok(classesOf(store, "dialog").includes("hover:opacity-90"));
});

test("adding a member applies saved classes, appearance and animation only to the new member", () => {
  const store = setup();
  store.set(applyGroupAppearanceAtom, "dialog-popups", "px", "2");
  store.set(applyGroupClassesAtom, "dialog-popups", "hover:opacity-90");
  store.set(applyGroupAnimationAtom, "dialog-popups", "enter", {
    mode: "custom",
    animation,
  });
  store.set(setComponentEditAtom, "dialog", {
    partClasses: {
      Popup: setAppearanceValue(classesOf(store, "dialog"), "px", "8"),
    },
  });
  const group = store.get(styleGroupsAtom)[0];
  store.set(updateStyleGroupAtom, group.id, {
    members: [...group.members, { component: "popover", part: "Popup" }],
  });
  assert.equal(valueOf(classesOf(store, "popover"), "px"), "2");
  assert.ok(classesOf(store, "popover").includes("hover:opacity-90"));
  assert.equal(
    store.get(animationSettingsAtom)[
      animationSettingKey("popover", "Popup", "enter")
    ].mode,
    "custom"
  );
  assert.equal(valueOf(classesOf(store, "dialog"), "px"), "8");
});

test("group animation batches share one CSS rule and preserve the other phase", () => {
  const store = setup();
  store.set(applyGroupAppearanceAtom, "dialog-popups", "px", "2");
  const nativeExits = ["dialog", "alert-dialog", "command"].map((slug) =>
    classesOf(store, slug)
      .split(/\s+/)
      .filter((token) => token.startsWith("data-ending-style:"))
  );
  store.set(applyGroupAnimationAtom, "dialog-popups", "enter", {
    mode: "custom",
    animation,
  });
  const rules = () =>
    Object.keys(store.get(presetBuilderAtom).base.animations ?? {}).filter(
      (name) => name.startsWith("creator-")
    );
  assert.equal(rules().length, 1);
  for (const [index, slug] of ["dialog", "alert-dialog", "command"].entries()) {
    assert.equal(valueOf(classesOf(store, slug), "px"), "2");
    assert.deepEqual(
      classesOf(store, slug)
        .split(/\s+/)
        .filter((token) => token.startsWith("data-ending-style:")),
      nativeExits[index]
    );
    assert.deepEqual(
      store.get(animationSettingsAtom)[
        animationSettingKey(slug, "Popup", "enter")
      ].animation,
      animation
    );
  }
  store.set(applyGroupAnimationAtom, "dialog-popups", "enter", {
    mode: "none",
  });
  assert.equal(rules().length, 0);
  assert.ok(
    store
      .get(animationLibraryAtom)
      .some((entry) => entry.animation.id === animation.id)
  );
  store.set(applyGroupAnimationAtom, "dialog-popups", "enter", {
    mode: "default",
  });
  for (const slug of ["dialog", "alert-dialog", "command"]) {
    assert.deepEqual(
      new Set(
        classesOf(store, slug)
          .split(/\s+/)
          .filter((token) => token.startsWith("data-open:"))
      ),
      new Set(
        popup(slug)
          .classes.split(/\s+/)
          .filter((token) => token.startsWith("data-open:"))
      )
    );
  }
});

test("failed animation compilation leaves classes, settings, group and preset untouched", () => {
  const store = setup();
  const before = [
    store.get(presetBuilderAtom),
    store.get(componentEditsAtom),
    store.get(animationSettingsAtom),
    store.get(styleGroupsAtom),
  ];
  assert.throws(
    () =>
      store.set(applyGroupAnimationAtom, "dialog-popups", "enter", {
        mode: "custom",
      }),
    /Missing custom animation/
  );
  assert.equal(store.get(presetBuilderAtom), before[0]);
  assert.equal(store.get(componentEditsAtom), before[1]);
  assert.equal(store.get(animationSettingsAtom), before[2]);
  assert.equal(store.get(styleGroupsAtom), before[3]);
});

test("removing a group or stopping animation sharing does not undo direct edits", () => {
  const store = setup();
  store.set(applyGroupAnimationAtom, "dialog-popups", "enter", {
    mode: "custom",
    animation,
  });
  const applied = store.get(componentEditsAtom);
  store.set(applyGroupAnimationAtom, "dialog-popups", "enter", undefined);
  assert.equal(store.get(componentEditsAtom), applied);
  store.set(styleGroupsAtom, []);
  assert.equal(store.get(componentEditsAtom), applied);
});

test("restoring a shared property uses each member's own original value", () => {
  const store = setup();
  store.set(applyGroupAppearanceAtom, "dialog-popups", "px", "2");
  store.set(applyGroupAppearanceAtom, "dialog-popups", "px", undefined);
  for (const component of ["dialog", "alert-dialog", "command"]) {
    assert.equal(
      valueOf(classesOf(store, component), "px"),
      valueOf(popup(component).classes, "px")
    );
  }
  assert.equal(store.get(styleGroupsAtom)[0].values.px, undefined);
});

test("exports and imports use only standard preset components, without group schema metadata", () => {
  const source = setup();
  source.set(applyGroupClassesAtom, "dialog-popups", "px-2");
  const exported = RegistryPresetSchema.parse({
    ...source.get(presetBuilderAtom),
    components: source.get(componentEditsAtom),
  });
  assert.ok(!("creator" in exported));
  assert.ok(!("groups" in exported));
  const restored = setup();
  restored.set(importCreatorPresetAtom, JSON.parse(JSON.stringify(exported)));
  assert.deepEqual(
    restored.get(componentEditsAtom),
    source.get(componentEditsAtom)
  );
  restored.set(resetComponentEditsAtom, "dialog");
  assert.equal(classesOf(restored, "dialog"), popup("dialog").classes);
  assert.equal(valueOf(classesOf(restored, "alert-dialog"), "px"), "2");
  restored.set(resetPresetAtom);
  assert.deepEqual(restored.get(componentEditsAtom), {});
});

test("legacy linked-group drafts are materialized without losing individual overrides", () => {
  const groups = defaultStyleGroups();
  groups[0].values = { px: "2" };
  const personal = setAppearanceValue(popup("dialog").classes, "font", "bold");
  const migrated = materializeLegacyGroupDraft(
    groups,
    { dialog: { partClasses: { Popup: personal } } },
    { dialog: { Popup: { px: "4" } } }
  );
  assert.equal(valueOf(migrated.dialog.partClasses!.Popup!, "px"), "4");
  assert.equal(valueOf(migrated.dialog.partClasses!.Popup!, "font"), "bold");
  assert.equal(
    valueOf(migrated["alert-dialog"].partClasses!.Popup!, "px"),
    "2"
  );
});
