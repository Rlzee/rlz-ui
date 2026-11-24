import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";

/** Fixed build inputs only. Draft CSS is compiled in the preview document, never here. */
export async function GET() {
  const modules = join(process.cwd(), "node_modules");
  const inputs = {
    "@rlz/ui/globals.css": join(modules, "@rlz/ui/src/styles/globals.css"),
    tailwindcss: join(modules, "tailwindcss/index.css"),
    "./theme.css": join(modules, "tailwindcss/theme.css"),
    "./preflight.css": join(modules, "tailwindcss/preflight.css"),
    "./utilities.css": join(modules, "tailwindcss/utilities.css"),
    "tw-animate-css": join(modules, "tw-animate-css/dist/tw-animate.css"),
  };
  const entries = await Promise.all(
    Object.entries(inputs).map(async ([name, path]) => [
      name,
      await readFile(path, "utf8"),
    ])
  );
  return Response.json(Object.fromEntries(entries));
}
