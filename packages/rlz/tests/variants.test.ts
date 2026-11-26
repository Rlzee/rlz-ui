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

function consumerProject() {
  return new Project({
    tsConfigFilePath: fileURLToPath(url("tsconfig.json")),
    skipAddingFilesFromTsConfig: true,
    compilerOptions: { declaration: false, declarationMap: false },
  });
}

function native(id: string, axis: string) {
  const item = registry.items[id];
  assert.equal(item?.type, "component");
  return item
    .capabilities!.variants!.find(({ name }) => name === axis)!
    .values.map((value) => ({ value }));
}

async function load(project: Project, id: string, suffix = "") {
  const item = registry.items[id]!;
  const name = `rlz-generated-${id}${suffix}`;
  const path = item.path.replace(/[^/]+\.tsx$/, `${name}.tsx`);
  return project.createSourceFile(
    fileURLToPath(url(`src/${path}`)),
    await readFile(url(`src/${item.path}`), "utf8")
  );
}

test("new variant keys follow sibling indentation and only quote names when needed", async () => {
  const project = consumerProject();
  const originalIndentation = project.manipulationSettings.getIndentationText();
  const originalNewLine = project.manipulationSettings.getNewLineKind();
  for (const [index, unit] of ["  ", "    ", "\t"].entries()) {
    const button = await load(project, "button", `-format-${index}`);
    const newline = index === 1 ? "\r\n" : "\n";
    button.replaceWithText(
      button
        .getFullText()
        .replace(/^(?: {2})+/gm, (spaces) => unit.repeat(spaces.length / 2))
        .replace(/\r?\n/g, newline)
    );
    assert.deepEqual(
      applyPresetVariantClasses(button, "button", {
        variant: [
          ...native("button", "variant"),
          { value: "brand", classes: "bg-violet-600" },
          { value: "brand-soft", classes: "bg-violet-100" },
        ],
        size: [
          ...native("button", "size"),
          { value: "comfy", classes: "h-12" },
        ],
      }),
      []
    );
    const text = button.getFullText();
    const lines = text.split(/\r?\n/).map((line) => line.replace(/,$/, ""));
    assert.ok(lines.includes(`${unit.repeat(3)}brand: "bg-violet-600"`));
    assert.ok(lines.includes(`${unit.repeat(3)}"brand-soft": "bg-violet-100"`));
    assert.ok(lines.includes(`${unit.repeat(3)}comfy: "h-12"`));
    assert.doesNotMatch(text, /"brand":/);
    assert.equal(
      project.manipulationSettings.getIndentationText(),
      originalIndentation
    );
    assert.equal(
      project.manipulationSettings.getNewLineKind(),
      originalNewLine
    );
  }
});

