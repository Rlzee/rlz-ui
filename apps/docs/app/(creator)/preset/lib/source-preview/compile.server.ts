import { readFile, realpath } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { Node, Project, ts, type SourceFile } from "ts-morph";
import type { PresetComponentCustomization } from "@rlz/registry";
import { transformPresetComponent } from "@rlz/preset-transform";
import { sourcePreviewComponents, isSourcePreviewComponent } from "./catalog";
import { instrumentPreviewSource } from "./instrument.server";
import { injectScenarioConsumers } from "./consumers.server";
import { previewSelectionDefinition } from "./selection";
import { capabilitiesOf } from "@rlz/ui/registry/resolve-capabilities";
import {
  playgroundExamples,
  playgroundScenarios,
} from "../playground-examples";
import { type SourcePreviewBundle } from "./types";

const require = createRequire(path.join(process.cwd(), "package.json"));
const EXTERNALS = new Set([
  "react",
  "react/jsx-runtime",
  "react-dom",
  "class-variance-authority",
  "cn",
  "lucide-react",
  "next/link",
  "recharts",
]);

function external(id: string) {
  return EXTERNALS.has(id) || /^@base-ui\/react\/[a-z-]+$/.test(id);
}

/** Node's resolver does not infer TS extensions outside the tsx test runner. */
async function resolveSourceImport(filename: string, specifier: string) {
  if (!specifier.startsWith("."))
    return createRequire(filename).resolve(specifier);
  const absolute = path.resolve(path.dirname(filename), specifier);
  const candidates = path.extname(absolute)
    ? [
        absolute,
        absolute.replace(/\.js$/, ".ts"),
        absolute.replace(/\.js$/, ".tsx"),
      ]
    : [
        `${absolute}.ts`,
        `${absolute}.tsx`,
        path.join(absolute, "index.ts"),
        path.join(absolute, "index.tsx"),
      ];
  for (const candidate of candidates) {
    try {
      return await realpath(candidate);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  throw new Error(`Cannot resolve UI source import: ${specifier}`);
}

/**
 * Compile only trusted, local library sources. The request supplies preset data,
 * never source text, filenames, import specifiers or executable expressions.
 */
export async function compileSourcePreview(
  slug: string,
  edits: Record<string, PresetComponentCustomization>
): Promise<SourcePreviewBundle> {
  if (!isSourcePreviewComponent(slug))
    throw new Error("Unsupported source preview component");

  const uiRoot = path.dirname(
    path.dirname(await realpath(require.resolve("@rlz/ui/globals.css")))
  );
  const project = new Project({ useInMemoryFileSystem: true });
  const bundle: SourcePreviewBundle = {
    modules: {},
    preview: "",
    example: "",
    contexts: {},
    warnings: [],
    selection: previewSelectionDefinition(slug, edits[slug]),
  };
  const loading = new Map<string, string>();
  const unavailable = new Map<string, string>();

  async function load(filename: string, scenario = false): Promise<string> {
    filename = await realpath(filename);
    const relative = path.relative(uiRoot, filename).replaceAll("\\", "/");
    if (
      relative.startsWith("../") ||
      path.isAbsolute(relative) ||
      !/\.tsx?$/.test(relative)
    )
      throw new Error("Source preview imports must stay inside the UI sources");
    const id = `${scenario ? "scenario/" : ""}${relative}`;
    if (loading.has(id)) return id;
    if (loading.size >= 100)
      throw new Error("Source preview module limit reached");
    loading.set(id, filename);
    const source = project.createSourceFile(
      `/${id}`,
      await readFile(filename, "utf8")
    );
    if (relative.startsWith("components/examples/")) {
      const removed = removedExampleUsages(
        source,
        edits,
        scenario ? slug : undefined
      );
      if (removed.length) {
        unavailable.set(
          id,
          `This example uses removed variant values: ${removed.join(
            ", "
          )}. Its source must be updated before it can render.`
        );
        return id;
      }
    }
    const item = Object.entries(sourcePreviewComponents).find(
      ([, item]) => item.path === relative
    );
    if (item) {
      const [componentId] = item;
      const warnings = transformPresetComponent(
        source,
        componentId,
        edits[componentId]
      );
      bundle.warnings.push(
        ...warnings.variants.map((value) => `${componentId}: ${value}`)
      );
      bundle.warnings.push(
        ...warnings.parts.map(
          (value) => `${componentId}: unsupported part ${value}`
        )
      );
      if (componentId === slug) injectScenarioConsumers(source, id, bundle);
    }
    instrumentPreviewSource(source, id, bundle);
    const imports: Record<string, string> = {};
    for (const declaration of [
      ...source.getImportDeclarations(),
      ...source.getExportDeclarations(),
    ]) {
      const specifier = declaration.getModuleSpecifierValue();
      if (
        !specifier ||
        (Node.isImportDeclaration(declaration) && declaration.isTypeOnly())
      )
        continue;
      if (specifier.startsWith("@rlz/ui/") || specifier.startsWith(".")) {
        imports[specifier] = await load(
          await resolveSourceImport(filename, specifier)
        );
      } else if (external(specifier)) {
        imports[specifier] = `external:${specifier}`;
      } else {
        throw new Error(`Unsupported source preview dependency: ${specifier}`);
      }
    }
    // react-jsx emits this import even when the source has no React import.
    imports["react/jsx-runtime"] = "external:react/jsx-runtime";
    imports["react"] = "external:react";
    const output = ts.transpileModule(source.getFullText(), {
      fileName: `${id}.tsx`,
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
      reportDiagnostics: true,
    });
    if (
      output.diagnostics?.some(
        (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
      )
    )
      throw new Error("Source preview could not transpile the component");
    bundle.modules[id] = { code: output.outputText, imports };
    return id;
  }

  async function exampleEntry(examplePath: string, scenario: boolean) {
    let filename: string;
    try {
      filename = require.resolve(
        `@rlz/ui/components/examples/ui/${examplePath}`
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "MODULE_NOT_FOUND")
        throw error;
      return {
        warning: `The registered example "${examplePath}" has no source file.`,
      };
    }
    const entry = await load(filename, scenario);
    return unavailable.has(entry)
      ? { warning: unavailable.get(entry) }
      : { entry };
  }
  bundle.scenarios = [];
  const primary = new Set(playgroundScenarios(slug).map(({ key }) => key));
  for (const { key, path: examplePath, label } of playgroundExamples(slug)) {
    bundle.scenarios.push({
      id: key,
      label,
      primary: primary.has(key),
      ...(await exampleEntry(examplePath, true)),
    });
  }
  bundle.examples = [];
  for (const { key, path: examplePath, label } of playgroundExamples(slug)) {
    bundle.examples.push({
      id: key,
      label,
      ...(await exampleEntry(examplePath, false)),
    });
  }
  const preview = bundle.scenarios[0];
  const example = bundle.examples[0];
  bundle.preview = preview?.entry ?? "";
  bundle.example = example?.entry ?? "";
  bundle.previewWarning =
    preview?.warning ?? (!preview ? "No scenario available." : undefined);
  bundle.exampleWarning =
    example?.warning ?? (!example ? "No example available." : undefined);
  return bundle;
}

/** Report literal invalid usages; do not silently migrate documentation props. */
function removedExampleUsages(
  source: SourceFile,
  edits: Record<string, PresetComponentCustomization>,
  selectedComponent?: string
) {
  const removed = new Set<string>();
  for (const declaration of source.getImportDeclarations()) {
    const item = Object.entries(sourcePreviewComponents).find(
      ([, item]) =>
        declaration.getModuleSpecifierValue() ===
        `@rlz/ui/${item.path.replace(/\.tsx?$/, "")}`
    );
    if (!item) continue;
    const [componentId] = item;
    const axes = edits[componentId]?.variants;
    if (!axes) continue;
    const names = new Set(
      declaration
        .getNamedImports()
        .map((entry) => entry.getAliasNode()?.getText() ?? entry.getName())
    );
    for (const node of source.getDescendants()) {
      if (
        !(
          Node.isJsxOpeningElement(node) || Node.isJsxSelfClosingElement(node)
        ) ||
        !names.has(node.getTagNameNode().getText().split(".")[0]!)
      )
        continue;
      for (const [axis, values] of Object.entries(axes)) {
        if (!values.length) continue;
        const attribute = node.getAttribute(axis);
        if (!Node.isJsxAttribute(attribute)) continue;
        const initializer = attribute.getInitializer();
        const expression = Node.isJsxExpression(initializer)
          ? initializer.getExpression()
          : initializer;
        if (
          Node.isStringLiteral(expression) &&
          !values.some(({ value }) => value === expression.getLiteralValue())
        ) {
          const native = capabilitiesOf(componentId)?.variants?.find(
            (entry) => entry.name === axis
          );
          if (
            componentId === selectedComponent &&
            native?.values.includes(expression.getLiteralValue())
          )
            continue; // The selected scope replaces public variant props, not internal fixed values.
          removed.add(
            `${componentId}.${axis}="${expression.getLiteralValue()}"`
          );
        }
      }
    }
  }
  return [...removed];
}
