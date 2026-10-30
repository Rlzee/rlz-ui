"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useAtom, useAtomValue } from "jotai";
import { useTheme } from "next-themes";

import { demoPaths } from "@rlz/ui/components/examples";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { cn } from "@rlz/ui/lib/cn";

import { useSelectedComponent } from "@/hooks/use-selected-component";
import { getCapabilities } from "@/lib/component-capabilities";
import { componentEditsAtom, presetBuilderAtom } from "../preset-builder";
import { slugFromId } from "../lib/slug";
import { describeEdits } from "../lib/component-edits";

/**
 * First preview of the playground: reflects whatever is selected in the
 * explorer. Foundation entries (Colors, Base, Recommendations) get a bespoke
 * live preview driven by the draft preset, while a selected component renders
 * every one of its examples listed in `demoPaths`.
 */
export function SelectedPreview() {
  const [selected] = useSelectedComponent();

  return (
    // Internal scroll region, mirroring the properties panel: only the preview
    // body scrolls, the surrounding page stays put.
    <ScrollArea
      scrollFade
      className="min-h-0 flex-1 **:data-[slot=scroll-area-scrollbar]:hidden"
    >
      <PreviewContent selected={selected} />
    </ScrollArea>
  );
}

function PreviewContent({
  selected,
}: {
  selected: ReturnType<typeof useSelectedComponent>[0];
}) {
  if (!selected) {
    return (
      <EmptyState>Select an item in the explorer to preview it here.</EmptyState>
    );
  }

  switch (selected.id) {
    case "colors":
      return <ColorsPreview />;
    case "base":
      return <BasePreview />;
    case "recommendations":
      return <RecommendationsPreview />;
    default:
      return (
        <ComponentExamplesPreview
          slug={slugFromId(selected.id)}
          name={selected.name}
        />
      );
  }
}

// Last URL segment of a docs page (or the registry key itself) is the demo
// folder name used as a prefix when filtering `demoPaths`. (slugFromId lives in
// ../lib/slug so the properties panel shares the exact same lookup.)

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-muted-foreground flex h-full items-center justify-center p-6 text-center text-sm">
      {children}
    </div>
  );
}

function PreviewSection({
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

/* -------------------------------------------------------------------------- */
/* Colors: every token as a swatch square carrying its own info.              */
/* -------------------------------------------------------------------------- */

function ColorsPreview() {
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
                <div
                  key={token.cssVar}
                  className="bg-card overflow-hidden rounded-md border border-sidebar-border"
                >
                  <div
                    className="h-16 w-full border-b border-border/60"
                    style={{ background: current.value }}
                  />
                  <div className="flex flex-col gap-0.5 p-2">
                    <span className="truncate text-xs font-medium">
                      {token.label}
                    </span>
                    <span className="text-muted-foreground truncate font-mono text-[11px]">
                      {token.cssVar}
                    </span>
                    <span className="text-muted-foreground truncate font-mono text-[11px]">
                      {current.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </PreviewSection>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Base: live visuals that react to radius, letter spacing and spacing.       */
/* -------------------------------------------------------------------------- */

function BasePreview() {
  const [preset] = useAtom(presetBuilderAtom);
  const { radius, spacing } = preset.base.layout;
  const { letterSpacing } = preset.base.typography;

  return (
    <div className="flex flex-col gap-8 p-4">
      <PreviewSection title="Radius" value={`${radius}rem`}>
        <div className="bg-card flex flex-wrap items-end gap-4 rounded-md border border-sidebar-border p-5">
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
        </div>
      </PreviewSection>

      <PreviewSection title="Letter Spacing" value={`${letterSpacing}em`}>
        <div className="bg-card rounded-md border border-sidebar-border p-5">
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
        </div>
      </PreviewSection>

      <PreviewSection title="Spacing" value={`${spacing}rem`}>
        <div
          className="bg-card rounded-md border border-sidebar-border"
          style={{ padding: `${spacing}rem` }}
        >
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
        </div>
      </PreviewSection>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Recommendations: the three recommended typefaces. Icons are not previewed.  */
/* -------------------------------------------------------------------------- */

function RecommendationsPreview() {
  const [preset] = useAtom(presetBuilderAtom);
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
          <div className="bg-card rounded-md border border-sidebar-border p-5">
            <p
              className={cn("text-foreground", sample.className)}
              style={sample.font ? { fontFamily: sample.font } : undefined}
            >
              {sample.text}
            </p>
          </div>
        </PreviewSection>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components: render every example of the selected component from demoPaths. */
/* -------------------------------------------------------------------------- */

function ComponentExamplesPreview({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const edits = useAtomValue(componentEditsAtom);
  const capabilities = getCapabilities(slug);
  const edit = edits[slug];

  const entries = React.useMemo(() => {
    const prefix = `${slug}/`;

    return Object.entries(demoPaths)
      .filter(([, path]) => path === slug || path.startsWith(prefix))
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([key, path]) => ({ key, path }));
  }, [slug]);

  return (
    <div className="flex flex-col divide-y divide-border p-4">
      {entries.map(({ key, path }) => (
        <DemoBlock key={key} entry={path} label={variantLabel(path)} />
      ))}
    </div>
  );
}

function variantLabel(path: string) {
  const segment = path.split("/").pop() ?? path;
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

// Some `demoPaths` entries point at demos that have no file (e.g.
// "kbd/input-group"). next/dynamic would throw and take down the whole
// preview, so the loader falls back to this placeholder when a module is missing.
function MissingDemo() {
  return (
    <span className="text-muted-foreground text-xs">
      Preview not available
    </span>
  );
}

// Each example is centered and separated by a divider, with its name below,
// but rendered straight in the preview — no surrounding card.
function DemoBlock({ entry, label }: { entry: string; label: string }) {
  const Demo = React.useMemo(
    () =>
      dynamic(
        async () => {
          try {
            return await import(`@rlz/ui/components/examples/ui/${entry}`);
          } catch {
            return { default: MissingDemo };
          }
        },
        { ssr: false }
      ),
    [entry]
  );

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <Demo />
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
  );
}
