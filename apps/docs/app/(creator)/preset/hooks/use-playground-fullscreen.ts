"use client";

import { useCallback, useEffect, useState } from "react";

export function usePlaygroundFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    onChange();
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const playground = document.getElementById("playground");
    if (!playground) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void playground.requestFullscreen();
  }, []);

  return { isFullscreen, toggleFullscreen };
}
