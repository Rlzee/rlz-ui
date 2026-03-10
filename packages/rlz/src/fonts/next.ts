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

  const fontsDir = path.join(cwd, rootDir, "app", "fonts");
  await fs.promises.mkdir(fontsDir, { recursive: true });

  const fontsPath = path.join(fontsDir, "fonts.ts");
  const fontImportName = font.next.import;
  const monoImportName = "Geist_Mono";
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

  await updateNextRootLayout({
    cwd,
    rootDir,
    fontSansExport: sansExportName,
    fontMonoExport: "geistMono",
  });
}
