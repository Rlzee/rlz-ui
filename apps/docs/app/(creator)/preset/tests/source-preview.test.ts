import assert from "node:assert/strict";
import { test } from "node:test";
import * as React from "react";
import { Project, ts } from "ts-morph";
import { renderToStaticMarkup } from "react-dom/server";
import { capabilitiesOf } from "@rlz/ui/registry/resolve-capabilities";
import { compileSourcePreview } from "../lib/source-preview/compile.server";
import { SourcePreviewRuntime } from "../lib/source-preview/runtime";
import { type SourcePreviewBundle } from "../lib/source-preview/types";
import {
  sourcePreviewComponentIds,
  sourcePreviewComponents,
  isSourcePreviewComponent,
} from "../lib/source-preview/catalog";
import { sourcePreviewExternals } from "../lib/source-preview/externals";
import { playgroundExamples } from "../lib/playground-examples";
import { injectScenarioConsumers } from "../lib/source-preview/consumers.server";
import { instrumentPreviewSource } from "../lib/source-preview/instrument.server";
import type { SourcePreviewSelectionDefinition } from "../lib/source-preview/types";
import { previewSelection } from "../lib/source-preview/selection";

const dependencies = sourcePreviewExternals;

function fixture(text: string, selection?: SourcePreviewSelectionDefinition) {
  const source = new Project({ useInMemoryFileSystem: true }).createSourceFile(
    "/fixture.tsx",
    text
  );
  const bundle: SourcePreviewBundle = {
    modules: {},
    preview: "fixture",
    example: "fixture",
    contexts: {},
    warnings: [],
    selection,
  };
  if (selection) injectScenarioConsumers(source, "fixture", bundle);
  instrumentPreviewSource(source, "fixture", bundle);
  const imports = Object.fromEntries(
    source
      .getImportDeclarations()
      .map((entry) => [
        entry.getModuleSpecifierValue(),
        `external:${entry.getModuleSpecifierValue()}`,
      ])
  );
  imports["react/jsx-runtime"] = "external:react/jsx-runtime";
  imports.react = "external:react";
  bundle.modules.fixture = {
    imports,
    code: ts.transpileModule(source.getFullText(), {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText,
  };
  return bundle;
}

function options(slug: string, axis = "variant") {
  return capabilitiesOf(slug)!
    .variants!.find((entry) => entry.name === axis)!
    .values.map((value) => ({ value }));
}

test("the entire component registry compiles and renders its documentation examples without adapters", async () => {
  const failures: string[] = [];
  for (const slug of sourcePreviewComponentIds) {
    try {
      const bundle = await compileSourcePreview(slug, {});
      if (sourcePreviewComponents[slug].allowManualInstall !== false) {
        const consumed = new Set(Object.values(bundle.consumers ?? {}).flat());
        for (const axis of capabilitiesOf(slug)?.variants ?? [])
          assert.ok(
            consumed.has(axis.name),
            `${slug}.${axis.name}: missing public consumer`
          );
      }
      const runtime = new SourcePreviewRuntime();
      const loaded = runtime.load(bundle, dependencies(bundle));
      assert.deepEqual(bundle.warnings, []);
      assert.doesNotThrow(
        () => renderToStaticMarkup(React.createElement(loaded.preview)),
        slug
      );
      assert.doesNotThrow(
        () => renderToStaticMarkup(React.createElement(loaded.example)),
        slug
      );
      assert.deepEqual(
        loaded.examples.map(({ id }) => id),
        playgroundExamples(slug).map(({ key }) => key)
      );
      for (const { Component, label } of loaded.examples) {
        assert.ok(Component, `${slug}: ${label}`);
        assert.doesNotThrow(
          () => renderToStaticMarkup(React.createElement(Component!)),
          `${slug}: ${label}`
        );
      }
    } catch (error) {
      failures.push(`${slug}: ${String(error)}`);
    }
  }
  assert.deepEqual(failures, []);
});

test("source preview passes selected new variants without changing installed defaults", async () => {
  for (const slug of ["button", "badge"] as const) {
    const bundle = await compileSourcePreview(slug, {
      [slug]: {
        variants: {
          variant: [
            ...options(slug),
            { value: "brand", classes: "bg-[#132768]" },
          ],
        },
      },
    });
    const runtime = new SourcePreviewRuntime();
    const loaded = runtime.load(bundle, dependencies(bundle));
    runtime.setSelection({ variant: "brand" });
    const preview = renderToStaticMarkup(React.createElement(loaded.preview));
    const example = renderToStaticMarkup(React.createElement(loaded.example));
    assert.ok(preview.includes("bg-[#132768]"));
    assert.ok(!preview.includes("bg-primary"));
    assert.ok(example.includes("bg-primary"));
    assert.ok(!example.includes("bg-[#132768]"));
  }
});

test("documentation variants are restyled independently of the currently selected value", async () => {
  const bundle = await compileSourcePreview("badge", {
    badge: {
      variants: {
        variant: options("badge").map((option) =>
          option.value === "secondary"
            ? { ...option, classes: "bg-[#123456]" }
            : option.value === "outline"
            ? { ...option, classes: "border-[#abcdef]" }
            : option
        ),
      },
    },
  });
  const runtime = new SourcePreviewRuntime();
  const loaded = runtime.load(bundle, dependencies(bundle));
  runtime.setSelection({ variant: "primary" });
  const Example = loaded.examples.find(({ id }) => id === "badge-variant")!
    .Component!;
  const markup = renderToStaticMarkup(React.createElement(Example));
  assert.ok(markup.includes("bg-[#123456]"));
  assert.ok(markup.includes("border-[#abcdef]"));
  assert.ok(
    !renderToStaticMarkup(React.createElement(loaded.preview)).includes(
      "bg-[#123456]"
    )
  );
});

test("class edits preserve component identities, public parts and context objects", async () => {
  const runtime = new SourcePreviewRuntime();
  const original = await compileSourcePreview("dialog", {});
  const first = runtime.load(original, dependencies(original));
  const changed = await compileSourcePreview("dialog", {
    dialog: {
      partClasses: { Popup: "rounded-full bg-red-500", Header: "p-8" },
    },
  });
  const next = runtime.load(changed, dependencies(changed));
  assert.equal(first.preview, next.preview);
  assert.equal(first.example, next.example);
  assert.deepEqual(changed.contexts, original.contexts);
  assert.deepEqual(changed.warnings, []);
  // Render dependencies are real library exports, not reconstructed Dialog parts.
  const code = Object.entries(changed.modules).find(
    ([id]) => id === "components/ui/dialog.tsx"
  )![1].code;
  assert.ok(code.includes("rounded-full bg-red-500"));
  assert.ok(code.includes("DialogPopup"));
  const root = next.scenarios.find(({ id }) => id === "dialog")!.Component!;
  assert.equal(
    root,
    first.scenarios.find(({ id }) => id === "dialog")!.Component
  );
});

test("the registry, not a pilot list or environment switch, controls allowed components", () => {
  for (const slug of sourcePreviewComponentIds)
    assert.equal(isSourcePreviewComponent(slug), true);
  for (const slug of [
    "../dialog",
    "__proto__",
    "constructor",
    "",
    "not-a-component",
  ])
    assert.equal(isSourcePreviewComponent(slug), false);
});

test("Button state scenarios reuse the existing disabled and loading examples with selected props", async () => {
  const bundle = await compileSourcePreview("button", {
    button: {
      variants: {
        variant: [
          ...options("button"),
          { value: "brand", classes: "bg-[#132768]" },
        ],
      },
    },
  });
  const runtime = new SourcePreviewRuntime();
  const loaded = runtime.load(bundle, dependencies(bundle));
  runtime.setSelection({ variant: "brand", size: "sm" });
  assert.deepEqual(
    loaded.scenarios.filter(({ primary }) => primary).map(({ id }) => id),
    ["button", "button-disabled", "button-loading"]
  );
  for (const { id, Component } of loaded.scenarios) {
    const markup = renderToStaticMarkup(React.createElement(Component!));
    assert.ok(markup.includes("bg-[#132768]"), id);
    assert.ok(markup.includes("h-8"), id);
    if (id === "button-disabled") assert.match(markup, / disabled=""/);
  }
  assert.ok(
    bundle.modules[
      "scenario/components/examples/ui/button/loading.tsx"
    ]!.code.includes("useState")
  );
  runtime.setSelection({ variant: "brand", disabled: false, loading: true });
  const disabled = loaded.scenarios.find(({ id }) => id === "button-disabled")!
    .Component!;
  const loading = loaded.scenarios.find(({ id }) => id === "button-loading")!
    .Component!;
  assert.match(
    renderToStaticMarkup(React.createElement(disabled)),
    / disabled=""/
  );
  assert.doesNotMatch(
    renderToStaticMarkup(React.createElement(loading)),
    /data-loading=/
  );
});

test("documentation examples referencing removed values are flagged instead of silently rewritten", async () => {
  const bundle = await compileSourcePreview("alert", {
    alert: {
      variants: {
        variant: options("alert").filter(({ value }) => value !== "warning"),
      },
    },
  });
  const warning = bundle.examples!.find(({ id }) => id === "alert-warning")!;
  assert.equal(warning.entry, undefined);
  assert.match(warning.warning!, /alert\.variant="warning"/);
  assert.ok(bundle.examples!.find(({ id }) => id === "alert-success")!.entry);
  const loaded = new SourcePreviewRuntime().load(bundle, dependencies(bundle));
  assert.equal(
    loaded.examples.find(({ id }) => id === "alert-warning")!.Component,
    undefined
  );
});

test("scenario props reach their public consuming part without becoming installed defaults", async () => {
  const bundle = fixture(
    `
    export function Popup({ variant = "default", backdrop = true, showCloseButton = true }) {
      return <div data-variant={variant} data-backdrop={String(backdrop)} data-close={String(showCloseButton)} />;
    }
    function Root() { return <Popup />; }
    export const Composed = Object.assign(Root, { Popup });
    export default function Example() { return <Composed />; }
  `,
    {
      axes: { variant: ["default", "bare"] },
      props: ["backdrop", "showCloseButton"],
    }
  );
  const runtime = new SourcePreviewRuntime();
  const loaded = runtime.load(bundle, dependencies(bundle));
  runtime.setSelection({
    variant: "bare",
    backdrop: false,
    showCloseButton: false,
  });
  const selected = renderToStaticMarkup(React.createElement(loaded.preview));
  assert.match(selected, /data-variant="bare"/);
  assert.match(selected, /data-backdrop="false"/);
  assert.match(selected, /data-close="false"/);
  const original = renderToStaticMarkup(React.createElement(loaded.example));
  assert.match(original, /data-variant="default"/);
  assert.match(original, /data-backdrop="true"/);
  assert.match(original, /data-close="true"/);
});

test("a removed dependency value is reported even when it invalidates the default scenario", async () => {
  const bundle = await compileSourcePreview("dialog", {
    button: {
      variants: {
        variant: options("button").filter(({ value }) => value !== "outline"),
      },
    },
  });
  assert.match(bundle.previewWarning!, /button\.variant="outline"/);
  assert.match(bundle.exampleWarning!, /button\.variant="outline"/);
  const loaded = new SourcePreviewRuntime().load(bundle, dependencies(bundle));
  const scenario = loaded.scenarios.find(({ id }) => id === "dialog")!;
  assert.equal(scenario.Component, undefined);
  assert.match(scenario.warning!, /button\.variant="outline"/);
});

test("removing an Alert default uses the same source fallback as the CLI", async () => {
  const bundle = await compileSourcePreview("alert", {
    alert: {
      props: { variant: "success" },
      variants: {
        variant: options("alert").filter(({ value }) => value !== "default"),
      },
    },
  });
  const runtime = new SourcePreviewRuntime();
  const loaded = runtime.load(bundle, dependencies(bundle));
  const example = renderToStaticMarkup(React.createElement(loaded.example));
  assert.ok(example.includes("bg-success/8"));
  assert.ok(!example.includes("bg-card"));
});

test("structural context changes require an explicit reset instead of silently remounting", async () => {
  const runtime = new SourcePreviewRuntime();
  const original = await compileSourcePreview("dialog", {});
  const first = runtime.load(original, dependencies(original));
  const changed = await compileSourcePreview("dialog", {
    dialog: {
      props: { variant: "bare" },
      variants: {
        variant: options("dialog").filter(({ value }) => value !== "default"),
      },
    },
  });
  assert.throws(
    () => runtime.load(changed, dependencies(changed)),
    /Reset the source preview/
  );
  assert.equal(
    runtime.load(original, dependencies(original)).preview,
    first.preview
  );
  assert.doesNotThrow(() =>
    new SourcePreviewRuntime().load(changed, dependencies(changed))
  );
});

test("failed module evaluation leaves the previous implementations and exports usable", async () => {
  const runtime = new SourcePreviewRuntime();
  const original = await compileSourcePreview("badge", {});
  const first = runtime.load(original, dependencies(original));
  const before = renderToStaticMarkup(React.createElement(first.preview));
  const broken = structuredClone(original);
  broken.modules[broken.example]!.code +=
    '\nthrow new Error("intentional failure");';
  assert.throws(
    () => runtime.load(broken, dependencies(broken)),
    /intentional failure/
  );
  assert.equal(
    renderToStaticMarkup(React.createElement(first.preview)),
    before
  );
});

test("the compiler rejects arbitrary entry paths", async () => {
  await assert.rejects(
    compileSourcePreview("../dialog" as "dialog", {}),
    /Unsupported source preview component/
  );
});

test("preset class strings remain data and cannot execute in compiled modules", async () => {
  const bundle = await compileSourcePreview("badge", {
    badge: {
      partClasses: { Root: 'p-4"; globalThis.__rlzSourceInjected = true; //' },
    },
  });
  const runtime = new SourcePreviewRuntime();
  const loaded = runtime.load(bundle, dependencies(bundle));
  renderToStaticMarkup(React.createElement(loaded.preview));
  assert.equal(Reflect.get(globalThis, "__rlzSourceInjected"), undefined);
});

test("failed evaluation rolls back public parts attached to stable component exports", () => {
  const runtime = new SourcePreviewRuntime();
  const bundle: SourcePreviewBundle = {
    preview: "test",
    example: "test",
    contexts: {},
    warnings: [],
    modules: {
      test: {
        imports: {},
        code: `exports.default = Object.assign(
          __rlzPreview.component("root", () => "old"),
          { Part: "old" }
        );`,
      },
    },
  };
  const first = runtime.load(bundle, {});
  const component = first.preview as typeof first.preview & {
    Part: string;
    Added?: boolean;
  };
  const broken = structuredClone(bundle);
  broken.modules.test!.code = `exports.default = Object.assign(
    __rlzPreview.component("root", () => "new"),
    { Part: "new", Added: true }
  ); throw new Error("rollback");`;
  assert.throws(() => runtime.load(broken, {}), /rollback/);
  assert.equal(component(), "old");
  assert.equal(component.Part, "old");
  assert.equal(component.Added, undefined);
});

test("arrows and memo/forwardRef boundaries retain identity with fresh implementations", () => {
  const make = (label: string) =>
    fixture(`
    import { memo, forwardRef } from "react";
    const Arrow = () => <span>${label}</span>;
    const Forward = forwardRef((props, ref) => <div ref={ref}><Arrow /></div>);
    const Memo = memo(Forward);
    export default Object.assign(Memo, { Arrow, Forward });
  `);
  const runtime = new SourcePreviewRuntime();
  const original = make("before");
  const first = runtime.load(original, dependencies(original));
  const parts = first.preview as typeof first.preview & {
    Arrow: unknown;
    Forward: unknown;
  };
  const arrow = parts.Arrow;
  const forward = parts.Forward;
  assert.match(
    renderToStaticMarkup(React.createElement(first.preview)),
    /before/
  );
  const changed = make("after");
  const next = runtime.load(changed, dependencies(changed));
  assert.equal(next.preview, first.preview);
  assert.equal(parts.Arrow, arrow);
  assert.equal(parts.Forward, forward);
  assert.match(
    renderToStaticMarkup(React.createElement(next.preview)),
    /after/
  );
});

test("literal data stays stable but changes when its dependency signature changes", () => {
  const make = (value: string) =>
    fixture(`
    const item = { value: "${value}" };
    const items = [item];
    export default function Example() { return items; }
  `);
  const runtime = new SourcePreviewRuntime();
  const original = make("first");
  const first = runtime.load(original, dependencies(original));
  const data = first.preview();
  assert.equal(runtime.load(original, dependencies(original)).preview(), data);
  const changed = make("second");
  const next = runtime.load(changed, dependencies(changed)).preview();
  assert.notEqual(next, data);
  assert.deepEqual(next, [{ value: "second" }]);
});

test("preview selection preserves boolean axis and property types", () => {
  assert.equal(
    previewSelection("backdrop", { props: { blur: "false" } }).blur,
    false
  );
  assert.equal(
    previewSelection("backdrop", { props: { blur: "true" } }).blur,
    true
  );
  assert.equal(
    previewSelection("dialog", { props: { backdrop: "false" } }).backdrop,
    false
  );
});
