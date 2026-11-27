import type { PresetVariantValue } from "@rlz/registry";
import {
  IndentationText,
  NewLineKind,
  Node,
  type CallExpression,
  type ObjectLiteralExpression,
  type SourceFile,
} from "ts-morph";
import { staticName } from "./component-targets";
import {
  infersVariantType,
  manualVariantType,
  usesManualVariantType,
} from "./variant-types";

export type VariantTarget = {
  part: string;
  call: CallExpression;
  values: ObjectLiteralExpression;
};

function isNewValue(value: string) {
  return (
    /^[A-Za-z][A-Za-z0-9_-]*$/.test(value) &&
    value !== "true" &&
    value !== "false" &&
    value !== "prototype" &&
    !Object.hasOwn(Object.prototype, value)
  );
}

function isStringDomain(native: Set<string>, targets: VariantTarget[]) {
  if (
    !native.size ||
    [...native].some(
      (value) =>
        value === "true" || value === "false" || /^\d+(?:\.\d+)?$/.test(value)
    )
  )
    return false;
  // Computed entries and spreads may hide additional native values.
  return (
    targets.length > 0 &&
    targets.every(({ values }) =>
      values.getProperties().every((property) => {
        const name =
          Node.isPropertyAssignment(property) &&
          staticName(property.getNameNode());
        return typeof name === "string" && native.has(name);
      })
    )
  );
}

/** Introduce string keys on existing, selectable CVA axes. Never replace defaults. */
export function addVariantValues(
  source: SourceFile,
  axis: string,
  native: Set<string>,
  targets: VariantTarget[],
  options: PresetVariantValue[]
): string[] {
  if (!options.length) return [];
  const skipped: string[] = [];
  if (!isStringDomain(native, targets)) {
    return options.map(
      ({ value }) => `${axis}.${value} (not an extensible string axis)`
    );
  }

  const manual = manualVariantType(source, axis, native);
  const widened = new Set<string>();
  const seen = new Set<string>();
  const changes = new Map<
    ObjectLiteralExpression,
    { name: string; initializer: string }[]
  >();
  const parts = new Set(targets.map(({ part }) => part));

  for (const option of options) {
    const { value } = option;
    const label = `${axis}.${value}`;
    if (!isNewValue(value) || seen.has(value)) {
      skipped.push(`${label} (invalid or duplicate value)`);
      continue;
    }
    seen.add(value);
    if (
      Object.keys(option.partClasses ?? {}).some((part) => !parts.has(part)) ||
      (option.classes !== undefined && targets.length !== 1)
    ) {
      skipped.push(`${label} (specify only parts that use this axis)`);
      continue;
    }
    const handwritten = targets.filter(
      ({ call }) => !infersVariantType(source, call, axis, value)
    );
    if (
      handwritten.some(
        ({ call }) =>
          !manual || !usesManualVariantType(source, call, axis, manual)
      )
    ) {
      skipped.push(`${label} (cannot extend the component's prop type safely)`);
      continue;
    }

    // A shared CVA definition still supplies the public VariantProps type. Do
    // not clone it before adding the type key, or the installed prop stays closed.
    const entries = new Map<ObjectLiteralExpression, string>();
    let conflict = false;
    for (const { part, values } of targets) {
      const classes =
        (Object.hasOwn(option.partClasses ?? {}, part)
          ? option.partClasses?.[part]
          : undefined) ??
        option.classes ??
        "";
      if (entries.has(values) && entries.get(values) !== classes)
        conflict = true;
      entries.set(values, classes);
    }
    if (conflict) {
      skipped.push(`${label} (parts share a CVA but have different classes)`);
      continue;
    }
    for (const [values, classes] of entries) {
      const list = changes.get(values) ?? [];
      list.push({
        name: /^[A-Za-z][A-Za-z0-9_]*$/.test(value)
          ? value
          : JSON.stringify(value),
        initializer: JSON.stringify(classes),
      });
      changes.set(values, list);
    }
    if (handwritten.length) widened.add(value);
  }

  if (manual && widened.size) {
    manual.replaceWithText(
      [
        manual.getText(),
        ...[...widened].map((value) => JSON.stringify(value)),
      ].join(" | ")
    );
  }
  const settings = source.getProject().manipulationSettings;
  const originalIndentation = settings.getIndentationText();
  const originalNewLine = settings.getNewLineKind();
  const text = source.getFullText();
  // ts-morph's getIndentationText rounds to the project's configured width,
  // which may differ from the downloaded source. Read its actual whitespace.
  const indentationOf = (node: Node) =>
    node
      .getSourceFile()
      .getFullText()
      .slice(node.getStartLinePos(), node.getStart())
      .match(/^[\t ]*/)![0];
  try {
    for (const [values, entries] of changes) {
      const parentIndentation = indentationOf(values);
      const sibling = values.getProperties()[0];
      const siblingIndentation = sibling && indentationOf(sibling);
      const unit = siblingIndentation?.slice(parentIndentation.length);
      const indentation = Object.values(IndentationText).find(
        (candidate) => candidate === unit
      );
      settings.set({
        indentationText: indentation ?? originalIndentation,
        newLineKind: text.includes("\r\n")
          ? NewLineKind.CarriageReturnLineFeed
          : NewLineKind.LineFeed,
      });
      values.addPropertyAssignments(entries);
    }
  } finally {
    settings.set({
      indentationText: originalIndentation,
      newLineKind: originalNewLine,
    });
  }
  return skipped;
}
