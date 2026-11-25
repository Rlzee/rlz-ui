import {
  Node,
  type CallExpression,
  type Expression,
  type ObjectLiteralExpression,
  type SourceFile,
} from "ts-morph";
import type { PresetComponentCustomization } from "@rlz/registry";
import {
  assignment,
  classJoin,
  cvaDefinition,
  discoverStyleTargets,
  findCvaUses,
  isolateCva,
  isStaticClasses,
  staticName,
} from "./component-targets";

function mapProperty(object: ObjectLiteralExpression, name: string) {
  const initializer = assignment(object, name)?.getInitializer();
  return Node.isObjectLiteralExpression(initializer) ? initializer : undefined;
}

function getAxis(source: SourceFile, call: CallExpression, axis: string) {
  const cva = cvaDefinition(source, call);
  const variants = cva && mapProperty(cva.options, "variants");
  return variants && mapProperty(variants, axis);
}

function valueNames(axis: ObjectLiteralExpression) {
  return axis.getProperties().flatMap((entry) => {
    const name = Node.isPropertyAssignment(entry)
      ? staticName(entry.getNameNode())
      : undefined;
    return name === undefined ? [] : [name];
  });
}

function remainingBase(source: SourceFile, base: Node) {
  if (isStaticClasses(source, base)) return '""';
  if (Node.isArrayLiteralExpression(base)) {
    const entries = base
      .getElements()
      .filter((entry) => !isStaticClasses(source, entry));
    return `[${entries.map((entry) => entry.getText()).join(", ")}]`;
  }
  if (classJoin(base)) {
    const args = base
      .getArguments()
      .filter((entry) => !isStaticClasses(source, entry));
    return `${base.getExpression().getText()}(${args
      .map((entry) => entry.getText())
      .join(", ")})`;
  }
  return undefined;
}

function removeStaticArguments(source: SourceFile, join: CallExpression) {
  const args = join.getArguments();
  for (let index = args.length - 1; index >= 0; index--) {
    if (isStaticClasses(source, args[index])) join.removeArgument(index);
  }
}

function replacePart(
  source: SourceFile,
  part: string,
  expression: Expression,
  classes: string
) {
  const uses = findCvaUses(source, expression);
  const literal = JSON.stringify(classes);
  if (uses.length === 1) {
    const call = uses[0]!;
    const original = cvaDefinition(source, call)!;
    const base = remainingBase(source, original.base);
    const existing = original.options.getProperty("compoundVariants");
    if (
      base === undefined ||
      (existing &&
        (!Node.isPropertyAssignment(existing) ||
          !Node.isArrayLiteralExpression(existing.getInitializer())))
    )
      return false;

    const isolated = isolateCva(source, call, part);
    if (!isolated) return false;
    const { options, base: baseNode } = isolated;
    const entries = assignment(options, "compoundVariants")?.getInitializer();
    // Part classes run after native variants but before the caller's className.
    if (classes) {
      const entry = `{ class: ${literal} }`;
      if (Node.isArrayLiteralExpression(entries)) entries.addElement(entry);
      else
        options.addPropertyAssignment({
          name: "compoundVariants",
          initializer: `[${entry}]`,
        });
    }
    baseNode.replaceWithText(base);
    if (classJoin(expression)) removeStaticArguments(source, expression);
    return true;
  }
  if (uses.length > 1) return false;

  if (classJoin(expression)) {
    // Leave conditional or forwarded classes alone. Only replace authored values.
    const args = expression.getArguments();
    const hasStatic = args.some((argument) =>
      isStaticClasses(source, argument)
    );
    const isCallerClass = (node: Node) =>
      node.getText() === "className" ||
      (Node.isPropertyAccessExpression(node) && node.getName() === "className");
    if (!hasStatic && args.some((argument) => !isCallerClass(argument)))
      return false;
    removeStaticArguments(source, expression);
    if (classes) {
      const caller = expression.getArguments().findIndex(isCallerClass);
      expression.insertArgument(
        caller < 0 ? expression.getArguments().length : caller,
        literal
      );
    }
    return true;
  }
  if (!isStaticClasses(source, expression)) return false;
  expression.replaceWithText(
    Node.isJsxAttribute(expression.getParent()) ? `{${literal}}` : literal
  );
  return true;
}

