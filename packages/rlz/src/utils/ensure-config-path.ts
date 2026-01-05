import fs, { exists } from "fs-extra";
import path from "path";

type EnsurePathsOptions = {
  cwd: string;
  paths: Record<string, string[]>;
};

// Remove JSON comments to allow parsing JSONC files
function stripJsonComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "").trim();
}

export async function ensureTsconfigPaths({
  cwd,
  paths,
}: EnsurePathsOptions): Promise<void> {
  const tsconfigPath = path.join(
    cwd,
    (await exists(path.join(cwd, "tsconfig.app.json")))
      ? "tsconfig.app.json"
      : "tsconfig.json"
  );

  if (!(await fs.pathExists(tsconfigPath))) {
    return;
  }

  const raw = await fs.readFile(tsconfigPath, "utf-8");
  const config = JSON.parse(stripJsonComments(raw));

  config.compilerOptions ??= {};
  config.compilerOptions.baseUrl ??= ".";

  config.compilerOptions.paths ??= {};

  let changed = false;

  for (const [alias, value] of Object.entries(paths)) {
    if (!config.compilerOptions.paths[alias]) {
      config.compilerOptions.paths[alias] = value;
      changed = true;
    }
  }

  if (!changed) return;

  await fs.writeFile(tsconfigPath, JSON.stringify(config, null, 2) + "\n");
}
