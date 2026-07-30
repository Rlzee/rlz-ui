import fs from "fs";
import path from "path";

type UpdateLayoutOptions = {
  cwd: string;
  rootDir: string;

  fontSansExport: string;
  fontHeadingExport: string;
  fontMonoExport?: string;

  fontsImportPath?: string;
  force?: boolean;
};

function buildLayoutContent(
  fontSansExport: string,
  fontHeadingExport: string,
  fontMonoExport: string | undefined,
  fontsImportPath: string
) {
  const imports = [fontSansExport, fontHeadingExport, fontMonoExport].filter(
    Boolean
  );

  const variables = [
    `${fontSansExport}.variable`,
    `${fontHeadingExport}.variable`,
    fontMonoExport ? `${fontMonoExport}.variable` : null,
  ]
    .filter(Boolean)
    .map((v) => `\${${v}}`)
    .join(" ");

  return `import type { Metadata } from "next";
import { ${imports.join(", ")} } from "${fontsImportPath}";
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
      className={\`${variables} antialiased\`}
    >
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  );
}
`;
}

function layoutAlreadyHasFonts(
  content: string,
  fontSansExport: string,
  fontHeadingExport: string,
  fontMonoExport: string | undefined,
  fontsImportPath: string
): boolean {
  const requiredFonts = [
    fontSansExport,
    fontHeadingExport,
    fontMonoExport,
  ].filter(Boolean);

  const importRegex = new RegExp(
    `import\\s+\\{[^}]*${requiredFonts
      .map((font) => `\\b${escapeRegExp(font!)}\\b`)
      .join("[^}]*")}\\s+from\\s+['"]${escapeRegExp(fontsImportPath)}['"]`
  );

  if (!importRegex.test(content)) return false;

  const variables = requiredFonts
    .map((font) => `\\b${escapeRegExp(font!)}\\.variable\\b`)
    .join("[^}]*");

  const htmlRegex = new RegExp(
    `<html[^>]*className=\\{[^}]*${variables}[^}]*\\}`
  );

  return htmlRegex.test(content);
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function updateNextRootLayout(
  options: UpdateLayoutOptions
): Promise<void> {
  const {
    cwd,
    rootDir,
    fontSansExport,
    fontHeadingExport,
    fontMonoExport,
    fontsImportPath = "@/app/fonts/fonts",
    force = false,
  } = options;

  const layoutPath = path.join(cwd, rootDir, "app", "layout.tsx");

  const desiredContent = buildLayoutContent(
    fontSansExport,
    fontHeadingExport,
    fontMonoExport,
    fontsImportPath
  );

  if (!fs.existsSync(layoutPath)) {
    await fs.promises.mkdir(path.dirname(layoutPath), {
      recursive: true,
    });

    await fs.promises.writeFile(layoutPath, desiredContent, "utf8");

    return;
  }

  const existing = await fs.promises.readFile(layoutPath, "utf8");

  if (
    !force &&
    layoutAlreadyHasFonts(
      existing,
      fontSansExport,
      fontHeadingExport,
      fontMonoExport,
      fontsImportPath
    )
  ) {
    return;
  }

  let modified = existing;

  const imports = [fontSansExport, fontHeadingExport, fontMonoExport].filter(
    Boolean
  );

  const fontsImportLine = `import { ${imports.join(
    ", "
  )} } from "${fontsImportPath}";`;

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

  if (!/import\s+["']\.\/globals\.css["'];?/.test(modified)) {
    modified = `import "./globals.css";\n` + modified;
  }

  const variables = [
    `${fontSansExport}.variable`,
    `${fontHeadingExport}.variable`,
    fontMonoExport ? `${fontMonoExport}.variable` : null,
  ]
    .filter(Boolean)
    .map((v) => `\${${v}}`)
    .join(" ");

  const htmlRegex = /<html([^>]*)className=\{([^}]*)\}([^>]*)>/;

  if (htmlRegex.test(modified)) {
    modified = modified.replace(
      htmlRegex,
      `<html$1className={\`${variables} \${$2}\`}$3>`
    );
  } else {
    modified = desiredContent;
  }

  await fs.promises.writeFile(layoutPath, modified, "utf8");
}
