import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createStore } from "jotai";
import { defaultPreset } from "@rlz/ui/styles/presets";
import { partsOf } from "@rlz/ui/registry/resolve-capabilities";
import {
  ANIMATION_PROPERTIES,
  DEFAULT_ANIMATION,
  moveProperty,
  removeProperty,
  setSegmentEasing,
  valueAt,
} from "../lib/animation-model";
import {
  insertInterpolatedKeyframe,
  nextKeyframeOffset,
} from "../lib/animation-keyframes";
import {
  hasNativeAnimation,
  resolveAnimationPart,
} from "../lib/animation-parts";
import { setPartAnimation } from "../lib/animation-apply";
import { updatePartAnimationAtom } from "../state/animation-actions";
import { componentEditsAtom, presetBuilderAtom } from "../state/preset-builder";
import {
  animationSettingKey,
  animationSettingsAtom,
} from "../state/animation-state";

describe("keyframe editing", () => {
  it("inserts halfway into an empty timeline", () => {
    assert.equal(nextKeyframeOffset([]), 0.5);
  });

  it("chooses the widest gap regardless of input order and duplicates", () => {
    assert.equal(
      nextKeyframeOffset([{ offset: 1 }, { offset: 0.2 }, { offset: 0.2 }]),
      0.6
    );
  });

  it("chooses the first gap when widths are equal", () => {
    assert.equal(nextKeyframeOffset([{ offset: 0.5 }]), 0.25);
  });

  it("does not insert when the timeline has no room", () => {
    const frames = Array.from({ length: 1001 }, (_, index) => ({
      offset: index / 1000,
    }));
    assert.equal(nextKeyframeOffset(frames), undefined);
  });

  it("samples every track without mutating the original animation", () => {
    const animation = structuredClone(DEFAULT_ANIMATION);
    const original = structuredClone(animation);
    const frames = insertInterpolatedKeyframe(animation, 0.5);
    const inserted = frames.find((frame) => frame.offset === 0.5);
    assert.ok(inserted);
    for (const property of ANIMATION_PROPERTIES) {
      assert.equal(
        inserted[property],
        valueAt(original.keyframes, property, 0.5, original.easing)
      );
    }
    assert.deepEqual(animation, original);
  });

  it("interpolates sparse tracks using each segment's easing", () => {
    const animation = {
      ...structuredClone(DEFAULT_ANIMATION),
      easing: "linear",
      keyframes: [
        { offset: 0, opacity: 0, easing: { opacity: "ease-in" } },
        { offset: 0.25, x: 0 },
        { offset: 0.75, x: 100 },
        { offset: 1, opacity: 1 },
      ],
    };
    const frame = insertInterpolatedKeyframe(animation, 0.5).find(
      (item) => item.offset === 0.5
    );
    assert.ok(frame);
    assert.equal(frame.x, 50);
    assert.ok(frame.opacity !== undefined && frame.opacity < 0.5);
    assert.equal(frame.scale, 1);
  });

  it("moves only the selected property, including its segment easing", () => {
    const frames = [
      { offset: 0.25, opacity: 0.4, x: 10, easing: { opacity: "ease-in" } },
      { offset: 0.75, x: 20 },
    ];
    const moved = moveProperty(frames, "opacity", 0.25, 0.75);
    assert.equal(moved[0].x, 10);
    assert.equal(moved[0].opacity, undefined);
    assert.equal(moved[1].opacity, 0.4);
    assert.equal(moved[1].easing?.opacity, "ease-in");
    assert.equal(frames[0].opacity, 0.4);
  });

  it("does not overwrite another key of the same property", () => {
    const frames = [
      { offset: 0, opacity: 0 },
      { offset: 1, opacity: 1 },
    ];
    assert.equal(moveProperty(frames, "opacity", 0, 1), frames);
  });

  it("removes a property's easing without removing other tracks", () => {
    const frames = [
      {
        offset: 0.5,
        opacity: 0.5,
        x: 10,
        easing: { opacity: "ease-in", x: "linear" },
      },
    ];
    const result = removeProperty(frames, "opacity", 0.5);
    assert.deepEqual(result, [{ offset: 0.5, x: 10, easing: { x: "linear" } }]);
  });

  it("can reset a segment to the default easing", () => {
    const frames = [{ offset: 0, opacity: 0 }];
    const overridden = setSegmentEasing(frames, "opacity", 0, "ease-in");
    const reset = setSegmentEasing(overridden, "opacity", 0, undefined);
    assert.equal(reset[0].easing, undefined);
    assert.deepEqual(frames, [{ offset: 0, opacity: 0 }]);
  });
});

describe("animation part selection", () => {
  const parts = [{ name: "Root" }, { name: "Popup" }, { name: "Content" }];

  it("keeps an explicitly selected part", () => {
    assert.equal(resolveAnimationPart(parts, "Root"), parts[0]);
  });

  it("prefers popup/content when the selection no longer exists", () => {
    assert.equal(resolveAnimationPart(parts, "Missing"), parts[1]);
  });

  it("falls back to the first part, or undefined for no parts", () => {
    assert.equal(resolveAnimationPart([parts[0]], ""), parts[0]);
    assert.equal(resolveAnimationPart([], ""), undefined);
  });

  it("detects only animation utilities of the requested phase", () => {
    const classes = "data-open:fade-in-0 data-ending-style:duration-150";
    assert.equal(hasNativeAnimation(classes, "enter"), true);
    assert.equal(hasNativeAnimation(classes, "exit"), false);
    assert.equal(
      hasNativeAnimation("data-ending-style:animate-out", "exit"),
      true
    );
    assert.equal(hasNativeAnimation(undefined, "enter"), false);
    assert.equal(hasNativeAnimation("animate-in duration-200", "enter"), false);
  });
});

