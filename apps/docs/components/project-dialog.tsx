"use client";

import * as React from "react";

import { Dialog, DialogCreateHandle } from "@rlz/ui/components/ui/dialog";
import { Field } from "@rlz/ui/components/ui/field";
import { CommandTabs } from "./command-tabs";
import { Toggle } from "@rlz/ui/components/ui/toggle";
import { FontSelect } from "./font-select";
import { IconLibSelect } from "./icon-lib-select";
import FrameworkIcon from "./icons/framework";

export const dialogHandle = DialogCreateHandle();

import { DEFAULT_PRESET } from "@rlz/ui/styles/preset";
const BASE = DEFAULT_PRESET.base;

export function ProjectDialog() {
  const [activeTab, setActiveTab] = React.useState("new-project");

  const [bodyFont, setBodyFont] = React.useState(BASE.typography.bodyFont);
  const [headingFont, setHeadingFont] = React.useState(
    BASE.typography.headingFont
  );
  const [iconLib, setIconLib] = React.useState(BASE.icons.library);
  const [template, setTemplate] = React.useState("next");

  const command = React.useMemo(() => {
    const action = activeTab === "existing-project" ? "init" : "create";
    const parts = [`rlz@latest ${action}`];
    if (activeTab === "new-project") {
      parts.push(`--framework ${template}`);
    }
    if (bodyFont !== "Geist") {
      parts.push(`--body-font "${bodyFont}"`);
    }
    if (headingFont !== "Geist Mono") {
      parts.push(`--heading-font "${headingFont}"`);
    }
    parts.push(`--icon-lib ${iconLib}`);
    return parts.join(" ");
  }, [activeTab, template, bodyFont, headingFont, iconLib]);

  return (
    <Dialog handle={dialogHandle} variant="bare-bottom">
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
                  <FrameworkIcon.NextJs />
                  Next.js
                </Toggle>
                <Toggle
                  value="vite"
                  className="w-full rounded-lg border p-3 bg-card justify-start"
                >
                  <FrameworkIcon.Vite />
                  Vite
                </Toggle>
                <Toggle
                  value="react"
                  className="w-full rounded-lg border p-3 bg-card justify-start"
                >
                  <FrameworkIcon.React />
                  React
                </Toggle>
              </Toggle.Group>
            </Field>
          )}

          {/*<Field>
            <Field.Label>Theme</Field.Label>
            <Button variant="outline">Add a Theme</Button>
          </Field>*/}

          <Field>
            <Field.Label>Heading Font</Field.Label>
            <FontSelect
              value={headingFont}
              defaultValue={BASE.typography.headingFont}
              onValueChange={setHeadingFont}
            />
          </Field>

          <Field>
            <Field.Label>Body Font</Field.Label>
            <FontSelect
              value={bodyFont}
              defaultValue={BASE.typography.bodyFont}
              onValueChange={setBodyFont}
            />
          </Field>

          <Field>
            <Field.Label>Icons Library</Field.Label>
            <IconLibSelect
              value={iconLib}
              defaultValue={BASE.icons.library}
              onValueChange={setIconLib}
            />
          </Field>
        </Dialog.Body>

        <Dialog.Footer className="sm:justify-start sm:flex-col">
          <CommandTabs
            __npm__={`npx ${command}`}
            __pnpm__={`pnpm dlx ${command}`}
            __yarn__={`yarn dlx ${command}`}
            __bun__={`bunx --bun ${command}`}
          />
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
}
