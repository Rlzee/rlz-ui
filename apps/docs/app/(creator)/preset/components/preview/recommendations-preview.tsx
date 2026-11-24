"use client";

import type { RegistryPreset } from "@rlz/registry";

import { Card } from "@rlz/ui/components/ui/card";
import { cn } from "@rlz/ui/lib/cn";

import { EmptyState, PreviewSection } from "./preview-shell";

/* Recommendations: the three recommended typefaces. Icons are not previewed. */
export function RecommendationsPreview({ preset }: { preset: RegistryPreset }) {
  const typography = preset.recommendations?.typography;

  if (!typography) {
    return <EmptyState>No font recommendations in this preset.</EmptyState>;
  }

  const samples = [
    {
      key: "heading",
      label: "Heading",
      font: typography.fontHeading,
      className: "text-3xl font-semibold",
      text: "Grumpy wizards make toxic brew",
    },
    {
      key: "sans",
      label: "Sans",
      font: typography.fontSans,
      className: "text-base",
      text: "The quick brown fox jumps over the lazy dog.",
    },
    {
      key: "mono",
      label: "Mono",
      font: typography.fontMono,
      className: "text-sm",
      text: "const preset = definePreset({ base })",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-4">
      {samples.map((sample) => (
        <PreviewSection
          key={sample.key}
          title={sample.label}
          value={sample.font ?? "—"}
        >
          <Card className="border-sidebar-border">
            <Card.Body>
              <p
                className={cn("text-foreground", sample.className)}
                style={sample.font ? { fontFamily: sample.font } : undefined}
              >
                {sample.text}
              </p>
            </Card.Body>
          </Card>
        </PreviewSection>
      ))}
    </div>
  );
}
