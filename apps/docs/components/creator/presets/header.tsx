import { defaultPreset } from "@rlz/ui/styles/presets";
import { Label } from "@rlz/ui/components/ui/label";
import { Button } from "@rlz/ui/components/ui/button";
import { Separator } from "@rlz/ui/components/ui/separator";

import { Braces, FileDown, Share2, Heart } from "lucide-react";

export function Header() {
  return (
    <div className="h-14 border-b w-full flex items-center px-4 sm:px-6 justify-between">
      <div className="flex gap-0.5 items-center">
        <div className="h-4 w-4 shrink-0 rounded-sm border bg-foreground" />
        <div className="h-4 w-4 shrink-0 rounded-sm border bg-background" />
        <div className="h-4 w-4 shrink-0 rounded-sm border bg-secondary" />
        <Label className="ml-1 text-md">{defaultPreset.name}</Label>
      </div>
      <div className="flex gap-1.5 items-center justify-center">
        <Button variant="ghost" size="sm">
          <Share2 />
          Share
        </Button>
        <Separator orientation="vertical" className="h-4 w-4" />

        <Button variant="ghost" size="sm">
          <FileDown />
          Import
        </Button>
        <Separator orientation="vertical" className="h-4 w-4" />

        <Button variant="ghost" size="sm">
          <Braces />
          Preset
        </Button>
        <Separator orientation="vertical" className="h-4 w-4" />
        <Button className="ml-1" size="sm">
          <Heart />
          Save
        </Button>
      </div>
    </div>
  );
}
