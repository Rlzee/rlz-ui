import * as React from "react";
import { cn } from "@ui/lib/utils";
import { useMDXComponent } from "next-contentlayer2/hooks";

import { BlockDocs } from "./block-docs";
import { ComponentPreview } from "./component-preview";
import { CodeBlock } from "./code-block";
import { InputCopyCLI } from "./input-copy";
import { ComponentProps } from "./component-props";

const components = {
  BlockDocs,
  ComponentPreview,
  ComponentProps,
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn("mt-8 text-xl text-foreground font-semibold", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "text-muted-foreground text-base leading-relaxed",
        className
      )}
      {...props}
    />
  ),
  MarkdownFallback: ({ children }: { children: React.ReactNode }) => {
    return null; // site ignore
  },
  pre: ({ children }: any) => {
    const child = children.props;
    let code = child.children || "";
    const language = child.className?.replace("language-", "") || "";

    if (language === "tsx") {
      // Remove leading/trailing empty lines and trim
      code = code.split("\n").filter((line: string, idx: number, arr: string[]) => {
        // Remove first/last line if empty
        if ((idx === 0 || idx === arr.length - 1) && line.trim() === "") return false;
        return true;
      }).join("\n").trim();
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

      return <InputCopyCLI commands={commands} wrapperClassName="mt-2" />;
    }

    return <pre>{code}</pre>; // fallback
  },
};

export const Mdx = ({ code }: { code: string }) => {
  const Component = useMDXComponent(code);

  return <Component components={components} />;
};
