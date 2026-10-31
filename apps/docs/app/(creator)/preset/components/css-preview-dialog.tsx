"use client";

import * as React from "react";
import type { RegistryPreset } from "@rlz/registry";

import { Dialog } from "@rlz/ui/components/ui/dialog";
import { Button } from "@rlz/ui/components/ui/button";
import { FileCode } from "lucide-react";

import { CodeViewer } from "./code-viewer";
import { themeCss } from "../lib/preset-css";

/**
 * What the foundations are worth where it counts: the sheet a consuming app gets
 * once this draft is installed. The Creator paints its own playground live, but a
 * preset is not worn by the Creator - it is written into `globals.css`, so this
 * shows that text instead of a second mock-up, from the same draft.
 */
export function CssPreviewDialog({
  name,
  preset,
}: {
  name: string;
  preset: RegistryPreset;
}) {
  // Recomputed as the draft moves, so the preview is never a snapshot.
  const code = React.useMemo(() => themeCss(preset), [preset]);

  return (
    <Dialog>
      <Dialog.Trigger render={<Button variant="ghost" size="sm" />}>
        <FileCode />
        CSS
      </Dialog.Trigger>
      <Dialog.Popup className="max-w-3xl">
        <Dialog.Header>
          <Dialog.Title>{name}</Dialog.Title>
          <Dialog.Description>
            The theme your app reads from these foundations: light values under{" "}
            <code className="font-mono text-xs">:root</code>, dark values under{" "}
            <code className="font-mono text-xs">.dark</code>. Every color, radius
            and spacing utility resolves through them.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="p-0">
          <CodeViewer code={code} lang="css" />
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  );
}
