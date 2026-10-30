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
  /** every part of the component, its slot in the demos and its own classes */
  parts: DetectedPart[];
};

/**
 * One box the Creator can restyle: the component itself (`Root`) or a part it
 * exports (`Header`, `Popup`...). `slot` is the `data-slot` its element carries,
 * which is what the demos are marked with, and `classes` is what the design system
 * authored on it - the shared classes, not the ones a variant value adds.
 */
export type DetectedPart = { name: string; slot: string; classes: string };

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
  /** the classes every value of this cva shares */
  base: string;
  axes: { name: string; default?: string; values: { value: string; classes: string }[] }[];
};

// Local `const` holding classes, so `cva(defaultClass, ...)` and
// `cn(inputClassName)` resolve to what they actually draw.
type ClassConsts = Map<string, string>;

// A compound export: the part names users type, the function that draws each of
// them, and the function the component itself is.
type Compound = {
  keys: string[];
  owners: Map<string, string>;
  target?: string;
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

  const consts = classConstants(nodes);
  const compound = compoundOf(nodes);
  const cvas = readCvas(nodes, source, slug, compound.keys, consts);
  const { variants, classes } = groupAxes(cvas, compound.keys);
  const parts = partEntries(nodes, compound, cvas, consts);

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
    parts: compound.keys.length > 0 ? compound.keys : undefined,
    styles: styles.length > 0 ? styles : undefined,
    states: states.length > 0 ? states : undefined,
    editableProperties: nonEmpty(booleanProps(nodes)),
  };

  return { capabilities, classes, parts };
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
 * names users type (`Card.Header`), the function drawing each of them, and the
 * function the component itself is. A single-element component has no key, and its
 * own function is the one that draws the marked element.
 */
function compoundOf(nodes: ts.Node[]): Compound {
  const keys: string[] = [];
  const owners = new Map<string, string>();
  let target: string | undefined;

  for (const node of nodes) {
    if (!ts.isCallExpression(node) || !isObjectAssign(node)) continue;

    const [assigned, parts] = node.arguments;

    if (ts.isIdentifier(assigned)) target = assigned.text;

    if (parts && ts.isObjectLiteralExpression(parts)) {
      for (const property of parts.properties) {
        if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.initializer)) {
          continue;
        }

        const name = propertyName(property);

        if (!name) continue;
        if (!keys.includes(name)) keys.push(name);

        owners.set(name, property.initializer.text);
      }
    }
  }

  if (!target) target = componentFunctions(nodes).find(isDrawn)?.name;

  return { keys, owners, target };
}

// A component function that puts a `data-slot` on what it renders.
function isDrawn(component: { name: string; node: ts.FunctionLikeDeclaration }) {
  return Boolean(slotOwner(component.node));
}

// The component functions of a file, in the order they are written.
function componentFunctions(nodes: ts.Node[]) {
  const functions: { name: string; node: ts.FunctionLikeDeclaration }[] = [];

  for (const node of nodes) {
    if (ts.isFunctionDeclaration(node) && node.name) {
      functions.push({ name: node.name.text, node });
      continue;
    }

    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
    ) {
      functions.push({ name: node.name.text, node: node.initializer });
    }
  }

  return functions;
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
  parts: string[],
  consts: ClassConsts
): Cva[] {
  const cvas: Cva[] = [];

  for (const node of nodes) {
    if (!ts.isVariableDeclaration(node) || !ts.isIdentifier(node.name)) continue;

    const config = node.initializer && cvaConfig(node.initializer, consts);
    if (!config) continue;

    cvas.push({
      varName: node.name.text,
      part: partOfCva(node.name.text, nodes, source, slug, parts),
      base: config.base,
      axes: config.axes,
    });
  }

  return cvas;
}

