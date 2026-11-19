"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Button } from "@rlz/ui/components/ui/button";
import { Slider } from "@rlz/ui/components/ui/slider";
import { Select } from "@rlz/ui/components/ui/select";
import { demoPaths } from "@rlz/ui/components/examples";
import { useSelectedComponent } from "@/hooks/use-selected-component";
import { slugFromId } from "../../lib/slug";
import { type CreatorAnimation, toWebKeyframes } from "./model";

function MissingDemo() {
  return (
    <span className="text-xs text-muted-foreground">Preview not available</span>
  );
}

function ComponentDemo({ entry }: { entry: string }) {
  const Demo = React.useMemo(
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
  seekRequest: { value: number; id: number };
}) {
  const [selected] = useSelectedComponent();
  const slug = selected ? slugFromId(selected.id) : "";
  const entries = React.useMemo(() => {
    const prefix = `${slug}/`;
    return Object.entries(demoPaths)
      .filter(([, path]) => slug && (path === slug || path.startsWith(prefix)))
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([, path]) => path);
  }, [slug]);
  const [chosenEntry, setChosenEntry] = React.useState("");
  const entry = entries.includes(chosenEntry) ? chosenEntry : entries[0] ?? "";
  const target = React.useRef<HTMLDivElement>(null);
  const playback = React.useRef<Animation | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  const stop = React.useCallback(() => {
    playback.current?.cancel();
    playback.current = null;
    setPlaying(false);
    setPaused(false);
  }, []);

  const seek = React.useCallback(
    (fraction: number) => {
      const node = target.current;
      if (!node) return;
      playback.current?.cancel();
      const instance = node.animate(toWebKeyframes(animation), {
        duration: Math.max(1, animation.duration),
        delay: 0,
        easing: "linear",
        fill: "both",
      });
      instance.pause();
      instance.currentTime = fraction * Math.max(1, animation.duration);
      playback.current = instance;
      onProgressChange(fraction);
      setPlaying(false);
      setPaused(false);
    },
    [animation, onProgressChange]
  );

  const play = React.useCallback(() => {
    const node = target.current;
    if (!node) return;
    playback.current?.cancel();
    onProgressChange(0);
    const instance = node.animate(toWebKeyframes(animation), {
      duration: Math.max(1, animation.duration),
      delay: animation.delay,
      easing: "linear",
      fill: "both",
    });
    playback.current = instance;
    setPlaying(true);
    setPaused(false);
    instance.onfinish = () => {
      if (playback.current !== instance) return;
      onProgressChange(1);
      setPlaying(false);
      setPaused(false);
    };
  }, [animation, onProgressChange]);

  const togglePause = React.useCallback(() => {
    const instance = playback.current;
    if (!instance) return;
    if (paused) {
      instance.play();
      setPaused(false);
      setPlaying(true);
    } else if (playing) {
      instance.pause();
      setPaused(true);
      setPlaying(false);
    }
  }, [paused, playing]);

  React.useEffect(() => {
    seek(progress);
    return () => {
      playback.current?.cancel();
      playback.current = null;
    };
    // Rebuild the preview only when the animation definition or example changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation, entry]);

  React.useEffect(() => {
    if (seekRequest.id > 0) seek(seekRequest.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seekRequest]);

  React.useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      const instance = playback.current;
      if (!instance || instance.playState !== "running") return;
      const elapsed = Number(instance.currentTime ?? 0);
      onProgressChange(
        Math.max(
          0,
          Math.min(
            1,
            (elapsed - animation.delay) / Math.max(1, animation.duration)
          )
        )
      );
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, animation.duration, animation.delay, onProgressChange]);

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
      <div className="flex min-h-52 items-center justify-center rounded-lg border bg-muted/30 p-8">
        <div
          ref={target}
          className="flex min-w-0 max-w-full items-center justify-center"
        >
          {entry ? (
            <ComponentDemo key={entry} entry={entry} />
          ) : (
            <span className="text-xs text-muted-foreground">
              Select a component with an available demo to preview its
              animation.
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" onClick={play}>
          {playing || paused ? "Replay" : "Play"}
        </Button>
        {(playing || paused) && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={togglePause}
          >
            {paused ? "Resume" : "Pause"}
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            stop();
            seek(0);
          }}
        >
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
