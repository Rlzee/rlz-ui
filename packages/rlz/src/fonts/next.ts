import { readConfig } from "@/config/read";
import path from "path";
import fs from "fs-extra";
import { updateNextRootLayout } from "@/utils/update-next-layout";
import { getNextImportName } from "./utils";

type AddNextFontsOptions = {
  fontSans: string;
  fontHeading: string;
  fontMono?: string;
  cwd: string;
};

export async function addNextFonts({
  fontSans,
  fontHeading,
  fontMono,
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

  const sansImport = getNextImportName(fontSans);
  const headingImport = getNextImportName(fontHeading);
  const monoImport = fontMono ? getNextImportName(fontMono) : null;

  const imports = [sansImport, headingImport, monoImport].filter(Boolean);

  const uniqueImports = [...new Set(imports)];

  const content = `import { ${uniqueImports.join(
    ", "
  )} } from "next/font/google";

export const sansFont = ${sansImport}({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const headingFont = ${headingImport}({
  variable: "--font-heading",
  subsets: ["latin"],
});

${
  monoImport
    ? `export const monoFont = ${monoImport}({
  variable: "--font-mono",
  subsets: ["latin"],
});`
    : ""
}
`;

  await fs.writeFile(fontsPath, content, "utf8");

  await updateNextRootLayout({
    cwd,
    rootDir,
    fontSansExport: "sansFont",
    fontHeadingExport: "headingFont",
    fontMonoExport: monoImport ? "monoFont" : undefined,
  });
}
