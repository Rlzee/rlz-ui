import { readConfig } from "@/config/read";
import path from "path";
import fs from "fs-extra";
import { updateNextRootLayout } from "@/utils/update-next-layout";
import { getNextImportName } from "./utils";

type AddNextFontsOptions = {
  bodyFont: string;
  headingFont: string;
  cwd: string;
};

export async function addNextFonts({
  bodyFont,
  headingFont,
  cwd,
}: AddNextFontsOptions) {
  const config = readConfig(cwd);
  const rootDir = config.dirs.root;

  if (!rootDir || typeof rootDir !== "string") {
    throw new Error("Missing config.dirs.root");
  }

  const fontsDir = path.join(cwd, rootDir, "app", "fonts");
  await fs.mkdir(fontsDir, { recursive: true });

  const fontsPath = path.join(fontsDir, "fonts.ts");

  const bodyImport = getNextImportName(bodyFont);
  const headingImport = getNextImportName(headingFont);

  const imports = [...new Set([bodyImport, headingImport])];

  const content = `import { ${imports.join(", ")} } from "next/font/google";

export const bodyFont = ${bodyImport}({
  variable: "--font-body",
  subsets: ["latin"],
});

export const headingFont = ${headingImport}({
  variable: "--font-heading",
  subsets: ["latin"],
});
`;

  await fs.writeFile(fontsPath, content, "utf8");

  await updateNextRootLayout({
    cwd,
    rootDir,
    fontBodyExport: "bodyFont",
    fontHeadingExport: "headingFont",
  });
}
