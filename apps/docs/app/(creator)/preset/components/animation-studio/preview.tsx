"use client";

import * as React from "react";
import { Button } from "@rlz/ui/components/ui/button";
import { Slider } from "@rlz/ui/components/ui/slider";
import { type CreatorAnimation, toWebKeyframes } from "./model";

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
    [animation]
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
  }, [animation]);

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
    // Rebuild the preview only when the animation definition changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation]);

  React.useEffect(() => {
    if (seekRequest.id > 0) seek(seekRequest.value);
    // A seek request is an explicit timeline action, not a playback tick.
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
  }, [playing, animation.duration, animation.delay]);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-lg border bg-muted/30 p-8">
        <div
          ref={target}
          className="w-44 rounded-lg border bg-background p-4 shadow-lg"
        >
          <div className="mb-3 h-2 w-24 rounded bg-foreground/25" />
          <div className="mb-2 h-2 w-full rounded bg-foreground/10" />
          <div className="h-2 w-3/4 rounded bg-foreground/10" />
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
