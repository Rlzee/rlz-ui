"use client";

import * as React from "react";

import { Dialog, DialogCreateHandle } from "@rlz/ui/components/ui/dialog";
import { Field } from "@rlz/ui/components/ui/field";
import { CommandTabs } from "./command-tabs";
import { Tabs } from "@rlz/ui/components/ui/tabs";
import { Toggle } from "@rlz/ui/components/ui/toggle";
import { FontSelect } from "./font-select";
import { IconLibSelect } from "./icon-lib-select";
import FrameworkIcon from "./icons/framework";

export const dialogHandle = DialogCreateHandle();

import { defaultPreset } from "@rlz/ui/styles/presets";

const RECOMMENDATIONS = defaultPreset.recommendations;

export function ProjectDialog() {
  const [activeTab, setActiveTab] = React.useState("new-project");

  const [fontSans, setFontSans] = React.useState<string | undefined>(
    RECOMMENDATIONS?.typography?.fontSans
  );

  const [headingFont, setHeadingFont] = React.useState<string | undefined>(
    RECOMMENDATIONS?.typography?.fontHeading
  );

  const [monoFont, setMonoFont] = React.useState<string | undefined>(
    RECOMMENDATIONS?.typography?.fontMono
  );

  const [iconLib, setIconLib] = React.useState<string | undefined>(
    RECOMMENDATIONS?.icons?.library
  );

  const [template, setTemplate] = React.useState("next");

  const command = React.useMemo(() => {
    const action = activeTab === "existing-project" ? "init" : "create";

    const parts = [`rlz@latest ${action}`];

    if (activeTab === "new-project") {
      parts.push(`--framework ${template}`);
    }

    if (fontSans) {
      parts.push(`--font-sans "${fontSans}"`);
    }

    if (headingFont) {
      parts.push(`--font-heading "${headingFont}"`);
    }

    if (monoFont) {
      parts.push(`--font-mono "${monoFont}"`);
    }

    if (iconLib) {
      parts.push(`--icon-lib ${iconLib}`);
    }

    return parts.join(" ");
  }, [activeTab, template, fontSans, headingFont, monoFont, iconLib]);

  return (
    <Dialog handle={dialogHandle} variant="bare-bottom">
      <Dialog.Popup>
        <Dialog.Header className="pb-0">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab((value as typeof activeTab) ?? "new-project")
            }
            aria-label="Project type"
          >
            <Tabs.List>
              <Tabs.Tab value="new-project">New Project</Tabs.Tab>
              <Tabs.Tab value="existing-project">Existing Project</Tabs.Tab>
              <Tabs.Indicator variant="underline" />
            </Tabs.List>
          </Tabs>
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

          <Field>
            <Field.Label>Sans Font</Field.Label>

            <FontSelect
              value={fontSans}
              defaultValue={RECOMMENDATIONS?.typography?.fontSans}
              onValueChange={setFontSans}
            />
          </Field>

          <Field>
            <Field.Label>Heading Font</Field.Label>

            <FontSelect
              value={headingFont}
              defaultValue={RECOMMENDATIONS?.typography?.fontHeading}
              onValueChange={setHeadingFont}
            />
          </Field>

          <Field>
            <Field.Label>Mono Font</Field.Label>

            <FontSelect
              value={monoFont}
              defaultValue={RECOMMENDATIONS?.typography?.fontMono}
              onValueChange={setMonoFont}
            />
          </Field>

          <Field>
            <Field.Label>Icons Library</Field.Label>

            <IconLibSelect
              value={iconLib}
              defaultValue={RECOMMENDATIONS?.icons?.library}
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
