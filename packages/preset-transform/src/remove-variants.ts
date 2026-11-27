import {
  Node,
  SyntaxKind,
  type ObjectLiteralExpression,
  type SourceFile,
} from "ts-morph";
import type { VariantTarget } from "./add-variants";
import { assignment, cvaDefinition, staticName } from "./component-targets";
import {
  infersVariantType,
  manualVariantType,
  usesManualVariantType,
} from "./variant-types";
import {
  stringValue,
  variantDefaultEdits,
  type RemovedDomain,
} from "./variant-defaults";

function hasUnknownKeys(object: ObjectLiteralExpression) {
  return object.getProperties().some((property) => {
    if (Node.isSpreadAssignment(property)) return true;
    if (!Node.isPropertyAssignment(property)) return false;
    const name = property.getNameNode();
    return (
      Node.isComputedPropertyName(name) &&
      stringValue(name.getExpression()) === undefined
    );
  });
}

function axisField(object: ObjectLiteralExpression, axis: string) {
  return (
    object.getProperty(axis) ??
    assignment(object, axis) ??
    object
      .getProperties()
      .filter(Node.isPropertyAssignment)
      .find((property) => {
        const name = property.getNameNode();
        return (
          Node.isComputedPropertyName(name) &&
          stringValue(name.getExpression()) === axis
        );
      })
  );
}

function planCompounds(
  options: ObjectLiteralExpression,
  axis: string,
  removed: Set<string>
) {
  const field = options.getProperty("compoundVariants");
  const entries = Node.isPropertyAssignment(field)
    ? field.getInitializer()
    : undefined;
  if (!field) return [];
  if (!Node.isArrayLiteralExpression(entries)) return undefined;
  const edits: (() => void)[] = [];
  for (const entry of entries.getElements()) {
    if (!Node.isObjectLiteralExpression(entry) || hasUnknownKeys(entry))
      return undefined;
    const condition = axisField(entry, axis);
    if (!condition) continue;
    if (!Node.isPropertyAssignment(condition)) return undefined;
    const value = condition.getInitializer();
    if (Node.isArrayLiteralExpression(value)) {
      const items = value.getElements().map(stringValue);
      if (items.some((item) => item === undefined)) return undefined;
      const kept = items.filter((item) => !removed.has(item!));
      if (items.length === kept.length) continue;
      if (kept.length)
        edits.push(() => value.replaceWithText(JSON.stringify(kept)));
      else edits.push(() => entries.removeElement(entry));
    } else {
      const key = stringValue(value);
      if (key === undefined) return undefined;
      if (removed.has(key)) edits.push(() => entries.removeElement(entry));
    }
  }
  return edits;
}

function valuesOf(values: ObjectLiteralExpression) {
  const keys = values
    .getProperties()
    .map((property) =>
      Node.isPropertyAssignment(property)
        ? staticName(property.getNameNode())
        : undefined
    );
  return keys.every((key): key is string => key !== undefined)
    ? keys
    : undefined;
}

