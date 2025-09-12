"use client";

import { useState } from "react";
import { ToggleGroup } from "@ui/components/toggle-group";
import { BorderFlash } from "@ui/components/animations/border-flash";
import { Clipboard } from "./clipboard";
import { CodeBlock } from "./code-block";

import { demos } from "./demo/demos";

const ComponentPreview = ({ name }: { name: keyof typeof demos }) => {
  const [view, setView] = useState<"preview" | "code">("preview");
  const example = demos[name];

  if (!example) {
    return null;
  }

  return (
    <div className="grid">
      <div className="flex items-center justify-start">
        <ToggleGroup
          type="single"
          defaultValue="preview"
          className="w-fit bg-background-secondary p-1 rounded-lg"
          aria-label="View Mode"
          size="custom"
        >
          <ToggleGroup.Item
            value="preview"
            className="rounded-md px-4 hover:bg-transparent cursor-pointer"
            onClick={() => setView("preview")}
          >
            Preview
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value="code"
            className="rounded-md px-4 hover:bg-transparent cursor-pointer"
            onClick={() => setView("code")}
          >
            Code
          </ToggleGroup.Item>
        </ToggleGroup>
      </div>
      {view === "preview" ? (
        <div className="pt-3.5">
          <BorderFlash.Box className="w-full max-w-none">
            <BorderFlash.BoxContent className="h-[450px] items-center justify-center p-6">
              <div className="w-full">{example.component}</div>
            </BorderFlash.BoxContent>
          </BorderFlash.Box>
        </div>
      ) : (
        <CodeBlock code={example.code} />
      )}
    </div>
  );
};

export { ComponentPreview };