export function applyPresetPartClasses(
  source: SourceFile,
  componentId: string,
  overrides: PresetComponentCustomization["partClasses"]
): string[] {
  if (!overrides || !Object.keys(overrides).length) return [];
  const targets = discoverStyleTargets(source, componentId);
  return Object.entries(overrides).flatMap(([part, classes]) => {
    if (classes === undefined) return [];
    const expression = targets.get(part)?.classes;
    return expression && replacePart(source, part, expression, classes)
      ? []
      : [part];
  });
}

function fixedVariant(call: CallExpression, axis: string) {
  const options = call.getArguments()[0];
  const value = Node.isObjectLiteralExpression(options)
    ? assignment(options, axis)?.getInitializer()
    : undefined;
  if (Node.isStringLiteral(value) || Node.isNumericLiteral(value))
    return value.getLiteralText().toString();
  if (value?.getText() === "true" || value?.getText() === "false")
    return value.getText();
  return undefined;
}

function replaceVariant(
  source: SourceFile,
  call: CallExpression,
  part: string,
  axis: string,
  value: string,
  classes: string
) {
  const definition = cvaDefinition(source, call);
  const object = getAxis(source, call, axis);
  const entry = object && assignment(object, value);
  if (!definition || !entry || !isStaticClasses(source, entry.getInitializer()))
    return false;
  const compound = definition.options.getProperty("compoundVariants");
  if (
    compound &&
    (!Node.isPropertyAssignment(compound) ||
      !Node.isArrayLiteralExpression(compound.getInitializer()))
  )
    return false;

  const isolated = isolateCva(source, call, part);
  if (!isolated) return false;
  const target = getAxis(source, call, axis);
  const variant = target && assignment(target, value);
  if (!variant) return false;
  const compoundEntries = assignment(
    isolated.options,
    "compoundVariants"
  )?.getInitializer();
  if (classes && Node.isArrayLiteralExpression(compoundEntries)) {
    // Native compound rules remain intact (e.g. Input's unstyled=false rules).
    // Put the authored override after them so it wins only when its value is active.
    const valueLiteral =
      value === "true" ||
      value === "false" ||
      Node.isNumericLiteral(variant.getNameNode())
        ? value
        : JSON.stringify(value);
    compoundEntries.addElement(
      `{ [${JSON.stringify(axis)}]: ${valueLiteral}, class: ${JSON.stringify(
        classes
      )} }`
    );
    variant.getInitializerOrThrow().replaceWithText('""');
  } else {
    variant.getInitializerOrThrow().replaceWithText(JSON.stringify(classes));
  }
  return true;
}

/** Restyle a value declared in the downloaded source; never add keys or change defaults. */
export function applyPresetVariantClasses(
  source: SourceFile,
  componentId: string,
  overrides: PresetComponentCustomization["variants"]
): string[] {
  if (!overrides || !Object.keys(overrides).length) return [];
  const skipped: string[] = [];
  const targets = discoverStyleTargets(source, componentId);
  for (const [axis, options] of Object.entries(overrides)) {
    const uses = new Map<string, CallExpression>();
    const native = new Set<string>();
    for (const [part, target] of targets) {
      const candidates = findCvaUses(source, target.classes).filter((call) =>
        getAxis(source, call, axis)
      );
      if (candidates.length !== 1) continue;
      const call = candidates[0]!;
      uses.set(part, call);
      valueNames(getAxis(source, call, axis)!).forEach((value) =>
        native.add(value)
      );
    }
    if (!uses.size) {
      skipped.push(axis);
      continue;
    }
    const selectable = [...uses].filter(
      ([, call]) => fixedVariant(call, axis) === undefined
    );
    const defaultPart =
      selectable.length === 1 ? selectable[0]?.[0] : undefined;
    const requested = new Set(options.map(({ value }) => value));
    const omitted = [...native].filter((value) => !requested.has(value));
    if (omitted.length) skipped.push(`${axis} (kept ${omitted.join(", ")})`);

    for (const option of options) {
      const label = `${axis}.${option.value}`;
      if (!native.has(option.value)) {
        skipped.push(label);
        continue;
      }
      const parts = { ...option.partClasses };
      if (option.classes !== undefined) {
        if (defaultPart) parts[defaultPart] ??= option.classes;
        else skipped.push(`${label}.classes (specify a part)`);
      }
      for (const [part, classes] of Object.entries(parts)) {
        const call = uses.get(part);
        const fixed = call && fixedVariant(call, axis);
        if (
          !call ||
          (fixed !== undefined && fixed !== option.value) ||
          !replaceVariant(source, call, part, axis, option.value, classes)
        ) {
          skipped.push(`${label}.${part}`);
        }
      }
    }
  }
  return skipped;
}
