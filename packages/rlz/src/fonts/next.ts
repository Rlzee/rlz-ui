import { FONT_DEFINITION } from "./def";
import type { FontKey } from "./def";
import { Project } from "ts-morph";
import path from "path";

type NextFontConfig = {
  fontName: FontKey;
  rootDir: string;
};

export async function addNextFont({ fontName, rootDir }: NextFontConfig) {
  const font = FONT_DEFINITION[fontName];

  if (!font.next) {
    throw new Error(`Font ${fontName} does not have a next configuration`);
  }

  const appLayout = path.join(rootDir, "app/layout.tsx");
  const project = new Project();
  const file = project.addSourceFileAtPath(appLayout);
  file.addImportDeclaration({
    namedImports: [font.next.import],
    moduleSpecifier: font.next.from,
  });

  await file.save();
}