/** The list is authoritative for public values; fixed internal CVA calls keep theirs. */
export function removeVariantValues(
  source: SourceFile,
  axis: string,
  targets: VariantTarget[],
  requested: string[],
  desired: string | null | undefined
): string[] {
  if (!requested.length)
    return [`${axis} (at least one variant value must be kept)`];
  if (!targets.length) return [`${axis} (no selectable CVA target)`];
  const calls = source.getDescendantsOfKind(SyntaxKind.CallExpression);
  const edits: (() => void)[] = [];
  const domains: RemovedDomain[] = [];
  const original = new Set<string>();
  const remaining = new Set<string>();
  const seen = new Set<ObjectLiteralExpression>();
  const publicDomains: string[][] = [];

  for (const { call, values } of targets) {
    if (seen.has(values)) continue;
    seen.add(values);
    const definition = cvaDefinition(source, call);
    const native = valuesOf(values);
    if (
      !definition ||
      !native ||
      native.some((value) => /^(true|false|\d+(?:\.\d+)?)$/.test(value))
    ) {
      return [`${axis} (only literal string axes support removal)`];
    }
    const cva = definition.declaration.getName();
    const reserved = new Set(
      calls.flatMap((entry) => {
        if (entry.getExpression().getText() !== cva) return [];
        const options = entry.getArguments()[0];
        const fixed =
          Node.isObjectLiteralExpression(options) &&
          stringValue(assignment(options, axis)?.getInitializer());
        return typeof fixed === "string" ? [fixed] : [];
      })
    );
    const publicValues = requested.filter(
      (value) => native.includes(value) && !reserved.has(value)
    );
    const kept = new Set([
      ...publicValues,
      ...native.filter((value) => reserved.has(value)),
    ]);
    const removed = new Set(native.filter((value) => !kept.has(value)));
    native.forEach((value) => original.add(value));
    kept.forEach((value) => remaining.add(value));
    publicDomains.push(publicValues);
    if (!removed.size) continue;
    if (!publicValues.length)
      return [`${axis} (no remaining public value for ${cva})`];

    const defaultField = definition.options.getProperty("defaultVariants");
    const defaults = Node.isPropertyAssignment(defaultField)
      ? defaultField.getInitializer()
      : undefined;
    if (
      (defaultField && !Node.isObjectLiteralExpression(defaults)) ||
      (Node.isObjectLiteralExpression(defaults) && hasUnknownKeys(defaults))
    ) {
      return [`${axis} (cannot update a computed default)`];
    }
    const defaultEntry = Node.isObjectLiteralExpression(defaults)
      ? axisField(defaults, axis)
      : undefined;
    const defaultNode = Node.isPropertyAssignment(defaultEntry)
      ? defaultEntry.getInitializer()
      : undefined;
    const currentDefault = stringValue(defaultNode);
    if (
      defaultEntry &&
      currentDefault === undefined &&
      defaultNode?.getKind() !== SyntaxKind.NullKeyword
    ) {
      return [`${axis} (cannot update a computed default)`];
    }
    const fallback =
      currentDefault !== undefined && publicValues.includes(currentDefault)
        ? currentDefault
        : desired != null && publicValues.includes(desired)
        ? desired
        : publicValues[0]!;
    if (
      defaultNode &&
      currentDefault !== undefined &&
      removed.has(currentDefault)
    ) {
      edits.push(() => defaultNode.replaceWithText(JSON.stringify(fallback)));
    }
    const compounds = planCompounds(definition.options, axis, removed);
    if (!compounds) return [`${axis} (cannot update computed compound rules)`];
    edits.push(...compounds);
    domains.push({ cva, removed, fallback });
    edits.push(() => {
      for (const value of removed) assignment(values, value)?.remove();
    });
  }

  if (!domains.length) return [];
  const manual = manualVariantType(source, axis, original);
  const handwritten = targets.filter(({ call, values }) => {
    const cva = cvaDefinition(source, call)?.declaration.getName();
    if (!domains.some((domain) => domain.cva === cva)) return false;
    return !valuesOf(values)!.some((value) =>
      infersVariantType(source, call, axis, value)
    );
  });
  if (
    handwritten.some(
      ({ call }) =>
        !manual || !usesManualVariantType(source, call, axis, manual)
    )
  ) {
    return [`${axis} (cannot narrow the component's prop type safely)`];
  }
  if (
    handwritten.length &&
    publicDomains.some((domain) => domain.join() !== publicDomains[0]!.join())
  ) {
    return [
      `${axis} (shared prop type has different remaining values across parts)`,
    ];
  }

  const defaultEdits = variantDefaultEdits(
    source,
    axis,
    domains,
    handwritten.length ? manual : undefined
  );
  defaultEdits.forEach((apply) => apply());
  edits.forEach((apply) => apply());
  if (manual && handwritten.length) {
    manual.replaceWithText(
      [...remaining].map((value) => JSON.stringify(value)).join(" | ")
    );
  }
  return [];
}
