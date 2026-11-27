import {
  Node,
  SyntaxKind,
  VariableDeclarationKind,
  type CallExpression,
  type Expression,
  type ObjectLiteralExpression,
  type SourceFile,
  type VariableDeclaration,
} from "ts-morph";

export function staticName(node: Node) {
  if (Node.isIdentifier(node)) return node.getText();
  if (Node.isStringLiteral(node) || Node.isNumericLiteral(node))
    return node.getLiteralText().toString();
  return undefined;
}

export function assignment(object: ObjectLiteralExpression, name: string) {
  return object
    .getProperties()
    .filter(Node.isPropertyAssignment)
    .find((entry) => staticName(entry.getNameNode()) === name);
}

export function classJoin(node: Node | undefined): node is CallExpression {
  return (
    Node.isCallExpression(node) &&
    /^(cn|clsx)$/.test(node.getExpression().getText())
  );
}

export function isStaticClasses(
  source: SourceFile,
  node: Node | undefined,
  seen: Set<Node> = new Set()
): boolean {
  if (!node || seen.has(node)) return false;
  if (Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node))
    return true;
  if (Node.isIdentifier(node)) {
    const declaration = source.getVariableDeclaration(node.getText());
    if (
      declaration?.getVariableStatement()?.getDeclarationKind() !==
      VariableDeclarationKind.Const
    )
      return false;
    return isStaticClasses(
      source,
      declaration.getInitializer(),
      new Set([...seen, node])
    );
  }
  if (Node.isArrayLiteralExpression(node) || classJoin(node)) {
    const entries = Node.isArrayLiteralExpression(node)
      ? node.getElements()
      : node.getArguments();
    return entries.every((entry) =>
      isStaticClasses(source, entry, new Set([...seen, node]))
    );
  }
  return false;
}

function componentFunctions(source: SourceFile) {
  return new Map<string, Node>([
    ...source.getFunctions().flatMap((fn): [string, Node][] => {
      const name = fn.getName();
      return name ? [[name, fn]] : [];
    }),
    ...source
      .getVariableDeclarations()
      .flatMap((declaration): [string, Node][] => {
        const fn = declaration.getInitializer();
        return Node.isArrowFunction(fn) || Node.isFunctionExpression(fn)
          ? [[declaration.getName(), fn]]
          : [];
      }),
  ]);
}

function slotAndClass(component: Node | undefined): StyleTarget | undefined {
  for (const node of component?.getDescendants() ?? []) {
    if (
      Node.isJsxAttribute(node) &&
      node.getNameNode().getText() === "data-slot"
    ) {
      const slot = node.getInitializer();
      if (!Node.isStringLiteral(slot)) continue;
      const owner = node.getParentIfKind(SyntaxKind.JsxAttributes)?.getParent();
      const item =
        Node.isJsxOpeningElement(owner) || Node.isJsxSelfClosingElement(owner)
          ? owner.getAttribute("className")
          : undefined;
      const initializer = Node.isJsxAttribute(item)
        ? item.getInitializer()
        : undefined;
      return {
        slot: slot.getLiteralText(),
        classes: Node.isJsxExpression(initializer)
          ? initializer.getExpression()
          : Node.isStringLiteral(initializer)
          ? initializer
          : undefined,
      };
    }
    if (
      Node.isPropertyAssignment(node) &&
      staticName(node.getNameNode()) === "data-slot"
    ) {
      const slot = node.getInitializer();
      const owner = node.getParentIfKind(SyntaxKind.ObjectLiteralExpression);
      if (owner && Node.isStringLiteral(slot)) {
        return {
          slot: slot.getLiteralText(),
          classes: assignment(owner, "className")?.getInitializer(),
        };
      }
    }
  }
  return undefined;
}

type StyleTarget = { slot: string; classes: Expression | undefined };

