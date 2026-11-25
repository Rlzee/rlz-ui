import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { Project } from "ts-morph";
import {
  applyPresetPartClasses,
  applyPresetVariantClasses,
} from "../src/utils/apply-preset-component-classes";

const requireFromUi = createRequire(
  new URL("../../ui/package.json", import.meta.url)
);
const { cva } = requireFromUi("class-variance-authority");
const { cn } = requireFromUi("cn");

async function fixture(name: string) {
  const project = new Project({ useInMemoryFileSystem: true });
  const source = await readFile(
    new URL(`../../ui/src/components/ui/${name}.tsx`, import.meta.url),
    "utf8"
  );
  return project.createSourceFile(`${name}.tsx`, source);
}

test("Button Root is applied after its variants and before the caller className", async () => {
  const source = await fixture("button");
  const untouchedBase = source
    .getVariableDeclarationOrThrow("defaultClass")
    .getText();
  assert.deepEqual(
    applyPresetPartClasses(source, "button", { Root: "rounded-full" }),
    []
  );
  const variant = source
    .getVariableDeclarationOrThrow("buttonVariants")
    .getText();
  assert.match(variant, /cva\(""/);
  assert.match(variant, /compoundVariants:\s*\[\{ class: "rounded-full" \}\]/);
  assert.match(variant, /variant: "primary"/);
  assert.match(variant, /"icon-md": "size-9/);
  assert.match(
    source.getText(),
    /buttonVariants\(\{ className, size, variant \}\)/
  );
  assert.equal(
    source.getVariableDeclarationOrThrow("defaultClass").getText(),
    untouchedBase
  );

  const installedVariants = runInNewContext(
    source
      .getVariableDeclarationOrThrow("buttonVariants")
      .getInitializerOrThrow()
      .getText(),
    { cva }
  );
  const outline = cn(
    installedVariants({
      variant: "outline",
      size: "sm",
      className: "rounded-none",
    })
  );
  assert.match(outline, /\bbg-secondary\b/);
  assert.match(outline, /\bh-8\b/);
  assert.match(outline, /\brounded-none\b/);
  assert.doesNotMatch(outline, /\brounded-full\b/);
});

test("Dialog Popup and Header are independent and preserve variant values", async () => {
  const source = await fixture("dialog");
  const footer = source
    .getVariableDeclarationOrThrow("dialogFooterVariants")
    .getText();
  assert.deepEqual(
    applyPresetPartClasses(source, "dialog", {
      Popup: "relative rounded-full bg-accent",
      Header: "flex px-8",
      Trigger: "rounded-full",
    }),
    ["Trigger"]
  );
  const popup = source
    .getVariableDeclarationOrThrow("dialogPopupVariants")
    .getText();
  const header = source
    .getVariableDeclarationOrThrow("dialogHeaderVariants")
    .getText();
  assert.match(popup, /class: "relative rounded-full bg-accent"/);
  assert.match(popup, /bare: "bg-popover"/);
  assert.match(header, /class: "flex px-8"/);
  assert.equal(
    source.getVariableDeclarationOrThrow("dialogFooterVariants").getText(),
    footer
  );
  assert.match(
    source.getText(),
    /cn\(dialogPopupVariants\(\{ variant \}\), className\)/
  );

  const popupVariants = runInNewContext(
    source
      .getVariableDeclarationOrThrow("dialogPopupVariants")
      .getInitializerOrThrow()
      .getText(),
    { cva }
  );
  const bare = cn(popupVariants({ variant: "bare" }));
  assert.match(bare, /\bbg-accent\b/);
  assert.doesNotMatch(bare, /\bbg-popover\b/);
});

test("no overrides and unknown source layouts leave the file unchanged", async () => {
  const source = await fixture("button");
  const before = source.getText();
  assert.deepEqual(applyPresetPartClasses(source, "button", undefined), []);
  assert.deepEqual(
    applyPresetPartClasses(source, "badge", { Root: "rounded-full" }),
    ["Root"]
  );
  assert.equal(source.getText(), before);

  source
    .getVariableDeclarationOrThrow("buttonVariants")
    .setInitializer("wrap(defaultClass)");
  const changed = source.getText();
  assert.deepEqual(
    applyPresetPartClasses(source, "button", { Root: "rounded-full" }),
    ["Root"]
  );
  assert.equal(source.getText(), changed);
});

test("Button restyles an existing variant and a quoted size without changing defaults", async () => {
  const source = await fixture("button");
  assert.deepEqual(
    applyPresetVariantClasses(source, "button", {
      variant: [
        { value: "primary" },
        { value: "outline", classes: "border bg-accent" },
        { value: "secondary" },
        { value: "ghost" },
        { value: "link" },
        { value: "destructive" },
      ],
      size: [
        ...[
          "xs",
          "sm",
          "md",
          "lg",
          "xl",
          "icon-sm",
          "icon-md",
          "icon-lg",
          "icon-xl",
        ].map((value) => ({ value })),
        { value: "icon-xs", classes: "size-8" },
      ],
    }),
    []
  );

  const installedVariants = runInNewContext(
    source
      .getVariableDeclarationOrThrow("buttonVariants")
      .getInitializerOrThrow()
      .getText(),
    { cva, defaultClass: "rounded-md" }
  );
  assert.match(cn(installedVariants()), /\bbg-primary\b/);
  assert.match(cn(installedVariants()), /\bh-9\b/);
  const outline = cn(
    installedVariants({ variant: "outline", size: "icon-xs" })
  );
  assert.match(outline, /\bbg-accent\b/);
  assert.match(outline, /\bsize-8\b/);
  assert.doesNotMatch(outline, /\bbg-secondary\b/);
  assert.match(
    cn(installedVariants({ variant: "outline", className: "bg-card" })),
    /\bbg-card\b/
  );
});

test("Dialog restyles existing variant parts independently and can clear a variant's classes", async () => {
  const source = await fixture("dialog");
  assert.deepEqual(
    applyPresetVariantClasses(source, "dialog", {
      variant: [
        { value: "default" },
        {
          value: "bare",
          partClasses: { Popup: "bg-accent", Header: "bg-card" },
        },
        { value: "bare-bottom", partClasses: { Header: "" } },
        { value: "bare-top" },
      ],
    }),
    []
  );
  const evaluate = (part: string) =>
    runInNewContext(
      source
        .getVariableDeclarationOrThrow(`dialog${part}Variants`)
        .getInitializerOrThrow()
        .getText(),
      { cva }
    );
  const popup = evaluate("Popup");
  const header = evaluate("Header");
  assert.match(cn(popup({ variant: "bare" })), /\bbg-accent\b/);
  assert.match(cn(header({ variant: "bare" })), /\bbg-card\b/);
  assert.match(cn(header({ variant: "bare-bottom" })), /\bpt-4\b/);
  assert.doesNotMatch(cn(header({ variant: "bare-bottom" })), /\bbg-popover\b/);
  assert.match(cn(header()), /\bbg-popover\b/);
});

test("adding or removing variant values and styling unsupported parts does not change the source", async () => {
  const source = await fixture("dialog");
  const original = source.getText();
  assert.deepEqual(
    applyPresetVariantClasses(source, "dialog", {
      variant: [
        { value: "default" },
        { value: "bare", partClasses: { Title: "text-xl" } },
        { value: "brand", partClasses: { Popup: "bg-accent" } },
      ],
    }),
    [
      "variant (kept bare-bottom, bare-top)",
      "variant.bare.Title",
      "variant.brand",
    ]
  );
  assert.equal(source.getText(), original);
});
