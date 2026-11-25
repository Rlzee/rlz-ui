import {
  Node,
  SyntaxKind,
  type CallExpression,
  type Expression,
  type SourceFile,
  type TypeNode,
} from "ts-morph";
import { assignment, cvaDefinition, staticName } from "./component-targets";

function stringLiterals(node: TypeNode | undefined): string[] | undefined {
  if (Node.isParenthesizedTypeNode(node))
    return stringLiterals(node.getTypeNode());
  if (Node.isUnionTypeNode(node)) {
    const members = node.getTypeNodes().map(stringLiterals);
    return members.every((member) => member !== undefined)
      ? members.flatMap((member) => member!)
      : undefined;
  }
  const value = Node.isLiteralTypeNode(node) ? node.getLiteral() : undefined;
  return Node.isStringLiteral(value) ? [value.getLiteralText()] : undefined;
}

/** Follow the common local prop-type forms without resolving project dependencies. */
function infersAxis(
  source: SourceFile,
  node: TypeNode | undefined,
  axis: string,
  cva: string,
  value: string,
  seen = new Set<TypeNode>()
): boolean {
  if (!node || seen.has(node)) return false;
  const next = new Set([...seen, node]);
  const infer = (type: TypeNode | undefined) =>
    infersAxis(source, type, axis, cva, value, next);

  if (Node.isParenthesizedTypeNode(node)) return infer(node.getTypeNode());
  if (Node.isIntersectionTypeNode(node)) {
    // An explicit property in an intersection can narrow an inferred CVA prop.
    const members = node.getTypeNodes();
    const declared = members.filter(
      (member) =>
        Node.isTypeLiteral(member) &&
        member
          .getProperties()
          .some((property) => staticName(property.getNameNode()) === axis)
    );
    return (declared.length ? declared : members).some(infer);
  }
  if (Node.isTypeLiteral(node)) {
    return infer(
      node
        .getProperties()
        .find((property) => staticName(property.getNameNode()) === axis)
        ?.getTypeNode()
    );
  }
  if (Node.isIndexedAccessTypeNode(node)) {
    return (
      stringLiterals(node.getIndexTypeNode())?.includes(axis) === true &&
      infer(node.getObjectTypeNode())
    );
  }
  if (!Node.isTypeReference(node)) return false;

  const name = node.getTypeName().getText();
  const [target, filter] = node.getTypeArguments();
  if (name === "VariantProps") {
    return Node.isTypeQuery(target) && target.getExprName().getText() === cva;
  }
  if (name === "NonNullable" || name === "Partial" || name === "Required")
    return infer(target);
  if (name === "Pick" || name === "Omit" || name === "Exclude") {
    const keys = stringLiterals(filter);
    if (!keys) return false;
    if (name === "Pick" && !keys.includes(axis)) return false;
    if (name === "Omit" && keys.includes(axis)) return false;
    if (name === "Exclude" && keys.includes(value)) return false;
    return infer(target);
  }
  return infer(source.getTypeAlias(name)?.getTypeNode());
}

function finiteAxisType(
  source: SourceFile,
  node: TypeNode | undefined,
  seen = new Set<TypeNode>()
): TypeNode | undefined {
  if (!node || seen.has(node)) return undefined;
  if (stringLiterals(node)) return node;
  if (Node.isTypeReference(node) && !node.getTypeArguments().length) {
    const alias = source.getTypeAlias(node.getTypeName().getText());
    return finiteAxisType(
      source,
      alias?.getTypeNode(),
      new Set([...seen, node])
    );
  }
  return undefined;
}

/** A handwritten type is only widened when its local declaration is unambiguous
 * and lists precisely the same values as the receiving CVA(s). */
export function manualVariantType(
  source: SourceFile,
  axis: string,
  native: Set<string>
): TypeNode | undefined {
  const matches = new Set<TypeNode>();
  const properties = source.getDescendantsOfKind(SyntaxKind.PropertySignature);
  for (const property of properties) {
    if (staticName(property.getNameNode()) !== axis) continue;
    const type = finiteAxisType(source, property.getTypeNode());
    const domain = stringLiterals(type);
    if (
      type &&
      domain?.length === native.size &&
      domain.every((value) => native.has(value))
    ) {
      matches.add(type);
    }
  }
  if (matches.size !== 1) return undefined;
  const match = [...matches][0];
  // An alias shared by different props cannot be widened for this axis alone.
  if (
    properties.some(
      (property) =>
        staticName(property.getNameNode()) !== axis &&
        finiteAxisType(source, property.getTypeNode()) === match
    )
  )
    return undefined;
  return match;
}

export function infersVariantType(
  source: SourceFile,
  call: CallExpression,
  axis: string,
  value: string
): boolean {
  const definition = cvaDefinition(source, call);
  if (!definition) return false;
  for (const owner of call.getAncestors()) {
    if (
      !Node.isFunctionDeclaration(owner) &&
      !Node.isArrowFunction(owner) &&
      !Node.isFunctionExpression(owner)
    )
      continue;
    const props = owner.getParameters()[0]?.getTypeNode();
    if (props)
      return infersAxis(
        source,
        props,
        axis,
        definition.declaration.getName(),
        value
      );
  }
  return false;
}

