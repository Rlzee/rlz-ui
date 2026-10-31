"use client";

import type { RegistryPreset } from "@rlz/registry";

import { Button, type ButtonProps } from "@rlz/ui/components/ui/button";
import { Download } from "lucide-react";

/**
 * The Creator's one download: whatever a dialog shows is what lands on disk, so
 * the file can never disagree with the text on screen. Only the content, its type
 * and the extension change from one dialog to the next - the name always comes
 * from the preset being exported.
 */
export function ExportButton({
  preset,
  content,
  extension,
  mediaType,
  children = "Export",
  ...props
}: ButtonProps & {
  preset: RegistryPreset;
  content: string;
  extension: string;
  mediaType: string;
}) {
  function download() {
    const url = URL.createObjectURL(new Blob([content], { type: mediaType }));
    const link = document.createElement("a");

    link.href = url;
    link.download = exportFileName(preset, extension);
    link.click();

    // Revoking too early cancels the download, so the click is allowed to land.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <Button variant="outline" onClick={download} {...props}>
      <Download />
      {children}
    </Button>
  );
}

// A downloadable name out of the preset's own name, or its registry key when the
// name was cleared - and never a path separator.
function exportFileName(preset: RegistryPreset, extension: string) {
  const base = preset.name.trim() || preset.id || "preset";
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");

  return `${slug || "preset"}.${extension}`;
}
