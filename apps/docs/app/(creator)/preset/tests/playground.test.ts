import assert from "node:assert/strict";
import { test } from "node:test";
import type { PresetComponentCustomization } from "@rlz/registry";
import { defaultPreset } from "@rlz/ui/styles/presets";
import { dialogPopupVariants } from "@rlz/ui/components/ui/dialog";
import { buttonVariants } from "@rlz/ui/components/ui/button";
import {
  playgroundVariant,
  resolvePreviewClasses,
} from "../lib/playground-component";
import { foundationCss, themeCss, themeUtilitiesCss } from "../lib/preset-css";
import {
  compilePlaygroundCss,
  playgroundCandidates,
} from "../lib/playground-tailwind";
import { GET } from "../preview/styles/route";

test("the selected Button variant can be authored from scratch without inheriting the native palette", () => {
  const edit: PresetComponentCustomization = {
    props: { variant: "brand", size: "sm" },
    variants: {
      variant: [{ value: "brand", classes: "bg-[#132768] text-white" }],
    },
  };
  const variant = playgroundVariant("button", "variant", edit);
  const size = playgroundVariant("button", "size", edit);
  const result = resolvePreviewClasses(
    "button",
    "button",
    buttonVariants({ variant: "primary", size: "sm" }),
    edit,
    [variant, size]
  );
  assert.equal(variant.value, "brand");
  assert.match(result, /bg-\[#132768\] text-white/);
  assert.match(result, /\bh-8\b/);
  assert.match(result, /\bstate-focus-ring\b/);
  assert.doesNotMatch(result, /bg-primary/);
});

test("Dialog part overrides keep variant behavior and do not affect unrelated slots", () => {
  const edit: PresetComponentCustomization = {
    props: { variant: "bare" },
    partClasses: { Popup: "relative rounded-xl bg-accent" },
  };
  const variant = playgroundVariant("dialog", "variant", edit);
  assert.equal(
    resolvePreviewClasses(
      "dialog",
      "dialog-popup",
      dialogPopupVariants({ variant: "bare" }),
      edit,
      [variant]
    ),
    "relative rounded-xl bg-accent"
  );
  assert.equal(
    resolvePreviewClasses("dialog", "dialog-title", "ui-title", edit, [
      variant,
    ]),
    "ui-title"
  );
});

test("the canvas compiles draft Tailwind classes, Base utilities and animations from the export", async () => {
  const preset = structuredClone(defaultPreset);
  preset.base.utilities = {
    ...preset.base.utilities,
    "state-focus-ring": "focus-visible:ring-4",
  };
  preset.base.animations = {
    "creator-dialog-popup-enter": {
      value: "creator-dialog-popup-enter 200ms linear both",
      keyframes: { from: { opacity: "0" }, to: { opacity: "1" } },
    },
  };
  const draft = themeUtilitiesCss(preset);
  assert.ok(themeCss(preset).includes(draft));
  assert.match(foundationCss(preset), /\.dark\s*\{/);

  const sources = await (await GET()).json();
  const candidates = playgroundCandidates({
    dialog: {
      partClasses: {
        Popup: "bg-[#132768] data-open:animate-creator-dialog-popup-enter",
      },
    },
    button: {
      variants: { variant: [{ value: "brand", classes: "bg-[#132768]" }] },
    },
  });
  assert.equal(candidates.length, 2);
  const css = await compilePlaygroundCss(sources, draft, candidates);
  assert.match(css, /background-color: #132768/);
  assert.match(
    css,
    /\.state-focus-ring\s*\{[\s\S]*?&:focus-visible\s*\{[\s\S]*?4px/
  );
  assert.match(css, /@keyframes creator-dialog-popup-enter/);
  assert.match(css, /animation: var\(--animate-creator-dialog-popup-enter\)/);
  assert.match(css, /--animate-creator-dialog-popup-enter:\s*creator-dialog-popup-enter 200ms/);
});
