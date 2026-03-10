import { type FontKey, FONT_DEFINITION } from "./def";
import { readConfig } from "@/config/read";
import path from "path";
import fs from "fs";
import { updateNextRootLayout } from "@/utils/update-next-layout";

type AddNextFontOptions = {
  name: FontKey;
  cwd: string;
};

export async function addNextFont({ name, cwd }: AddNextFontOptions) {
  const font = FONT_DEFINITION[name];
  if (!font.next) throw new Error(`Font ${name} does not support Next.js`);

  const config = readConfig(cwd);
  const rootDir = config.dirs.root;
  if (!rootDir || typeof rootDir !== "string") {
    throw new Error("Missing config.dirs.root");
  }

  // Create app/fonts directory and write fonts.ts
  const fontsDir = path.join(cwd, rootDir, "app", "fonts");
  await fs.promises.mkdir(fontsDir, { recursive: true });

  const fontsPath = path.join(fontsDir, "fonts.ts");

  // Use the Next import name for the chosen font (e.g. "Geist", "Inter")
  const fontImportName = font.next.import;
  // Always include Geist_Mono for the mono variable
  const monoImportName = "Geist_Mono";

  // Create export names and CSS variable names derived from the font key
  const sanitizedName = name.replace(/-/g, "_");
  const sansExportName = `${sanitizedName}Sans`;

  const content = `import { ${fontImportName}, ${monoImportName} } from "next/font/google";

export const ${sansExportName} = ${fontImportName}({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const geistMono = ${monoImportName}({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
`;

  await fs.promises.writeFile(fontsPath, content, "utf8");

  // Update or create the Next.js root layout to import and use the fonts
  await updateNextRootLayout({
    cwd,
    rootDir,
    fontSansExport: sansExportName,
    fontMonoExport: "geistMono",
  });
}
