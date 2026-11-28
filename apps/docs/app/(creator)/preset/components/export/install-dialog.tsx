"use client";

import { useAtomValue } from "jotai";
import type { RegistryPreset } from "@rlz/registry";
import { Button } from "@rlz/ui/components/ui/button";
import { Dialog } from "@rlz/ui/components/ui/dialog";
import { Download } from "lucide-react";

import { componentEditsAtom } from "../../state/preset-builder";
import { CodeViewer } from "../shared/code-viewer";
import { ExportButton, exportFileName } from "./export-button";

export function InstallDialog({ preset }: { preset: RegistryPreset }) {
  const edits = useAtomValue(componentEditsAtom);
  const exported: RegistryPreset = {
    ...preset,
    components: Object.keys(edits).length ? edits : undefined,
  };
  const fileName = exportFileName(exported, "json");

  return (
    <Dialog>
      <Dialog.Trigger render={<Button size="sm" />}>
        <Download />
        Install
      </Dialog.Trigger>
      <Dialog.Popup className="max-w-2xl">
        <Dialog.Header>
          <Dialog.Title>Install your preset</Dialog.Title>
          <Dialog.Description>
            Bring your Creator theme and component customizations into your project.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-6">
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">1. Export your preset</h3>
            <p className="text-muted-foreground text-sm">
              Download the JSON file and move it to the root of your project.
              It includes your latest theme and component edits.
            </p>
            <div>
              <ExportButton
                preset={exported}
                content={JSON.stringify(exported, null, 2)}
                extension="json"
                mediaType="application/json"
              >
                Export preset
              </ExportButton>
            </div>
          </section>
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">2. Initialize with your preset</h3>
            <p className="text-muted-foreground text-sm">
              Run this command from your project root to apply the theme and
              configure rlz-ui.
            </p>
            <div className="relative overflow-hidden rounded-lg border">
              <CodeViewer
                compact
                code={`npx rlz@latest init --preset ./${fileName}`}
                lang="bash"
              />
            </div>
          </section>
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">3. Add your components</h3>
            <p className="text-muted-foreground text-sm">
              New components use your saved preset automatically. Replace button
              with the component you want to install.
            </p>
            <div className="relative overflow-hidden rounded-lg border">
              <CodeViewer compact code="npx rlz@latest add button" lang="bash" />
            </div>
            <p className="text-muted-foreground text-sm">
              To restyle an already installed component, add it again and confirm
              replacement. This replaces its file, so back up any local changes first.
            </p>
          </section>
          <p className="text-muted-foreground text-xs">
            Keep rlz.config.json and the snapshot in .rlz/presets/ with your
            project so future installs use the same preset.
          </p>
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  );
}
