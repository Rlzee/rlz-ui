import React from "react";

import { getIconForLanguageExtension } from "./icons/language";

import { CodeBlock } from "./code-block";
import { Card } from "@rlz/ui/components/ui/card";

type Props = {
  children: React.ReactNode;
  name: string;
  // maxLines?: number;
  // collapsible?: boolean;
  title?: string;
};

export function ComponentSource({ children, name, title }: Props) {
  if (!name) return null;

  return (
    <CodeBlock>
      <Card.Header>
        <Card.Title>
          <span>{getIconForLanguageExtension("tsx")}</span>
          {title}
        </Card.Title>
      </Card.Header>
      {children}
    </CodeBlock>
  );
}
