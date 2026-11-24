"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { useTheme } from "next-themes";
import { useSelectedComponent } from "@/hooks/use-selected-component";
import {
  PLAYGROUND_READY,
  PLAYGROUND_STATE,
  type PlaygroundState,
} from "../../lib/playground-state";
import {
  componentEditsAtom,
  presetBuilderAtom,
} from "../../state/preset-builder";
import {
  selectedStyleGroupAtom,
  styleGroupsAtom,
} from "../../state/style-group-state";

/** The frame has its own document: all portals, styles and focus stay on its canvas. */
export function PlaygroundFrame() {
  const frame = useRef<HTMLIFrameElement>(null);
  const preset = useAtomValue(presetBuilderAtom);
  const edits = useAtomValue(componentEditsAtom);
  const groups = useAtomValue(styleGroupsAtom);
  const selectedGroup = useAtomValue(selectedStyleGroupAtom);
  const [selected] = useSelectedComponent();
  const { resolvedTheme } = useTheme();

  const sync = useCallback(() => {
    const state: PlaygroundState = {
      preset,
      edits,
      selected: selected ? { id: selected.id } : null,
      groups,
      selectedGroup,
      dark: resolvedTheme === "dark",
    };
    frame.current?.contentWindow?.postMessage(
      { type: PLAYGROUND_STATE, state },
      window.location.origin
    );
  }, [preset, edits, selected, groups, selectedGroup, resolvedTheme]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (
        event.origin === window.location.origin &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === PLAYGROUND_READY
      )
        sync();
    }
    window.addEventListener("message", onMessage);
    sync();
    return () => window.removeEventListener("message", onMessage);
  }, [sync]);

  return (
    <iframe
      ref={frame}
      src="/preset/preview"
      title="Preset playground"
      className="min-h-0 w-full flex-1 border-0 bg-background"
      onLoad={sync}
    />
  );
}
