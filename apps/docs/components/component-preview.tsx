import { ComponentPreviewClient } from "./component-preview-client";
import { highlightCode } from "@/lib/highlight";
import { getDemoSource } from "@/lib/component-source";

export async function ComponentPreview({
  name,
  className,
  demoClassName,
}: {
  name: string;
  className?: string;
  demoClassName?: string;
}) {
  const source = await getDemoSource(name);
  const highlighted = source ? await highlightCode(source) : null;

  return (
    <ComponentPreviewClient
      name={name}
      highlighted={highlighted ?? ""}
      rawCode={source ?? ""}
      className={className}
      demoClassName={demoClassName}
    />
  );
}
