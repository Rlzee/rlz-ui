import { defaultPreset } from "@rlz/ui/styles/presets";
import { Button } from "@rlz/ui/components/ui/button";
import { Separator } from "@rlz/ui/components/ui/separator";
import { Input } from "@rlz/ui/components/ui/input";

import { Braces, FileDown, Share2, CloudSync } from "lucide-react";

export function Header() {
  return (
    <div className="h-14 border-b w-full flex items-center px-4 sm:px-6 justify-between">
      <div className="flex gap-0.5 items-center">
        <div className="h-4 w-4 shrink-0 rounded-sm border bg-foreground" />
        <div className="h-4 w-4 shrink-0 rounded-sm border bg-background" />
        <div className="h-4 w-4 shrink-0 rounded-sm border bg-secondary" />
        <Input
          defaultValue={defaultPreset.name}
          unstyled
          className="ml-1 text-md"
        />
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
        <Button variant="ghost" size="sm">
          <CloudSync />
          Publish
        </Button>
      </div>
    </div>
  );
}
