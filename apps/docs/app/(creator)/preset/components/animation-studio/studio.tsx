"use client";

import * as React from "react";
import { Button } from "@rlz/ui/components/ui/button";
import { Input } from "@rlz/ui/components/ui/input";
import { Field } from "@rlz/ui/components/ui/field";
import { NumberField } from "@rlz/ui/components/ui/number-field";
import { Select } from "@rlz/ui/components/ui/select";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { AnimationPreview } from "./preview";
import { AnimationTimeline } from "./timeline";
import { BezierEditor } from "./bezier-editor";
import {
  ANIMATION_PROPERTIES,
  clampNumber,
  DEFAULT_ANIMATION,
  moveProperty,
  normalizedOffset,
  propertyFrames,
  removeProperty,
  sortedFrames,
  upsertProperty,
  valueAt,
  setSegmentEasing,
  type AnimationProperty,
  type CreatorAnimation,
} from "./model";

const PROPERTIES: {
  key: AnimationProperty;
  label: string;
  step: number;
  min?: number;
  max?: number;
}[] = [
  { key: "opacity", label: "Opacity", step: 0.05, min: 0, max: 1 },
  { key: "x", label: "Translate X (px)", step: 1 },
  { key: "y", label: "Translate Y (px)", step: 1 },
  { key: "scale", label: "Scale", step: 0.05, min: 0 },
  { key: "rotate", label: "Rotate (deg)", step: 1 },
];

