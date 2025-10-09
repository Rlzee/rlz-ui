"use client";

import { Tabs } from "@ui/components/tabs";
import { BorderFlash } from "@ui/components/animations/border-flash";
import { CodeBlock } from "./code-block";

import { demos } from "./demo/demos";

const ComponentPreview = ({ name }: { name: keyof typeof demos }) => {
  const example = demos[name];

  if (!example) {
    return null;
  }

  return (
    <Tabs defaultValue="preview" className="w-full ">
      <Tabs.List className="bg-background-secondary">
        <Tabs.Trigger value="preview" className="border-none hover:text-white">Preview</Tabs.Trigger>
        <Tabs.Trigger value="code" className="border-none hover:text-white">Code</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="preview" className="pt-3.5">
        <BorderFlash.Box className="w-full max-w-none">
          <BorderFlash.BoxContent className="h-[450px] items-center justify-center p-6">
            <div className="w-full">{example.component}</div>
          </BorderFlash.BoxContent>
        </BorderFlash.Box>
      </Tabs.Content>
      <Tabs.Content value="code">
        <CodeBlock code={example.code} />
      </Tabs.Content>
    </Tabs>
  );
};

export { ComponentPreview };
