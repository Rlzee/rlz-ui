"use client";

import { useContext } from "react";
import dynamic from "next/dynamic";
import type { PlaygroundState } from "../../lib/playground-state";
import { playgroundExamples } from "../../lib/playground-examples";
import { isSourcePreviewComponent } from "../../lib/source-preview/catalog";
import { SourcePreviewAppliedContext } from "../../lib/source-preview/applied-context";
import { EmptyState } from "./preview-shell";

const SourceComponentPreview = dynamic(
  () =>
    import("./source-component-preview").then(
      (module) => module.SourceComponentPreview
    ),
  { ssr: false }
);

export function ComponentExamplesPreview({
  slug,
  edits,
}: Pick<PlaygroundState, "edits"> & { slug: string }) {
  const onApplied = useContext(SourcePreviewAppliedContext);
  if (!isSourcePreviewComponent(slug) || !playgroundExamples(slug).length)
    return <EmptyState>No example available for this component.</EmptyState>;
  return (
    <SourceComponentPreview
      key={slug}
      slug={slug}
      edits={edits}
      onApplied={onApplied}
    />
  );
}
