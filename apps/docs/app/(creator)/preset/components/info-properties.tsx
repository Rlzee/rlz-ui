"use client";

import { useAtom } from "jotai";
import type { RegistryPreset } from "@rlz/registry";

import { Fieldset } from "@rlz/ui/components/ui/fieldset";
import { Field } from "@rlz/ui/components/ui/field";
import { Input } from "@rlz/ui/components/ui/input";
import { Textarea } from "@rlz/ui/components/ui/textarea";

import { presetBuilderAtom } from "../preset-builder";

/**
 * What the preset says about itself. `name` and `description` are the draft's own
 * words, so they are editable here - the name also lives in the top bar, and both
 * read and write the same draft. `id` and `version` are registry coordinates: the
 * key the preset is served under and the revision it was published at. They are
 * form fields like the others, only disabled - the Creator reads them, it does not
 * move them, which is the same rule the JSON dialog enforces through `keepIdentity`.
 */
export function InfoProperties() {
  const [preset, setPreset] = useAtom(presetBuilderAtom);

  const update = (
    patch: Partial<Pick<RegistryPreset, "name" | "description">>
  ) => {
    setPreset((prev) => ({ ...prev, ...patch }));
  };

  return (
    <section id="editor-info" className="h-full">
      <Fieldset className="px-3 py-3">
        <Field>
          <Field.Label htmlFor="preset-name" className="text-xs">
            Name
          </Field.Label>

          <Input
            id="preset-name"
            value={preset.name}
            placeholder="No name"
            onChange={(event) => update({ name: event.target.value })}
          />
        </Field>

        <Field>
          <Field.Label htmlFor="preset-description" className="text-xs">
            Description
          </Field.Label>

          <Textarea
            id="preset-description"
            rows={3}
            value={preset.description ?? ""}
            placeholder="What this preset is about"
            onChange={(event) =>
              // An emptied description leaves the preset rather than being kept as
              // an empty string, which the registry says as "nothing to show".
              update({ description: event.target.value || undefined })
            }
          />
        </Field>

        <Field>
          <Field.Label htmlFor="preset-id" className="text-xs">
            Id
          </Field.Label>

          <Input
            id="preset-id"
            value={preset.id}
            disabled
            className="font-mono text-xs"
          />

          <Field.Description>
            The registry key this preset is served under.
          </Field.Description>
        </Field>

        <Field>
          <Field.Label htmlFor="preset-version" className="text-xs">
            Version
          </Field.Label>

          <Input
            id="preset-version"
            value={preset.version}
            disabled
            className="font-mono text-xs"
          />

          <Field.Description>
            The revision the preset was published at.
          </Field.Description>
        </Field>
      </Fieldset>
    </section>
  );
}
