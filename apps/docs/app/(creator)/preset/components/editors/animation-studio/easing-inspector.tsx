"use client";

import { Field } from "@rlz/ui/components/ui/field";
import { propertyFrames } from "../../../lib/animation-model";
import type { AnimationDraft } from "../../../hooks/use-animation-draft";
import { ANIMATION_PROPERTY_FIELDS } from "./animation-property-fields";
import { BezierEditor } from "./bezier-editor";
import { EASING_OPTIONS, StudioSelect } from "./studio-fields";

export function EasingInspector({
  draft,
  updateSegmentEasing,
  segmentProperty,
  setSegmentProperty,
  segmentStart,
  setSegmentStart,
}: Pick<
  AnimationDraft,
  | "draft"
  | "updateSegmentEasing"
  | "segmentProperty"
  | "setSegmentProperty"
  | "segmentStart"
  | "setSegmentStart"
>) {
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

  function changeEasing(next: string | undefined) {
    if (activeSegment)
      updateSegmentEasing(segmentProperty, activeSegment.offset, next);
  }

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-medium">Segment easing</span>
      <Field.Group className="gap-2 [&>*]:min-w-0 [&>*]:flex-1">
        <StudioSelect
          label="Property"
          value={segmentProperty}
          options={ANIMATION_PROPERTY_FIELDS.map(({ key, label }) => ({
            value: key,
            label,
          }))}
          onChange={(next) => {
            const property = ANIMATION_PROPERTY_FIELDS.find(
              ({ key }) => key === next
            );
            if (!property) return;
            setSegmentProperty(property.key);
            setSegmentStart(0);
          }}
        />
        <StudioSelect
          label="Interval"
          value={activeSegment ? String(activeSegment.offset) : ""}
          disabled={!segments.length}
          options={segments.map((frame, index) => ({
            value: String(frame.offset),
            label: `${Math.round(frame.offset * 100)}% → ${Math.round(
              segmentKeys[index + 1].offset * 100
            )}%`,
          }))}
          onChange={(next) => setSegmentStart(Number(next))}
        />
      </Field.Group>
      <StudioSelect
        label="Easing for this segment"
        disabled={!activeSegment || !segmentEnd}
        value={
          segmentEasing.startsWith("cubic-bezier(") ? "__custom" : segmentEasing
        }
        options={[
          { value: "__default", label: `Use default (${draft.easing})` },
          ...EASING_OPTIONS,
          { value: "__custom", label: "Custom cubic-bezier…" },
        ]}
        onChange={(next) =>
          changeEasing(
            next === "__default"
              ? undefined
              : next === "__custom"
              ? "cubic-bezier(0.25, 0.1, 0.25, 1)"
              : next
          )
        }
      />
      {activeSegment && segmentEnd && (
        <div className="w-full">
          <BezierEditor
            key={`${segmentProperty}:${activeSegment.offset}`}
            value={segmentOverride ?? draft.easing}
            onChange={changeEasing}
          />
        </div>
      )}
      <span className="text-[11px] text-muted-foreground">
        Each property and interval can override the default easing.
      </span>
    </div>
  );
}
