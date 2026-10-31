"use client";

import * as React from "react";
import { useSetAtom } from "jotai";
import type { RegistryPreset } from "@rlz/registry";

import { Dialog } from "@rlz/ui/components/ui/dialog";
import { Button } from "@rlz/ui/components/ui/button";
import { Check, FileCode, Pencil, X } from "lucide-react";

import { CodeViewer } from "./code-viewer";
import { CssValueEditor } from "./css-value-editor";
import { ExportButton } from "./export-button";
import { themeCss } from "../lib/preset-css";
import { presetBuilderAtom } from "../preset-builder";

/**
 * What the foundations are worth where it counts: the sheet a consuming app gets
 * once this draft is installed. The Creator paints its own playground live, but a
 * preset is not worn by the Creator - it is written into `globals.css`, so this
 * shows that text instead of a second mock-up, from the same draft.
 *
 * The sheet can also be edited, values only: the structure it is written in belongs
 * to the design system, and the two modes are two renderings of one description
 * (`cssSheet`), so what is read is what is written.
 */
export function CssPreviewDialog({
  name,
  preset,
}: {
  name: string;
  preset: RegistryPreset;
}) {
  const setPreset = useSetAtom(presetBuilderAtom);

  const [editing, setEditing] = React.useState(false);

  // The draft as editing found it. A value written here lands on the live draft as
  // soon as its field is left, so Cancel cannot throw away an unsaved buffer - it
  // has to hand the draft back, which is what this snapshot is for.
  const [before, setBefore] = React.useState<RegistryPreset | null>(null);

  // Recomputed as the draft moves, so the preview is never a snapshot.
  const code = React.useMemo(() => themeCss(preset), [preset]);

  function startEdit() {
    setBefore(preset);
    setEditing(true);
  }

  function stopEdit() {
    setBefore(null);
    setEditing(false);
  }

  function cancelEdit() {
    if (before) setPreset(before);
    stopEdit();
  }

  return (
    <Dialog onOpenChange={(open) => !open && stopEdit()}>
      <Dialog.Trigger render={<Button variant="ghost" size="sm" />}>
        <FileCode />
        CSS
      </Dialog.Trigger>
      <Dialog.Popup className="max-w-3xl">
        <Dialog.Header>
          <Dialog.Title>{name}</Dialog.Title>
          <Dialog.Description>
            {editing ? (
              "Only the values can be changed here. The selectors, the custom property names and the @apply keyword are what the design system declares, and every component reads them by those names."
            ) : (
              <>
                The theme your app reads from these foundations: light values under{" "}
                <code className="font-mono text-xs">:root</code>, dark values under{" "}
                <code className="font-mono text-xs">.dark</code>. Every color, radius
                and spacing utility resolves through them.
              </>
            )}
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="p-0">
          {editing ? (
            <CssValueEditor preset={preset} />
          ) : (
            <CodeViewer code={code} lang="css" />
          )}
        </Dialog.Body>
        <Dialog.Footer>
          {editing ? (
            <>
              <Button variant="ghost" onClick={cancelEdit}>
                <X />
                Cancel
              </Button>
              <Button onClick={stopEdit}>
                <Check />
                Apply
              </Button>
            </>
          ) : (
            <>
              {/* The download carries the same sheet that is on screen, so the file
                  and the preview cannot disagree. */}
              <ExportButton
                preset={preset}
                content={code}
                extension="css"
                mediaType="text/css"
              />
              <Button variant="outline" onClick={startEdit}>
                <Pencil />
                Edit values
              </Button>
            </>
          )}
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
}
