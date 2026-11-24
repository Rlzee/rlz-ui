"use client";

import { useEffect, useState } from "react";
import {
  compilePlaygroundCss,
  type TailwindSources,
} from "../lib/playground-tailwind";

let sources: Promise<TailwindSources> | undefined;
function loadSources() {
  sources ??= fetch("/preset/preview/styles")
    .then((response) => {
      if (!response.ok)
        throw new Error("Unable to load the preview stylesheet sources.");
      return response.json() as Promise<TailwindSources>;
    })
    .catch((error) => {
      sources = undefined;
      throw error;
    });
  return sources;
}

export function usePlaygroundCss(theme: string, candidateKey: string) {
  const [css, setCss] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let disposed = false;
    // Class editors can generate several intermediate drafts while typing.
    const timer = window.setTimeout(async () => {
      try {
        const result = await compilePlaygroundCss(
          await loadSources(),
          theme,
          candidateKey ? candidateKey.split("\n") : []
        );
        if (!disposed) {
          setCss(result);
          setError("");
        }
      } catch (reason) {
        if (!disposed) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to build preview CSS."
          );
        }
      }
    }, 100);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
    };
  }, [theme, candidateKey]);

  return { css, error };
}
