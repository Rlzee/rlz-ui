import { Node, type SourceFile } from "ts-morph";
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

function replaceCvaBase(
  source: SourceFile,
  target: CvaPart,
  classes: string
): boolean {
  const call = source
    .getVariableDeclaration(target.variantFunction)
    ?.getInitializer();
  if (!Node.isCallExpression(call) || call.getExpression().getText() !== "cva")
    return false;
  const [base, options] = call.getArguments();
  const expectedBase = target.baseBinding
    ? Node.isIdentifier(base) && base.getText() === target.baseBinding
    : Node.isStringLiteral(base) ||
      (Node.isArrayLiteralExpression(base) &&
        base.getElements().every(Node.isStringLiteral));
  if (!base || !expectedBase || !Node.isObjectLiteralExpression(options))
    return false;

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

export function applyPresetPartClasses(
  source: SourceFile,
  componentId: string,
  overrides: PresetComponentCustomization["partClasses"]
): string[] {
  const skipped: string[] = [];
  for (const [part, classes] of Object.entries(overrides ?? {})) {
    if (classes === undefined) continue;
    const component = Object.hasOwn(targets, componentId)
      ? targets[componentId]
      : undefined;
    const target =
      component && Object.hasOwn(component, part) ? component[part] : undefined;
    if (!target || !replaceCvaBase(source, target, classes)) skipped.push(part);
  }
  return skipped;
}
