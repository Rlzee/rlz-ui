"use client";

import type * as React from "react";
import { CopyButton } from "@/components/copy-button";
import { Card } from "@rlz/ui/components/ui/card";
import { cn } from "@rlz/ui/lib/cn";

export function CodeBlock({
  children,
  className,
  rawCode,
}: {
  children: React.ReactNode;
  className?: string;
  rawCode?: string;
}) {
  return (
    <Card className={cn("p-0 mt-6 relative rounded-md gap-0", className)}>
      <CopyButton className="absolute right-2 top-2 z-2" code={rawCode ?? ""} />
      {children}
    </Card>
  );
}
