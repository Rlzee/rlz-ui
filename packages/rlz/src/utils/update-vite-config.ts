import { Project, SyntaxKind } from "ts-morph";
import path from "path";
import fs from "fs-extra";

export async function updateViteConfig(cwd: string): Promise<void> {
  const viteConfigPath = ["vite.config.ts", "vite.config.js"]
    .map((f) => path.join(cwd, f))
    .find(fs.existsSync);

  if (!viteConfigPath) return;

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(viteConfigPath);

  // 1. Add import if missing
  const hasImport = sourceFile
    .getImportDeclarations()
    .some((i) => i.getModuleSpecifierValue() === "vite-tsconfig-paths");

  if (!hasImport) {
    sourceFile.addImportDeclaration({
      defaultImport: "tsconfigPaths",
      moduleSpecifier: "vite-tsconfig-paths",
    });
  }

  // 2. Add plugin if missing
  const defineConfigCall = sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .find((c) => c.getExpression().getText() === "defineConfig");

  if (!defineConfigCall) return;

  const configArg = defineConfigCall.getArguments()[0];
  if (!configArg || !configArg.asKind(SyntaxKind.ObjectLiteralExpression))
    return;

  const obj = configArg.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  let pluginsProp = obj.getProperty("plugins");

  if (!pluginsProp) {
    obj.addPropertyAssignment({
      name: "plugins",
      initializer: "[tsconfigPaths()]",
    });
  } else {
    const arr = pluginsProp.getFirstDescendantByKind(
      SyntaxKind.ArrayLiteralExpression
    );

    if (arr && !arr.getText().includes("tsconfigPaths")) {
      arr.addElement("tsconfigPaths()");
    }
  }

  await sourceFile.save();
}
