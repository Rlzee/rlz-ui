import {
  Node,
  type ObjectLiteralExpression,
  type PropertyAssignment,
  type SourceFile,
} from "ts-morph";
import type { PresetComponentCustomization } from "@rlz/registry";

type CvaPart = { variantFunction: string; baseBinding?: string };

// Pilot targets only. Do not guess which class expression owns a part in an
// unrecognized component or in a source that has changed shape.
const targets: Record<string, Record<string, CvaPart>> = {
  button: {
    Root: { variantFunction: "buttonVariants", baseBinding: "defaultClass" },
  },
  dialog: {
    Popup: { variantFunction: "dialogPopupVariants" },
    Header: { variantFunction: "dialogHeaderVariants" },
    Footer: { variantFunction: "dialogFooterVariants" },
  },
};

function getCva(source: SourceFile, target: CvaPart) {
  const call = source
    .getVariableDeclaration(target.variantFunction)
    ?.getInitializer();
  if (!Node.isCallExpression(call) || call.getExpression().getText() !== "cva")
    return undefined;
  const [base, options] = call.getArguments();
  return base && Node.isObjectLiteralExpression(options)
    ? { base, options }
    : undefined;
}

function isStaticClasses(node: Node | undefined) {
  return (
    Node.isStringLiteral(node) ||
    Node.isNoSubstitutionTemplateLiteral(node) ||
    (Node.isArrayLiteralExpression(node) &&
      node
        .getElements()
        .every(
          (entry) =>
            Node.isStringLiteral(entry) ||
            Node.isNoSubstitutionTemplateLiteral(entry)
        ))
  );
}

function replaceCvaBase(
  source: SourceFile,
  target: CvaPart,
  classes: string
): boolean {
  const cva = getCva(source, target);
  if (!cva) return false;
  const { base, options } = cva;
  const expectedBase = target.baseBinding
    ? Node.isIdentifier(base) && base.getText() === target.baseBinding
    : isStaticClasses(base);
  if (!expectedBase) return false;

  const compound = options.getProperty("compoundVariants");
  const entries = Node.isPropertyAssignment(compound)
    ? compound.getInitializer()
    : undefined;
  if (compound && !Node.isArrayLiteralExpression(entries)) return false;

  // Restore the part's classes after the native variant classes but before the
  // caller's className, matching the Creator's precedence. Keep other uses of
  // an exported base binding (e.g. the Sidebar) independent of this override.
  const literal = JSON.stringify(classes);
  if (classes) {
    const entry = `{ class: ${literal} }`;
    if (Node.isArrayLiteralExpression(entries)) {
      entries.addElement(entry);
    } else {
      options.addPropertyAssignment({
        name: "compoundVariants",
        initializer: `[${entry}]`,
      });
    }
  }
  base.replaceWithText('""');
  return true;
}

function componentTargets(componentId: string) {
  return Object.hasOwn(targets, componentId) ? targets[componentId] : undefined;
}

export function applyPresetPartClasses(
  source: SourceFile,
  componentId: string,
  overrides: PresetComponentCustomization["partClasses"]
): string[] {
  const skipped: string[] = [];
  const component = componentTargets(componentId);
  for (const [part, classes] of Object.entries(overrides ?? {})) {
    if (classes === undefined) continue;
    const target =
      component && Object.hasOwn(component, part) ? component[part] : undefined;
    if (!target || !replaceCvaBase(source, target, classes)) skipped.push(part);
  }
  return skipped;
}

function propertyName(property: PropertyAssignment) {
  const name = property.getNameNode();
  if (Node.isIdentifier(name)) return name.getText();
  if (Node.isStringLiteral(name)) return name.getLiteralText();
  return undefined;
}

function namedAssignment(object: ObjectLiteralExpression, name: string) {
  return object
    .getProperties()
    .filter(Node.isPropertyAssignment)
    .find((property) => propertyName(property) === name);
}

function mapProperty(object: ObjectLiteralExpression, name: string) {
  const initializer = namedAssignment(object, name)?.getInitializer();
  return Node.isObjectLiteralExpression(initializer) ? initializer : undefined;
}

function getAxis(source: SourceFile, target: CvaPart, axis: string) {
  const cva = getCva(source, target);
  const variants = cva && mapProperty(cva.options, "variants");
  return variants && mapProperty(variants, axis);
}

function valueNames(axis: ObjectLiteralExpression) {
  return axis
    .getProperties()
    .filter(Node.isPropertyAssignment)
    .map(propertyName)
    .filter((name): name is string => name !== undefined);
}

/** Restyle a value declared in the downloaded source; never add keys or change defaults. */
export function applyPresetVariantClasses(
  source: SourceFile,
  componentId: string,
  overrides: PresetComponentCustomization["variants"]
): string[] {
  const skipped: string[] = [];
  const targets = componentTargets(componentId);
  for (const [axis, options] of Object.entries(overrides ?? {})) {
    const axes = new Map<string, ObjectLiteralExpression>();
    for (const [part, target] of Object.entries(targets ?? {})) {
      const object = getAxis(source, target, axis);
      if (object) axes.set(part, object);
    }
    if (!axes.size) {
      skipped.push(axis);
      continue;
    }
    const nativeValues = new Set([...axes.values()].flatMap(valueNames));
    const requested = new Set(options.map(({ value }) => value));
    const omitted = [...nativeValues].filter((value) => !requested.has(value));
    if (omitted.length) skipped.push(`${axis} (kept ${omitted.join(", ")})`);

    for (const option of options) {
      const label = `${axis}.${option.value}`;
      if (!nativeValues.has(option.value)) {
        skipped.push(label);
        continue;
      }
      const parts = { ...option.partClasses };
      if (option.classes !== undefined) parts.Root ??= option.classes;
      for (const [part, classes] of Object.entries(parts)) {
        const partAxis = axes.get(part);
        const initializer =
          partAxis && namedAssignment(partAxis, option.value)?.getInitializer();
        if (!initializer || !isStaticClasses(initializer)) {
          skipped.push(`${label}.${part}`);
          continue;
        }
        initializer.replaceWithText(JSON.stringify(classes));
      }
    }
  }
  return skipped;
}
