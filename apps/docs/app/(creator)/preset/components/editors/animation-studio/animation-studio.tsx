"use client";

import { useRef, useState, type PointerEvent } from "react";
import { Button } from "@rlz/ui/components/ui/button";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { Tabs } from "@rlz/ui/components/ui/tabs";
import {
  DEFAULT_ANIMATION,
  type CreatorAnimation,
} from "../../../lib/animation-model";
import { useAnimationDraft } from "../../../hooks/use-animation-draft";
import { AnimationPreview } from "./animation-preview";
import { AnimationTimeline } from "./animation-timeline";
import { AnimationSettings } from "./animation-settings";
import { KeyframeInspector } from "./keyframe-inspector";
import { EasingInspector } from "./easing-inspector";

const DEFAULT_TIMELINE_HEIGHT = 340;
const MIN_TIMELINE_HEIGHT = 280;
const MAX_TIMELINE_HEIGHT = 560;

export function AnimationStudio({
  value = DEFAULT_ANIMATION,
  onApply,
  onCancel,
}: {
  value?: CreatorAnimation;
  onApply?: (animation: CreatorAnimation) => void;
  onCancel: () => void;
}) {
  const editor = useAnimationDraft(value);
  const { draft, inspector, setInspector } = editor;
  const [timelineHeight, setTimelineHeight] = useState(DEFAULT_TIMELINE_HEIGHT);
  const resizeStart = useRef<{ y: number; height: number } | null>(null);

  function resizeTimeline(event: PointerEvent<HTMLDivElement>) {
    if (!resizeStart.current) return;
    const next =
      resizeStart.current.height + resizeStart.current.y - event.clientY;
    setTimelineHeight(
      Math.max(MIN_TIMELINE_HEIGHT, Math.min(MAX_TIMELINE_HEIGHT, next))
    );
  }

  return (
    <section className="@container flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Animation Studio</h2>
          <p className="text-xs text-muted-foreground">
            Create independent keyframes for each animated property.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onApply?.(structuredClone(draft))}
          >
            Apply animation
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 overflow-hidden @2xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <ScrollArea orientation="vertical" className="min-h-0 min-w-0 flex-1">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="w-full max-w-[900px]">
              <AnimationPreview
                animation={draft}
                progress={editor.progress}
                onProgressChange={editor.setProgress}
                seekRequest={editor.seekRequest}
              />
            </div>
          </div>
        </ScrollArea>
        <aside className="flex min-h-0 min-w-0 flex-col border-t border-border @2xl:border-l @2xl:border-t-0">
          <Tabs
            value={inspector}
            onValueChange={(next) => {
              if (
                next === "animation" ||
                next === "keyframe" ||
                next === "easing"
              )
                setInspector(next);
            }}
            className="min-h-0 flex-1 gap-0"
          >
            <Tabs.List className="relative shrink-0 border-b border-border p-2">
              <Tabs.Tab value="animation" className="h-8 px-3 text-xs">
                Animation
              </Tabs.Tab>
              <Tabs.Tab value="keyframe" className="h-8 px-3 text-xs">
                Keyframes
              </Tabs.Tab>
              <Tabs.Tab value="easing" className="h-8 px-3 text-xs">
                Easing
              </Tabs.Tab>
              <Tabs.Indicator className="h-8" />
            </Tabs.List>
            <ScrollArea
              key={inspector}
              orientation="vertical"
              className="min-h-0 flex-1"
            >
              <div className="px-4 py-3">
                {inspector === "animation" && (
                  <AnimationSettings draft={draft} setField={editor.setField} />
                )}
                {inspector === "keyframe" && (
                  <KeyframeInspector
                    draft={draft}
                    selectedOffset={editor.selectedOffset}
                    activeProperty={editor.activeProperty}
                    setActiveProperty={editor.setActiveProperty}
                    selectKeyframe={editor.selectKeyframe}
                    setKeyframe={editor.setKeyframe}
                    addKeyframe={editor.addKeyframe}
                    addPropertyKeyframe={editor.addPropertyKeyframe}
                    removeSelected={editor.removeSelected}
                  />
                )}
                {inspector === "easing" && (
                  <EasingInspector
                    draft={draft}
                    segmentProperty={editor.segmentProperty}
                    setSegmentProperty={editor.setSegmentProperty}
                    segmentStart={editor.segmentStart}
                    setSegmentStart={editor.setSegmentStart}
                    updateSegmentEasing={editor.updateSegmentEasing}
                  />
                )}
              </div>
            </ScrollArea>
          </Tabs>
        </aside>
      </div>

      <div
        role="separator"
        aria-label="Resize timeline"
        aria-orientation="horizontal"
        className="group flex h-3 shrink-0 cursor-row-resize touch-none items-center justify-center border-t border-border hover:bg-muted/40"
        onPointerDown={(event) => {
          resizeStart.current = { y: event.clientY, height: timelineHeight };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={resizeTimeline}
        onPointerUp={(event) => {
          resizeStart.current = null;
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          resizeStart.current = null;
        }}
        onDoubleClick={() => setTimelineHeight(DEFAULT_TIMELINE_HEIGHT)}
      >
        <div className="h-1 w-10 rounded-full bg-border group-hover:bg-muted-foreground/60" />
      </div>
      <div
        className="min-h-0 shrink-0 border-t border-border"
        style={{ height: timelineHeight }}
      >
        <ScrollArea orientation="both" className="size-full">
          <div className="min-w-0 px-3 py-2">
            <AnimationTimeline
              frames={draft.keyframes}
              selectedOffset={editor.selectedOffset}
              duration={draft.duration}
              onSelect={editor.selectKeyframe}
              onMove={editor.moveKeyframe}
              onAdd={editor.addPropertyKeyframe}
              progress={editor.progress}
              onSeek={editor.seekTimeline}
              activeProperty={editor.activeProperty}
              onPropertySelect={editor.selectProperty}
            />
          </div>
        </ScrollArea>
      </div>
    </section>
  );
}
