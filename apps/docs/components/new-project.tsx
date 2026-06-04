"use client";

import { Dialog, DialogCreateHandle } from "@rlz/ui/components/ui/dialog";
import { Field } from "@rlz/ui/components/ui/field";
import { CommandTabs } from "./command-tabs";
import { Button } from "@rlz/ui/components/ui/button";
import { Combobox } from "@rlz/ui/components/ui/combobox";

export const dialogHandle = DialogCreateHandle();

export function NewProject() {
  return (
    <Dialog handle={dialogHandle} variant="bare-bottom">
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>New Project</Dialog.Title>
          <Dialog.Description>
            create your new project with rlz-ui
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <Field>
            <Field.Label>Header Fonts</Field.Label>
            <Combobox>
              <Combobox.Field clearable />
            </Combobox>
          </Field>
          <Field>
            <Field.Label>Fonts</Field.Label>
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
