"use client";

import { useAtom } from "jotai";

import { CollapsibleProperties } from "./colapsible-properties";
import { FontSelect } from "@/components/font-select";
import { IconLibSelect } from "@/components/icon-lib-select";

import { Label } from "@rlz/ui/components/ui/label";

import { presetBuilderAtom } from "../preset-builder";

export function RecommendationsProperties() {
  const [preset] = useAtom(presetBuilderAtom);

  const recommendations = preset.recommendations ?? {};

  return (
    <section id="editor-recommendations" className="h-full">
      <div className="px-2 py-3 flex flex-col gap-2">
        <CollapsibleProperties name="TYPOGRAPHY" defaultOpen>
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Label className="text-xs w-16 flex shrink-0 text-muted-foreground">
              Heading
            </Label>

            <FontSelect
              defaultValue={recommendations.typography?.fontHeading}
            />
          </div>

          <div className="flex items-center gap-3 px-2 py-1.5">
            <Label className="text-xs w-16 flex shrink-0 text-muted-foreground">
              Sans
            </Label>

            <FontSelect defaultValue={recommendations.typography?.fontSans} />
          </div>

        <div className="flex items-center gap-3 px-2 py-1.5">
            <Label className="text-xs w-16 flex shrink-0 text-muted-foreground">
              Mono
            </Label>

            <FontSelect defaultValue={recommendations.typography?.fontMono} />
          </div>
        </CollapsibleProperties>

        <CollapsibleProperties name="ICON LIBRARY" defaultOpen>
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Label className="text-xs w-16 flex shrink-0 text-muted-foreground">
              Library
            </Label>

            <IconLibSelect defaultValue={recommendations.icons?.library} />
          </div>
        </CollapsibleProperties>
      </div>
    </section>
  );
}
