"use client";

import type * as React from "react";
import { CopyButton } from "@/components/copy-button";
import { Card } from "@rlz/ui/components/ui/card";

function extractCode(children: React.ReactNode): string {
  const extract = (node: any): string => {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(extract).join("");
    if (node?.props?.children) return extract(node.props.children);
    return "";
  };
  return extract(children);
}

export function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <Card className="p-0 mt-6 relative rounded-md">
      <CopyButton
        className="absolute right-2 top-2"
        code={extractCode(children)}
      />
      {children}
    </Card>
  );
}
