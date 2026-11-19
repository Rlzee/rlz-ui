"use client";

import * as React from "react";
import { Button } from "@rlz/ui/components/ui/button";
import { Dialog } from "@rlz/ui/components/ui/dialog";
import { Input } from "@rlz/ui/components/ui/input";
import { Field } from "@rlz/ui/components/ui/field";
import { NumberField } from "@rlz/ui/components/ui/number-field";
import { Select } from "@rlz/ui/components/ui/select";
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

export function AnimationStudio({
  value = DEFAULT_ANIMATION,
  onApply,
  trigger,
}: {
  value?: CreatorAnimation;
  onApply?: (animation: CreatorAnimation) => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<CreatorAnimation>(() =>
    structuredClone(value)
  );
  const [selectedOffset, setSelectedOffset] = React.useState(0);
  const [activeProperty, setActiveProperty] =
    React.useState<AnimationProperty | null>(null);
  const [progress, setProgress] = React.useState(0);
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
    let left = 0,
      widest = 0;
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
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setDraft(structuredClone(value));
          setSelectedOffset(0);
          setProgress(0);
          setActiveProperty(null);
          setSeekRequest({ value: 0, id: 0 });
          setSegmentProperty("scale");
          setSegmentStart(0);
        }
        setOpen(next);
      }}
    >
      <Dialog.Trigger
        render={<Button type="button" size="sm" variant="outline" />}
      >
        {trigger ?? "Open Animation Studio"}
      </Dialog.Trigger>
      <Dialog.Popup className="max-w-4xl">
        <Dialog.Header>
          <Dialog.Title>Animation Studio</Dialog.Title>
          <Dialog.Description>
            Create independent keyframes for each animated property.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="gap-4">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <AnimationPreview
              animation={draft}
              progress={progress}
              onProgressChange={setProgress}
              seekRequest={seekRequest}
            />
            <div className="flex min-w-0 flex-col gap-3">
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
              <div className="rounded-md border p-2.5 flex flex-col gap-2">
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
                      label: `${Math.round(frame.offset * 100)}% → ${Math.round(
                        segmentKeys[i + 1].offset * 100
                      )}%`,
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
                  <BezierEditor
                    key={`${segmentProperty}:${activeSegment.offset}`}
                    value={segmentOverride ?? draft.easing}
                    onChange={updateSegmentEasing}
                  />
                )}
                <span className="text-[11px] text-muted-foreground">
                  Each property and interval can override the default easing.
                </span>
              </div>
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
                      selectedOffset === frame.offset ? "primary" : "outline"
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
                Double-click a property track to add a key at that time. Drag
                its diamond to move only that property.
              </span>
            </div>
          </div>
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
            onPropertySelect={setActiveProperty}
          />
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close render={<Button type="button" variant="outline" />}>
            Cancel
          </Dialog.Close>
          <Button
            type="button"
            onClick={() => {
              onApply?.(structuredClone(draft));
              setOpen(false);
            }}
          >
            Apply animation
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
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
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Popup
          positionerProps={{
            alignItemWithTrigger: true,
            align: "start",
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
