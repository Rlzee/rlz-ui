"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toWebKeyframes, type CreatorAnimation } from "../lib/animation-model";

type PlaybackStatus = "idle" | "playing" | "paused";
export type AnimationSeekRequest = { value: number; id: number };

export function useAnimationPlayback({
  snapshot,
  animation,
  onProgressChange,
  seekRequest,
}: {
  snapshot: HTMLElement | null;
  animation: CreatorAnimation;
  onProgressChange: (progress: number) => void;
  seekRequest: AnimationSeekRequest;
}) {
  const playback = useRef<Animation | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const lastSeekId = useRef(0);

  const seek = useCallback(
    (fraction: number) => {
      if (!snapshot) return;
      playback.current?.cancel();
      const duration = Math.max(1, animation.duration);
      const instance = snapshot.animate(toWebKeyframes(animation), {
        duration,
        delay: 0,
        easing: "linear",
        fill: "both",
      });
      instance.pause();
      instance.currentTime = fraction * duration;
      playback.current = instance;
      onProgressChange(fraction);
      setStatus("idle");
    },
    [animation, onProgressChange, snapshot]
  );

  const play = useCallback(() => {
    if (!snapshot) return;
    playback.current?.cancel();
    onProgressChange(0);
    const instance = snapshot.animate(toWebKeyframes(animation), {
      duration: Math.max(1, animation.duration),
      delay: animation.delay,
      easing: "linear",
      fill: "both",
    });
    playback.current = instance;
    setStatus("playing");
    instance.onfinish = () => {
      if (playback.current !== instance) return;
      onProgressChange(1);
      setStatus("idle");
    };
  }, [animation, onProgressChange, snapshot]);

  const togglePause = useCallback(() => {
    const instance = playback.current;
    if (!instance) return;
    if (status === "paused") {
      instance.play();
      setStatus("playing");
    } else if (status === "playing") {
      instance.pause();
      setStatus("paused");
    }
  }, [status]);

  useEffect(() => {
    if (snapshot) seek(1);
    return () => {
      playback.current?.cancel();
      playback.current = null;
    };
  }, [seek, snapshot]);

  useEffect(() => {
    // An edited animation resets to its end; do not replay an old seek request.
    if (seekRequest.id <= 0 || seekRequest.id === lastSeekId.current) return;
    lastSeekId.current = seekRequest.id;
    seek(seekRequest.value);
  }, [seekRequest, seek]);

  useEffect(() => {
    if (status !== "playing") return;
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
  }, [status, animation.duration, animation.delay, onProgressChange]);

  return {
    playing: status === "playing",
    paused: status === "paused",
    play,
    seek,
    togglePause,
    reset: () => seek(0),
  };
}
