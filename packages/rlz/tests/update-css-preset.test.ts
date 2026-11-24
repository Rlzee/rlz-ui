import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { PresetBaseConfig } from "@rlz/registry";
import { updateCssPreset } from "../src/utils/update-css-preset";

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
