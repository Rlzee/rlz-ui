"use client";

import dynamic from "next/dynamic";

import { demoPaths } from "@rlz/ui/components/examples";
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
  const entry = demoPaths[name];
  const DemoComponent = entry
    ? dynamic(() => import(`@rlz/ui/components/examples/ui/${entry}`), {
        ssr: false,
      })
    : null;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="relative h-[350px] bg-secondary flex items-center justify-center p-6 border border-b-0 rounded-t-md">
        {DemoComponent ? (
          <DemoComponent />
        ) : (
          <p className="text-muted-foreground text-sm">Not found: {name}</p>
        )}
      </div>
      <CodeTriggerWrapper>
        <CodeBlock className="mt-0 rounded-t-none border-t-0 h-80">
          <Pre dangerouslySetInnerHTML={{ __html: highlighted }} />
        </CodeBlock>
      </CodeTriggerWrapper>
    </div>
  );
}
