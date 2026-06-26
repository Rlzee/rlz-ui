"use client";

import * as React from "react";

import { Dialog, DialogCreateHandle } from "@rlz/ui/components/ui/dialog";
import { Field } from "@rlz/ui/components/ui/field";
import { CommandTabs } from "./command-tabs";
import { Toggle } from "@rlz/ui/components/ui/toggle";
import { FontSelect } from "./font-select";
import { IconLibSelect } from "./icon-lib-select";
import { Button } from "@rlz/ui/components/ui/button";

export const dialogHandle = DialogCreateHandle();

export function ProjectDialog() {
  const [activeTab, setActiveTab] = React.useState("new-project");

  const [bodyFont, setBodyFont] = React.useState("Geist");
  const [headingFont, setHeadingFont] = React.useState("Geist Mono");
  const [template, setTemplate] = React.useState("next");

  const command = React.useMemo(() => {
    const action = activeTab === "existing-project" ? "init" : "create";
    const parts = [`npx rlz@latest ${action}`];
    if (activeTab === "new-project") {
      parts.push(`--framework ${template}`);
    }
    if (bodyFont !== "Geist") {
      parts.push(`--body-font "${bodyFont}"`);
    }
    if (headingFont !== "Geist Mono") {
      parts.push(`--heading-font "${headingFont}"`);
    }
    return parts.join(" ");
  }, [activeTab, template, bodyFont, headingFont]);

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
          {activeTab === "new-project" && (
            <Field>
              <Field.Label>Template</Field.Label>
              <Toggle.Group
                value={[template]}
                onValueChange={(values) => setTemplate(values[0] ?? "next")}
                aria-label="Select framework"
                className="gap-1.5"
              >
                <Toggle
                  value="next"
                  className="w-full rounded-lg border p-3 bg-card justify-start"
                >
                  Next.js
                </Toggle>
                <Toggle
                  value="vite"
                  className="w-full rounded-lg border p-3 bg-card justify-start"
                >
                  Vite
                </Toggle>
                <Toggle
                  value="react"
                  className="w-full rounded-lg border p-3 bg-card justify-start"
                >
                  React
                </Toggle>
              </Toggle.Group>
            </Field>
          )}

          <Button variant="outline">Add a Theme</Button>

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
            <IconLibSelect defaultValue="lucide" />
          </Field>

          <CommandTabs
            __npm__={command}
            __pnpm__={command}
            __yarn__={command}
            __bun__={command}
          />
        </Dialog.Body>

        <Dialog.Footer className="sm:justify-start sm:flex-col">
          <Button>Copy Command</Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
}
