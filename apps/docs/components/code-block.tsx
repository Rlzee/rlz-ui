"use client";

import type * as React from "react";
import { CopyButton } from "@/components/copy-button";
import { Card } from "@rlz/ui/components/ui/card";
import { cn } from "@rlz/ui/lib/cn";

function extractCode(children: React.ReactNode): string {
  const extract = (node: any): string => {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(extract).join("");
    if (node?.props?.children) return extract(node.props.children);
    return "";
  };
  return extract(children);
}

export function CodeBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("p-0 mt-6 relative rounded-md gap-0", className)}>
      <CopyButton
        className="absolute right-2 top-2 z-2"
        code={extractCode(children)}
      />
      {children}
    </Card>
  );
}
