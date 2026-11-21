"use client";

import { Field } from "@rlz/ui/components/ui/field";
import { Input } from "@rlz/ui/components/ui/input";
import { clampNumber } from "../../../lib/animation-model";
import type { AnimationDraft } from "../../../hooks/use-animation-draft";
import { EASING_OPTIONS, NumericInput, StudioSelect } from "./studio-fields";

export function AnimationSettings({
  draft,
  setField,
}: Pick<AnimationDraft, "draft" | "setField">) {
  return (
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
          onChange={(next) => setField("duration", clampNumber(next, 1, 60000))}
        />
        <NumericInput
          label="Delay (ms)"
          value={draft.delay}
          min={0}
          step={50}
          onChange={(next) => setField("delay", clampNumber(next, 0, 60000))}
        />
      </Field.Group>
      <StudioSelect
        label="Default easing"
        value={draft.easing}
        options={EASING_OPTIONS}
        onChange={(next) => setField("easing", next)}
      />
    </div>
  );
}