/** The classes one cva call draws: its base, its axes and the default of each. */
function cvaConfig(initializer: ts.Expression, consts: ClassConsts) {
  if (
    !ts.isCallExpression(initializer) ||
    !ts.isIdentifier(initializer.expression) ||
    initializer.expression.text !== "cva"
  ) {
    return undefined;
  }

  const [base, config] = initializer.arguments;

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

          return [{ value, classes: classTextOf(entry.initializer, consts) }];
        }),
      },
    ];
  });

  return { base: classTextOf(base, consts), axes };
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
function classTextOf(node: ts.Node | undefined, consts?: ClassConsts): string {
  if (!node) return "";

  if (ts.isStringLiteralLike(node)) return node.text;

  // A named class list (`const defaultClass = cn(...)`) is read for what it draws.
  if (ts.isIdentifier(node)) return consts?.get(node.text) ?? "";

  if (ts.isArrayLiteralExpression(node)) {
    return node.elements
      .map((element) => classTextOf(element, consts))
      .filter(Boolean)
      .join(" ");
  }

  if (ts.isCallExpression(node)) {
    const isHelper =
      ts.isIdentifier(node.expression) && CLASS_HELPERS.has(node.expression.text);

    // A computed base (a token, a helper that is not a class joiner) is read as
    // written, so the analyzer still shows what the component does with it.
    return isHelper
      ? node.arguments
          .map((argument) => classTextOf(argument, consts))
          .filter(Boolean)
          .join(" ")
      : flatten(node.getText());
  }

  if (ts.isConditionalExpression(node)) {
    return [
      classTextOf(node.whenTrue, consts),
      classTextOf(node.whenFalse, consts),
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (ts.isParenthesizedExpression(node)) return classTextOf(node.expression, consts);

  if (ts.isBinaryExpression(node)) {
    return [classTextOf(node.left, consts), classTextOf(node.right, consts)]
      .filter(Boolean)
      .join(" ");
  }

  if (ts.isTemplateExpression(node)) {
    return node.templateSpans.reduce(
      (text, span) => text + classTextOf(span.literal, consts),
      node.head.text
    );
  }

  return "";
}

/**
 * The classes one element was authored with, read out of the expression that builds
 * its `className`: the string literals, the `cn`/`clsx` arguments, the local class
 * constants and the base of a cva call. Its variant values stay out on purpose -
 * those are edited on their own axis, not as the part's own classes.
 */
function authoredClasses(
  node: ts.Node | undefined,
  ctx: { consts: ClassConsts; bases: Map<string, string> }
): string {
  if (!node) return "";

  if (ts.isJsxExpression(node)) return authoredClasses(node.expression, ctx);
  if (ts.isStringLiteralLike(node)) return node.text;

  if (ts.isIdentifier(node)) {
    return ctx.consts.get(node.text) ?? "";
  }

  if (ts.isArrayLiteralExpression(node)) {
    return node.elements
      .map((element) => authoredClasses(element, ctx))
      .filter(Boolean)
      .join(" ");
  }

  if (ts.isCallExpression(node)) {
    const name = ts.isIdentifier(node.expression) ? node.expression.text : "";

    if (CLASS_HELPERS.has(name)) {
      return node.arguments
        .map((argument) => authoredClasses(argument, ctx))
        .filter(Boolean)
        .join(" ");
    }

    // A cva call contributes the classes every value shares, whatever is picked.
    return ctx.bases.get(name) ?? "";
  }

  if (ts.isParenthesizedExpression(node)) return authoredClasses(node.expression, ctx);

  if (ts.isBinaryExpression(node)) {
    return [
      authoredClasses(node.left, ctx),
      authoredClasses(node.right, ctx),
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (ts.isConditionalExpression(node)) {
    return [
      authoredClasses(node.whenTrue, ctx),
      authoredClasses(node.whenFalse, ctx),
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (ts.isTemplateExpression(node)) {
    return node.head.text + node.templateSpans.map((span) => span.literal.text).join("");
  }

  return "";
}

// The local constants that only hold classes, so `cva(defaultClass, ...)` and
// `cn(inputClassName)` are read as the classes they draw rather than as a name.
function classConstants(nodes: ts.Node[]): ClassConsts {
  const consts: ClassConsts = new Map();
  const ctx = { consts, bases: new Map<string, string>() };

  for (const node of nodes) {
    if (
      !ts.isVariableDeclaration(node) ||
      !ts.isIdentifier(node.name) ||
      !node.initializer
    ) {
      continue;
    }

    // A cva call is not a class list, it is the whole variant config.
    if (ts.isCallExpression(node.initializer) && node.initializer.expression.getText() === "cva") {
      continue;
    }

    const text = authoredClasses(node.initializer, ctx).trim();

    if (text) consts.set(node.name.text, text);
  }

  return consts;
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
  const owner = slotOwner(node);

  return owner ? slotOf(owner) : undefined;
}

/**
 * The element a component function draws: the JSX attributes, or the props object,
 * carrying the first `data-slot`. Wrappers that only nest other components are
 * walked through, since the mark sits on the element that finally renders.
 */
function slotOwner(node: ts.Node) {
  let owner: ts.ObjectLiteralExpression | ts.JsxAttributes | undefined;

  (function visit(current: ts.Node) {
    if (owner) return;

    if (
      (ts.isObjectLiteralExpression(current) || ts.isJsxAttributes(current)) &&
      slotOf(current)
    ) {
      owner = current;
      return;
    }

    current.forEachChild(visit);
  })(node);

  return owner;
}

/** The expression building the `className` of that same element, when it has one. */
function classNameOf(owner: ts.ObjectLiteralExpression | ts.JsxAttributes) {
  for (const property of owner.properties) {
    if (ts.isPropertyAssignment(property) && propertyName(property) === "className") {
      return property.initializer;
    }

    if (ts.isJsxAttribute(property) && property.name.getText() === "className") {
      return property.initializer;
    }
  }

  return undefined;
}

/**
 * Every box the Creator can restyle, in the order it should be listed: the
 * component itself first, then the parts it exports. A part is read from the
 * function drawing it, so the name the user types (`Card.Header`) is tied to the
 * slot the demos carry (`card-header`) and to the classes authored on it.
 */
function partEntries(
  nodes: ts.Node[],
  compound: Compound,
  cvas: Cva[],
  consts: ClassConsts
): DetectedPart[] {
  const bases = new Map(cvas.map((cva) => [cva.varName, cva.base]));
  const functions = componentFunctions(nodes);
  const entries: DetectedPart[] = [];
  const claimed = new Set<string>();

  const own = (name: string | undefined, fnName?: string) => {
    if (!name || !fnName) return;

    const fn = functions.find((entry) => entry.name === fnName);
    const owner = fn ? slotOwner(fn.node) : undefined;
    const slot = owner ? slotOf(owner) : undefined;

    // No slot: nothing to point at in the demos. An already claimed slot: this
    // function only composes the part that owns it, so it draws no box of its own.
    if (!slot || claimed.has(slot)) return;

    claimed.add(slot);
    entries.push({
      name,
      slot,
      classes: owner
        ? authoredClasses(classNameOf(owner), { consts, bases }).trim()
        : "",
    });
  };

  own("Root", compound.target);

  for (const key of compound.keys) own(key, compound.owners.get(key));

  return entries;
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
