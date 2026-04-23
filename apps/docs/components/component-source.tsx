import { getComponentSource } from "@/lib/component-source";
import { highlightCode } from "@/lib/highlight";
import { ComponentSourceView } from "./component-source-view";

export async function ComponentSource({ name }: { name: string }) {
  const result = await getComponentSource(name);
  if (!result) return null;

  const highlighted = await highlightCode(result.source);

  return (
    <ComponentSourceView
      name={name}
      title={result.path}
      highlighted={highlighted}
    />
  );
}
