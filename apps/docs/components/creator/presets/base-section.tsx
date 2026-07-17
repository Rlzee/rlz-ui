"use client";

import * as React from "react";

import { CollapsibleItem } from "./collapsible-item";
import { FontSelect } from "@/components/font-select";
import { IconLibSelect } from "@/components/icon-lib-select";
import { Label } from "@rlz/ui/components/ui/label";

import { DEFAULT_PRESET } from "@rlz/ui/styles/preset";
const BASE = DEFAULT_PRESET.base;

export function BaseSection() {
  return (
    <section id="editor-base" className="h-full py-3">
      <div className="px-4 py-3 flex flex-col gap-2">
        <CollapsibleItem triggerName="TYPOGRAPHY" defaultOpen>
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Label className="text-xs w-16 flex shrink-0 text-muted-foreground">
              Heading
            </Label>
            <FontSelect defaultValue={BASE.typography.headingFont} />
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Label className="text-xs w-16 flex shrink-0 text-muted-foreground">
              Body
            </Label>
            <FontSelect defaultValue={BASE.typography.bodyFont} />
          </div>
        </CollapsibleItem>
        <CollapsibleItem triggerName="ICON LIBRARY" defaultOpen>
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Label className="text-xs w-16 flex shrink-0 text-muted-foreground">
              Library
            </Label>
            <IconLibSelect defaultValue={BASE.icons.library} />
          </div>
        </CollapsibleItem>
      </div>
    </section>
  );
}