describe("shared animation updates", () => {
  function setup() {
    const store = createStore();
    const part = resolveAnimationPart(partsOf("dialog"), "");
    assert.ok(part, "The dialog registry must expose an editable part");
    store.set(presetBuilderAtom, structuredClone(defaultPreset));
    store.set(componentEditsAtom, {});
    store.set(animationSettingsAtom, {});
    return { store, part, slug: "dialog" };
  }

  it("keeps preset CSS, classes and settings consistent with the compiler", () => {
    const { store, part, slug } = setup();
    const animation = structuredClone(DEFAULT_ANIMATION);
    const expected = setPartAnimation(
      store.get(presetBuilderAtom),
      undefined,
      slug,
      part.name,
      "enter",
      "custom",
      animation,
      {}
    );
    store.set(updatePartAnimationAtom, {
      slug,
      part: part.name,
      phase: "enter",
      mode: "custom",
      animation,
    });
    assert.deepEqual(store.get(presetBuilderAtom), expected.preset);
    assert.equal(
      store.get(componentEditsAtom)[slug].partClasses?.[part.name],
      expected.partClasses
    );
    const saved = store.get(animationSettingsAtom)[
      animationSettingKey(slug, part.name, "enter")
    ];
    assert.equal(saved.mode, "custom");
    assert.deepEqual(saved.animation, animation);
    assert.notEqual(saved.animation, animation);
    animation.name = "Changed after applying";
    assert.equal(saved.animation?.name, DEFAULT_ANIMATION.name);
  });

  it("preserves other component edits and the opposite animation phase", () => {
    const { store, part, slug } = setup();
    const exitKey = animationSettingKey(slug, part.name, "exit");
    store.set(componentEditsAtom, {
      [slug]: { props: { modal: "false" }, partClasses: { Other: "p-4" } },
    });
    store.set(animationSettingsAtom, { [exitKey]: { mode: "none" } });
    store.set(updatePartAnimationAtom, {
      slug,
      part: part.name,
      phase: "enter",
      mode: "custom",
      animation: DEFAULT_ANIMATION,
    });
    assert.deepEqual(store.get(componentEditsAtom)[slug].props, {
      modal: "false",
    });
    assert.equal(store.get(componentEditsAtom)[slug].partClasses?.Other, "p-4");
    assert.deepEqual(store.get(animationSettingsAtom)[exitKey], {
      mode: "none",
    });
  });

  it("supports disabling and restoring native animations", () => {
    const { store, part, slug } = setup();
    for (const mode of ["none", "default"] as const) {
      store.set(updatePartAnimationAtom, {
        slug,
        part: part.name,
        phase: "enter",
        mode,
      });
      assert.equal(
        store.get(animationSettingsAtom)[
          animationSettingKey(slug, part.name, "enter")
        ].mode,
        mode
      );
    }
    const restoredClasses =
      store.get(componentEditsAtom)[slug].partClasses?.[part.name] ??
      part.classes ??
      "";
    // Restoring native classes may reorder tokens; their order is not semantic.
    assert.deepEqual(
      new Set(restoredClasses.split(/\s+/).filter(Boolean)),
      new Set((part.classes ?? "").split(/\s+/).filter(Boolean))
    );
  });

  it("retains a shared CSS rule until its last edited part stops using it", () => {
    const { store, part, slug } = setup();
    const otherSlug = "popover";
    const otherPart = resolveAnimationPart(partsOf(otherSlug), "");
    assert.ok(otherPart);
    const animation = {
      ...structuredClone(DEFAULT_ANIMATION),
      keyframes: [
        { offset: 0, opacity: 0, rotate: 0 },
        { offset: 0.4, opacity: 0.8, rotate: 45 },
        { offset: 1, opacity: 1, rotate: 90 },
      ],
    };
    const targets = [
      { slug, part: part.name },
      { slug: otherSlug, part: otherPart.name },
    ];
    const creatorRules = () =>
      Object.keys(store.get(presetBuilderAtom).base.animations ?? {}).filter(
        (name) => name.startsWith("creator-")
      );

    for (const target of targets) {
      store.set(updatePartAnimationAtom, {
        ...target,
        phase: "enter",
        mode: "custom",
        animation,
      });
    }
    assert.equal(creatorRules().length, 1);

    store.set(updatePartAnimationAtom, {
      ...targets[0],
      phase: "enter",
      mode: "none",
    });
    assert.equal(creatorRules().length, 1);

    store.set(updatePartAnimationAtom, {
      ...targets[1],
      phase: "enter",
      mode: "none",
    });
    assert.equal(creatorRules().length, 0);
  });

  it("leaves all state untouched if compilation fails", () => {
    const { store, part, slug } = setup();
    const preset = store.get(presetBuilderAtom);
    const edits = store.get(componentEditsAtom);
    const settings = store.get(animationSettingsAtom);
    assert.throws(
      () =>
        store.set(updatePartAnimationAtom, {
          slug,
          part: part.name,
          phase: "enter",
          mode: "custom",
        }),
      /Missing custom animation/
    );
    assert.equal(store.get(presetBuilderAtom), preset);
    assert.equal(store.get(componentEditsAtom), edits);
    assert.equal(store.get(animationSettingsAtom), settings);
  });
});
