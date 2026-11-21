"use client";

import * as React from "react";
import { Kbd } from "@rlz/ui/components/ui/kbd";
import {
  ANIMATION_PROPERTIES,
  type AnimationKeyframe,
  type AnimationProperty,
  propertyFrames,
  normalizedOffset,
} from "../../../lib/animation-model";

const LABELS: Record<AnimationProperty, string> = {
  opacity: "Opacity",
  x: "Translate X",
  y: "Translate Y",
  scale: "Scale",
  rotate: "Rotate",
};

export function AnimationTimeline({
  frames,
  selectedOffset,
  duration,
  onSelect,
  onMove,
  onAdd,
  progress,
  onSeek,
  activeProperty,
  onPropertySelect,
}: {
  frames: AnimationKeyframe[];
  selectedOffset: number;
  duration: number;
  onSelect: (offset: number, property: AnimationProperty | null) => void;
  onMove: (property: AnimationProperty, from: number, to: number) => void;
  onAdd: (property: AnimationProperty, offset: number) => void;
  progress: number;
  onSeek: (progress: number) => void;
  activeProperty: AnimationProperty | null;
  onPropertySelect: (property: AnimationProperty | null) => void;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{
    pointerId: number;
    property: AnimationProperty;
    from: number;
  } | null>(null);
  const playheadPointer = React.useRef<number | null>(null);
  const [dragOffset, setDragOffset] = React.useState<number | null>(null);

  function atClientX(x: number) {
    const rect = trackRef.current?.getBoundingClientRect();
    return rect?.width ? normalizedOffset((x - rect.left) / rect.width) : 0;
  }
  function startPlayhead(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    playheadPointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    onSeek(atClientX(event.clientX));
  }
  function movePlayhead(event: React.PointerEvent<HTMLButtonElement>) {
    if (playheadPointer.current === event.pointerId)
      onSeek(atClientX(event.clientX));
  }
  function endPlayhead(event: React.PointerEvent<HTMLButtonElement>) {
    if (playheadPointer.current !== event.pointerId) return;
    onSeek(atClientX(event.clientX));
    playheadPointer.current = null;
  }
  function playhead() {
    return (
      <button
        type="button"
        aria-label={`Drag playhead at ${Math.round(progress * duration)} ms`}
        title={`Drag playhead · ${Math.round(progress * duration)} ms`}
        className="absolute inset-y-0 z-30 w-3 -translate-x-1/2 cursor-ew-resize touch-none bg-transparent"
        style={{ left: `${progress * 100}%` }}
        onPointerDown={startPlayhead}
        onPointerMove={movePlayhead}
        onPointerUp={endPlayhead}
        onPointerCancel={() => {
          playheadPointer.current = null;
        }}
        onDoubleClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          const row = event.currentTarget.parentElement;
          const property = row?.getAttribute(
            "data-animation-property"
          ) as AnimationProperty | null;
          if (property) onAdd(property, atClientX(event.clientX));
        }}
      >
        <span className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-primary" />
      </button>
    );
  }
  function startKey(
    event: React.PointerEvent<HTMLButtonElement>,
    property: AnimationProperty,
    offset: number
  ) {
    event.stopPropagation();
    onSelect(offset, property);
    // Keep endpoint keys fixed; intermediate keys can move independently.
    if (offset === 0 || offset === 1) return;
    drag.current = { pointerId: event.pointerId, property, from: offset };
    setDragOffset(offset);
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveKey(event: React.PointerEvent<HTMLButtonElement>) {
    if (drag.current?.pointerId === event.pointerId)
      setDragOffset(atClientX(event.clientX));
  }
  function endKey(event: React.PointerEvent<HTMLButtonElement>) {
    if (drag.current?.pointerId !== event.pointerId) return;
    const { property, from } = drag.current;
    const to = atClientX(event.clientX);
    drag.current = null;
    setDragOffset(null);
    onMove(property, from, to);
  }
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-medium">Timeline</span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↔</Kbd>
            Drag playhead
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>Drag</Kbd>
            Move keyframes
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>Double click</Kbd>
            Add keyframe
          </span>
        </div>
      </div>
      <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-x-3 gap-y-2 px-1.5">
        <div />
        <div className="flex justify-between text-[10px] tabular-nums text-muted-foreground">
          <span>0 ms</span>
          <span>{Math.round(duration / 2)} ms</span>
          <span>{duration} ms</span>
        </div>
        <button
          type="button"
          onClick={() => onPropertySelect(null)}
          className={`text-left text-xs font-medium ${
            activeProperty === null
              ? "text-foreground"
              : "text-muted-foreground"
          }`}
        >
          Keyframes
        </button>
        <div
          ref={trackRef}
          className="relative h-8 rounded bg-muted/40"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget)
              onSeek(atClientX(event.clientX));
          }}
        >
          <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
          {playhead()}
          {frames.map((frame) => (
            <button
              key={frame.offset}
              type="button"
              title={`${Math.round(frame.offset * duration)} ms`}
              aria-label={`Select keyframe at ${Math.round(
                frame.offset * duration
              )} ms`}
              className={`absolute top-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border ${
                selectedOffset === frame.offset
                  ? "border-primary bg-primary"
                  : "border-foreground bg-background"
              }`}
              style={{ left: `${frame.offset * 100}%` }}
              onClick={() => onSelect(frame.offset, null)}
            />
          ))}
        </div>
        {ANIMATION_PROPERTIES.map((property) => (
          <React.Fragment key={property}>
            <button
              type="button"
              onClick={() => onPropertySelect(property)}
              className={`text-left text-[11px] ${
                activeProperty === property
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {LABELS[property]}
            </button>
            <div
              data-animation-property={property}
              className={`relative h-7 rounded ${
                activeProperty === property ? "bg-primary/10" : "bg-muted/20"
              }`}
              onPointerDown={(event) => {
                if (event.target === event.currentTarget) {
                  onPropertySelect(property);
                  onSeek(atClientX(event.clientX));
                }
              }}
              onDoubleClick={(event) => {
                // Decorative track lines are children too; only actual key buttons
                // should prevent adding a new keyframe.
                const target = event.target as HTMLElement;
                if (target.closest("button")) return;
                event.preventDefault();
                onAdd(property, atClientX(event.clientX));
              }}
            >
              {playhead()}
              <div className="absolute inset-x-0 top-1/2 h-px bg-border/70" />
              {propertyFrames(frames, property).map((frame) => {
                const offset =
                  drag.current?.property === property &&
                  drag.current.from === frame.offset &&
                  dragOffset !== null
                    ? dragOffset
                    : frame.offset;
                return (
                  <button
                    key={frame.offset}
                    type="button"
                    title={`${LABELS[property]}: ${
                      frame[property]
                    } · ${Math.round(offset * duration)} ms`}
                    aria-label={`${LABELS[property]} keyframe at ${Math.round(
                      offset * duration
                    )} ms`}
                    className={`absolute top-1/2 z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border touch-none ${
                      selectedOffset === frame.offset &&
                      activeProperty === property
                        ? "border-primary bg-primary"
                        : "border-muted-foreground bg-background"
                    } ${
                      frame.offset > 0 && frame.offset < 1
                        ? "cursor-ew-resize"
                        : "cursor-pointer"
                    }`}
                    style={{ left: `${offset * 100}%` }}
                    onClick={() => onSelect(frame.offset, property)}
                    onPointerDown={(event) =>
                      startKey(event, property, frame.offset)
                    }
                    onPointerMove={moveKey}
                    onPointerUp={endKey}
                    onPointerCancel={() => {
                      drag.current = null;
                      setDragOffset(null);
                    }}
                  />
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
