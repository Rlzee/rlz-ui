"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { captureAnimationSnapshot } from "../lib/animation-snapshot";
import type { PreviewPatch } from "../lib/preset-styles";

export function useAnimationSnapshot(
  entry: string,
  slot: string | undefined,
  patches: PreviewPatch[]
) {
  const sourceRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [snapshot, setSnapshot] = useState<HTMLElement | null>(null);
  const [captureError, setCaptureError] = useState("");

  useEffect(() => {
    setSnapshot(null);
    setCaptureError("");
    if (!entry || !slot || !sourceRef.current) return;

    return captureAnimationSnapshot({
      source: sourceRef.current,
      slot,
      patches,
      onCapture: setSnapshot,
      onError: setCaptureError,
    });
  }, [entry, slot, patches]);

  useLayoutEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    target.replaceChildren();
    if (snapshot) target.appendChild(snapshot);
  }, [snapshot]);

  return { sourceRef, targetRef, snapshot, captureError };
}
