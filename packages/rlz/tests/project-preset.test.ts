import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { Registry, RegistryPreset } from "@rlz/registry";
import { pinProjectPreset, resolveProjectPreset } from "../src/presets/project";

const preset: RegistryPreset = {
  type: "preset",
  id: "fixture",
  name: "Fixture",
  path: "styles/presets.ts",
  version: "1.0.0",
  base: {
    typography: { letterSpacing: 0 },
    layout: { spacing: 0.25, radius: 0.5 },
  },
  colors: [],
  components: { button: { partClasses: { Root: "rounded-full" } } },
};

const emptyRegistry: Registry = { schemaVersion: 1, items: {}, presets: {} };

test("local and registry configs are pinned to the same immutable project preset", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "rlz-preset-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const local = {
    id: preset.id,
    name: preset.name,
    source: "path",
    path: "export.json",
  } as const;
  const remote = {
    id: preset.id,
    name: preset.name,
    source: "registry",
  } as const;
  await writeFile(join(directory, local.path), JSON.stringify(preset));
  const registry = { ...emptyRegistry, presets: { "public-slug": preset } };

  assert.deepEqual(
    await resolveProjectPreset(directory, local, registry),
    preset
  );
  assert.deepEqual(
    await resolveProjectPreset(directory, remote, registry),
    preset
  );
  const pinnedLocal = await pinProjectPreset(directory, local, preset);
  const pinnedRemote = await pinProjectPreset(directory, remote, preset);
  assert.equal(pinnedLocal.snapshot, pinnedRemote.snapshot);

  await writeFile(join(directory, local.path), "{}");
  assert.deepEqual(
    await resolveProjectPreset(directory, pinnedLocal, emptyRegistry),
    preset
  );
  assert.deepEqual(
    await resolveProjectPreset(directory, pinnedRemote, emptyRegistry),
    preset
  );
  assert.equal(
    await resolveProjectPreset(directory, undefined, emptyRegistry),
    undefined
  );
  await assert.rejects(
    resolveProjectPreset(directory, local, registry),
    /Cannot read preset/
  );
});