/** Same authored conventions as the registry detector: Object.assign exports and data-slot. */
export function discoverStyleTargets(
  source: SourceFile,
  componentId: string
): Map<string, StyleTarget> {
  const functions = componentFunctions(source);
  const compounds = source.getVariableDeclarations().flatMap((declaration) => {
    const call = declaration.getInitializer();
    if (
      !Node.isCallExpression(call) ||
      call.getExpression().getText() !== "Object.assign"
    )
      return [];
    const [root, parts] = call.getArguments();
    return Node.isIdentifier(root) && Node.isObjectLiteralExpression(parts)
      ? [{ root: root.getText(), parts }]
      : [];
  });
  // Files with more than one compound follow the registry detector's last declaration.
  const compound = compounds.at(-1);
  const result = new Map<string, StyleTarget>();
  const claimed = new Set<string>();
  const add = (part: string, target: StyleTarget | undefined) => {
    if (target && !claimed.has(target.slot)) {
      result.set(part, target);
      claimed.add(target.slot);
    }
  };
  if (compound) {
    add("Root", slotAndClass(functions.get(compound.root)));
    for (const property of compound.parts.getProperties()) {
      if (
        !Node.isPropertyAssignment(property) &&
        !Node.isShorthandPropertyAssignment(property)
      )
        continue;
      const part = staticName(property.getNameNode());
      const owner = Node.isPropertyAssignment(property)
        ? property.getInitializer()
        : property.getNameNode();
      if (part && Node.isIdentifier(owner))
        add(part, slotAndClass(functions.get(owner.getText())));
    }
  } else {
    const drawn = [...functions.values()]
      .sort((a, b) => a.getStart() - b.getStart())
      .map(slotAndClass)
      .filter((target): target is StyleTarget => Boolean(target));
    add("Root", drawn.find(({ slot }) => slot === componentId) ?? drawn[0]);
  }
  return result;
}

type CvaDefinition = {
  base: Node;
  options: ObjectLiteralExpression;
  declaration: VariableDeclaration;
  initializer: CallExpression;
};

export function cvaDefinition(
  source: SourceFile,
  call: CallExpression
): CvaDefinition | undefined {
  const name = call.getExpression();
  if (!Node.isIdentifier(name)) return undefined;
  const declaration = source.getVariableDeclaration(name.getText());
  const initializer = declaration?.getInitializer();
  if (
    !declaration ||
    !Node.isCallExpression(initializer) ||
    initializer.getExpression().getText() !== "cva"
  )
    return undefined;
  const [base, options] = initializer.getArguments();
  return base && Node.isObjectLiteralExpression(options)
    ? { base, options, declaration, initializer }
    : undefined;
}

export function findCvaUses(
  source: SourceFile,
  expression: Expression | undefined
): CallExpression[] {
  if (!Node.isCallExpression(expression)) return [];
  if (cvaDefinition(source, expression)) return [expression];
  return classJoin(expression)
    ? expression
        .getArguments()
        .flatMap((argument) =>
          Node.isExpression(argument) ? findCvaUses(source, argument) : []
        )
    : [];
}

/** A preset targets a rendered part, not every call of a shared CVA in the file. */
export function isolateCva(
  source: SourceFile,
  call: CallExpression,
  part: string
): CvaDefinition | undefined {
  const definition = cvaDefinition(source, call);
  if (!definition) return undefined;
  const original = definition.declaration.getName();
  const allCalls = source
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter((entry) => entry.getExpression().getText() === original);
  if (allCalls.length <= 1) return definition;

  const statement = definition.declaration.getVariableStatement();
  if (!statement) return undefined;
  let name = `${original}For${part}`;
  const names = new Set(
    source
      .getDescendantsOfKind(SyntaxKind.Identifier)
      .map((entry) => entry.getText())
  );
  while (names.has(name)) name += "_";
  const index = source.getStatements().indexOf(statement);
  if (index < 0) return undefined;
  source.insertVariableStatement(index + 1, {
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{ name, initializer: definition.initializer.getText() }],
  });
  call.getExpression().replaceWithText(name);
  return cvaDefinition(source, call);
}
