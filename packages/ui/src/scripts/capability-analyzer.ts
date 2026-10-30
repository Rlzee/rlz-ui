import ts from "typescript";
import type {
  ComponentCapabilities,
  ComponentStyleProperty,
  ComponentVariant,
  ComponentVariantClasses,
} from "@rlz/registry";

/**
 * Reads what a component source exposes, so the Creator can offer it for
 * customization without anyone declaring it. cva 0.7.1 keeps its config inside a
 * closure (its returned function exposes nothing but the call signature), so the
 * only way to read a component's variants is their source: this analyzer parses
 * the file with the TypeScript compiler API (`typescript`, a workspace-root
 * devDependency) and answers with the shape the registry manifest uses.
 */
export type DetectedComponent = {
  capabilities: ComponentCapabilities;
  /** the built-in classes of each variant value, read from the same source */
  classes: ComponentVariantClasses;
};

// A corner drawn from one of the radius tokens, at any side. `rounded-full` and
// arbitrary radii are not here: they follow no token, so nothing to tune.
const RADIUS_TOKEN = /^rounded(-(t|b|s|e|r|l|x|y)+)?(-(sm|md|lg|xl))?$/;

// Canonical order of the state badges the Creator can show; a state is kept when
// the component's own classes style it. A state can sit behind another variant
// (`dark:hover:`, `has-focus-visible:has-aria-invalid:`), so a prefix separator
// counts as a boundary too.
const STATES: [string, RegExp][] = [
  ["hover", /(^|[\s\[:])hover:/],
  ["focus", /(^|[\s\[:])focus(-visible)?:|state-focus|has-focus/],
  ["active", /(^|[\s\[:])active:/],
  ["disabled", /(^|[\s\[:])(has-)?disabled[:-]/],
  ["invalid", /(^|[\s\[:])(has-)?aria-invalid[:-]|state-invalid/],
  ["checked", /data-\[checked\]|data-\[state='?checked|aria-checked/],
  ["selected", /data-\[selected|aria-selected/],
  ["expanded", /data-\[expanded|aria-expanded/],
  ["open", /(^|[\s\[:])data-open[:-]|data-\[state='?open/],
  ["pressed", /data-\[pressed\]|aria-pressed/],
];

// Functions that only join classes, so their arguments are read as class text.
const CLASS_HELPERS = new Set(["cn", "clsx"]);

// One cva call, attributed to the part it styles.
type Cva = {
  varName: string;
  part?: string;
  axes: { name: string; default?: string; values: { value: string; classes: string }[] }[];
};

/**
 * `--radius` is what a radius slider starts from, and it belongs to the
 * stylesheet, not to this analyzer.
 */
export function readRadiusDefault(globalsCss: string): number {
  const match = /--radius:\s*([\d.]+)rem/.exec(globalsCss);
  return match ? Number(match[1]) : 0.575;
}

export function analyzeComponentSource({
  fileName,
  text,
  slug,
  radiusDefault,
}: {
  fileName: string;
  text: string;
  slug: string;
  radiusDefault: number;
}): DetectedComponent {
  const source = ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX
  );

  const nodes: ts.Node[] = [];
  (function collect(node: ts.Node) {
    nodes.push(node);
    node.forEachChild(collect);
  })(source);

  const classTexts = nodes
    .filter((node): node is ts.StringLiteralLike => ts.isStringLiteralLike(node))
    .map((node) => node.text);

  const parts = compoundParts(nodes);
  const cvas = readCvas(nodes, source, slug, parts);
  const { variants, classes } = groupAxes(cvas, parts);

  const styles: ComponentStyleProperty[] = [];

  if (classTexts.some(isRadiusDriven)) {
    styles.push({
      key: "radius",
      label: "Border radius",
      kind: "slider",
      min: 0,
      max: 2,
      step: 0.05,
      unit: "rem",
      default: radiusDefault,
    });
  }

  const states = STATES.filter(([, pattern]) =>
    pattern.test(classTexts.join(" "))
  ).map(([state]) => state);

  const capabilities: ComponentCapabilities = {
    variants: variants.length > 0 ? variants : undefined,
    parts: parts.length > 0 ? parts : undefined,
    styles: styles.length > 0 ? styles : undefined,
    states: states.length > 0 ? states : undefined,
    editableProperties: nonEmpty(booleanProps(nodes)),
  };

  return { capabilities, classes };
}

// Keeps an empty detection result out of the manifest, so the Creator renders no
// section instead of an empty one.
function nonEmpty(list: string[]) {
  return list.length > 0 ? list : undefined;
}

function isRadiusDriven(classText: string) {
  return classText
    .split(/\s+/)
    .some((token) => RADIUS_TOKEN.test(token) && token !== "rounded-none");
}

/**
 * The compound parts of a component: the keys of its
 * `Object.assign(Root, { Header: ..., Footer: ... })`, which are exactly the
 * names users type (`Card.Header`). A single-element component has none.
 */
function compoundParts(nodes: ts.Node[]) {
  const parts: string[] = [];

  for (const node of nodes) {
    if (!ts.isCallExpression(node) || !isObjectAssign(node)) continue;

    const [, keys] = node.arguments;

    if (keys && ts.isObjectLiteralExpression(keys)) {
      for (const property of keys.properties) {
        const name = propertyName(property);
        if (name && !parts.includes(name)) parts.push(name);
      }
    }
  }

  return parts;
}

function isObjectAssign(node: ts.CallExpression) {
  const { expression } = node;

  return (
    ts.isPropertyAccessExpression(expression) &&
    expression.name.text === "assign" &&
    ts.isIdentifier(expression.expression) &&
    expression.expression.text === "Object"
  );
}

function propertyName(node: ts.NamedDeclaration): string | undefined {
  const { name } = node;

  if (!name) return undefined;
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  return undefined;
}

/** Every `cva(...)` of the file, with its axes and the part it styles. */
function readCvas(
  nodes: ts.Node[],
  source: ts.SourceFile,
  slug: string,
  parts: string[]
): Cva[] {
  const cvas: Cva[] = [];

  for (const node of nodes) {
    if (!ts.isVariableDeclaration(node) || !ts.isIdentifier(node.name)) continue;

    const config = node.initializer && cvaConfig(node.initializer);
    if (!config) continue;

    cvas.push({
      varName: node.name.text,
      part: partOfCva(node.name.text, nodes, source, slug, parts),
      axes: config.axes,
    });
  }

  return cvas;
}

/** The axes of one cva call, with the default of each axis. */
function cvaConfig(initializer: ts.Expression) {
  if (
    !ts.isCallExpression(initializer) ||
    !ts.isIdentifier(initializer.expression) ||
    initializer.expression.text !== "cva"
  ) {
    return undefined;
  }

  const config = initializer.arguments[1];

  if (!config || !ts.isObjectLiteralExpression(config)) return undefined;

  const variants = propertyObject(config, "variants");
  if (!variants) return undefined;

  const defaults = readStringRecord(propertyObject(config, "defaultVariants"));

  const axes = variants.properties.flatMap((axis) => {
    const name = propertyName(axis);

    if (!name || !ts.isPropertyAssignment(axis)) return [];

    const { initializer } = axis;
    if (!ts.isObjectLiteralExpression(initializer)) return [];

    return [
      {
        name,
        default: defaults[name],
        values: initializer.properties.flatMap((entry) => {
          const value = propertyName(entry);

          if (!value || !ts.isPropertyAssignment(entry)) return [];

          return [{ value, classes: classTextOf(entry.initializer) }];
        }),
      },
    ];
  });

  return { axes };
}

function propertyObject(node: ts.Node | undefined, key: string) {
  if (!node || !ts.isObjectLiteralExpression(node)) return undefined;

  const property = node.properties.find(
    (entry) => propertyName(entry) === key && ts.isPropertyAssignment(entry)
  );

  if (property && ts.isPropertyAssignment(property)) {
    const { initializer } = property;
    if (ts.isObjectLiteralExpression(initializer)) return initializer;
  }

  return undefined;
}

function readStringRecord(node: ts.ObjectLiteralExpression | undefined) {
  if (!node) return {} as Record<string, string>;

  return Object.fromEntries(
    node.properties.flatMap((property) => {
      const name = propertyName(property);

      if (!name || !ts.isPropertyAssignment(property)) return [];
      if (!ts.isStringLiteral(property.initializer)) return [];

      return [[name, property.initializer.text]];
    })
  );
}

/** The classes one cva value carries, whatever form they were written in. */
function classTextOf(node: ts.Node | undefined): string {
  if (!node) return "";

  if (ts.isStringLiteralLike(node)) return node.text;

  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(classTextOf).filter(Boolean).join(" ");
  }

  if (ts.isCallExpression(node)) {
    const isHelper =
      ts.isIdentifier(node.expression) && CLASS_HELPERS.has(node.expression.text);

    // A computed base (a token, a helper that is not a class joiner) is read as
    // written, so the analyzer still shows what the component does with it.
    return isHelper
      ? node.arguments.map(classTextOf).filter(Boolean).join(" ")
      : flatten(node.getText());
  }

  if (ts.isConditionalExpression(node)) {
    return [classTextOf(node.whenTrue), classTextOf(node.whenFalse)]
      .filter(Boolean)
      .join(" ");
  }

  if (ts.isBinaryExpression(node) || ts.isParenthesizedExpression(node)) {
    return flatten(node.getText());
  }

  if (ts.isTemplateExpression(node)) {
    return node.templateSpans.reduce(
      (text, span) => text + classTextOf(span.literal),
      node.head.text
    );
  }

  return "";
}

// Keeps an expression readable inside a class field: one line, no comments.
function flatten(text: string) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The part a cva styles, read from the `data-slot` written next to its call:
 * either in the same object (`{ "data-slot": "dialog-footer", className: cn(fn()) }`),
 * the same JSX element (`<Popup data-slot="dialog-popup" className={cn(fn())}>`),
 * or - when the call sits elsewhere - in the component function holding it.
 * Type-only usages (`VariantProps<typeof fn>`) name no part.
 */
function partOfCva(
  varName: string,
  nodes: ts.Node[],
  source: ts.SourceFile,
  slug: string,
  parts: string[]
) {
  for (const node of nodes) {
    if (!ts.isIdentifier(node) || node.text !== varName) continue;
    if (ts.isVariableDeclaration(node.parent) && node.parent.name === node) continue;
    if (ts.findAncestor(node, (ancestor) => ts.isTypeNode(ancestor))) continue;

    for (let ancestor = node.parent; ancestor && ancestor !== source; ) {
      const slot =
        ts.isObjectLiteralExpression(ancestor) || ts.isJsxAttributes(ancestor)
          ? slotOf(ancestor)
          : ts.isFunctionLike(ancestor)
            ? slotInSubtree(ancestor)
            : undefined;

      if (slot) return partOfSlot(slot, slug, parts);

      // A component function is as far as a class ever travels: looking further
      // would attribute it to whichever caller happens to render it.
      if (ts.isFunctionLike(ancestor)) break;

      ancestor = ancestor.parent;
    }
  }

  return undefined;
}

function slotOf(node: ts.ObjectLiteralExpression | ts.JsxAttributes) {
  // Both carry their entries in `properties`: an object writes
  // `"data-slot": "card"`, a JSX element `data-slot="card"`.
  for (const property of node.properties) {
    if (ts.isPropertyAssignment(property)) {
      // `propertyName` unquotes the key, which `getText()` would keep.
      if (propertyName(property) !== "data-slot") continue;

      if (ts.isStringLiteral(property.initializer)) return property.initializer.text;
      continue;
    }

    if (!ts.isJsxAttribute(property)) continue;
    if (property.name.getText() !== "data-slot") continue;

    // A JSX string literal still carries its quotes.
    const value = property.initializer;

    if (value && ts.isStringLiteral(value)) {
      return value.text.replace(/^["']|["']$/g, "");
    }
  }

  return undefined;
}

function slotInSubtree(node: ts.Node) {
  let slot: string | undefined;

  (function visit(current: ts.Node) {
    if (slot) return;

    if (ts.isObjectLiteralExpression(current) || ts.isJsxAttributes(current)) {
      slot = slotOf(current);
      if (slot) return;
    }

    current.forEachChild(visit);
  })(node);

  return slot;
}

// `dialog-popup` -> "Popup", `sidebar-menu-button` -> "MenuButton". The root slot
// (`dialog`) styles the component itself, so it names no part.
function partOfSlot(slot: string, slug: string, parts: string[]) {
  if (slot === slug) return undefined;

  const derived = toPascalCase(
    slot.startsWith(`${slug}-`) ? slot.slice(slug.length + 1) : slot
  );

  // Match the compound export spelling when it agrees, so an axis and the Parts
  // block never name the same part differently.
  return (
    parts.find((part) => part.toLowerCase() === derived.toLowerCase()) ?? derived
  );
}

function toPascalCase(value: string) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Folds every cva of a component into the axes the panel shows. An axis shared
 * by several parts (a dialog variant restyling Popup, Header and Footer) keeps
 * its classes per part; an axis of a single element stores them per value.
 */
function groupAxes(cvas: Cva[], parts: string[]) {
  const axes = new Map<
    string,
    { values: string[]; parts: Set<string>; default?: string }
  >();

  for (const cva of cvas) {
    for (const axis of cva.axes) {
      const known = axes.get(axis.name) ?? { values: [], parts: new Set<string>() };

      for (const value of axis.values) {
        if (!known.values.includes(value.value)) known.values.push(value.value);
      }

      if (cva.part) known.parts.add(cva.part);
      if (axis.default && !known.default) known.default = axis.default;

      axes.set(axis.name, known);
    }
  }

  const variants: ComponentVariant[] = [];
  const byValue: Record<string, Record<string, string>> = {};
  const byPart: Record<string, Record<string, Record<string, string>>> = {};

  for (const [name, axis] of axes) {
    if (axis.values.length === 0) continue;

    // Only parts the component actually exports are worth showing.
    const owners = [...axis.parts].filter((part) => parts.includes(part));
    const multi = owners.length > 1;

    variants.push({
      name,
      values: axis.values,
      ...(axis.default && axis.values.includes(axis.default)
        ? { default: axis.default }
        : {}),
      ...(multi ? { parts: owners } : {}),
    });

    if (multi) {
      byPart[name] = Object.fromEntries(owners.map((part) => [part, {}]));
    } else {
      byValue[name] = {};
    }
  }

  for (const cva of cvas) {
    for (const axis of cva.axes) {
      const byPartAxis = byPart[axis.name];
      const byValueAxis = byValue[axis.name];

      if (!byPartAxis && !byValueAxis) continue;

      for (const value of axis.values) {
        if (!value.classes) continue;

        if (byPartAxis) {
          const target = byPartAxis[cva.part ?? Object.keys(byPartAxis)[0]];
          if (target) target[value.value] = value.classes;
        } else {
          byValueAxis[value.value] = value.classes;
        }
      }
    }
  }

  return {
    variants,
    classes: {
      ...(Object.keys(byValue).length > 0 ? { byValue } : {}),
      ...(Object.keys(byPart).length > 0 ? { byPart } : {}),
    } as ComponentVariantClasses,
  };
}

/**
 * Boolean props the Creator could switch: the ones typed `boolean` and the ones
 * defaulted to `true`/`false`. Deciding which of them are real design decisions
 * - and which are React plumbing - is left to the capability policy.
 */
function booleanProps(nodes: ts.Node[]) {
  const found: string[] = [];

  const push = (name: string | undefined) => {
    if (name && !found.includes(name)) found.push(name);
  };

  for (const node of nodes) {
    if (ts.isPropertySignature(node) && node.type && isBooleanType(node.type)) {
      push(propertyName(node));
      continue;
    }

    if (!ts.isBindingElement(node) || !node.initializer) continue;

    const isBoolLiteral =
      node.initializer.kind === ts.SyntaxKind.TrueKeyword ||
      node.initializer.kind === ts.SyntaxKind.FalseKeyword;

    if (isBoolLiteral) {
      push(node.propertyName?.getText() ?? node.name.getText());
    }
  }

  return found;
}

/**
 * Whether a prop is *a* boolean: `backdrop?: boolean`, `loading?: boolean | undefined`.
 * A callback (`onOpenChange?: (open: boolean) => void`) mentions booleans in its
 * parameters without being one, so only the top level of a union is read.
 */
function isBooleanType(node: ts.TypeNode): boolean {
  if (node.kind === ts.SyntaxKind.BooleanKeyword) return true;

  if (ts.isUnionTypeNode(node) || ts.isIntersectionTypeNode(node)) {
    return node.types.some((type) => type.kind === ts.SyntaxKind.BooleanKeyword);
  }

  if (ts.isParenthesizedTypeNode(node)) return isBooleanType(node.type);

  return false;
}
