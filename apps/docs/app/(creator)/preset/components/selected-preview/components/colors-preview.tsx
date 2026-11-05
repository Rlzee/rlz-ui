"use client";

import * as React from "react";
import { useAtom } from "jotai";
import { useTheme } from "next-themes";

import { Card } from "@rlz/ui/components/ui/card";

import { presetBuilderAtom } from "../../../preset-builder";

import { PreviewSection } from "./preview-shell";

/* Colors: every token as a swatch square carrying its own info. */
export function ColorsPreview() {
  const [preset] = useAtom(presetBuilderAtom);
  const { resolvedTheme } = useTheme();

  // Match the editor: only trust the resolved theme once mounted so the first
  // client render stays in sync with the server HTML.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="flex flex-col gap-8 p-4">
      {preset.colors.map((section) => (
        <PreviewSection key={section.id} title={section.name}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {section.tokens.map((token) => {
              const current = isDark ? token.dark : token.light;

              return (
                <Card
                  key={token.cssVar}
                  className="gap-0 overflow-hidden rounded-md py-0"
                >
                  <div
                    className="h-16 w-full border-b border-border/60"
                    style={{ background: current.value }}
                  />
                  <Card.Body className="flex flex-col gap-0.5 p-2">
                    <span className="truncate text-xs font-medium">
                      {token.label}
                    </span>
                    <span className="text-muted-foreground truncate font-mono text-[11px]">
                      {token.cssVar}
                    </span>
                    <span className="text-muted-foreground truncate font-mono text-[11px]">
                      {current.value}
                    </span>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </PreviewSection>
      ))}
    </div>
  );
}
