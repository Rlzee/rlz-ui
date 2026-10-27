"use client";

import { useAtom, useSetAtom } from "jotai";
import { presetBuilderAtom, resetPresetAtom } from "../preset-builder";

import { PresetDialog } from "./preset-dialog";
import { Button } from "@rlz/ui/components/ui/button";
import { RefreshCw, CloudSync, type LucideIcon } from "lucide-react";

export function Navbar() {
  const resetPreset = useSetAtom(resetPresetAtom);
  const [preset, setPreset] = useAtom(presetBuilderAtom);

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent px-4 sm:px-6">
      <div className="relative flex h-(--header-height) w-full items-center justify-between gap-2">
        <div>
          <span className="text-lg">{preset.name}</span>
        </div>
        <nav className="hidden items-center gap-1.5 lg:flex">
          <Button variant="ghost" size="sm" onClick={() => resetPreset()}>
            <RefreshCw />
            Reset
          </Button>

          <PresetDialog name={preset.name} preset={preset} />

          <Button size="sm">
            <CloudSync />
            Publish
          </Button>
        </nav>
      </div>
    </header>
  );
}
