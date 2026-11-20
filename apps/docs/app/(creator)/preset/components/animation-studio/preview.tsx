"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Button } from "@rlz/ui/components/ui/button";
import { Slider } from "@rlz/ui/components/ui/slider";
import { Select } from "@rlz/ui/components/ui/select";
import { demoPaths } from "@rlz/ui/components/examples";
import { useAtom, useAtomValue } from "jotai";
import { useTheme } from "next-themes";
import { partsOf } from "@rlz/ui/registry/resolve-capabilities";
import { presetBuilderAtom, componentEditsAtom } from "../../preset-builder";
import { presetVariables, previewPatches } from "../../lib/preset-styles";
import { useSelectedComponent } from "@/hooks/use-selected-component";
import { slugFromId } from "../../lib/slug";
import { type CreatorAnimation, toWebKeyframes } from "./model";
import { animationPartAtom } from "./panel-state";
import { Play, Pause, RotateCcw } from "lucide-react";

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
  const preset = useAtomValue(presetBuilderAtom);
  const edits = useAtomValue(componentEditsAtom);
  const { resolvedTheme } = useTheme();
  const parts = React.useMemo(() => partsOf(slug), [slug]);
  const [partName, setPartName] = useAtom(animationPartAtom);
  const selectedPart =
    parts.find((part) => part.name === partName) ??
    parts.find((part) => /popup|content/i.test(part.name)) ??
    parts[0];

  // Keep Apply in sync even when the current part was chosen by fallback
  // (for example, after switching to a different component).
  React.useEffect(() => {
    if (selectedPart && selectedPart.name !== partName) {
      setPartName(selectedPart.name);
    }
  }, [selectedPart?.name, partName, setPartName]);

  const [snapshot, setSnapshot] = React.useState<HTMLElement | null>(null);
  const [captureError, setCaptureError] = React.useState("");
  const stage = React.useRef<HTMLDivElement>(null);
  const source = React.useRef<HTMLDivElement>(null);
  const target = React.useRef<HTMLDivElement>(null);
  const variables = React.useMemo(
    () => presetVariables(preset, resolvedTheme === "dark"),
    [preset, resolvedTheme]
  );
  const patches = React.useMemo(() => previewPatches(edits), [edits]);
  const playback = React.useRef<Animation | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  // The example is loaded asynchronously. Observe its actual DOM rather than
  // assuming it has mounted after a fixed timeout.
  React.useEffect(() => {
    setSnapshot(null);
    setCaptureError("");
    if (!entry || !selectedPart || !source.current || !stage.current) return;

    const slot = selectedPart.slot;
    const selector = `[data-slot="${CSS.escape(slot)}"]`;
    const needsOpening = /popup|content|viewport|listbox/i.test(slot);
    const existingPortals = new Set(
      document.querySelectorAll<HTMLElement>(selector)
    );
    let disposed = false;
    let captured = false;
    let opened = false;
    let openingAt = 0;
    let timeoutId: number | undefined;
    let retryId: number | undefined;
    let observer: MutationObserver;
    let backdropGuard: HTMLStyleElement | null = null;
    let closeTimer: number | undefined;

    const suppressBackdrop = () => {
      if (backdropGuard) return;
      backdropGuard = document.createElement("style");
      backdropGuard.dataset.animationStudioBackdropGuard = "";
      backdropGuard.textContent = `
        [data-slot$="-backdrop"],
        [data-slot$="-overlay"],
        [data-slot="dialog-backdrop"],
        [data-slot="alert-dialog-backdrop"] {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
      `;
      document.head.appendChild(backdropGuard);
    };
    const releaseBackdrop = () => {
      backdropGuard?.remove();
      backdropGuard = null;
    };

    const copy = (element: HTMLElement) => {
      if (disposed || captured) return;
      captured = true;
      const clone = element.cloneNode(true) as HTMLElement;
      clone.removeAttribute("id");
      clone
        .querySelectorAll("[id]")
        .forEach((node) => node.removeAttribute("id"));

      const originalStyle = window.getComputedStyle(element);
      for (const name of originalStyle) {
        if (!name.startsWith("--")) continue;
        const value = originalStyle.getPropertyValue(name);
        if (value.trim()) clone.style.setProperty(name, value);
      }

      clone.style.setProperty("position", "relative", "important");
      clone.style.setProperty("inset", "auto", "important");
      clone.style.setProperty("transform", "none");
      clone.style.setProperty("animation", "none", "important");
      clone.style.setProperty("transition", "none", "important");
      clone.style.maxHeight = "100%";
      clone.style.maxWidth = "100%";
      for (const patch of patches.filter((patch) => patch.slot === slot)) {
        const classes = new Set(
          (clone.getAttribute("class") ?? "").split(/\s+/)
        );
        if (
          !patch.wholeSlot &&
          !patch.remove.every((name) => classes.has(name))
        )
          continue;
        patch.remove.forEach((name) => classes.delete(name));
        patch.add.forEach((name) => classes.add(name));
        clone.setAttribute("class", [...classes].filter(Boolean).join(" "));
      }
      setSnapshot(clone);
      if (!source.current?.contains(element)) {
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Escape",
            code: "Escape",
            bubbles: true,
            cancelable: true,
          })
        );
        closeTimer = window.setTimeout(releaseBackdrop, 250);
      } else {
        releaseBackdrop();
      }
    };

    const find = () => {
      const local = source.current?.querySelector<HTMLElement>(selector);
      if (local) {
        copy(local);
        return true;
      }
      if (opened) {
        const external = [
          ...document.querySelectorAll<HTMLElement>(selector),
        ].find(
          (node) =>
            !existingPortals.has(node) &&
            !source.current?.contains(node) &&
            !node.closest("[data-animation-studio-snapshot]")
        );
        if (external) {
          copy(external);
          return true;
        }
      }
      return false;
    };

    const attempt = () => {
      if (disposed || captured || find()) return;
      if (!needsOpening || opened) return;
      const trigger = source.current?.querySelector<HTMLElement>(
        '[data-slot$="-trigger"], button, [role="combobox"], input'
      );
      if (!trigger) return;
      opened = true;
      openingAt = performance.now();
      if (needsOpening) suppressBackdrop();
      if (trigger instanceof HTMLInputElement) {
        trigger.focus();
        trigger.dispatchEvent(new Event("input", { bubbles: true }));
      } else {
        trigger.click();
      }
    };

    let pending = false;
    const schedule = () => {
      if (pending || disposed || captured) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        attempt();
      });
    };
    observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    schedule();
    retryId = window.setInterval(() => {
      if (disposed || captured) return;
      attempt();
      if (opened && performance.now() - openingAt > 1200 && !captured) {
        setCaptureError(
          "Unable to open this part automatically. Try another example or part."
        );
        releaseBackdrop();
      }
    }, 100);
    timeoutId = window.setTimeout(() => {
      if (!disposed && !captured) {
        setCaptureError(
          "Preview unavailable: the component or its popup did not appear."
        );
        releaseBackdrop();
      }
    }, 4500);
    return () => {
      disposed = true;
      observer.disconnect();
      window.clearInterval(retryId);
      window.clearTimeout(timeoutId);
      window.clearTimeout(closeTimer);
      releaseBackdrop();
    };
  }, [entry, selectedPart?.slot, patches]);

  React.useLayoutEffect(() => {
    const node = target.current;
    if (!node) return;
    node.replaceChildren();
    if (snapshot) node.appendChild(snapshot);
  }, [snapshot]);

  const stop = React.useCallback(() => {
    playback.current?.cancel();
    playback.current = null;
    setPlaying(false);
    setPaused(false);
  }, []);

  const seek = React.useCallback(
    (fraction: number) => {
      const node = snapshot;
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
    [animation, onProgressChange, snapshot]
  );

  const play = React.useCallback(() => {
    const node = snapshot;
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
  }, [animation, onProgressChange, snapshot]);

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
    if (snapshot) seek(1);
    return () => {
      playback.current?.cancel();
      playback.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation, entry, snapshot]);

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
        ref={stage}
        className="relative flex min-h-52 items-center justify-center overflow-hidden rounded-lg border bg-muted/30 p-8"
        style={
          Object.fromEntries(
            Object.entries(variables)
              .filter(([, v]) => v)
              .map(([k, v]) => [`--${k}`, v])
          ) as React.CSSProperties
        }
      >
        <div
          ref={target}
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
          ref={source}
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
        <Button
          type="button"
          size="sm"
          variant="ghost"
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
