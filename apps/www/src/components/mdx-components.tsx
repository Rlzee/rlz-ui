import * as React from "react";
import { cn } from "@ui/lib/utils";
import { useMDXComponent } from "next-contentlayer2/hooks";

import { BlockDocs } from "./block-docs";
import { ComponentPreview } from "./component-preview";
import { CodeBlock } from "./code-block";
import { InputCopyCLI } from "./input-copy";

const components = {
  BlockDocs,
  ComponentPreview,
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn("text-foreground text-lg font-heading", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("text-muted-foreground text-sm", className)} {...props} />
  ),
  pre: ({ children }: any) => {
    const child = children.props;
    const code = child.children || "";
    const language = child.className?.replace("language-", "") || "";
    const showLineNumbers = child.metastring?.includes("showLineNumbers");

    if (language === "tsx") {
      return <CodeBlock code={code} />;
    }

    if (language === "bash") {
      const lines = code
        .split("\n")
        .map((line: string) => line.trim())
        .filter(Boolean);

      const commands: Record<string, string> = {};

      for (const line of lines) {
        if (line.includes(":")) {
          const [key, cmd] = line.split(":").map((s: string) => s.trim());
          if (key && cmd) commands[key] = cmd;
        } else {
          if (line.startsWith("npm")) commands.npm = line;
          if (line.startsWith("pnpm")) commands.pnpm = line;
          if (line.startsWith("yarn")) commands.yarn = line;
          if (line.startsWith("bun")) commands.bun = line;
        }
      }

      return <InputCopyCLI commands={commands} wrapperClassName="mt-4" />;
    }

    return <pre>{code}</pre>; // fallback
  },
};

export const Mdx = ({ code }: { code: string }) => {
  const Component = useMDXComponent(code);

  return <Component components={components} />;
};
