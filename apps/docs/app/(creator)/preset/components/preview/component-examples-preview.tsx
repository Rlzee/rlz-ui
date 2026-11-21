"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import { demoPaths } from "@rlz/ui/components/examples";

/* Components: render every example of the selected component from demoPaths. */
export function ComponentExamplesPreview({
  slug,
}: {
  slug: string;
  name: string;
}) {
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
