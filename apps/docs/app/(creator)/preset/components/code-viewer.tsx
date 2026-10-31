"use client";

import * as React from "react";

import { CopyButton } from "@/components/copy-button";
import { Pre } from "@/components/Pre";

const PRE_CLASS = "font-mono text-xs wrap-break-word";

/**
 * Highlighted code, through the same highlightCode helper as the docs code
 * blocks. It lives in its own component so the work only runs while a dialog is
 * mounted, and shiki is imported on demand to keep it out of the initial bundle.
 * The sheet it writes is the text it was given: what is copied is what is shown.
 */
export function CodeViewer({ code, lang }: { code: string; lang: string }) {
  const [highlighted, setHighlighted] = React.useState("");

  React.useEffect(() => {
    let active = true;

    import("@/lib/highlight").then(async ({ highlightCode }) => {
      const html = await highlightCode(code, lang);

      if (active) {
        setHighlighted(html);
      }
    });

    return () => {
      active = false;
    };
  }, [code, lang]);

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
