"use client";

import { ReactNode, ComponentProps } from "react";
import { Sidebar } from "./sidebar";
import { Collapsible } from "./collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { File as FileIcon } from "lucide-react";

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
        height: 'auto',
        minHeight: 'auto'
      }}
    >
      <Sidebar.Provider 
        className="w-[250px]"
        style={{
          height: 'auto',
          minHeight: 'auto'
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
      <Collapsible
        className={cn("group/collapsible", className)}
        {...props}
      >
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

interface TreeTriggerItemProps extends ComponentProps<typeof Collapsible.Trigger> {
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
      <div className="ml-4 border-l border-border pl-2">
        {children}
      </div>
    </Collapsible.Content>
  );
};

/* --------------------------- Tree Item --------------------------- */

const TreeItem = ({ children }: { children: ReactNode }) => {
  return (
    <div className="py-1">
      <span className="text-sm text-foreground">{children}</span>
    </div>
  );
};

/* --------------------------- Tree Item File --------------------------- */

const TreeItemFile = ({
  text,
  icon = <FileIcon className="h-4 w-4" />,
  extension
}: {
  key?: string;
  text: string;
  icon?: ReactNode;
  extension?: string;
}) => {
  return (
    <div className="flex items-center gap-2 py-1 cursor-pointer hover:bg-secondary rounded-sm px-2">
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
  ItemFile: TreeItemFile,
});

export {
  TreeComposed as Tree,
  TreeGroup,
  TreeTrigger,
  TreeContent,
  TreeItem,
  TreeItemFile,
};
