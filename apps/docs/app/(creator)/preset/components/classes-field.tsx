"use client";

import * as React from "react";
import { useAtomValue } from "jotai";
import { presetBuilderAtom } from "../preset-builder";

import { Button } from "@rlz/ui/components/ui/button";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Dialog } from "@rlz/ui/components/ui/dialog";
import { Pencil, RotateCcw } from "lucide-react";
import { TailwindCodeEditor } from "./tailwind-code-editor";
import { TailwindClassExplorer } from "./tailwind-class-explorer";

export type ClassesFieldTarget = {
  subject: string;
  part?: string;
  builtIn: string;
  override?: string;
};

/**
 * Shared class editor for component parts, variant values, and preset utilities.
 * The dialog uses a private draft; only Apply writes to the existing onClasses
 * callback. The compact field is a read-only preview, not a second editor.
 */
export function ClassesField({
  target,
  onClasses,
  onRemove,
  autoFocus,
}: {
  target: ClassesFieldTarget;
  onClasses: (classes: string) => void;
  onRemove?: () => void;
  autoFocus?: boolean;
}) {
  const { subject, part, builtIn, override } = target;
  const preset = useAtomValue(presetBuilderAtom);
  const colorTokens = React.useMemo(
    () => [
      ...new Set(
        preset.colors.flatMap((group) =>
          group.tokens.map((token) => token.cssVar.replace(/^--/, ""))
        )
      ),
    ],
    [preset.colors]
  );
  const effective = override ?? builtIn;
  const overridden = override !== undefined && override !== builtIn;
  const status = builtIn
    ? overridden
      ? "Custom classes"
      : "Built-in classes"
    : effective
    ? "Utility of the preset's own"
    : "Nothing applied yet";

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogDraft, setDialogDraft] = React.useState(effective);
  const [insertRequest, setInsertRequest] = React.useState<{
    id: number;
    text: string;
  } | null>(null);
  const insertCounter = React.useRef(0);

  function openEditor() {
    setDialogDraft(effective);
    setInsertRequest(null);
    setDialogOpen(true);
  }

  function applyEditor() {
    onClasses(dialogDraft.trim());
    setDialogOpen(false);
  }

  const label = part ? `${subject} / ${part}` : subject;

  return (
    <div className="flex flex-col gap-1.5">
      {part && (
        <span className="text-xs font-medium text-muted-foreground">
          {part}
        </span>
      )}

      <InputGroup
        className={
          "group relative !h-14 min-w-0 overflow-hidden border-border/60 " +
          "bg-transparent p-0 shadow-none transition-colors " +
          "hover:border-border hover:bg-accent/20"
        }
      >
        <pre
          aria-hidden="true"
          className={
            "pointer-events-none absolute inset-0 m-0 overflow-hidden " +
            "whitespace-pre-wrap break-all px-2.5 py-1.5 font-mono " +
            "text-xs leading-5 text-foreground/75 " +
            "[mask-image:linear-gradient(to_bottom,black_10%,transparent_100%)] " +
            "transition-opacity group-hover:opacity-35 group-focus-within:opacity-35"
          }
        >
          {effective || `Classes to @apply in ${part ?? subject}`}
        </pre>
        <Button
          type="button"
          variant="ghost"
          autoFocus={autoFocus}
          aria-label={`Edit classes of ${label}`}
          title={`Edit classes of ${label}`}
          onClick={openEditor}
          className={
            "absolute inset-0 z-10 flex h-full w-full items-center justify-center " +
            "rounded-[inherit] bg-transparent text-xs font-medium " +
            "text-foreground/80 opacity-0 transition-opacity " +
            "hover:bg-background/30 hover:opacity-100 " +
            "focus-visible:bg-background/30 focus-visible:opacity-100 " +
            "max-md:opacity-100"
          }
        >
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/95 px-2.5 py-1 shadow-sm">
            <Pencil className="size-3.5" />
            Edit classes
          </span>
        </Button>
      </InputGroup>

      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">{status}</span>
        {onRemove ? (
          <Button
            variant="ghost"
            size="xs"
            className="text-[11px]"
            onClick={onRemove}
          >
            Remove
          </Button>
        ) : (
          overridden && (
            <Button
              variant="ghost"
              size="xs"
              className="text-[11px]"
              onClick={() => onClasses(builtIn)}
            >
              Reset
            </Button>
          )
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Popup className="max-w-5xl">
          <Dialog.Header>
            <Dialog.Title>Class editor</Dialog.Title>
            <Dialog.Description>
              {label} · Edit Tailwind classes. Changes are applied to the preset
              only when you confirm.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Body className="gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">{status}</span>
              {builtIn && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setDialogDraft(builtIn)}
                >
                  <RotateCcw />
                  Restore built-in
                </Button>
              )}
            </div>
            <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
              <TailwindCodeEditor
                value={dialogDraft}
                onChange={setDialogDraft}
                onApply={applyEditor}
                colorTokens={colorTokens}
                insertRequest={insertRequest}
              />
              <TailwindClassExplorer
                colorTokens={colorTokens}
                onInsert={(text) =>
                  setInsertRequest({ id: ++insertCounter.current, text })
                }
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Ctrl/Cmd + Space for suggestions · Ctrl/Cmd + Enter to apply ·
              Escape to close without applying.
            </p>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button type="button" variant="ghost" />}>
              Cancel
            </Dialog.Close>
            <Button type="button" onClick={applyEditor}>
              Apply classes
            </Button>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog>
    </div>
  );
}
