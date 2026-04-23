"use client";

import { getIconForLanguageExtension } from "./icons/language";
import { CodeBlock } from "./code-block";
import { Pre } from "./Pre";
import { Card } from "@rlz/ui/components/ui/card";
import { CodeCollapsibleWrapper } from "./code-collapsible-wrapper";

export function ComponentSourceView({
  name,
  title,
  highlighted,
  collapsible = true,
}: {
  name: string;
  title?: string;
  highlighted: string;
  collapsible?: boolean;
}) {
  const componentBase = (
    <CodeBlock>
      <Card.Header className="border-b p-3.5 bg-background rounded-t-md">
        <Card.Title className="flex items-center gap-2 [&_svg]:h-4 text-sm font-normal text-muted-foreground">
          {getIconForLanguageExtension("tsx")}
          {title ?? `${name}.tsx`}
        </Card.Title>
      </Card.Header>
      <Pre dangerouslySetInnerHTML={{ __html: highlighted }} />
    </CodeBlock>
  );

  if (!collapsible) return componentBase;

  return (
    <CodeCollapsibleWrapper title={title ?? `${name}.tsx`}>
      {componentBase}
    </CodeCollapsibleWrapper>
  );
}
