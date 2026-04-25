"use client";

import dynamic from "next/dynamic";

import { ComponentsExamples } from "@rlz/ui/components/examples";
import { CodeTriggerWrapper } from "./code-trigger-wrapper";
import { CodeBlock } from "./code-block";
import { Pre } from "./Pre";

import { cn } from "@rlz/ui/lib/cn";

export function ComponentPreviewClient({
  name,
  highlighted,
  className,
}: {
  name: string;
  highlighted: string;
  className?: string;
}) {
  const loader = ComponentsExamples[name];
  const DemoComponent = loader ? dynamic(loader, { ssr: false }) : null;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="relative h-[350px] flex items-center justify-center p-6 border border-b-0 rounded-t-md">
        {DemoComponent ? (
          <DemoComponent />
        ) : (
          <p className="text-muted-foreground text-sm">Not found: {name}</p>
        )}
      </div>
      <CodeTriggerWrapper>
        <CodeBlock className="mt-0 rounded-t-none h-80">
          <Pre dangerouslySetInnerHTML={{ __html: highlighted }} />
        </CodeBlock>
      </CodeTriggerWrapper>
    </div>
  );
}