test("installed Badge and Dialog accept a new value in TSX and apply its styles", async () => {
  const project = consumerProject();
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
  assert.match(original, /brand: ""/);
  assert.match(isolated, /brand: ""/);
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
  const project = consumerProject();
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

test("a removed public value disappears from TSX and only a removed default uses the preset fallback", async () => {
  const project = consumerProject();
  const alert = await load(project, "alert");
  const withoutWarning = native("alert", "variant").filter(
    ({ value }) => value !== "warning"
  );
  assert.deepEqual(
    applyPresetVariantClasses(
      alert,
      "alert",
      { variant: withoutWarning },
      { variant: "success" }
    ),
    []
  );
  const cvaText = () =>
    alert
      .getVariableDeclarationOrThrow("alertVariants")
      .getInitializerOrThrow()
      .getText();
  assert.match(cvaText(), /defaultVariants:\s*\{\s*variant: "default"/);
  assert.doesNotMatch(cvaText(), /\bwarning:/);

  assert.deepEqual(
    applyPresetVariantClasses(
      alert,
      "alert",
      {
        variant: withoutWarning.filter(({ value }) => value !== "default"),
      },
      { variant: "success" }
    ),
    []
  );
  const usage = project.createSourceFile(
    fileURLToPath(url("src/components/ui/rlz-remove-usage.tsx")),
    `
    import { Alert } from "./rlz-generated-alert";
    <Alert />;
    <Alert variant="success" />;
    // @ts-expect-error removed registry variants cannot be passed
    <Alert variant="warning" />;
    // @ts-expect-error removed default is no longer a valid explicit prop
    <Alert variant="default" />;
  `
  );
  assert.equal(
    project.formatDiagnosticsWithColorAndContext(
      [alert, usage].flatMap((file) => file.getPreEmitDiagnostics())
    ),
    ""
  );
  const options = runInNewContext(cvaText(), { cva, cn });
  assert.equal(options(), options({ variant: "success" }));
});

test("removes a shared public Menu value without removing the fixed internal SwitchItem variant", async () => {
  const project = consumerProject();
  const menu = await load(project, "menu");
  assert.deepEqual(
    applyPresetVariantClasses(menu, "menu", {
      variant: native("menu", "variant").filter(
        ({ value }) => value !== "solid" && value !== "switch"
      ),
    }),
    []
  );
  const code = menu
    .getVariableDeclarationOrThrow("menuCheckboxItemVariants")
    .getText();
  assert.match(code, /\bswitch:/);
  assert.doesNotMatch(code, /\bsolid:/);
  assert.match(
    menu.getFunctionOrThrow("MenuSwitchItem").getText(),
    /variant: "switch"/
  );
  assert.match(
    menu.getFunctionOrThrow("MenuCheckboxItem").getText(),
    /const isSolid = false/
  );
  assert.equal(
    project.formatDiagnosticsWithColorAndContext(menu.getPreEmitDiagnostics()),
    ""
  );
});

test("a preset can replace the default with a new value and narrow a handwritten type", async () => {
  const project = consumerProject();
  const source = await load(project, "dialog");
  assert.deepEqual(
    applyPresetVariantClasses(
      source,
      "dialog",
      {
        variant: [
          { value: "bare" },
          { value: "brand", partClasses: { Popup: "bg-accent" } },
        ],
      },
      { variant: "brand" }
    ),
    []
  );
  assert.match(
    source.getTypeAliasOrThrow("DialogVariant").getText(),
    /"bare" \| "brand"/
  );
  assert.doesNotMatch(
    source.getTypeAliasOrThrow("DialogVariant").getText(),
    /"default"|"bare-top"/
  );
  assert.match(
    source.getFunctionOrThrow("DialogRoot").getText(),
    /variant = "brand"/
  );
  assert.match(
    source.getVariableDeclarationOrThrow("DialogVariantContext").getText(),
    /createContext<DialogVariant>\("brand"\)/
  );
  assert.equal(
    project.formatDiagnosticsWithColorAndContext(
      source.getPreEmitDiagnostics()
    ),
    ""
  );
});

test("removing Input variant values prunes their compound rules", async () => {
  const project = new Project({ useInMemoryFileSystem: true });
  const input = await load(project, "input");
  assert.deepEqual(
    applyPresetVariantClasses(input, "input", {
      variant: [{ value: "secondary" }],
    }),
    []
  );
  const cvaCode = input
    .getVariableDeclarationOrThrow("inputVariants")
    .getInitializerOrThrow()
    .getText();
  assert.doesNotMatch(cvaCode, /bg-input/);
  assert.match(cvaCode, /bg-accent\/60/);
  const options = runInNewContext(cvaCode, { cva });
  assert.equal(
    options({ unstyled: false }),
    options({ variant: "secondary", unstyled: false })
  );
  assert.match(
    input.getFunctionOrThrow("Input").getText(),
    /variant = "secondary"/
  );
});

test("removal filters compound arrays and leaves unrelated rules intact", () => {
  const project = new Project({ useInMemoryFileSystem: true });
  const source = project.createSourceFile(
    "demo.tsx",
    `
    const styles = cva("", {
      variants: { tone: { normal: "", quiet: "", loud: "" }, size: { sm: "", md: "" } },
      defaultVariants: { tone: "normal" },
      compoundVariants: [
        { ["tone"]: ["normal", "loud"], class: "keep-this" },
        { tone: ["normal", "quiet"], class: "remove-this" },
        { size: "sm", class: "other-axis" },
      ],
    });
    function Demo({ tone }: VariantProps<typeof styles>) {
      return <div data-slot="demo" className={styles({ tone })} />;
    }
  `
  );
  assert.deepEqual(
    applyPresetVariantClasses(source, "demo", { tone: [{ value: "loud" }] }),
    []
  );
  const options = runInNewContext(
    source
      .getVariableDeclarationOrThrow("styles")
      .getInitializerOrThrow()
      .getText(),
    { cva }
  );
  assert.equal(options({ size: "sm" }), "keep-this other-axis");
  assert.doesNotMatch(source.getText(), /remove-this/);
});

test("keeps empty lists and boolean removals from changing the source", async () => {
  const project = new Project({ useInMemoryFileSystem: true });
  const source = await load(project, "backdrop");
  const original = source.getText();
  assert.deepEqual(
    applyPresetVariantClasses(source, "backdrop", { blur: [] }),
    ["blur (at least one variant value must be kept)"]
  );
  assert.deepEqual(
    applyPresetVariantClasses(source, "backdrop", {
      blur: [{ value: "true" }],
    }),
    ["blur (only literal string axes support removal)"]
  );
  assert.equal(source.getText(), original);
});

test("removes a native default on every current string axis without diagnostics", async () => {
  const project = consumerProject();
  const generated = [];
  for (const item of Object.values(registry.items)) {
    if (item.type !== "component") continue;
    for (const axis of item.capabilities?.variants ?? []) {
      if (
        axis.values.length < 2 ||
        axis.values.some((value) => value === "false" || value === "true")
      )
        continue;
      const source = await load(project, item.id, `-${axis.name}`);
      generated.push(source);
      const removed = axis.default ?? axis.values[0];
      const remaining = axis.values
        .filter((value) => value !== removed)
        .map((value) => ({ value }));
      assert.deepEqual(
        applyPresetVariantClasses(source, item.id, { [axis.name]: remaining }),
        [],
        `${item.id}.${axis.name}`
      );
    }
  }
  assert.ok(generated.length > 0);
  const diagnostics = generated.flatMap((source) =>
    source.getPreEmitDiagnostics()
  );
  assert.equal(project.formatDiagnosticsWithColorAndContext(diagnostics), "");
});
