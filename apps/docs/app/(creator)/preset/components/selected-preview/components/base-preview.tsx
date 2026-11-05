"use client";

import { useAtom } from "jotai";

import { Card } from "@rlz/ui/components/ui/card";

import { presetBuilderAtom } from "../../../preset-builder";

import { PreviewSection } from "./preview-shell";

/* Base: live visuals that react to radius, letter spacing and spacing. */
export function BasePreview() {
  const [preset] = useAtom(presetBuilderAtom);
  const { radius, spacing } = preset.base.layout;
  const { letterSpacing } = preset.base.typography;

  return (
    <div className="flex flex-col gap-8 p-4">
      <PreviewSection title="Radius" value={`${radius}rem`}>
        <Card className="border-sidebar-border">
          <Card.Body className="flex flex-wrap items-end gap-4">
            {[
              { label: "sm", r: radius * 0.5 },
              { label: "base", r: radius },
              { label: "lg", r: radius * 1.5 },
              { label: "full", r: 9999 },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5">
                <div
                  className="bg-primary/90 h-16 w-16"
                  style={{ borderRadius: `${item.r}px` }}
                />
                <span className="text-muted-foreground text-[11px]">
                  {item.label}
                </span>
              </div>
            ))}
          </Card.Body>
        </Card>
      </PreviewSection>

      <PreviewSection title="Letter Spacing" value={`${letterSpacing}em`}>
        <Card className="border-sidebar-border">
          <Card.Body>
            <p
              className="text-foreground text-2xl font-semibold"
              style={{ letterSpacing: `${letterSpacing}em` }}
            >
              The quick brown fox jumps
            </p>
            <p
              className="text-muted-foreground mt-2 text-sm"
              style={{ letterSpacing: `${letterSpacing}em` }}
            >
              Sphinx of black quartz, judge my vow — 0123456789.
            </p>
          </Card.Body>
        </Card>
      </PreviewSection>

      <PreviewSection title="Spacing" value={`${spacing}rem`}>
        <Card className="border-sidebar-border">
          {/* Padding is the token under test, so it overrides the body padding. */}
          <Card.Body style={{ padding: `${spacing}rem` }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing}rem` }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-primary/15 text-muted-foreground flex items-center justify-center text-xs"
                  style={{
                    padding: `${spacing}rem`,
                    borderRadius: `${radius}rem`,
                  }}
                >
                  Item {i + 1}
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </PreviewSection>
    </div>
  );
}