/** The Studio fills a Playground tab. It no longer owns a Dialog or trigger. */
export function AnimationStudio({
  value = DEFAULT_ANIMATION,
  onApply,
  onCancel,
}: {
  value?: CreatorAnimation;
  onApply?: (animation: CreatorAnimation) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = React.useState<CreatorAnimation>(() =>
    structuredClone(value)
  );
  const [selectedOffset, setSelectedOffset] = React.useState(0);
  const [activeProperty, setActiveProperty] =
    React.useState<AnimationProperty | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [inspector, setInspector] = React.useState<
    "animation" | "keyframe" | "easing"
  >("animation");
  const [timelineHeight, setTimelineHeight] = React.useState(340);
  const resizeStart = React.useRef<{ y: number; height: number } | null>(null);
  const resizeTimeline = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!resizeStart.current) return;
    const next =
      resizeStart.current.height + resizeStart.current.y - event.clientY;
    setTimelineHeight(Math.max(280, Math.min(560, next)));
  };
  const [seekRequest, setSeekRequest] = React.useState({ value: 0, id: 0 });

  const seekTimeline = (next: number) => {
    setProgress(next);
    setSeekRequest((prev) => ({ value: next, id: prev.id + 1 }));
  };

  function setField<K extends keyof CreatorAnimation>(
    key: K,
    next: CreatorAnimation[K]
  ) {
    setDraft((previous) => ({ ...previous, [key]: next }));
  }

  function selectKeyframe(offset: number, property: AnimationProperty | null) {
    setSelectedOffset(offset);
    setActiveProperty(property);
    setInspector("keyframe");
  }

  function setKeyframe(property: AnimationProperty, value: number) {
    setDraft((previous) => ({
      ...previous,
      keyframes: upsertProperty(
        previous.keyframes,
        property,
        selectedOffset,
        value
      ),
    }));
  }

  function addPropertyKeyframe(property: AnimationProperty, offset: number) {
    const at = normalizedOffset(offset);
    setDraft((previous) => ({
      ...previous,
      keyframes: upsertProperty(
        previous.keyframes,
        property,
        at,
        valueAt(previous.keyframes, property, at, previous.easing)
      ),
    }));
    selectKeyframe(at, property);
  }

  function moveKeyframe(property: AnimationProperty, from: number, to: number) {
    const at = normalizedOffset(to);
    if (from === at || at === 0 || at === 1) return;
    if (
      draft.keyframes.some(
        (frame) => frame.offset === at && frame[property] !== undefined
      )
    )
      return;
    setDraft((previous) => ({
      ...previous,
      keyframes: moveProperty(previous.keyframes, property, from, at),
    }));
    setSelectedOffset(at);
  }

  function addKeyframe() {
    const frames = sortedFrames(draft.keyframes);
    const offsets = [0, ...frames.map((frame) => frame.offset), 1]
      .filter((v, i, all) => all.indexOf(v) === i)
      .sort((a, b) => a - b);
    let left = 0;
    let widest = 0;
    for (let i = 0; i < offsets.length - 1; i++) {
      const gap = offsets[i + 1] - offsets[i];
      if (gap > widest) {
        widest = gap;
        left = offsets[i];
      }
    }
    if (widest < 0.002) return;
    const at = normalizedOffset(left + widest / 2);
    setDraft((previous) => {
      let next = previous.keyframes;
      for (const property of ANIMATION_PROPERTIES)
        next = upsertProperty(
          next,
          property,
          at,
          valueAt(previous.keyframes, property, at, previous.easing)
        );
      return { ...previous, keyframes: next };
    });
    selectKeyframe(at, null);
  }

  function removeSelected() {
    if (activeProperty) {
      setDraft((previous) => ({
        ...previous,
        keyframes: removeProperty(
          previous.keyframes,
          activeProperty,
          selectedOffset
        ),
      }));
    } else if (selectedOffset > 0 && selectedOffset < 1) {
      setDraft((previous) => ({
        ...previous,
        keyframes: previous.keyframes.filter(
          (frame) => frame.offset !== selectedOffset
        ),
      }));
      setSelectedOffset(0);
    }
  }

  const selectedFrame = draft.keyframes.find(
    (frame) => frame.offset === selectedOffset
  );
  const shownProperties = PROPERTIES.filter(
    ({ key }) => activeProperty === null || activeProperty === key
  );
  const [segmentProperty, setSegmentProperty] =
    React.useState<AnimationProperty>("scale");
  const [segmentStart, setSegmentStart] = React.useState(0);
  const segmentKeys = propertyFrames(draft.keyframes, segmentProperty);
  const segments = segmentKeys.slice(0, -1);
  const activeSegment =
    segments.find((frame) => frame.offset === segmentStart) ?? segments[0];
  const segmentIndex = activeSegment
    ? segmentKeys.findIndex((frame) => frame.offset === activeSegment.offset)
    : -1;
  const segmentEnd =
    segmentIndex >= 0 ? segmentKeys[segmentIndex + 1] : undefined;
  const segmentOverride = activeSegment?.easing?.[segmentProperty];
  const segmentEasing = segmentOverride ?? "__default";

  function updateSegmentEasing(next: string | undefined) {
    if (!activeSegment) return;
    setDraft((previous) => ({
      ...previous,
      keyframes: setSegmentEasing(
        previous.keyframes,
        segmentProperty,
        activeSegment.offset,
        next
      ),
    }));
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
          <Button type="button" size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onApply?.(structuredClone(draft))}
          >
            Apply animation
          </Button>
        </div>
      </header>

      {/* Workspace: preview stays visible while the inspector scrolls independently. */}
      <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 overflow-hidden @2xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <ScrollArea orientation="vertical" className="min-h-0 min-w-0 flex-1">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="w-full max-w-[900px]">
              <AnimationPreview
                animation={draft}
                progress={progress}
                onProgressChange={setProgress}
                seekRequest={seekRequest}
              />
            </div>
          </div>
        </ScrollArea>
        <aside className="flex min-h-0 min-w-0 flex-col border-t border-border @2xl:border-l @2xl:border-t-0">
          <div className="flex shrink-0 items-center gap-1 border-b border-border p-2">
            <Button
              type="button"
              size="xs"
              variant={inspector === "animation" ? "primary" : "ghost"}
              onClick={() => setInspector("animation")}
            >
              Animation
            </Button>
            <Button
              type="button"
              size="xs"
              variant={inspector === "keyframe" ? "primary" : "ghost"}
              onClick={() => setInspector("keyframe")}
            >
              Keyframes
            </Button>
            <Button
              type="button"
              size="xs"
              variant={inspector === "easing" ? "primary" : "ghost"}
              onClick={() => setInspector("easing")}
            >
              Easing
            </Button>
          </div>
          <ScrollArea
            key={inspector}
            orientation="vertical"
            className="min-h-0 flex-1"
          >
            <div className="px-4 py-3">
              {inspector === "animation" && (
                <div className="flex min-w-0 flex-col gap-4">
                  <h3 className="text-xs font-medium">Animation settings</h3>
                  <Field>
                    <Field.Label className="text-xs">Name</Field.Label>
                    <Input
                      value={draft.name}
                      onChange={(event) => setField("name", event.target.value)}
                      className="h-8"
                    />
                  </Field>
                  <Field.Group className="gap-2 [&>*]:min-w-0 [&>*]:flex-1">
                    <NumericInput
                      label="Duration (ms)"
                      value={draft.duration}
                      min={1}
                      step={50}
                      onChange={(next) =>
                        setField("duration", clampNumber(next, 1, 60000))
                      }
                    />
                    <NumericInput
                      label="Delay (ms)"
                      value={draft.delay}
                      min={0}
                      step={50}
                      onChange={(next) =>
                        setField("delay", clampNumber(next, 0, 60000))
                      }
                    />
                  </Field.Group>
                  <StudioSelect
                    label="Default easing"
                    value={draft.easing}
                    options={EASING_OPTIONS}
                    onChange={(next) => setField("easing", next)}
                  />
                </div>
              )}
              {inspector === "keyframe" && (
                <div className="flex min-w-0 flex-col gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium">Keyframes</span>
                    <Button
                      type="button"
                      size="xs"
                      variant="outline"
                      onClick={addKeyframe}
                    >
                      + Keyframe
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sortedFrames(draft.keyframes).map((frame) => (
                      <Button
                        key={frame.offset}
                        type="button"
                        size="xs"
                        variant={
                          selectedOffset === frame.offset
                            ? "primary"
                            : "outline"
                        }
                        onClick={() => selectKeyframe(frame.offset, null)}
                      >
                        {Math.round(frame.offset * 100)}%
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      Selected: {Math.round(selectedOffset * 100)}%
                    </span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {Math.round(selectedOffset * draft.duration)} ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium">
                      {activeProperty
                        ? PROPERTIES.find(({ key }) => key === activeProperty)
                            ?.label
                        : "Keyframe properties"}
                    </span>
                    {activeProperty && (
                      <Button
                        type="button"
                        size="xs"
                        variant="outline"
                        onClick={() => setActiveProperty(null)}
                      >
                        Show all
                      </Button>
                    )}
                  </div>
                  <Field.Group className="flex-wrap gap-3 [&>*]:min-w-[calc(50%-0.375rem)] [&>*]:flex-1">
                    {shownProperties.map(({ key, label, step, min, max }) => {
                      const keyed = selectedFrame?.[key] !== undefined;
                      return (
                        <div key={key} className="flex min-w-0 flex-col gap-1">
                          <NumericInput
                            label={label}
                            value={
                              keyed
                                ? selectedFrame[key]!
                                : valueAt(
                                    draft.keyframes,
                                    key,
                                    selectedOffset,
                                    draft.easing
                                  )
                            }
                            step={step}
                            min={min}
                            max={max}
                            onChange={(next) =>
                              setKeyframe(
                                key,
                                clampNumber(next, min ?? -100000, max ?? 100000)
                              )
                            }
                          />
                          {!keyed && (
                            <Button
                              type="button"
                              size="xs"
                              variant="outline"
                              onClick={() =>
                                addPropertyKeyframe(key, selectedOffset)
                              }
                            >
                              + Add key
                            </Button>
                          )}
                          {keyed &&
                            activeProperty === key &&
                            selectedOffset > 0 &&
                            selectedOffset < 1 && (
                              <Button
                                type="button"
                                size="xs"
                                variant="outline"
                                onClick={removeSelected}
                              >
                                Remove key
                              </Button>
                            )}
                        </div>
                      );
                    })}
                  </Field.Group>
                  {activeProperty === null &&
                    selectedOffset > 0 &&
                    selectedOffset < 1 && (
                      <Button
                        type="button"
                        size="xs"
                        variant="outline"
                        onClick={removeSelected}
                      >
                        Remove selected keyframe
                      </Button>
                    )}
                  <span className="text-[11px] text-muted-foreground">
                    Double-click a property track to add a key at that time.
                    Drag its diamond to move only that property.
                  </span>
                </div>
              )}
              {inspector === "easing" && (
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-medium">Segment easing</span>
                  <Field.Group className="gap-2 [&>*]:min-w-0 [&>*]:flex-1">
                    <StudioSelect
                      label="Property"
                      value={segmentProperty}
                      options={PROPERTIES.map(({ key, label }) => ({
                        value: key,
                        label,
                      }))}
                      onChange={(next) => {
                        setSegmentProperty(next as AnimationProperty);
                        setSegmentStart(0);
                      }}
                    />
                    <StudioSelect
                      label="Interval"
                      value={activeSegment ? String(activeSegment.offset) : ""}
                      disabled={!segments.length}
                      options={segments.map((frame, i) => ({
                        value: String(frame.offset),
                        label: `${Math.round(
                          frame.offset * 100
                        )}% → ${Math.round(segmentKeys[i + 1].offset * 100)}%`,
                      }))}
                      onChange={(next) => setSegmentStart(Number(next))}
                    />
                  </Field.Group>
                  <StudioSelect
                    label="Easing for this segment"
                    disabled={!activeSegment || !segmentEnd}
                    value={
                      segmentEasing.startsWith("cubic-bezier(")
                        ? "__custom"
                        : segmentEasing
                    }
                    options={[
                      {
                        value: "__default",
                        label: `Use default (${draft.easing})`,
                      },
                      ...EASING_OPTIONS,
                      { value: "__custom", label: "Custom cubic-bezier…" },
                    ]}
                    onChange={(next) => {
                      updateSegmentEasing(
                        next === "__default"
                          ? undefined
                          : next === "__custom"
                          ? "cubic-bezier(0.25, 0.1, 0.25, 1)"
                          : next
                      );
                    }}
                  />
                  {activeSegment && segmentEnd && (
                    <div className="w-full">
                      <BezierEditor
                        key={`${segmentProperty}:${activeSegment.offset}`}
                        value={segmentOverride ?? draft.easing}
                        onChange={updateSegmentEasing}
                      />
                    </div>
                  )}
                  <span className="text-[11px] text-muted-foreground">
                    Each property and interval can override the default easing.
                  </span>
                </div>
              )}
            </div>
          </ScrollArea>
        </aside>
      </div>

      {/* Resize grip; timeline stays anchored inside the Playground, not the viewport. */}
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
        onDoubleClick={() => setTimelineHeight(340)}
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
              selectedOffset={selectedOffset}
              duration={draft.duration}
              onSelect={selectKeyframe}
              onMove={moveKeyframe}
              onAdd={addPropertyKeyframe}
              progress={progress}
              onSeek={seekTimeline}
              activeProperty={activeProperty}
              onPropertySelect={(property) => {
                setActiveProperty(property);
                setInspector("keyframe");
              }}
            />
          </div>
        </ScrollArea>
      </div>
    </section>
  );
}

