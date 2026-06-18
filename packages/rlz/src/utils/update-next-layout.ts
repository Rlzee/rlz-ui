import fs from "fs";
import path from "path";

type UpdateLayoutOptions = {
  cwd: string;
  rootDir: string;

  fontBodyExport: string;
  fontHeadingExport: string;

  fontsImportPath?: string;
  force?: boolean;
};

/**
 * Create the default RootLayout content using the provided export/import names.
 */
function buildLayoutContent(
  fontBodyExport: string,
  fontHeadingExport: string,
  fontsImportPath: string
) {
  return `import type { Metadata } from "next";
 import { ${fontBodyExport}, ${fontHeadingExport} } from "${fontsImportPath}";
 import "./globals.css";

 export const metadata: Metadata = {
   title: "rlz ui",
   description: "Best UI",
 };

 export default function RootLayout({
   children,
 }: Readonly<{ children: React.ReactNode }>) {
   return (
     <html
       lang="en"
       suppressHydrationWarning
       className={\`\${${fontBodyExport}.variable} \${${fontHeadingExport}.variable} antialiased\`}
     >
       <body className="min-h-screen bg-background">{children}</body>
     </html>
   );
 }
 `;
}

/**
 * Check if the current file content already imports the fonts and uses their variables on <html>.
 * Very permissive / heuristic-based to avoid heavy parsing.
 */
function layoutAlreadyHasFonts(
  content: string,
  fontBodyExport: string,
  fontHeadingExport: string,
  fontsImportPath: string
): boolean {
  const importRegex = new RegExp(
    `import\\s+\\{[^}]*\\b${escapeRegExp(
      fontBodyExport
    )}\\b[^}]*\\b${escapeRegExp(
      fontHeadingExport
    )}\\b[^}]*\\}\\s+from\\s+['"]${escapeRegExp(fontsImportPath)}['"]`
  );

  if (!importRegex.test(content)) return false;

  const htmlRegex = new RegExp(
    `<html[^>]*className=\\{[^}]*\\b${escapeRegExp(
      fontBodyExport
    )}\\.variable\\b[^}]*\\b${escapeRegExp(
      fontHeadingExport
    )}\\.variable\\b[^}]*\\}`
  );

  return htmlRegex.test(content);
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&");
}

/**
 * Updates or creates the Next.js app root layout.tsx file to import the fonts and use them.
 *
 * This function will:
 * - Resolve the layout path as <cwd>/<rootDir>/app/layout.tsx
 * - If file exists and `force` is false, it will try to patch the file only if necessary.
 * - If file does not exist or `force` is true, it will write a new layout.tsx with the expected content.
 */
export async function updateNextRootLayout(
  options: UpdateLayoutOptions
): Promise<void> {
  const {
    cwd,
    rootDir,
    fontBodyExport,
    fontHeadingExport,
    fontsImportPath = "@/app/fonts/fonts",
    force = false,
  } = options;

  const layoutPath = path.join(cwd, rootDir, "app", "layout.tsx");

  const desiredContent = buildLayoutContent(
    fontBodyExport,
    fontHeadingExport,
    fontsImportPath
  );

  if (!fs.existsSync(layoutPath)) {
    await fs.promises.mkdir(path.dirname(layoutPath), { recursive: true });
    await fs.promises.writeFile(layoutPath, desiredContent, "utf8");
    return;
  }

  const existing = await fs.promises.readFile(layoutPath, "utf8");

  if (
    !force &&
    layoutAlreadyHasFonts(
      existing,
      fontBodyExport,
      fontHeadingExport,
      fontsImportPath
    )
  ) {
    return;
  }

  let modified = existing;

  const fontsImportLine = `import { ${fontBodyExport}, ${fontHeadingExport} } from "${fontsImportPath}";`;

  const importRegex = new RegExp(
    `import\\s+\\{[^}]*\\}\\s+from\\s+['"]${escapeRegExp(
      fontsImportPath
    )}['"];?`
  );

  if (importRegex.test(modified)) {
    modified = modified.replace(importRegex, fontsImportLine);
  } else {
    modified = fontsImportLine + "\n" + modified;
  }

  // ensure globals.css exists
  if (!/import\s+["']\.\/globals\.css["'];?/.test(modified)) {
    modified = `import "./globals.css";\n` + modified;
  }

  const htmlRegex = /<html([^>]*)className=\{([^}]*)\}([^>]*)>/;

  if (htmlRegex.test(modified)) {
    modified = modified.replace(
      htmlRegex,
      `<html$1className={\`\${${fontBodyExport}.variable} \${${fontHeadingExport}.variable}\`}$2$3>`
    );
  } else {
    modified = desiredContent;
  }

  await fs.promises.writeFile(layoutPath, modified, "utf8");
}
