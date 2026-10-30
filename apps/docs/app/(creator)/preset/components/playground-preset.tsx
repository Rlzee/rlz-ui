"use client";

import * as React from "react";
import { useAtomValue } from "jotai";
import { useTheme } from "next-themes";

import { cn } from "@rlz/ui/lib/cn";

import { componentEditsAtom, presetBuilderAtom } from "../preset-builder";
import {
  playgroundCss,
  PREVIEW_ID,
  previewPatches,
  type PreviewPatch,
} from "../lib/preset-styles";

/**
 * Makes the playground answer back: the preset being drafted is applied to the
 * live demos, so a color, a radius or a rewritten variant is seen where it is
 * edited instead of only in the exported JSON.
 *
 * Only the demos, never the pane's own chrome: the sheet and the class patches
 * both stop at `#playground-preview`, so the toolbar and tabs keep the site's
 * look whatever the draft says.
 *
 * It renders the stylesheet the preset describes (custom properties, which every
 * design-system utility reads) and patches the class list of the demos whose
 * variant value was restyled. Mount it once, above the preview.
 */
export function PlaygroundPreset() {
  const preset = useAtomValue(presetBuilderAtom);
  const edits = useAtomValue(componentEditsAtom);
  const { resolvedTheme } = useTheme();

  const [isDark, setIsDark] = React.useState(false);

  // Same rule as the previews: only trust the resolved theme once mounted, so the
  // first client render stays in sync with the server HTML.
  React.useEffect(() => setIsDark(resolvedTheme === "dark"), [resolvedTheme]);

  const css = React.useMemo(
    () => playgroundCss(preset, isDark, edits),
    [preset, isDark, edits]
  );

  // Written through the node rather than as children: the sheet is generated from
  // what the draft holds, and a text node cannot be parsed as markup.
  const styleRef = React.useRef<HTMLStyleElement>(null);

  React.useEffect(() => {
    if (styleRef.current) styleRef.current.textContent = css;
  }, [css]);

  React.useEffect(() => {
    const preview = document.getElementById(PREVIEW_ID);

    if (!preview) return;

    const apply = () => applyPatches(preview, previewPatches(edits));

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

    return () => observer.disconnect();
  }, [edits]);

  // An unlayered sheet beats Tailwind's `@layer utilities`, which is what lets a
  // component style win over the class the design system drew with.
  return <style id="rlz-playground-preset" ref={styleRef} />;
}

// What a patch wrote on an element, so it can be taken back.
const ORIGINAL = "data-rlz-original-class";

/**
 * Swaps the built-in classes of a restyled variant value, or of a part, for the
 * Creator's own: editing `outline` restyles the outline demo and leaves the other
 * variants alone, while editing a part restyles every element of that part. An
 * element carrying several edits - a variant AND a size, or a value and its part -
 * gets one merge, not two passes.
 */
function applyPatches(preview: HTMLElement, patches: PreviewPatch[]) {
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
        const original = element.getAttribute(ORIGINAL) ?? classOf(element);
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

        const target =
          targets.get(element) ?? { original, remove: new Set<string>(), add: [] };

        target.add.push(...patch.add);
        patch.remove.forEach((token) => target.remove.add(token));

        targets.set(element, target);
      });
  }

  targets.forEach((target, element) => {
    if (!element.hasAttribute(ORIGINAL)) {
      element.setAttribute(ORIGINAL, target.original);
    }

    const next = composed(target.original, target);

    // Writing only what actually changed is what keeps the observer quiet.
    if (next !== classOf(element)) element.setAttribute("class", next);
  });

  // Whatever a patch owned but no longer matches (a reset, a deleted value,
  // another selection) gets its classes back.
  preview.querySelectorAll<Element>(`[${ORIGINAL}]`).forEach((element) => {
    if (targets.has(element)) return;

    element.setAttribute("class", element.getAttribute(ORIGINAL) ?? "");
    element.removeAttribute(ORIGINAL);
  });
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
