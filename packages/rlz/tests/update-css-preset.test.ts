import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import postcss from "postcss";
import { presetUtilitiesCss, type PresetBaseConfig } from "@rlz/registry";
import { updateCssPreset } from "../src/presets/update-css";

const base: PresetBaseConfig = {
  typography: { letterSpacing: 0.03 },
  layout: { radius: 0.75, spacing: 0.3 },
};

test("replaces shared utilities, adds custom ones and preserves unrelated CSS", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "rlz-utilities-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, "globals.css");
  const unrelated = ".state-focus-ring:hover { color: red; }";
  const original = `@import "tailwindcss";
@layer base { .state-focus-ring { @apply block; } }
@layer utilities {
  /* App utilities */
  .state-focus-ring {
    @apply focus-visible:ring-2 focus-visible:border-ring;
    --app-focus: 1;
  }
  .ui-title { @apply text-lg; }
  ${unrelated}
}
@layer utilities { .state-focus-ring { @apply outline-none; } }
`;
  const utilities = {
    "state-focus-ring": "focus-visible:ring-4\n focus-visible:ring-red-500",
    "brand-surface": "bg-[#123456] text-white",
  };
  await writeFile(path, original);
  await updateCssPreset(path, { base: { ...base, utilities }, colors: [] });
  const installed = await readFile(path, "utf8");
  assert.doesNotMatch(
    installed,
    /focus-visible:ring-2|focus-visible:border-ring|outline-none/
  );
  assert.ok(
    installed.includes("@layer base { .state-focus-ring { @apply block; } }")
  );
  assert.ok(installed.includes(".ui-title { @apply text-lg; }"));
  assert.ok(installed.includes(unrelated));
  assert.ok(installed.includes("--app-focus: 1;"));
  assert.ok(installed.includes("/* App utilities */"));
  const applied: Record<string, string[]> = {};
  postcss.parse(installed).walkAtRules("apply", (rule) => {
    const parent = rule.parent;
    if (
      parent?.type !== "rule" ||
      parent.parent?.type !== "atrule" ||
      parent.parent.params !== "utilities"
    )
      return;
    (applied[parent.selector] ??= []).push(rule.params);
  });
  assert.deepEqual(applied[".state-focus-ring"], [
    "focus-visible:ring-4 focus-visible:ring-red-500",
    "focus-visible:ring-4 focus-visible:ring-red-500",
  ]);
  assert.deepEqual(applied[".brand-surface"], ["bg-[#123456] text-white"]);
  await updateCssPreset(path, { base: { ...base, utilities } });
  assert.equal(await readFile(path, "utf8"), installed);
});

test("can clear a utility, while absent overrides leave shipped utilities unchanged", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "rlz-utilities-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, "globals.css");
  const original =
    "@layer utilities {\n  .state-focus-ring { @apply ring-2; }\n}\n";
  await writeFile(path, original);
  await updateCssPreset(path, { base });
  assert.equal(await readFile(path, "utf8"), original);
  await updateCssPreset(path, { base: { ...base, utilities: {} } });
  assert.equal(await readFile(path, "utf8"), original);
  await updateCssPreset(path, {
    base: { ...base, utilities: { "state-focus-ring": "" } },
  });
  assert.doesNotMatch(
    await readFile(path, "utf8"),
    /ring-2|\.state-focus-ring/
  );
});

test("uses the shared export serializer when the sheet has no utilities layer", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "rlz-utilities-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, "globals.css");
  const utilities = { "brand-surface": "bg-red-500\n text-white", empty: "" };
  await writeFile(path, '@import "tailwindcss";\n');
  await updateCssPreset(path, { base: { ...base, utilities } });
  const installed = await readFile(path, "utf8");
  assert.ok(installed.includes(presetUtilitiesCss(utilities)));
  await updateCssPreset(path, { base: { ...base, utilities } });
  assert.equal(await readFile(path, "utf8"), installed);
  await assert.rejects(
    updateCssPreset(path, {
      base: { ...base, utilities: { "bad selector": "block" } },
    }),
    /Invalid preset utility name/
  );
  assert.equal(await readFile(path, "utf8"), installed);
});

test("applies base tokens and shadows with no colors", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "rlz-base-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, "globals.css");
  const original = await readFile(
    new URL("../../ui/src/styles/globals.css", import.meta.url),
    "utf8"
  );
  await writeFile(path, original);
  await updateCssPreset(path, {
    colors: [],
    base: {
      ...base,
      shadows: {
        offsetX: 2,
        offsetY: 3,
        blur: 4,
        spread: 1,
        opacity: 0.4,
        color: "red",
      },
    },
  });
  const installed = await readFile(path, "utf8");
  assert.match(installed, /--radius: 0.75rem;/);
  assert.match(installed, /--spacing: 0.3rem;/);
  assert.match(installed, /--tracking-normal: 0.03em;/);
  for (const declaration of [
    "--shadow-x: 2px;",
    "--shadow-y: 3px;",
    "--shadow-blur: 4px;",
    "--shadow-spread: 1px;",
    "--shadow-opacity: 0.4;",
    "--shadow-color: red;",
  ])
    assert.equal(installed.split(declaration).length - 1, 2);
  assert.ok(installed.includes("--background: oklch(0.984 0 0);"));
});

test("installs, replaces and removes preset animations without duplicates", async () => {
  const directory = await mkdtemp(join(tmpdir(), "rlz-animations-"));
  const path = join(directory, "globals.css");
  const original =
    '@import "tailwindcss";\n\n@keyframes app-spin { to { rotate: 360deg; } }\n';
  const base: PresetBaseConfig = {
    typography: { letterSpacing: 0 },
    layout: { radius: 0.5, spacing: 0.25 },
    animations: {
      fade: {
        value: "fade 300ms ease-out both",
        keyframes: { from: { opacity: "0" }, to: { opacity: "1" } },
      },
    },
  };

  try {
    await writeFile(path, original);
    await updateCssPreset(path, { base });
    const installed = await readFile(path, "utf8");
    assert.ok(installed.startsWith(original));
    assert.ok(installed.includes("--animate-fade: fade 300ms ease-out both;"));
    await updateCssPreset(path, { base });
    assert.equal(await readFile(path, "utf8"), installed);

    await updateCssPreset(path, {
      base: {
        ...base,
        animations: {
          slide: {
            value: "slide 1s",
            keyframes: { to: { transform: "translateX(0)" } },
          },
        },
      },
    });
    const replaced = await readFile(path, "utf8");
    assert.ok(!replaced.includes("--animate-fade"));
    assert.ok(replaced.includes("--animate-slide: slide 1s;"));
    assert.ok(replaced.includes("@keyframes app-spin"));

    await updateCssPreset(path, { base: { ...base, animations: undefined } });
    assert.equal(await readFile(path, "utf8"), replaced);
    await updateCssPreset(path, { base: { ...base, animations: {} } });
    const cleared = await readFile(path, "utf8");
    assert.ok(!cleared.includes("--animate-slide"));
    assert.ok(cleared.includes("@keyframes app-spin"));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
