"use client";

import { cn } from "@rlz/ui/lib/cn";

/**
 * One line of the sheet as it reads in the values-only editor: locked to the text
 * column, optionally indented, muted (a comment) or spaced (a declaration).
 */
export function Line({
  children,
  indent = 0,
  muted,
  gap,
}: {
  children: React.ReactNode;
  indent?: 0 | 1 | 2;
  muted?: boolean;
  gap?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-7 items-center whitespace-pre",
        muted && "text-muted-foreground",
        gap && "gap-2",
        indent === 1 && "pl-4",
        indent === 2 && "pl-8"
      )}
    >
      {children}
    </div>
  );
}
