import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { Project } from "ts-morph";
import type { Registry } from "@rlz/registry";
import { applyPresetVariantClasses } from "../src/presets/update-classes";

const url = (path: string) => new URL(`../../ui/${path}`, import.meta.url);
const registry: Registry = JSON.parse(
  await readFile(url("registry.json"), "utf8")
);
const requireFromUi = createRequire(url("package.json"));
const { cva } = requireFromUi("class-variance-authority");
const { cn } = requireFromUi("cn");

function native(id: string, axis: string) {
  const item = registry.items[id];
  assert.equal(item?.type, "component");
  return item
    .capabilities!.variants!.find(({ name }) => name === axis)!
    .values.map((value) => ({ value }));
}

async function load(project: Project, id: string) {
  const item = registry.items[id]!;
  const name = `rlz-generated-${id}`;
  const path = item.path.replace(/[^/]+\.tsx$/, `${name}.tsx`);
  return project.createSourceFile(
    fileURLToPath(url(`src/${path}`)),
    await readFile(url(`src/${item.path}`), "utf8")
  );
}

test("installed Badge and Dialog accept a new value in TSX and apply its styles", async () => {
  const project = new Project({
    tsConfigFilePath: fileURLToPath(url("tsconfig.json")),
    skipAddingFilesFromTsConfig: true,
  });
  const badge = await load(project, "badge");
  const dialog = await load(project, "dialog");
  assert.deepEqual(
    applyPresetVariantClasses(badge, "badge", {
      variant: [
        ...native("badge", "variant"),
        { value: "brand", classes: "bg-accent" },
      ],
    }),
    []
  );
  assert.deepEqual(
    applyPresetVariantClasses(dialog, "dialog", {
      variant: [
        ...native("dialog", "variant"),
        {
          value: "brand",
          partClasses: { Popup: "bg-accent", Header: "bg-card" },
        },
        { value: "quiet", partClasses: { Popup: "bg-card" } },
      ],
    }),
    []
  );

  const usage = project.createSourceFile(
    fileURLToPath(url("src/components/ui/rlz-variant-usage.tsx")),
    `
    import { Badge } from "./rlz-generated-badge";
    import { Dialog } from "./rlz-generated-dialog";
    <Badge variant="brand" />;
    <Badge variant="outline" />;
    <Dialog variant="brand"><Dialog.Popup><Dialog.Header /></Dialog.Popup></Dialog>;
    <Dialog variant="quiet" />;
    <Dialog variant="bare" />;
    // @ts-expect-error only authored variant values are valid
    <Badge variant="unknown" />;
    // @ts-expect-error the original union was extended, not widened to arbitrary strings
    <Dialog variant="unknown" />;
  `
  );
  const diagnostics = [badge, dialog, usage].flatMap((source) =>
    source.getPreEmitDiagnostics()
  );
  assert.equal(project.formatDiagnosticsWithColorAndContext(diagnostics), "");

  const evaluate = (file: typeof badge, name: string) =>
    runInNewContext(
      file
        .getVariableDeclarationOrThrow(name)
        .getInitializerOrThrow()
        .getText(),
      { cva }
    );
  const badgeVariants = evaluate(badge, "badgeVariants");
  const popup = evaluate(dialog, "dialogPopupVariants");
  const header = evaluate(dialog, "dialogHeaderVariants");
  const footer = evaluate(dialog, "dialogFooterVariants");
  assert.match(cn(badgeVariants({ variant: "brand" })), /\bbg-accent\b/);
  assert.match(cn(badgeVariants()), /\bbg-primary\b/);
  assert.match(cn(popup({ variant: "brand" })), /\bbg-accent\b/);
  assert.match(cn(header({ variant: "brand" })), /\bbg-card\b/);
  assert.doesNotMatch(cn(footer({ variant: "brand" })), /\bbg-popover\b/);
  assert.match(cn(popup()), /\bbg-background\b/);
});

test("adds a shared CVA key before isolating existing styles for one part", async () => {
  const project = new Project({ useInMemoryFileSystem: true });
  const source = await load(project, "menu");
  assert.deepEqual(
    applyPresetVariantClasses(source, "menu", {
      variant: [
        ...native("menu", "variant").map((option) =>
          option.value === "default"
            ? { ...option, partClasses: { CheckboxItem: "bg-card" } }
            : option
        ),
        { value: "brand" },
      ],
    }),
    []
  );
  const original = source
    .getVariableDeclarationOrThrow("menuCheckboxItemVariants")
    .getText();
  const isolated = source
    .getVariableDeclarationOrThrow("menuCheckboxItemVariantsForCheckboxItem")
    .getText();
  assert.match(original, /"brand": ""/);
  assert.match(isolated, /"brand": ""/);
  assert.match(isolated, /\bbg-card\b/);
  assert.match(
    source.getFunctionOrThrow("MenuSwitchItem").getText(),
    /menuCheckboxItemVariants\(\{ variant: "switch" \}\)/
  );
});

test("boolean axes and unproven type changes are skipped without editing the source", async () => {
  const project = new Project({ useInMemoryFileSystem: true });
  const backdrop = await load(project, "backdrop");
  const before = backdrop.getText();
  assert.deepEqual(
    applyPresetVariantClasses(backdrop, "backdrop", {
      blur: [
        ...native("backdrop", "blur"),
        { value: "brand", classes: "bg-card" },
      ],
    }),
    ["blur.brand (not an extensible string axis)"]
  );
  assert.equal(backdrop.getText(), before);

  const opaque = project.createSourceFile(
    "opaque.tsx",
    `
    const styles = cva("", { variants: { variant: { default: "" } } });
    type Unrelated = { variant?: "default" };
    function Opaque({ variant }: ImportedProps) {
      return <div data-slot="opaque" className={styles({ variant })} />;
    }
  `
  );
  const original = opaque.getText();
  assert.deepEqual(
    applyPresetVariantClasses(opaque, "opaque", {
      variant: [{ value: "default" }, { value: "brand", classes: "bg-accent" }],
    }),
    ["variant.brand (cannot extend the component's prop type safely)"]
  );
  assert.equal(opaque.getText(), original);
});

test("all current string axes accept a new value without diagnostics in the generated components", async () => {
  const project = new Project({
    tsConfigFilePath: fileURLToPath(url("tsconfig.json")),
    skipAddingFilesFromTsConfig: true,
  });
  const generated = [];
  let covered = 0;
  for (const item of Object.values(registry.items)) {
    if (item.type !== "component") continue;
    const axes = item.capabilities?.variants?.filter(
      ({ values }) => !values.includes("true") && !values.includes("false")
    );
    if (!axes?.length) continue;
    const source = await load(project, item.id);
    generated.push(source);
    for (const { name, values } of axes) {
      assert.deepEqual(
        applyPresetVariantClasses(source, item.id, {
          [name]: [
            ...values.map((value) => ({ value })),
            { value: "rlz-custom" },
          ],
        }),
        [],
        `${item.id}.${name}`
      );
      covered++;
    }
  }
  assert.ok(covered > 0);
  const diagnostics = generated.flatMap((source) =>
    source.getPreEmitDiagnostics()
  );
  assert.equal(project.formatDiagnosticsWithColorAndContext(diagnostics), "");
});
