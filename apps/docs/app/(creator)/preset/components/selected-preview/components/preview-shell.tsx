"use client";

import * as React from "react";

import { cn } from "@rlz/ui/lib/cn";

/** The centered placeholder shown when there is nothing to preview. */
export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-muted-foreground flex h-full items-center justify-center p-6 text-center text-sm">
      {children}
    </div>
  );
}

/** A titled block of the live preview, with an optional value read on the right. */
export function PreviewSection({
  title,
  value,
  children,
  className,
}: {
  title: string;
  value?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        {value !== undefined && (
          <span className="text-muted-foreground font-mono text-xs">{value}</span>
        )}
      </header>
      {children}
    </section>
  );
}
