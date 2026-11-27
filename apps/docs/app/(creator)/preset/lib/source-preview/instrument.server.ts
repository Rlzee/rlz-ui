import {
  Node,
  SyntaxKind,
  VariableDeclarationKind,
  type SourceFile,
} from "ts-morph";
import type { SourcePreviewBundle } from "./types";

export function reactFactoryName(source: SourceFile, expression: Node) {
  for (const declaration of source.getImportDeclarations()) {
    if (
      declaration.isTypeOnly() ||
      declaration.getModuleSpecifierValue() !== "react"
    )
      continue;
    if (Node.isIdentifier(expression)) {
      const imported = declaration
        .getNamedImports()
        .find(
          (entry) =>
            (entry.getAliasNode()?.getText() ?? entry.getName()) ===
            expression.getText()
        );
      if (imported) return imported.getName();
    }
    if (Node.isPropertyAccessExpression(expression)) {
      const namespace =
        declaration.getNamespaceImport() ?? declaration.getDefaultImport();
      if (namespace?.getText() === expression.getExpression().getText())
        return expression.getName();
    }
  }
}

/** Instrument trusted modules, not installed sources. Hook order stays unchanged. */
export function instrumentPreviewSource(
  source: SourceFile,
  id: string,
  bundle: SourcePreviewBundle
) {
  // Compute literal-data dependency signatures before rewriting any declarations.
  const signatures = new Map<Node, string>();
  const externalNames = new Set(
    source
      .getImportDeclarations()
      .filter(
        (entry) =>
          !entry.getModuleSpecifierValue().startsWith("@rlz/ui/") &&
          !entry.getModuleSpecifierValue().startsWith(".")
      )
      .flatMap((entry) => [
        ...entry
          .getNamedImports()
          .map((item) => item.getAliasNode()?.getText() ?? item.getName()),
        entry.getDefaultImport()?.getText(),
        entry.getNamespaceImport()?.getText(),
      ])
      .filter((name): name is string => Boolean(name))
  );

  function dataSignature(
    node: Node | undefined,
    seen = new Set<Node>()
  ): string | undefined {
    if (!node || seen.has(node)) return undefined;
    seen = new Set([...seen, node]);
    if (
      Node.isAsExpression(node) ||
      Node.isParenthesizedExpression(node) ||
      Node.isSatisfiesExpression(node)
    )
      return dataSignature(node.getExpression(), seen);
    if (
      Node.isStringLiteral(node) ||
      Node.isNumericLiteral(node) ||
      [
        SyntaxKind.TrueKeyword,
        SyntaxKind.FalseKeyword,
        SyntaxKind.NullKeyword,
      ].includes(node.getKind())
    )
      return node.getText();
    if (
      Node.isPrefixUnaryExpression(node) &&
      [SyntaxKind.MinusToken, SyntaxKind.PlusToken].includes(
        node.getOperatorToken()
      ) &&
      Node.isNumericLiteral(node.getOperand())
    )
      return node.getText();
    if (Node.isIdentifier(node)) {
      if (externalNames.has(node.getText()))
        return `external:${node.getText()}`;
      if (source.getFunction(node.getText()))
        return `function:${node.getText()}`;
      const declaration = source.getVariableDeclaration(node.getText());
      if (
        declaration?.getVariableStatement()?.getDeclarationKind() !==
        VariableDeclarationKind.Const
      )
        return undefined;
      const initializer = declaration.getInitializer();
      if (
        Node.isArrowFunction(initializer) ||
        Node.isFunctionExpression(initializer)
      )
        return `function:${node.getText()}`;
      return dataSignature(initializer, seen);
    }
    const children = Node.isArrayLiteralExpression(node)
      ? node.getElements()
      : Node.isObjectLiteralExpression(node)
      ? node.getProperties().map((property) => {
          if (
            Node.isPropertyAssignment(property) &&
            !Node.isComputedPropertyName(property.getNameNode())
          )
            return property.getInitializer();
          if (Node.isShorthandPropertyAssignment(property))
            return property.getNameNode();
          return undefined;
        })
      : undefined;
    if (!children) return undefined;
    const dependencies = children.map((child) => dataSignature(child, seen));
    return dependencies.every((value) => value !== undefined)
      ? `${node.getText()}:${JSON.stringify(dependencies)}`
      : undefined;
  }
  for (const statement of source.getVariableStatements()) {
    if (statement.getDeclarationKind() !== VariableDeclarationKind.Const)
      continue;
    for (const declaration of statement.getDeclarations()) {
      const initializer = declaration.getInitializer();
      const signature = dataSignature(initializer);
      if (
        initializer &&
        signature &&
        (Node.isArrayLiteralExpression(initializer) ||
          Node.isObjectLiteralExpression(initializer) ||
          Node.isAsExpression(initializer) ||
          Node.isSatisfiesExpression(initializer))
      )
        signatures.set(declaration, signature);
    }
  }

  for (const call of source
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .reverse()) {
    const factory = reactFactoryName(source, call.getExpression());
    const owner = call.getFirstAncestorByKind(SyntaxKind.VariableDeclaration);
    const inFunction = call.getFirstAncestor(
      (node) =>
        Node.isFunctionDeclaration(node) ||
        Node.isFunctionExpression(node) ||
        Node.isArrowFunction(node)
    );
    const moduleOwner =
      owner?.getVariableStatement()?.getParent() === source && !inFunction;
    const key = `${id}:${moduleOwner ? owner!.getName() : "$default"}`;
    if (factory === "createContext") {
      if (!moduleOwner)
        throw new Error("A preview context must be declared at module scope");
      bundle.contexts[key] = call
        .getArguments()
        .map((argument) => argument.getText())
        .join(",");
      call.replaceWithText(
        `__rlzPreview.context(${JSON.stringify(key)}, () => ${call.getText()})`
      );
    } else if (factory === "memo" && !inFunction) {
      // Preview updates must render even if only a closed-over CVA changed.
      // Bypass memoization, not the component boundary or its hooks.
      const component = call.getArguments()[0];
      if (component)
        call.replaceWithText(
          `__rlzPreview.memo(${JSON.stringify(key)}, ${component.getText()})`
        );
    } else if (factory === "forwardRef" && !inFunction) {
      const render = call.getArguments()[0];
      if (render)
        call.replaceWithText(
          `__rlzPreview.forwardRef(${JSON.stringify(key)}, ${call
            .getExpression()
            .getText()}, ${render.getText()})`
        );
    } else if (
      moduleOwner &&
      Node.isPropertyAccessExpression(call.getExpression()) &&
      /^(createHandle|createToastManager)$/.test(
        call
          .getExpression()
          .asKindOrThrow(SyntaxKind.PropertyAccessExpression)
          .getName()
      )
    ) {
      (bundle.resources ??= {})[key] = call
        .getArguments()
        .map((argument) => argument.getText())
        .join(",");
      call.replaceWithText(
        `__rlzPreview.resource(${JSON.stringify(key)}, () => ${call.getText()})`
      );
    }
  }
  const prelude: string[] = [];
  const defaults: string[] = [];
  const identifiers = new Set(
    source
      .getDescendantsOfKind(SyntaxKind.Identifier)
      .map((node) => node.getText())
  );
  for (const declaration of source.getFunctions()) {
    if (!declaration.getBody()) continue;
    let name = declaration.getName() ?? "__rlzDefault";
    if (!declaration.getName()) {
      while (identifiers.has(name)) name += "_";
      identifiers.add(name);
    }
    const isDefault = declaration.isDefaultExport();
    const isExported = declaration.isExported();
    let implementation = `__rlzImpl_${name}`;
    while (identifiers.has(implementation)) implementation += "_";
    identifiers.add(implementation);
    declaration.setIsDefaultExport(false);
    declaration.setIsExported(false);
    const nameNode = declaration.getNameNode();
    if (nameNode) nameNode.replaceWithText(implementation);
    else
      declaration.replaceWithText(
        declaration
          .getText()
          .replace(/\bfunction(\s*\*)?/, `function$1 ${implementation}`)
      );
    prelude.push(
      `${
        isExported && !isDefault ? "export " : ""
      }const ${name} = __rlzPreview.component(${JSON.stringify(
        `${id}:${name}`
      )}, ${implementation});`
    );
    if (isDefault) defaults.push(`export default ${name};`);
  }
  const lastImport = source.getImportDeclarations().at(-1);
  source.insertStatements(
    lastImport ? lastImport.getChildIndex() + 1 : 0,
    prelude
  );
  source.addStatements(defaults);
  for (const statement of source.getVariableStatements())
    for (const declaration of statement.getDeclarations()) {
      const initializer = declaration.getInitializer();
      if (!initializer) continue;
      const key = JSON.stringify(`${id}:${declaration.getName()}`);
      if (
        Node.isArrowFunction(initializer) ||
        Node.isFunctionExpression(initializer)
      )
        declaration.setInitializer(
          `__rlzPreview.component(${key}, ${initializer.getText()})`
        );
      else if (signatures.has(declaration))
        declaration.setInitializer(
          `__rlzPreview.value(${key}, ${JSON.stringify(
            signatures.get(declaration)
          )}, () => (${initializer.getText()}))`
        );
    }
  for (const assignment of source.getExportAssignments()) {
    const expression = assignment.getExpression();
    if (
      Node.isArrowFunction(expression) ||
      Node.isFunctionExpression(expression)
    )
      assignment.setExpression(
        `__rlzPreview.component(${JSON.stringify(
          `${id}:$default`
        )}, ${expression.getText()})`
      );
  }
}