function localPropertyType(
  source: SourceFile,
  node: TypeNode | undefined,
  key: string,
  seen = new Set<TypeNode>()
): TypeNode | undefined {
  if (!node || seen.has(node)) return undefined;
  const property = (type: TypeNode | undefined) =>
    localPropertyType(source, type, key, new Set([...seen, node]));
  if (Node.isTypeLiteral(node)) {
    return node
      .getProperties()
      .find((entry) => staticName(entry.getNameNode()) === key)
      ?.getTypeNode();
  }
  if (Node.isIntersectionTypeNode(node) || Node.isUnionTypeNode(node)) {
    return node
      .getTypeNodes()
      .map(property)
      .find((entry) => entry !== undefined);
  }
  if (Node.isParenthesizedTypeNode(node)) return property(node.getTypeNode());
  if (Node.isTypeReference(node)) {
    const name = node.getTypeName().getText();
    return (
      property(source.getTypeAlias(name)?.getTypeNode()) ??
      source.getInterface(name)?.getProperty(key)?.getTypeNode()
    );
  }
  return undefined;
}

function localContextType(
  source: SourceFile,
  expression: Expression | undefined,
  seen = new Set<Node>()
): TypeNode | undefined {
  if (!Node.isCallExpression(expression) || seen.has(expression))
    return undefined;
  const callee = expression.getExpression().getText();
  if (/^(React\.)?useContext$/.test(callee)) {
    const context = expression.getArguments()[0];
    const initializer =
      Node.isIdentifier(context) &&
      source.getVariableDeclaration(context.getText())?.getInitializer();
    if (
      initializer &&
      Node.isCallExpression(initializer) &&
      /^(React\.)?createContext$/.test(initializer.getExpression().getText())
    )
      return initializer.getTypeArguments()[0];
    return undefined;
  }
  if (!Node.isIdentifier(expression.getExpression())) return undefined;
  const helper =
    source.getFunction(callee) ??
    source.getVariableDeclaration(callee)?.getInitializer();
  if (
    !Node.isFunctionDeclaration(helper) &&
    !Node.isArrowFunction(helper) &&
    !Node.isFunctionExpression(helper)
  ) {
    return undefined;
  }
  const declared = helper.getReturnTypeNode();
  if (declared) return declared;
  const body = helper.getBody();
  const returns = Node.isBlock(body)
    ? body.getStatements().filter(Node.isReturnStatement)
    : [];
  const result = Node.isExpression(body)
    ? body
    : returns.length === 1
    ? returns[0]?.getExpression()
    : undefined;
  return localContextType(source, result, new Set([...seen, expression]));
}

/** Confirm a handwritten public type also feeds the rendered CVA call, either
 * through a local typed prop or through a typed local context/helper. */
export function usesManualVariantType(
  source: SourceFile,
  call: CallExpression,
  axis: string,
  expected: TypeNode
): boolean {
  const options = call.getArguments()[0];
  if (!Node.isObjectLiteralExpression(options)) return false;
  const entry = assignment(options, axis)?.getInitializer();
  const shorthand = options
    .getProperties()
    .filter(Node.isShorthandPropertyAssignment)
    .find((property) => property.getName() === axis);
  const value = entry ?? shorthand?.getNameNode();
  if (!Node.isIdentifier(value)) return false;
  const name = value.getText();

  for (const owner of call.getAncestors()) {
    if (
      !Node.isFunctionDeclaration(owner) &&
      !Node.isArrowFunction(owner) &&
      !Node.isFunctionExpression(owner)
    )
      continue;
    const parameter = owner.getParameters()[0];
    const binding = parameter?.getNameNode();
    const key = Node.isObjectBindingPattern(binding)
      ? binding.getElements().find((element) => element.getName() === name)
      : undefined;
    if (
      key &&
      finiteAxisType(
        source,
        localPropertyType(
          source,
          parameter?.getTypeNode(),
          key.getPropertyNameNode()?.getText() ?? name
        )
      ) === expected
    )
      return true;

    for (const declaration of owner.getDescendantsOfKind(
      SyntaxKind.VariableDeclaration
    )) {
      const binding = declaration.getNameNode();
      const property = Node.isObjectBindingPattern(binding)
        ? binding.getElements().find((element) => element.getName() === name)
        : undefined;
      if (declaration.getName() !== name && !property) continue;
      const type =
        declaration.getTypeNode() ??
        localContextType(source, declaration.getInitializer());
      const candidate = property
        ? localPropertyType(
            source,
            type,
            property.getPropertyNameNode()?.getText() ?? name
          )
        : type;
      if (finiteAxisType(source, candidate) === expected) return true;
    }
  }
  return false;
}