function NumericInput({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <Field className="min-w-0">
      <Field.Label className="text-xs">{label}</Field.Label>
      <NumberField
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(next) => {
          if (next !== null && Number.isFinite(next)) onChange(next);
        }}
        className="w-full"
      >
        <NumberField.Group className="h-8 w-full overflow-hidden rounded-md">
          <NumberField.Decrement className="h-8 shrink-0 px-2 [&_svg]:size-3" />
          <NumberField.Input
            aria-label={label}
            className="h-8 min-w-0 w-full flex-1 text-center text-xs tabular-nums"
          />
          <NumberField.Increment className="h-8 shrink-0 px-2 [&_svg]:size-3" />
        </NumberField.Group>
      </NumberField>
    </Field>
  );
}

const EASING_OPTIONS = [
  { value: "linear", label: "Linear" },
  { value: "ease", label: "Ease" },
  { value: "ease-in", label: "Ease in" },
  { value: "ease-out", label: "Ease out" },
  { value: "ease-in-out", label: "Ease in out" },
];

function StudioSelect({
  label,
  value,
  options,
  disabled = false,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const id = React.useId();
  return (
    <Field className="min-w-0">
      <Field.Label id={id} className="text-xs">
        {label}
      </Field.Label>
      <Select
        value={value}
        disabled={disabled}
        onValueChange={(next) => {
          if (typeof next === "string") onChange(next);
        }}
      >
        <Select.Trigger
          size="xs"
          aria-labelledby={id}
          className="h-8 w-full min-w-0 text-xs"
        >
          <Select.Value>
            {options.find((option) => option.value === value)?.label ?? value}
          </Select.Value>
          <Select.Icon />
        </Select.Trigger>
        <Select.Popup
          positionerProps={{
            alignItemWithTrigger: true,
            align: "start",
            // Remains above the Playground chrome; no Dialog portal anymore.
            className: "z-[60]",
          }}
        >
          <Select.List>
            {options.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                <Select.ItemIndicator />
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Popup>
      </Select>
    </Field>
  );
}
