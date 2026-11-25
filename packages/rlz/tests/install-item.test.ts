import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test, type TestContext } from "node:test";
import type { Registry, RegistryPreset } from "@rlz/registry";
import type { rlzConfig } from "../src/config/types";
import { installItem } from "../src/utils/install-item";

const config: rlzConfig = {
  framework: "next",
  dirs: { root: "src" },
  css: "src/app/globals.css",
  aliases: { components: "@/components", hooks: "@/hooks", lib: "@/lib" },
  icons: "lucide",
};

const registry: Registry = {
  schemaVersion: 1,
  presets: {},
  items: {
    button: {
      id: "button",
      name: "Button",
      type: "component",
      version: "1.0.0",
      path: "components/ui/button.tsx",
      registryDependencies: ["helper"],
    },
    helper: {
      id: "helper",
      name: "Helper",
      type: "hook",
      version: "1.0.0",
      path: "hooks/helper.ts",
    },
  },
};

const preset: RegistryPreset = {
  id: "fixture",
  name: "Fixture",
  type: "preset",
  version: "1.0.0",
  path: "preset.json",
  base: {
    typography: { letterSpacing: 0 },
    layout: { spacing: 0.25, radius: 0.5 },
  },
  colors: [],
  components: {
    button: {
      partClasses: { Root: "rounded-full" },
      variants: { variant: [{ value: "outline", classes: "bg-accent" }] },
    },
  },
};

async function fixture(t: TestContext) {
  const cwd = await mkdtemp(path.join(tmpdir(), "rlz-overwrite-"));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  const dirs = {
    components: path.join(cwd, "components"),
    hooks: path.join(cwd, "hooks"),
  };
  const button = path.join(dirs.components, "ui/button.tsx");
  const helper = path.join(dirs.hooks, "helper.ts");
  await mkdir(path.dirname(button), { recursive: true });
  await mkdir(path.dirname(helper), { recursive: true });
  await writeFile(button, "// Local Button");
  await writeFile(helper, "// Local dependency");
  return {
    button,
    helper,
    options: {
      item: registry.items.button!,
      registry,
      dirs,
      cwd,
      config,
      preset,
    },
  };
}

test("declining leaves the component and its dependencies unchanged", async (t) => {
  const { button, helper, options } = await fixture(t);
  let asked = 0;
  const result = await installItem(
    {
      ...options,
      async confirmOverwrite(file) {
        assert.equal(file, button);
        asked++;
        return false;
      },
    },
    async () =>
      assert.fail("Nothing should be downloaded when the user declines.")
  );
  assert.equal(result, "skipped");
  assert.equal(asked, 1);
  assert.equal(await readFile(button, "utf8"), "// Local Button");
  assert.equal(await readFile(helper, "utf8"), "// Local dependency");
});

test("confirmation replaces only the requested component and reapplies the preset", async (t) => {
  const { button, helper, options } = await fixture(t);
  const result = await installItem(
    {
      ...options,
      async confirmOverwrite(file) {
        assert.equal(file, button);
        return true;
      },
    },
    async (url, destination) => {
      assert.match(url, /\/button\.tsx$/);
      assert.notEqual(destination, button);
      await writeFile(
        destination,
        'const defaultClass = "rounded-md";\nconst buttonVariants = cva(defaultClass, { variants: { variant: { outline: "bg-secondary" } } });'
      );
    }
  );
  assert.equal(result, "overwritten");
  assert.match(await readFile(button, "utf8"), /class: "rounded-full"/);
  assert.match(await readFile(button, "utf8"), /outline: "bg-accent"/);
  assert.equal(await readFile(helper, "utf8"), "// Local dependency");
  assert.deepEqual(await readdir(path.dirname(button)), ["button.tsx"]);
});

test("failed downloads leave the original file intact and clean up staging", async (t) => {
  const { button, options } = await fixture(t);
  await assert.rejects(
    installItem(
      {
        ...options,
        async confirmOverwrite() {
          return true;
        },
      },
      async (_url, destination) => {
        await writeFile(destination, "partial");
        throw new Error("Download failed");
      }
    ),
    /Download failed/
  );
  assert.equal(await readFile(button, "utf8"), "// Local Button");
  assert.deepEqual(await readdir(path.dirname(button)), ["button.tsx"]);
});
