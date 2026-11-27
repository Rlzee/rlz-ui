"use client";

import { createContext } from "react";
import type { PlaygroundState } from "../playground-state";

/** Also reaches previews opened through a style group, not just Selected. */
export const SourcePreviewAppliedContext = createContext<
  (edits: PlaygroundState["edits"]) => void
>(() => {});
