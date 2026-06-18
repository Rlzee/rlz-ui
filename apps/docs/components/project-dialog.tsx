"use client";

import * as React from "react";

import { Dialog, DialogCreateHandle } from "@rlz/ui/components/ui/dialog";
import { Field } from "@rlz/ui/components/ui/field";
import { CommandTabs } from "./command-tabs";
import { Toggle } from "@rlz/ui/components/ui/toggle";
import { Combobox } from "@rlz/ui/components/ui/combobox";

export const dialogHandle = DialogCreateHandle();

export function ProjectDialog() {
  const [activeTab, setActiveTab] = React.useState("new-project");

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
            <Combobox>
              <Combobox.Field clearable />
            </Combobox>
          </Field>
          <Field>
            <Field.Label>Body Font</Field.Label>
            <Combobox>
              <Combobox.Field clearable />
            </Combobox>
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
            __npm__="npx rlz@latest create"
            __pnpm__="pnpm dlx rlz@latest create"
            __yarn__="yarn dlx rlz@latest create"
            __bun__="bunx --bun rlz@latest create"
          />
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
}
