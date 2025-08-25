import * as React from "react";
import { cn } from "@ui/lib/utils";
import { useMDXComponent } from "next-contentlayer2/hooks";

import { BlockDocs } from "./block-docs";
import { Preview } from "./preview";
import { Accordion } from "@ui/components/accordion";

const components = {
  BlockDocs,
  Preview,
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn("text-foreground text-lg font-heading", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("text-muted-foreground text-sm", className)} {...props} />
  ),
  Accordion,
};

export const Mdx = ({ code }: { code: string }) => {
  const Component = useMDXComponent(code);

  return <Component components={components} />;
};
