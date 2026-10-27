"use client";

import * as React from "react";
import type { RegistryPreset } from "@rlz/registry";

import { Dialog } from "@rlz/ui/components/ui/dialog";
import { Button } from "@rlz/ui/components/ui/button";
import { Braces } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { Pre } from "@/components/Pre";

const PRE_CLASS = "font-mono text-xs wrap-break-word";

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
  // Single formatted source, used for both the display and the copy button.
  const code = JSON.stringify(preset, null, 2);

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
            Registry preset definition, formatted and ready to copy.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="p-0">
          <PresetCode code={code} />
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  );
}
