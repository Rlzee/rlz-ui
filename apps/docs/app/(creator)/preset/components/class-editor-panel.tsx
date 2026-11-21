"use client";

import * as React from "react";
import { useAtomValue } from "jotai";
import { useIsMac } from "@/hooks/use-is-mac";
import { Button } from "@rlz/ui/components/ui/button";
import { Kbd } from "@rlz/ui/components/ui/kbd";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { RotateCcw } from "lucide-react";
import { presetBuilderAtom } from "../preset-builder";
import {
  classEditorRequestAtom,
  type ClassEditorRequest,
} from "../lib/class-editor-state";
import { TailwindCodeEditor } from "./tailwind-code-editor";
import { TailwindClassExplorer } from "./tailwind-class-explorer";

export function ClassEditorPanel({ onClose }: { onClose: () => void }) {
  const request = useAtomValue(classEditorRequestAtom);
  if (!request) return null;
  return (
    <ClassEditorSession key={request.id} request={request} onClose={onClose} />
  );
}

function ClassEditorSession({
  request,
  onClose,
}: {
  request: ClassEditorRequest;
  onClose: () => void;
}) {
  const preset = useAtomValue(presetBuilderAtom);
  const isMac = useIsMac();
  const [draft, setDraft] = React.useState(request.initial);
  const [insertRequest, setInsertRequest] = React.useState<{
    id: number;
    text: string;
  } | null>(null);
  const insertCounter = React.useRef(0);
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
  const apply = () => {
    request.onApply(draft.trim());
    onClose();
  };
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-medium">{request.label}</h2>
          <p className="text-xs text-muted-foreground">
            {request.status} · Edit Tailwind classes
          </p>
        </div>
        {request.builtIn && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setDraft(request.builtIn)}
          >
            <RotateCcw /> Restore built-in
          </Button>
        )}
      </div>
      <ScrollArea className="min-h-0 flex-1 **:data-[slot=scroll-area-scrollbar]:hidden">
        <div className="grid min-w-0 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
          <div className="min-w-0">
            <TailwindCodeEditor
              value={draft}
              onChange={setDraft}
              onApply={apply}
              colorTokens={colorTokens}
              insertRequest={insertRequest}
            />
          </div>
          <TailwindClassExplorer
            colorTokens={colorTokens}
            onInsert={(text) =>
              setInsertRequest({ id: ++insertCounter.current, text })
            }
          />
        </div>
      </ScrollArea>
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border px-4 py-3">
        <div className="hidden flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:flex">
          <span className="inline-flex items-center gap-1">
            <Kbd>{isMac ? "Cmd" : "Ctrl"}</Kbd>
            <span>+</span>
            <Kbd>Space</Kbd>
            <span>Suggestions</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Kbd>{isMac ? "Cmd" : "Ctrl"}</Kbd>
            <span>+</span>
            <Kbd>Enter</Kbd>
            <span>Apply</span>
          </span>
        </div>
        <div className="ml-auto flex gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="outline" onClick={apply}>
            Apply classes
          </Button>
        </div>
      </div>
    </div>
  );
}
