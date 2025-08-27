"use client";

import { useState } from "react";
import { ToggleGroup } from "@ui/components/toggle-group";
import { BorderFlash } from "@ui/components/animations/border-flash";
import { CodeWrapper } from "@ui/components/code-wrapper";
import { Clipboard } from "./clipboard";

import { demos } from "./demo/demos";

const ComponentPreview = ({ name }: { name: keyof typeof demos }) => {
  const [view, setView] = useState<"preview" | "code">("preview");
  const example = demos[name];

  if (!example) {
    return null;
  }

  return (
    <div className="grid">
      <div className="flex items-center justify-start mb-4">
        <ToggleGroup
          type="single"
          defaultValue="preview"
          className="w-fit gap-2"
          aria-label="View Mode"
        >
          <ToggleGroup.Item
            value="preview"
            className="rounded-md p-4"
            size="sm"
            onClick={() => setView("preview")}
          >
            Preview
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value="code"
            className="rounded-md"
            size="sm"
            onClick={() => setView("code")}
          >
            Code
          </ToggleGroup.Item>
        </ToggleGroup>
      </div>
      {view === "preview" ? (
        <BorderFlash.Box className="w-full max-w-none">
          <BorderFlash.BoxContent className="h-[450px] items-center justify-center p-6">
            <div className="w-full">{example.component}</div>
          </BorderFlash.BoxContent>
        </BorderFlash.Box>
      ) : (
        <div className="relative">
          <div className="absolute right-4 top-4">
            <Clipboard text={example.code} />
          </div>
          <CodeWrapper
            code={example.code}
            language="tsx"
            showLineNumbers={true}
            customStyle={{
              borderRadius: "0.5rem",
              backgroundColor: "var(--background-secondary)",
              maxHeight: "450px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export { ComponentPreview };
