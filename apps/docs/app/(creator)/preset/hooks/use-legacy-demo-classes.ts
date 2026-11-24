"use client";

import { useLayoutEffect } from "react";
import { cn } from "@rlz/ui/lib/cn";
import type { PlaygroundState } from "../lib/playground-state";
import { previewPatches, type PreviewPatch } from "../lib/preset-styles";

/**
 * Compatibility for documentation examples that do not accept a preset yet.
 * Only runs in the canvas document, including its portaled overlays.
 */
export function useLegacyDemoClasses(edits: PlaygroundState["edits"]) {
  useLayoutEffect(() => {
    const preview = document.body;
    const patches = previewPatches(edits);
    if (!patches.length) return;
    const previous = new Map<Element, { original: string; applied: string }>();
    const apply = () => applyPatches(preview, patches, previous);

    apply();

    // Demos mount lazily (`next/dynamic`), and only the ones of the selected
    // component: re-patch whenever the preview's own DOM settles. Applying is
    // idempotent, so a pass that changes nothing ends the observation loop.
    const observer = new MutationObserver(apply);

    observer.observe(preview, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "data-slot"],
    });

    return () => {
      observer.disconnect();
      applyPatches(preview, [], previous);
    };
  }, [edits]);
}

/**
 * Swaps the built-in classes of a restyled variant value, or of a part, for the
 * Creator's own: editing `outline` restyles the outline demo and leaves the other
 * variants alone, while editing a part restyles every element of that part. An
 * element carrying several edits - a variant AND a size, or a value and its part -
 * gets one merge, not two passes.
 */
function applyPatches(
  preview: HTMLElement,
  patches: PreviewPatch[],
  previous: Map<Element, { original: string; applied: string }>
) {
  const targets = new Map<
    Element,
    { original: string; remove: Set<string>; add: string[] }
  >();

  for (const patch of patches) {
    // A value the Creator invented has no built-in classes to look for, so nothing
    // points at its elements: it lands in the preset, not in the preview.
    if (!patch.wholeSlot && patch.remove.length === 0) continue;

    preview
      .querySelectorAll<Element>(`[data-slot="${patch.slot}"]`)
      .forEach((element) => {
        // Judge the element by the classes it came with, never by the ones a patch
        // wrote: a swap reading its own work would undo it on the next pass.
        const live = classOf(element);
        const last = previous.get(element);
        const original = last?.applied === live ? last.original : live;
        const came = new Set(original.split(/\s+/));

        // A variant value owns only what was drawn with all of its classes. One
        // shared token is not a match: variants borrow from each other
        // (`hover:bg-accent/70`), and a borrowed class would drag another variant's
        // element into this swap. A part, though, owns its whole slot.
        if (
          !patch.wholeSlot &&
          !patch.remove.every((token) => came.has(token))
        ) {
          return;
        }

        const target = targets.get(element) ?? {
          original,
          remove: new Set<string>(),
          add: [],
        };

        target.add.push(...patch.add);
        patch.remove.forEach((token) => target.remove.add(token));

        targets.set(element, target);
      });
  }

  targets.forEach((target, element) => {
    const next = composed(target.original, target);

    // Writing only what actually changed is what keeps the observer quiet.
    if (next !== classOf(element)) element.setAttribute("class", next);
    previous.set(element, { original: target.original, applied: next });
  });

  // Whatever a patch owned but no longer matches (a reset, a deleted value,
  // another selection) gets its classes back.
  for (const [element, last] of previous) {
    if (targets.has(element)) continue;
    if (
      preview.contains(element) &&
      classOf(element) === last.applied &&
      last.applied !== last.original
    )
      element.setAttribute("class", last.original);
    previous.delete(element);
  }
}

// Demos are not only `<div>`: an icon carries a slot too, and `className` is
// read-only on an SVG element, so the attribute is what both share.
function classOf(element: Element) {
  return element.getAttribute("class") ?? "";
}

function composed(
  original: string,
  target: { remove: Set<string>; add: string[] }
) {
  // The value's own classes come off, the Creator's go on, and `cn` settles what
  // is left - the same merge a component runs on its className.
  const kept = original
    .split(/\s+/)
    .filter((token) => token && !target.remove.has(token));

  return cn(...kept, ...target.add.filter(Boolean));
}
