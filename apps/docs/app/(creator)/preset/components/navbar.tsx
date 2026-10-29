"use client";

import * as React from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  ensurePresetIdAtom,
  presetBuilderAtom,
  resetPresetAtom,
} from "../preset-builder";

import { Input } from "@rlz/ui/components/ui/input";
import { Badge } from "@rlz/ui/components/ui/badge";
import { PresetDialog } from "./preset-dialog";
import { Button } from "@rlz/ui/components/ui/button";
import { RefreshCw, CloudSync, Share2 } from "lucide-react";

export function Navbar() {
  const resetPreset = useSetAtom(resetPresetAtom);
  const ensurePresetId = useSetAtom(ensurePresetIdAtom);
  const [preset, setPreset] = useAtom(presetBuilderAtom);

  // Landing on the creator always gives the draft its own registry key.
  React.useEffect(() => {
    ensurePresetId();
  }, [ensurePresetId]);

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent px-4 sm:px-6">
      <div className="relative flex h-(--header-height) w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Badge variant="info">Beta v1.0.0</Badge>
          <Input
            unstyled
            aria-label="Preset name"
            className="text-lg field-sizing-content min-w-24"
            value={preset.name}
            onChange={(event) =>
              setPreset((prev) => ({ ...prev, name: event.target.value }))
            }
          />
        </div>
        <nav className="hidden items-center gap-1.5 lg:flex">
          <Button variant="ghost" size="sm" onClick={() => resetPreset()}>
            <RefreshCw />
            Reset
          </Button>

          <PresetDialog name={preset.name.trim()} preset={preset} />

          <Button size="sm" variant="ghost">
            <Share2 />
            Share
          </Button>

          <Button size="sm">
            <CloudSync />
            Publish
          </Button>
        </nav>
      </div>
    </header>
  );
}
