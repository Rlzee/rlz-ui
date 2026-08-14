"use client";

import { useAtom, useSetAtom } from "jotai";

import { Button } from "@rlz/ui/components/ui/button";
import { Separator } from "@rlz/ui/components/ui/separator";
import { Input } from "@rlz/ui/components/ui/input";
import { PresetDialog } from "./preset-dialog";

import { presetBuilderAtom, resetPresetAtom } from "../preset-builder";

import { FileDown, Share2, CloudSync, RotateCcw } from "lucide-react";

export function Header() {
  const resetPreset = useSetAtom(resetPresetAtom);
  const [preset, setPreset] = useAtom(presetBuilderAtom);

  return (
    <div className="sticky top-0 z-40 w-full h-14 border-b flex items-center px-4 sm:px-6 justify-between">
      <div className="flex gap-0.5 items-center">
        <div className="h-4 w-4 shrink-0 rounded-sm border bg-foreground" />
        <div className="h-4 w-4 shrink-0 rounded-sm border bg-background" />
        <div className="h-4 w-4 shrink-0 rounded-sm border bg-secondary" />

        <Input
          value={preset.name}
          onChange={(e) =>
            setPreset((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          unstyled
          className="ml-1 text-md"
        />
      </div>

      <div className="flex gap-1.5 items-center justify-center">
        <Button variant="ghost" size="sm" onClick={() => resetPreset()}>
          <RotateCcw />
          Reset
        </Button>

        <Separator orientation="vertical" className="h-4 w-4" />

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

        <PresetDialog name={preset.name}>
          {JSON.stringify(preset, null, 2)}
        </PresetDialog>

        <Separator orientation="vertical" className="h-4 w-4" />

        <Button variant="ghost" size="sm">
          <CloudSync />
          Publish
        </Button>
      </div>
    </div>
  );
}
