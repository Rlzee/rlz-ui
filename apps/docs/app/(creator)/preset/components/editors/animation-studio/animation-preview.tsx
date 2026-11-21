"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { Button } from "@rlz/ui/components/ui/button";
import { Slider } from "@rlz/ui/components/ui/slider";
import { Select } from "@rlz/ui/components/ui/select";
import { demoPaths } from "@rlz/ui/components/examples";
import { useAtomValue } from "jotai";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw } from "lucide-react";
import {
  presetBuilderAtom,
  componentEditsAtom,
} from "../../../state/preset-builder";
import { presetVariables, previewPatches } from "../../../lib/preset-styles";
import type { CreatorAnimation } from "../../../lib/animation-model";
import { useAnimationPart } from "../../../hooks/use-animation-part";
import { useAnimationSnapshot } from "../../../hooks/use-animation-snapshot";
import {
  useAnimationPlayback,
  type AnimationSeekRequest,
} from "../../../hooks/use-animation-playback";

function MissingDemo() {
  return (
    <span className="text-xs text-muted-foreground">Preview not available</span>
  );
}

function ComponentDemo({ entry }: { entry: string }) {
  const Demo = useMemo(
    () =>
      dynamic(
        async () => {
          try {
            return await import(`@rlz/ui/components/examples/ui/${entry}`);
          } catch {
            return { default: MissingDemo };
          }
        },
        { ssr: false }
      ),
    [entry]
  );
  return <Demo />;
}

export function AnimationPreview({
  animation,
  progress,
  onProgressChange,
  seekRequest,
}: {
  animation: CreatorAnimation;
  progress: number;
  onProgressChange: (progress: number) => void;
  seekRequest: AnimationSeekRequest;
}) {
  const { slug, parts, partName, selectedPart, setPartName } =
    useAnimationPart();
  const entries = useMemo(() => {
    const prefix = `${slug}/`;
    return Object.values(demoPaths)
      .filter((path) => slug && (path === slug || path.startsWith(prefix)))
      .sort((a, b) => a.localeCompare(b));
  }, [slug]);
  const [chosenEntry, setChosenEntry] = useState("");
  const entry = entries.includes(chosenEntry) ? chosenEntry : entries[0] ?? "";
  const preset = useAtomValue(presetBuilderAtom);
  const edits = useAtomValue(componentEditsAtom);
  const { resolvedTheme } = useTheme();
  const variables = useMemo(
    () => presetVariables(preset, resolvedTheme === "dark"),
    [preset, resolvedTheme]
  );
  const patches = useMemo(() => previewPatches(edits), [edits]);
  const { sourceRef, targetRef, snapshot, captureError } = useAnimationSnapshot(
    entry,
    selectedPart?.slot,
    patches
  );
  const { playing, paused, play, seek, togglePause, reset } =
    useAnimationPlayback({
      snapshot,
      animation,
      onProgressChange,
      seekRequest,
    });
  const selectedPartName = selectedPart?.name;

  // Apply must use the same fallback part as the preview after a selection change.
  useEffect(() => {
    if (selectedPartName && selectedPartName !== partName)
      setPartName(selectedPartName);
  }, [selectedPartName, partName, setPartName]);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      {entries.length > 1 && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            Component example
          </span>
          <Select
            value={entry}
            onValueChange={(next) => {
              if (typeof next === "string") setChosenEntry(next);
            }}
          >
            <Select.Trigger size="xs" className="min-w-0 max-w-60">
              <Select.Value>{entry.split("/").pop()}</Select.Value>
              <Select.Icon />
            </Select.Trigger>
            <Select.Popup
              positionerProps={{ align: "start", className: "z-[60]" }}
            >
              <Select.List>
                {entries.map((path) => (
                  <Select.Item key={path} value={path}>
                    <Select.ItemIndicator />
                    <Select.ItemText>{path.split("/").pop()}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select>
        </div>
      )}
      {parts.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Animated part</span>
          <Select
            value={selectedPart?.name ?? ""}
            onValueChange={(next) => {
              if (typeof next === "string") setPartName(next);
            }}
          >
            <Select.Trigger size="xs" className="min-w-0 max-w-60">
              <Select.Value>{selectedPart?.name ?? "Select part"}</Select.Value>
              <Select.Icon />
            </Select.Trigger>
            <Select.Popup
              positionerProps={{ align: "start", className: "z-[60]" }}
            >
              <Select.List>
                {parts.map((part) => (
                  <Select.Item key={part.name} value={part.name}>
                    <Select.ItemIndicator />
                    <Select.ItemText>{part.name}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select>
        </div>
      )}
      <div
        className="relative flex min-h-52 items-center justify-center overflow-hidden rounded-lg border bg-muted/30 p-8"
        style={
          Object.fromEntries(
            Object.entries(variables)
              .filter(([, value]) => value)
              .map(([key, value]) => [`--${key}`, value])
          ) as CSSProperties
        }
      >
        <div
          ref={targetRef}
          data-animation-studio-snapshot
          className="flex max-h-full min-w-0 max-w-full items-center justify-center"
        />
        {!snapshot && (
          <div className="text-center text-xs text-muted-foreground">
            {captureError ||
              (entry
                ? "Preparing component preview…"
                : "No component example available")}
          </div>
        )}
        <div
          ref={sourceRef}
          className="pointer-events-none absolute size-px overflow-hidden opacity-0"
          aria-hidden="true"
        >
          {entry && <ComponentDemo key={entry} entry={entry} />}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="outline" onClick={play}>
          {playing || paused ? <RotateCcw /> : <Play />}{" "}
          {playing || paused ? "Replay" : "Play"}
        </Button>
        {(playing || paused) && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={togglePause}
          >
            {paused ? <Play /> : <Pause />} {paused ? "Resume" : "Pause"}
          </Button>
        )}
        <Button type="button" size="sm" variant="ghost" onClick={reset}>
          Reset
        </Button>
        <span className="ml-auto text-xs tabular-nums text-muted-foreground">
          {Math.round(progress * animation.duration)} / {animation.duration} ms
        </span>
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={Math.round(progress * 100)}
        onValueChange={(values) => seek((values[0] ?? 0) / 100)}
        aria-label="Preview position"
      />
    </div>
  );
}
