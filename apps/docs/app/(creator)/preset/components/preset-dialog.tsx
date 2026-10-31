"use client";

import * as React from "react";
import { useAtomValue, useSetAtom } from "jotai";
import type { RegistryPreset } from "@rlz/registry";

import { Dialog } from "@rlz/ui/components/ui/dialog";
import { Button } from "@rlz/ui/components/ui/button";
import { Braces, Check, Download, Pencil, Upload, X } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { Pre } from "@/components/Pre";

import { presetBuilderAtom, componentEditsAtom } from "../preset-builder";

const PRE_CLASS = "font-mono text-xs wrap-break-word";

/**
 * Keeps the identity of the draft. `type`, `id`, `version` and `path` belong to the
 * registry, not to the design: what is typed in the JSON editor or read from an
 * imported file changes the preset's look, never who it is.
 */
function keepIdentity(
  incoming: RegistryPreset,
  preset: RegistryPreset
): RegistryPreset {
  return {
    ...incoming,
    type: preset.type,
    id: preset.id,
    version: preset.version,
    path: preset.path,
  };
}

// A downloadable name out of the preset's own name, or its registry key when the
// name was cleared - and never a path separator.
function exportFileName(preset: RegistryPreset) {
  const base = preset.name.trim() || preset.id || "preset";

  return `${base.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^[-.]+|[-.]+$/g, "") || "preset"}.json`;
}

/**
 * Highlighted preset JSON, through the same highlightCode helper as the docs
 * code blocks. This lives in a child component so it only runs while the
 * dialog is mounted, and shiki is imported on demand to keep it out of the
 * initial bundle.
 */
function PresetCode({ code }: { code: string }) {
  const [highlighted, setHighlighted] = React.useState("");

  React.useEffect(() => {
    let active = true;

    import("@/lib/highlight").then(async ({ highlightCode }) => {
      const html = await highlightCode(code, "json");

      if (active) {
        setHighlighted(html);
      }
    });

    return () => {
      active = false;
    };
  }, [code]);

  return (
    <>
      <CopyButton className="absolute right-5 top-4 z-2" code={code} />
      {highlighted ? (
        <Pre
          className={PRE_CLASS}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      ) : (
        <Pre className={PRE_CLASS}>{code}</Pre>
      )}
    </>
  );
}

export function PresetDialog({
  name,
  preset,
}: {
  name: string;
  preset: RegistryPreset;
}) {
  // Merge the live per-component edits into the exported preset so the JSON
  // carries Creator customizations (only when present, to avoid empty noise).
  const edits = useAtomValue(componentEditsAtom);
  const exported: RegistryPreset = Object.keys(edits).length
    ? { ...preset, components: edits }
    : preset;

  // Single formatted source, used for both the display and the copy button.
  const code = JSON.stringify(exported, null, 2);

  const setPreset = useSetAtom(presetBuilderAtom);

  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(code);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Keep the editor in sync with the live preset while not editing.
  React.useEffect(() => {
    if (!editing) setDraft(code);
  }, [code, editing]);

  function startEdit() {
    setDraft(code);
    setError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setError(null);
    setEditing(false);
  }

  function applyEdit() {
    try {
      const parsed = JSON.parse(draft) as RegistryPreset;
      setPreset(keepIdentity(parsed, preset));
      setError(null);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  }

  function triggerImport() {
    fileInputRef.current?.click();
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset immediately so the same file can be picked again later.
    event.target.value = "";
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text()) as RegistryPreset;
      setPreset(keepIdentity(parsed, preset));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON file");
    }
  }

  // The download carries the same formatted JSON that is shown and copied, live
  // Creator edits included.
  function handleExport() {
    const url = URL.createObjectURL(
      new Blob([code], { type: "application/json" })
    );
    const link = document.createElement("a");

    link.href = url;
    link.download = exportFileName(exported);
    link.click();

    // Revoking too early cancels the download, so the click is allowed to land.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <Dialog>
      <Dialog.Trigger render={<Button variant="ghost" size="sm" />}>
        <Braces />
        Preset
      </Dialog.Trigger>
      <Dialog.Popup className="max-w-3xl">
        <Dialog.Header>
          <Dialog.Title>{name}</Dialog.Title>
          <Dialog.Description>
            {editing
              ? "Edit the JSON and apply it back to the preset. Its type, id, version and path stay as they are."
              : "Registry preset definition, formatted and ready to copy or export."}
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className={editing ? undefined : "p-0"}>
          {editing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                spellCheck={false}
                rows={18}
                className="min-h-80 w-full resize-y font-mono text-xs outline-none"
              />
              {error && (
                <span className="text-destructive text-xs">{error}</span>
              )}
            </div>
          ) : (
            <>
              <PresetCode code={code} />
              {error && (
                <span className="text-destructive block px-6 pb-3 text-xs">
                  {error}
                </span>
              )}
            </>
          )}
        </Dialog.Body>
        <Dialog.Footer>
          {editing ? (
            <>
              <Button variant="ghost" onClick={cancelEdit}>
                <X />
                Cancel
              </Button>
              <Button onClick={applyEdit}>
                <Check />
                Apply
              </Button>
            </>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={handleImport}
              />
              <Button variant="outline" onClick={handleExport}>
                <Download />
                Export
              </Button>
              <Button variant="outline" onClick={triggerImport}>
                <Upload />
                Import
              </Button>
              <Button variant="outline" onClick={startEdit}>
                <Pencil />
                Edit JSON
              </Button>
            </>
          )}
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
}
