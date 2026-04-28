import React from "react";
import type { MDXComponents } from "mdx/types";
import { CommandTabs } from "./command-tabs";
import { CodeTabs } from "./code-tabs";
import {
  TabsList,
  TabsPanel,
  TabsTab,
  TabsIndicator,
} from "@rlz/ui/components/ui/tabs";
import { CodeBlock } from "./code-block";
import { ComponentsList } from "./components-list";
import { Pre } from "./Pre";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { ComponentSource } from "./component-source";
import { cn } from "@rlz/ui/lib/cn";
import { ComponentPreview } from "./component-preview";

function MDXComponents() {
  return {
    h1: ({ className, ...props }: React.ComponentProps<"h1">) => (
      <h1
        className={cn(
          "scroll-m-20 text-3xl font-semibold tracking-tight xl:text-4xl",
          className
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }: React.ComponentProps<"h2">) => (
      <h2
        id={props.children
          ?.toString()
          .replace(/ /g, "-")
          .replace(/'/g, "")
          .replace(/\?/g, "")
          .toLowerCase()}
        className={cn(
          "[&+]*:[code]:text-xl mt-10 scroll-m-24 text-xl xl:text-2xl font-medium tracking-tight first:mt-0 lg:mt-12 [&+.steps]:mt-0! [&+.steps>h3]:mt-4! [&+h3]:mt-6! [&+p]:mt-4!",
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.ComponentProps<"h3">) => (
      <h3
        className={cn(
          "mt-8 scroll-m-20 font-semibold text-lg *:[code]:text-lg",
          className
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }: React.ComponentProps<"p">) => (
      <p
        className={cn(
          "not-first:mt-6 leading-relaxed text-muted-foreground",
          className
        )}
        {...props}
      />
    ),
    a: ({ className, ...props }: React.ComponentProps<"a">) => (
      <a
        className={cn(
          "font-medium text-foreground underline underline-offset-4",
          className
        )}
        {...props}
      />
    ),
    TabsList: ({
      className,
      ...props
    }: React.ComponentProps<typeof TabsList>) => (
      <TabsList className={cn("border-b w-26.5", className)} {...props} />
    ),
    TabsIndicator: ({
      variant = "underline",
      ...props
    }: React.ComponentProps<typeof TabsIndicator>) => (
      <TabsIndicator variant={variant} {...props} />
    ),
    TabsPanel: ({
      className,
      ...props
    }: React.ComponentProps<typeof TabsPanel>) => (
      <TabsPanel className={cn("mt-3", className)} {...props} />
    ),
    code: ({
      __npm__,
      __pnpm__,
      __yarn__,
      __bun__,
      __raw__,
      className,
      ...props
    }: any) => {
      if (typeof props.children === "string") {
        return (
          <code
            className={cn(
              "relative rounded-md bg-accent px-1.5 py-1 font-mono text-[.8125rem] text-muted-foreground outline-none",
              className
            )}
            {...props}
          />
        );
      }

      if (__npm__ || __pnpm__ || __yarn__ || __bun__) {
        return (
          <CommandTabs
            __npm__={__npm__}
            __pnpm__={__pnpm__}
            __yarn__={__yarn__}
            __bun__={__bun__}
          />
        );
      }

      return (
        <CodeBlock rawCode={__raw__}>
          <Pre style={props.style} className={className}>
            {props.children}
          </Pre>
        </CodeBlock>
      );
    },
    Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
      <h3
        className={cn(
          "mt-8 scroll-m-32 text-md xl:text-lg font-normal tracking-tight",
          className
        )}
        {...props}
      />
    ),
    Steps: ({ className, ...props }: React.ComponentProps<"div">) => (
      <div
        className={cn(
          "steps [counter-reset:step] md:ml-4 md:border-l md:pl-8 [&>h3]:step",
          className
        )}
        {...props}
      />
    ),
    table: ({ className, ...props }: React.ComponentProps<"table">) => (
      <ScrollArea
        className="mt-6 border rounded-md bg-background"
        scrollbarGutter
      >
        <table
          className={cn(
            "relative w-full border-none text-sm [&_tbody_tr:last-child]:border-b-0",
            className
          )}
          {...props}
        />
      </ScrollArea>
    ),
    td: ({ className, ...props }: React.ComponentProps<"td">) => (
      <td
        className={cn(
          "whitespace-nowrap px-3 py-3 text-left [[align=center]]:text-center [[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    th: ({ className, ...props }: React.ComponentProps<"th">) => (
      <th
        className={cn(
          "px-3 py-2.5 text-left bg-secondary rounded-t-md font-medium [[align=center]]:text-center [[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    tr: ({ className, ...props }: React.ComponentProps<"tr">) => (
      <tr
        className={cn("m-0 border-b last:border-b-none", className)}
        {...props}
      />
    ),
    CodeTabs,
    TabsTab,
    ComponentsList,
    ComponentSource,
    ComponentPreview,
  } satisfies MDXComponents;
}

export const useMDXComponents = MDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof MDXComponents>;
}
