"use client";

import { Tabs } from "@ui/components/tabs";
import { BorderFlash } from "@ui/components/animations/border-flash";
import { CodeBlock } from "./code-block";
import { Button } from "@/src/ui/components/button";
import { RefreshCcw } from "lucide-react";
import React, { useState } from "react";

import { demos } from "./demo/demos";

const ComponentPreview = ({
  name,
  refresh = false,
}: {
  name: keyof typeof demos;
  refresh?: boolean;
}) => {
  const example = demos[name];

  if (!example) {
    return null;
  }

  const [previewKey, setPreviewKey] = useState(0);

  return (
    <Tabs defaultValue="preview" className="w-full ">
      <Tabs.List className="bg-background-secondary">
        <Tabs.Trigger value="preview" className="border-none hover:text-white">
          Preview
        </Tabs.Trigger>
        <Tabs.Trigger value="code" className="border-none hover:text-white">
          Code
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="preview" className="pt-3.5">
        <BorderFlash.Box className="w-full max-w-none">
          <BorderFlash.BoxContent className="relative h-[450px] items-center justify-center p-6">
            {refresh && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-0 right-0"
                onClick={() => setPreviewKey((k) => k + 1)}
                aria-label="Refresh preview"
              >
                <RefreshCcw />
              </Button>
            )}
            <div className="w-full" key={previewKey}>
              {example.component}
            </div>
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
