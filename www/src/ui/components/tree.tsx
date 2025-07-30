"use client";

import { ReactNode, ComponentProps } from "react";
import { Sidebar } from "./sidebar";
import { Collapsible } from "./collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

/* --------------------------- Root Tree --------------------------- */

const Tree = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn("tree-container", className)}
      style={{
        height: "auto",
        minHeight: "auto",
      }}
    >
      <Sidebar.Provider
        className="w-[250px]"
        style={{
          height: "auto",
          minHeight: "auto",
        }}
      >
        <Sidebar.Group>
          <Sidebar.Menu>{children}</Sidebar.Menu>
        </Sidebar.Group>
      </Sidebar.Provider>
    </div>
  );
};

/* --------------------------- Tree Group --------------------------- */

const TreeGroup = ({
  children,
  className,
  nested = false,
  ...props
}: ComponentProps<typeof Collapsible> & { nested?: boolean }) => {
  if (nested) {
    return (
      <Collapsible className={cn("group/collapsible", className)} {...props}>
        {children}
      </Collapsible>
    );
  }

  return (
    <Collapsible
      className={cn("group/collapsible", className)}
      asChild
      {...props}
    >
      <Sidebar.MenuItem>{children}</Sidebar.MenuItem>
    </Collapsible>
  );
};

/* --------------------------- Tree Trigger --------------------------- */

interface TreeTriggerItemProps
  extends ComponentProps<typeof Collapsible.Trigger> {
  children: ReactNode;
  icon?: ReactNode;
  chevron?: "left" | "right" | "none";
}

const TreeTrigger = ({
  children,
  icon,
  chevron = "left",
  ...props
}: TreeTriggerItemProps) => {
  return (
    <Collapsible.Trigger asChild {...props}>
      <Sidebar.MenuButton>
        {chevron !== "none" && chevron !== "right" && (
          <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        )}
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span>{children}</span>
        {chevron === "right" && (
          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        )}
      </Sidebar.MenuButton>
    </Collapsible.Trigger>
  );
};

/* --------------------------- Tree Content --------------------------- */

const TreeContent = ({ children }: { children: ReactNode }) => {
  return (
    <Collapsible.Content>
      <div className="ml-4 border-l border-border pl-2">{children}</div>
    </Collapsible.Content>
  );
};

/* --------------------------- Tree Item File --------------------------- */

const TreeItem = ({
  text,
  icon,
  extension,
  selected = false,
  onClick,
}: {
  key?: string;
  text: string;
  icon?: ReactNode;
  extension?: string;
  selected?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 py-1 cursor-pointer rounded-sm px-2 not-last:mb-0.5 first:mt-0.5",
        selected ? "bg-muted" : "hover:bg-secondary"
      )}
      onClick={onClick}
    >
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <div className="text-sm">
        {text}
        {extension && <span>.{extension}</span>}
      </div>
    </div>
  );
};

/* --------------------------- Exports --------------------------- */

const TreeComposed = Object.assign(Tree, {
  Group: TreeGroup,
  Trigger: TreeTrigger,
  Content: TreeContent,
  Item: TreeItem,
});

export { TreeComposed as Tree, TreeGroup, TreeTrigger, TreeContent, TreeItem };
