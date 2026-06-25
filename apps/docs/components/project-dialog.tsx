"use client";

import * as React from "react";

import { Dialog, DialogCreateHandle } from "@rlz/ui/components/ui/dialog";
import { Field } from "@rlz/ui/components/ui/field";
import { CommandTabs } from "./command-tabs";
import { Toggle } from "@rlz/ui/components/ui/toggle";
import { FontSelect } from "./font-select";
import { Combobox } from "@rlz/ui/components/ui/combobox";

export const dialogHandle = DialogCreateHandle();

export function ProjectDialog() {
  const [activeTab, setActiveTab] = React.useState("new-project");

  const [bodyFont, setBodyFont] = React.useState("Geist");
  const [headingFont, setHeadingFont] = React.useState("Geist Mono");

  const command = React.useMemo(() => {
    const parts = ["npx rlz@latest create"];

    if (bodyFont !== "Geist") {
      parts.push(`--body-font "${bodyFont}"`);
    }

    if (headingFont !== "Geist Mono") {
      parts.push(`--heading-font "${headingFont}"`);
    }

    return parts.join(" ");
  }, [bodyFont, headingFont]);

  return (
    <Dialog handle={dialogHandle}>
      <Dialog.Popup>
        <Dialog.Header>
          <Toggle.Group
            value={[activeTab]}
            onValueChange={(values) =>
              setActiveTab((values[0] as typeof activeTab) ?? "new-project")
            }
            aria-label="Project type"
            className="gap-1.5"
          >
            <Toggle value="new-project">New Project</Toggle>
            <Toggle value="existing-project">Existing Project</Toggle>
          </Toggle.Group>
        </Dialog.Header>

        <Dialog.Body>
          <Field>
            <Field.Label>Heading Font</Field.Label>
            <FontSelect
              value={headingFont}
              defaultValue="Geist Mono"
              onValueChange={setHeadingFont}
            />
          </Field>

          <Field>
            <Field.Label>Body Font</Field.Label>
            <FontSelect
              value={bodyFont}
              defaultValue="Geist"
              onValueChange={setBodyFont}
            />
          </Field>

          <Field>
            <Field.Label>Icons Library</Field.Label>
            <Combobox>
              <Combobox.Field clearable />
            </Combobox>
          </Field>

          <Field>
            <Field.Label>Themes</Field.Label>
            <Combobox>
              <Combobox.Field clearable />
            </Combobox>
          </Field>
        </Dialog.Body>

        <Dialog.Footer className="sm:justify-start sm:flex-col">
          <CommandTabs
            __npm__={command}
            __pnpm__={command}
            __yarn__={command}
            __bun__={command}
          />
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
}
