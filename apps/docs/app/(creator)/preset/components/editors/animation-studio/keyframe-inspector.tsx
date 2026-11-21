"use client";

import { Button } from "@rlz/ui/components/ui/button";
import { Field } from "@rlz/ui/components/ui/field";
import {
  clampNumber,
  sortedFrames,
  valueAt,
} from "../../../lib/animation-model";
import type { AnimationDraft } from "../../../hooks/use-animation-draft";
import { ANIMATION_PROPERTY_FIELDS } from "./animation-property-fields";
import { NumericInput } from "./studio-fields";

type KeyframeInspectorProps = Pick<
  AnimationDraft,
  | "draft"
  | "selectedOffset"
  | "activeProperty"
  | "setActiveProperty"
  | "selectKeyframe"
  | "setKeyframe"
  | "addKeyframe"
  | "addPropertyKeyframe"
  | "removeSelected"
>;

export function KeyframeInspector({
  draft,
  selectedOffset,
  activeProperty,
  setActiveProperty,
  selectKeyframe,
  setKeyframe,
  addKeyframe,
  addPropertyKeyframe,
  removeSelected,
}: KeyframeInspectorProps) {
  const selectedFrame = draft.keyframes.find(
    (frame) => frame.offset === selectedOffset
  );
  const shownProperties = ANIMATION_PROPERTY_FIELDS.filter(
    ({ key }) => activeProperty === null || activeProperty === key
  );
  const canRemove = selectedOffset > 0 && selectedOffset < 1;

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium">Keyframes</span>
        <Button type="button" size="xs" variant="outline" onClick={addKeyframe}>
          + Keyframe
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedFrames(draft.keyframes).map((frame) => (
          <Button
            key={frame.offset}
            type="button"
            size="xs"
            variant={selectedOffset === frame.offset ? "primary" : "outline"}
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
            ? ANIMATION_PROPERTY_FIELDS.find(
                ({ key }) => key === activeProperty
              )?.label
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
          const keyedValue = selectedFrame?.[key];
          const keyed = keyedValue !== undefined;
          return (
            <div key={key} className="flex min-w-0 flex-col gap-1">
              <NumericInput
                label={label}
                value={
                  keyedValue ??
                  valueAt(draft.keyframes, key, selectedOffset, draft.easing)
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
                  onClick={() => addPropertyKeyframe(key, selectedOffset)}
                >
                  + Add key
                </Button>
              )}
              {keyed && activeProperty === key && canRemove && (
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
      {activeProperty === null && canRemove && (
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
        Double-click a property track to add a key at that time. Drag its
        diamond to move only that property.
      </span>
    </div>
  );
}
