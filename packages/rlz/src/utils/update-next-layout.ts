import fs from "fs";
import path from "path";

export type UpdateLayoutOptions = {
  /**
   * Project root (cwd passed to CLI command)
   */
  cwd: string;
  /**
   * The project rootDir from rlz.config.json (e.g. 'apps/web' or '.' )
   */
  rootDir: string;
  /**
   * The named export to import for the chosen sans font in `app/fonts/fonts.ts`.
   * e.g. 'geistSans' or 'interSans'
   */
  fontSansExport: string;
  /**
   * The named export to import for the mono font in `app/fonts/fonts.ts`.
   * Default in our generator is `geistMono`.
   */
  fontMonoExport?: string;
  /**
   * The relative module specifier to import from. Default is `"@/app/fonts/fonts"`.
   */
  fontsImportPath?: string;
  /**
   * Whether to overwrite layout.tsx even if it already appears to contain the proper imports/usage.
   * Defaults to false.
   */
  force?: boolean;
};

/**
 * Create the default RootLayout content using the provided export/import names.
 */
function buildLayoutContent(
  fontSansExport: string,
  fontMonoExport: string,
  fontsImportPath: string
) {
  return `import type { Metadata } from "next";
import { ${fontSansExport}, ${fontMonoExport} } from "${fontsImportPath}";
import "./globals.css";

export const metadata: Metadata = {
  title: "rlz ui",
  description: "Best UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={\`\${${fontSansExport}.variable} \${${fontMonoExport}.variable} antialiased\`}
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
  fontSansExport: string,
  fontMonoExport: string,
  fontsImportPath: string
): boolean {
  const importRegex = new RegExp(
    `import\\s+\\{[^}]*\\b${escapeRegExp(
      fontSansExport
    )}\\b[^}]*\\b${escapeRegExp(
      fontMonoExport
    )}\\b[^}]*\\}\\s+from\\s+['"]${escapeRegExp(fontsImportPath)}['"]`
  );

  if (!importRegex.test(content)) return false;

  const htmlRegex = new RegExp(
    `<html[^>]*className=\\{[^}]*\\b${escapeRegExp(
      fontSansExport
    )}\\.variable\\b[^}]*\\b${escapeRegExp(
      fontMonoExport
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
    fontSansExport,
    fontMonoExport = "geistMono",
    fontsImportPath = "@/app/fonts/fonts",
    force = false,
  } = options;

  if (!cwd || !rootDir) {
    throw new Error("Both cwd and rootDir must be provided");
  }

  const layoutPath = path.join(cwd, rootDir, "app", "layout.tsx");

  const desiredContent = buildLayoutContent(
    fontSansExport,
    fontMonoExport,
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
      fontSansExport,
      fontMonoExport,
      fontsImportPath
    )
  ) {
    return;
  }

  try {
    let modified = existing;

    const fontsImportLine = `import { ${fontSansExport}, ${fontMonoExport} } from "${fontsImportPath}";`;
    const importFromFontsRegex = new RegExp(
      `import\\s+\\{[^}]*\\}\\s+from\\s+['"]${escapeRegExp(
        fontsImportPath
      )}['"];?`
    );
    if (importFromFontsRegex.test(modified)) {
      modified = modified.replace(importFromFontsRegex, fontsImportLine);
    } else {
      const firstImportEnd = modified.search(/(?:\\r?\\n){1,2}(?!import)/);
      if (firstImportEnd !== -1) {
        const before = modified.slice(0, firstImportEnd);
        const after = modified.slice(firstImportEnd);
        modified = before + fontsImportLine + "\n" + after;
      } else {
        modified = fontsImportLine + "\n" + modified;
      }
    }

    if (!/import\s+["']\.\/globals\.css["'];?/.test(modified)) {
      const insertAfter = `import { ${fontSansExport}, ${fontMonoExport} } from "${fontsImportPath}";`;
      const idx = modified.indexOf(insertAfter);
      if (idx !== -1) {
        const insertPos = idx + insertAfter.length;
        modified =
          modified.slice(0, insertPos) +
          '\nimport "./globals.css";\n' +
          modified.slice(insertPos);
      } else {
        modified = 'import "./globals.css";\n' + modified;
      }
    }

    const htmlClassRegex = /<html([^>]*)className=\{([^}]*)\}([^>]*)>/;
    if (htmlClassRegex.test(modified)) {
      modified = modified.replace(
        htmlClassRegex,
        `<html$1className={\`${
          "${" +
          fontSansExport +
          "}.variable} ${" +
          fontMonoExport +
          "}.variable"
        }$2\`}$3>`
      );
    } else {
      modified = desiredContent;
    }

    await fs.promises.writeFile(layoutPath, modified, "utf8");
  } catch (err) {
    await fs.promises.writeFile(layoutPath, desiredContent, "utf8");
  }
}
