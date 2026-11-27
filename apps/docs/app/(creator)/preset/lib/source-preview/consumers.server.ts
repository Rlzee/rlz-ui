import { Node, SyntaxKind, type SourceFile } from "ts-morph";
import { reactFactoryName } from "./instrument.server";
import type { SourcePreviewBundle } from "./types";

/**
 * Selected props are a scenario concern, scoped to actual public consumers.
 * This also reaches parts rendered internally (e.g. a composed popup), without
 * modifying the original documentation props or the installable component API.
 */
export function injectScenarioConsumers(
  source: SourceFile,
  id: string,
  bundle: SourcePreviewBundle
) {
  if (!bundle.selection) return;
  const axes = Object.keys(bundle.selection.axes);
  const editable = bundle.selection.props;
  const keys = new Set([...axes, ...editable]);
  const functions = new Set<Node>();
  function inspect(node: Node | undefined, seen = new Set<Node>()) {
    if (!node || seen.has(node) || node.getSourceFile() !== source) return;
    seen = new Set([...seen, node]);
    if (Node.isVariableDeclaration(node))
      return inspect(node.getInitializer(), seen);
    if (Node.isIdentifier(node))
      return inspect(
        source.getFunction(node.getText()) ??
          source.getVariableDeclaration(node.getText()),
        seen
      );
    if (
      Node.isFunctionDeclaration(node) ||
      Node.isArrowFunction(node) ||
      Node.isFunctionExpression(node)
    )
      functions.add(node);
    else if (Node.isCallExpression(node)) {
      if (
        ["memo", "forwardRef"].includes(
          reactFactoryName(source, node.getExpression()) ?? ""
        )
      )
        inspect(node.getArguments()[0], seen);
      else if (node.getExpression().getText() === "Object.assign") {
        const [root, parts] = node.getArguments();
        inspect(root, seen);
        if (Node.isObjectLiteralExpression(parts))
          for (const member of parts.getProperties()) {
            if (Node.isPropertyAssignment(member))
              inspect(member.getInitializer(), seen);
            if (Node.isShorthandPropertyAssignment(member))
              inspect(member.getNameNode(), seen);
          }
      }
    }
  }
  for (const declarations of source.getExportedDeclarations().values())
    for (const declaration of declarations) inspect(declaration);
  for (const fn of functions) {
    if (
      !(
        Node.isFunctionDeclaration(fn) ||
        Node.isArrowFunction(fn) ||
        Node.isFunctionExpression(fn)
      )
    )
      continue;
    const parameter = fn.getParameters()[0];
    const name = parameter?.getNameNode();
    if (!parameter || !name || !fn.getBody()) continue;
    const consumed = new Set<string>();
    if (Node.isObjectBindingPattern(name)) {
      for (const entry of name.getElements()) {
        if (entry.getDotDotDotToken()) continue;
        const property = entry.getPropertyNameNode() ?? entry.getNameNode();
        consumed.add(
          Node.isStringLiteral(property)
            ? property.getLiteralText()
            : property.getText()
        );
      }
    } else if (Node.isIdentifier(name)) {
      for (const member of fn.getDescendantsOfKind(
        SyntaxKind.PropertyAccessExpression
      ))
        if (member.getExpression().getText() === name.getText())
          consumed.add(member.getName());
      for (const binding of fn.getDescendantsOfKind(
        SyntaxKind.VariableDeclaration
      )) {
        const pattern = binding.getNameNode();
        if (
          binding.getInitializer()?.getText() === name.getText() &&
          Node.isObjectBindingPattern(pattern)
        )
          for (const entry of pattern.getElements())
            consumed.add(
              (entry.getPropertyNameNode() ?? entry.getNameNode()).getText()
            );
      }
    }
    const selectedKeys = [...consumed].filter((key) => keys.has(key));
    if (!selectedKeys.length) continue;
    const selectedAxes = selectedKeys.filter((key) => axes.includes(key));
    const selectedProps = selectedKeys.filter((key) => editable.includes(key));
    let input = name.getText();
    let statement: string;
    if (Node.isObjectBindingPattern(name)) {
      const binding = input;
      const existingNames = new Set(
        fn
          .getDescendantsOfKind(SyntaxKind.Identifier)
          .map((node) => node.getText())
      );
      input = "__rlzScenarioInput";
      while (existingNames.has(input)) input += "_";
      name.replaceWithText(input);
      statement = `const ${binding} = __rlzPreview.selectedProps(${input}, ${JSON.stringify(
        selectedAxes
      )}, ${JSON.stringify(selectedProps)});`;
    } else {
      statement = `${input} = __rlzPreview.selectedProps(${input}, ${JSON.stringify(
        selectedAxes
      )}, ${JSON.stringify(selectedProps)});`;
    }
    const body = fn.getBody()!;
    if (!Node.isBlock(body)) fn.setBodyText(`return (${body.getText()});`);
    fn.getBody()!
      .asKindOrThrow(SyntaxKind.Block)
      .insertStatements(0, statement);
    const owner = fn.getFirstAncestorByKind(SyntaxKind.VariableDeclaration);
    const label = Node.isFunctionDeclaration(fn)
      ? fn.getName()
      : owner?.getName();
    (bundle.consumers ??= {})[`${id}:${label ?? "$default"}`] = selectedKeys;
  }
}
