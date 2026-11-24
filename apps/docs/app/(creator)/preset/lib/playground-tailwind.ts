import type { PresetComponentCustomization } from "@rlz/registry";

export type TailwindSources = Record<string, string>;

/** Include every authored variant so switching the selected value needs no rebuild. */
export function playgroundCandidates(
  edits: Record<string, PresetComponentCustomization>
): string[] {
  const candidates = new Set<string>();
  const add = (value?: string) => {
    for (const token of value?.trim().split(/\s+/) ?? []) {
      if (token) candidates.add(token);
    }
  };
  const parts = (value?: Record<string, string | undefined>) =>
    Object.values(value ?? {}).forEach(add);

  for (const edit of Object.values(edits)) {
    parts(edit.partClasses);
    for (const options of Object.values(edit.variants ?? {})) {
      for (const option of options) {
        if (typeof option === "string" || !option) continue;
        add(option.classes);
        parts(option.partClasses);
      }
    }
  }

  return [...candidates].sort();
}

export async function compilePlaygroundCss(
  sources: TailwindSources,
  theme: string,
  candidates: string[]
) {
  const { compile } = await import("tailwindcss");
  const compiler = await compile(
    // The first @theme controls where Tailwind emits variables. If the reference
    // goes first, the draft's --animate-* declarations are treated as reference-only.
    `@layer utilities { @tailwind utilities; }\n${theme}\n@reference "@rlz/ui/globals.css";`,
    {
      async loadStylesheet(id) {
        if (!Object.hasOwn(sources, id))
          throw new Error(`Unknown stylesheet: ${id}`);
        return { path: id, content: sources[id]!, base: "/" };
      },
    }
  );
  return compiler.build(candidates);
}
