"use client";

import { useEffect, useState } from "react";
import { usePlaygroundCss } from "../../hooks/use-playground-css";
import { foundationCss, themeUtilitiesCss } from "../../lib/preset-css";
import { playgroundCandidates } from "../../lib/playground-tailwind";
import {
  PLAYGROUND_READY,
  PLAYGROUND_STATE,
  type PlaygroundState,
} from "../../lib/playground-state";
import { SelectedPreview } from "./selected-preview";
import { SourcePreviewAppliedContext } from "../../lib/source-preview/applied-context";

export function PlaygroundCanvas() {
  const [state, setState] = useState<PlaygroundState>();

  useEffect(() => {
    if (window.parent === window) return;
    function onMessage(event: MessageEvent) {
      if (
        event.origin === window.location.origin &&
        event.source === window.parent &&
        event.data?.type === PLAYGROUND_STATE
      )
        setState(event.data.state);
    }
    window.addEventListener("message", onMessage);
    window.parent.postMessage(
      { type: PLAYGROUND_READY },
      window.location.origin
    );
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!state)
    return (
      <p className="p-4 text-sm text-muted-foreground">
        Waiting for the Creator…
      </p>
    );

  return <CanvasContent state={state} />;
}

function CanvasContent({ state }: { state: PlaygroundState }) {
  const { preset, edits, dark } = state;
  const [appliedSourceEdits, setAppliedSourceEdits] = useState<
    PlaygroundState["edits"]
  >({});
  // A rejected source update must not strip the classes still used by the last
  // committed components from the next Tailwind compilation.
  const { css, error } = usePlaygroundCss(
    themeUtilitiesCss(preset),
    [
      ...new Set([
        ...playgroundCandidates(edits),
        ...playgroundCandidates(appliedSourceEdits),
      ]),
    ]
      .sort()
      .join("\n")
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
  }, [dark]);

  return (
    <>
      <style>{`${foundationCss(preset)}
        html { font-family: var(--font-sans); }
        body { background-color: var(--background); color: var(--foreground); }
      `}</style>
      <style>{css}</style>
      {error && (
        <p role="status" className="border-b p-3 text-xs">
          Preview CSS could not be rebuilt. Keeping the last valid styles:{" "}
          {error}
        </p>
      )}
      <SourcePreviewAppliedContext.Provider value={setAppliedSourceEdits}>
        <SelectedPreview state={state} />
      </SourcePreviewAppliedContext.Provider>
    </>
  );
}
