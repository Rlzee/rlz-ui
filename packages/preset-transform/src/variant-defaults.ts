import { Node, SyntaxKind, type SourceFile, type TypeNode } from "ts-morph";
import { assignment, staticName } from "./component-targets";
import { sharesVariantType } from "./variant-types";

export type RemovedDomain = {
  cva: string;
  removed: Set<string>;
  fallback: string;
};

export function stringValue(node: Node | undefined) {
  return Node.isStringLiteral(node) ||
    Node.isNoSubstitutionTemplateLiteral(node)
    ? node.getLiteralText()
    : undefined;
}

/** Plan changes only where a local prop, context or helper is tied to this CVA. */
export function variantDefaultEdits(
  source: SourceFile,
  axis: string,
  domains: RemovedDomain[],
  manual: TypeNode | undefined
): (() => void)[] {
  const edits: (() => void)[] = [];
  const lookup = (type: TypeNode | undefined, value: string) =>
    domains.find(
      ({ cva, removed }) =>
        removed.has(value) &&
        sharesVariantType(source, type, axis, cva, value, manual)
    );
  const updateLiteral = (
    node: Node | undefined,
    type: TypeNode | undefined
  ) => {
    const value = stringValue(node);
    const domain = value !== undefined && lookup(type, value);
    if (node && domain)
      edits.push(() => node.replaceWithText(JSON.stringify(domain.fallback)));
  };

  for (const parameter of source.getDescendantsOfKind(SyntaxKind.Parameter)) {
    const pattern = parameter.getNameNode();
    if (!Node.isObjectBindingPattern(pattern)) continue;
    const type = parameter.getTypeNode();
    if (!type) continue;
    const owner = parameter.getParent();
    for (const entry of pattern.getElements()) {
      if (
        staticName(entry.getPropertyNameNode() ?? entry.getNameNode()) !== axis
      )
        continue;
      updateLiteral(entry.getInitializer(), type);
      const binding = entry.getNameNode();
      if (!Node.isIdentifier(binding)) continue;
      const symbol = binding.getSymbol()?.compilerSymbol;
      if (!symbol) continue;
      for (const comparison of owner.getDescendantsOfKind(
        SyntaxKind.BinaryExpression
      )) {
        const operator = comparison.getOperatorToken().getText();
        if (!["===", "==", "!==", "!="].includes(operator)) continue;
        const left = comparison.getLeft();
        const right = comparison.getRight();
        const value =
          Node.isIdentifier(left) && left.getSymbol()?.compilerSymbol === symbol
            ? stringValue(right)
            : Node.isIdentifier(right) &&
              right.getSymbol()?.compilerSymbol === symbol
            ? stringValue(left)
            : undefined;
        if (value !== undefined && lookup(type, value)) {
          edits.push(() =>
            comparison.replaceWithText(
              operator.startsWith("!") ? "true" : "false"
            )
          );
        }
      }
    }
  }

  for (const call of source.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    if (!/^(React\.)?createContext$/.test(call.getExpression().getText()))
      continue;
    const type = call.getTypeArguments()[0];
    const initial = call.getArguments()[0];
    updateLiteral(
      Node.isObjectLiteralExpression(initial)
        ? assignment(initial, axis)?.getInitializer()
        : initial,
      type
    );
  }

  for (const declaration of source.getVariableDeclarations()) {
    const type = declaration.getTypeNode();
    const initial = declaration.getInitializer();
    if (!Node.isArrayTypeNode(type) || !Node.isArrayLiteralExpression(initial))
      continue;
    const memberType = type.getElementTypeNode();
    const elements = initial.getElements();
    const filtered = elements.filter((entry) => {
      const value = stringValue(entry);
      return value === undefined || !lookup(memberType, value);
    });
    if (filtered.length === elements.length) continue;
    const first = stringValue(elements[0]);
    const fallback = first !== undefined && lookup(memberType, first);
    if (!filtered.length && !fallback) continue;
    const values = filtered.length
      ? filtered.map((entry) => entry.getText())
      : fallback
      ? [JSON.stringify(fallback.fallback)]
      : [];
    edits.push(() => initial.replaceWithText(`[${values.join(", ")}]`));
  }

  for (const attribute of source.getDescendantsOfKind(
    SyntaxKind.JsxAttribute
  )) {
    if (attribute.getNameNode().getText() !== axis) continue;
    const owner = attribute
      .getParentIfKind(SyntaxKind.JsxAttributes)
      ?.getParent();
    if (
      !Node.isJsxOpeningElement(owner) &&
      !Node.isJsxSelfClosingElement(owner)
    )
      continue;
    const tag = owner.getTagNameNode();
    if (!Node.isIdentifier(tag)) continue;
    const fn =
      source.getFunction(tag.getText()) ??
      source.getVariableDeclaration(tag.getText())?.getInitializer();
    if (
      !Node.isFunctionDeclaration(fn) &&
      !Node.isArrowFunction(fn) &&
      !Node.isFunctionExpression(fn)
    )
      continue;
    const initial = attribute.getInitializer();
    const value = stringValue(
      Node.isJsxExpression(initial) ? initial.getExpression() : initial
    );
    const domain =
      value !== undefined &&
      lookup(fn.getParameters()[0]?.getTypeNode(), value);
    if (initial && domain)
      edits.push(() =>
        initial.replaceWithText(`{${JSON.stringify(domain.fallback)}}`)
      );
  }
  return edits;
}
