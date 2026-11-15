"use client";

import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { ChevronRight, PanelLeft, ChevronLeft } from "lucide-react";

import { useIsMobile } from "@rlz/ui/hooks/use-mobile";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import {
  Button,
  type ButtonProps,
  buttonDefaultClass,
} from "@rlz/ui/components/ui/button";
import { Drawer } from "@rlz/ui/components/ui/drawer";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { Tooltip } from "./tooltip";
import { Collapsible } from "./collapsible";

const SIDEBAR_COOKIE_NAME: string = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE: number = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH: string = "16rem";
const SIDEBAR_WIDTH_MOBILE: string = "18rem";
const SIDEBAR_WIDTH_ICON: string = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT: string = "b";

const sidebarButtonVariants = cva(
  [
    buttonDefaultClass,
    "w-full justify-start text-left text-muted-foreground overflow-hidden",
    "[&>span:last-child]:truncate",
    "group-has-data-[slot=badge]/menu-item:pr-10",
    "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2!",
    "group-data-[collapsible=icon]:[&>span]:hidden",
  ],
  {
    variants: {
      variant: {
        primary:
          "text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
        destructive:
          "text-destructive hover:bg-accent data-[active=true]:bg-accent data-[active=true]:text-destructive",
      },
      size: {
        xs: "h-7 px-2 has-[>svg]:px-1.5 text-xs",
        sm: "h-8 has-[>svg]:px-2.5 text-sm",
        md: "h-9 has-[>svg]:px-3 text-sm",
        lg: "h-10 px-4 has-[>svg]:px-4 text-base",
        xl: "h-11 px-4 has-[>svg]:px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return ctx;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": isMobile ? SIDEBAR_WIDTH_MOBILE : SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar-background",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function SidebarRoot({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  dir,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col bg-sidebar-background text-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Drawer
        open={openMobile}
        onOpenChange={setOpenMobile}
        variant="bare"
        swipeDirection={side}
        {...props}
      >
        <Drawer.Popup
          dir={dir}
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          showCloseButton={false}
          className="max-w-(--sidebar-width)! border-sidebar-border bg-sidebar-background"
          style={
            { "--sidebar-width": SIDEBAR_WIDTH_MOBILE } as React.CSSProperties
          }
        >
          <Drawer.Header className="sr-only">
            <Drawer.Title>Sidebar</Drawer.Title>
            <Drawer.Description>
              Displays the mobile sidebar.
            </Drawer.Description>
          </Drawer.Header>
          <Drawer.Content className="flex h-full w-full flex-col">
            {children}
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer>
    );
  }

  return (
    <div
      className="group peer hidden text-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      <div
        data-slot="sidebar-container"
        data-side={side}
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l border-sidebar-border",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="flex size-full flex-col bg-sidebar-background group-data-[variant=sidebar]:bg-background group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarTrigger({
  onClick,
  variant = "ghost",
  size = "icon-md",
  ...props
}: ButtonProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant={variant}
      size={size}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:inset-s-1/2 after:w-0.5 hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar-background",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn(
        "flex flex-col gap-2 py-2 px-2",
        "[&>[data-slot=separator]]:-mx-1 [&>[data-slot=separator]]:w-auto",
        className,
      )}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn(
        "flex flex-col gap-2 py-2 px-2",
        "[&>[data-slot=separator]]:-mx-1 [&>[data-slot=separator]]:w-auto",
        className,
      )}
      {...props}
    />
  );
}

function SidebarBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <ScrollArea
      className="**:data-[slot=scroll-area-scrollbar]:hidden"
      scrollFade
    >
      <div
        data-sidebar="content"
        data-slot="sidebar-content"
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden px-2",
          "[&>[data-slot=separator]]:-mx-1 [&>[data-slot=separator]]:w-auto",
          className,
        )}
        {...props}
      />
    </ScrollArea>
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    "data-slot": "sidebar-group-label",
    "data-sidebar": "group-label",
    className: cn(
      "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-foreground outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2",
      "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 [&>svg]:size-4 [&>svg]:shrink-0",
      className,
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  });
}

function SidebarList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("flex w-full min-w-0 flex-col gap-0.5", className)}
      {...props}
    />
  );
}

function SidebarButtonField({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-button-field"
      data-sidebar="button-field"
      className={cn(
        "group/menu-item relative",
        "[&>*:not([data-slot=sidebar-menu-button])]:pointer-events-none",
        "[&>*:not([data-slot=sidebar-menu-button])]:absolute",
        "[&>*:not([data-slot=sidebar-menu-button])]:right-2",
        "[&>*:not([data-slot=sidebar-menu-button])]:inset-y-0",
        "[&>*:not([data-slot=sidebar-menu-button])]:my-auto",
        "[&>*:not([data-slot=sidebar-menu-button])]:h-fit",
        "[&>[data-slot=badge]]:pt-0",
        "group-data-[collapsible=icon]:[&>*:not([data-slot=sidebar-menu-button])]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarButton({
  children,
  isActive = false,
  variant = "primary",
  size = "md",
  tooltip,
  className,
  render,
  ...props
}: useRender.ComponentProps<"button"> &
  VariantProps<typeof sidebarButtonVariants> & {
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof Tooltip.Popup>;
  }): React.ReactElement {
  const { isMobile, state } = useSidebar();

  const content = React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      <span>{child}</span>
    ) : (
      child
    ),
  );

  const defaultProps = {
    "data-active": isActive,
    "data-sidebar": "menu-button",
    "data-size": size,
    "data-slot": "sidebar-menu-button",
    type: render ? undefined : ("button" as const),
    className: cn(sidebarButtonVariants({ size, variant }), className),
    children: content,
  };

  const buttonElement = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  });

  if (!tooltip) {
    return buttonElement;
  }

  const tooltipProps =
    typeof tooltip === "string" ? { children: tooltip } : tooltip;

  return (
    <Tooltip.Provider delay={0} closeDelay={0}>
      <Tooltip.Root>
        <Tooltip.Trigger render={buttonElement} />
        <Tooltip.Popup
          positionerProps={{
            align: "center",
            side: "right",
          }}
          hidden={state !== "collapsed" || isMobile}
          {...tooltipProps}
        />
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

type SidebarButtonSize = NonNullable<
  VariantProps<typeof sidebarButtonVariants>["size"]
>;

const SIZE_STEPS: SidebarButtonSize[] = ["xs", "sm", "md", "lg", "xl"];

function getSubSize(size: SidebarButtonSize): SidebarButtonSize {
  const index = SIZE_STEPS.indexOf(size);
  return SIZE_STEPS[Math.max(index - 1, 0)];
}

const SidebarSubContext = React.createContext<SidebarButtonSize>("md");

function SidebarSub({
  className,
  size = "md",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof Collapsible> & {
  size?: SidebarButtonSize;
}) {
  const { state, isMobile, setOpen: setSidebarOpen } = useSidebar();
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;

  const isCollapsed = state === "collapsed" && !isMobile;

  const handleOpenChange: NonNullable<
    React.ComponentProps<typeof Collapsible>["onOpenChange"]
  > = (nextOpen, ...args) => {
    if (isCollapsed) {
      setSidebarOpen(true);
      _setOpen(true);
      onOpenChange?.(true, ...args);
      return;
    }

    _setOpen(nextOpen);
    onOpenChange?.(nextOpen, ...args);
  };

  return (
    <SidebarSubContext.Provider value={size}>
      <Collapsible
        data-slot="sidebar-sub"
        className={cn("group/menu-item relative", className)}
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </SidebarSubContext.Provider>
  );
}

function SidebarSubTrigger({
  children,
  size,
  ...props
}: React.ComponentProps<typeof SidebarButton>) {
  const subSize = React.useContext(SidebarSubContext);

  return (
    <Collapsible.Trigger
      render={(triggerProps) => (
        <SidebarButton {...triggerProps} size={size ?? subSize} {...props}>
          {children}
          <ChevronRight
            className={cn(
              "ml-auto transition-transform duration-200",
              "in-data-panel-open:rotate-90",
              "group-data-[collapsible=icon]:hidden",
            )}
          />
        </SidebarButton>
      )}
    />
  );
}

function SidebarSubList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible.Panel>) {
  return (
    <Collapsible.Panel
      data-slot="sidebar-sub-list"
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-linear",
        "data-starting-style:h-0 data-ending-style:h-0",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    >
      <div className="mt-1 ml-4 flex flex-col gap-1 border-l border-sidebar-border pl-2">
        {children}
      </div>
    </Collapsible.Panel>
  );
}

function SidebarSubButton({
  size,
  ...props
}: React.ComponentProps<typeof SidebarButton>) {
  const parentSize = React.useContext(SidebarSubContext);

  return <SidebarButton size={size ?? getSubSize(parentSize)} {...props} />;
}

type SidebarNavContextProps = {
  current: string | null;
  direction: "forward" | "back";
  push: (name: string) => void;
  pop: () => void;
};

const SidebarNavContext = React.createContext<SidebarNavContextProps | null>(
  null,
);

function useSidebarNav() {
  const ctx = React.useContext(SidebarNavContext);
  if (!ctx) {
    throw new Error("useSidebarNav must be used within a Sidebar.Nav.");
  }
  return ctx;
}

function SidebarNav({
  className,
  defaultPath = [],
  path: pathProp,
  onPathChange,
  ...props
}: React.ComponentProps<"div"> & {
  defaultPath?: string[];
  path?: string[];
  onPathChange?: (path: string[]) => void;
}) {
  const [_path, _setPath] = React.useState<string[]>(defaultPath);
  const [direction, setDirection] =
    React.useState<SidebarNavContextProps["direction"]>("forward");
  const path = pathProp ?? _path;

  const setPath = React.useCallback(
    (next: string[]) => {
      if (pathProp === undefined) _setPath(next);
      onPathChange?.(next);
    },
    [pathProp, onPathChange],
  );

  const value = React.useMemo<SidebarNavContextProps>(
    () => ({
      current: path.at(-1) ?? null,
      direction,
      push: (name) => {
        setDirection("forward");
        setPath([...path, name]);
      },
      pop: () => {
        setDirection("back");
        setPath(path.slice(0, -1));
      },
    }),
    [path, direction, setPath],
  );

  return (
    <SidebarNavContext.Provider value={value}>
      <div
        data-slot="sidebar-nav"
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          className,
        )}
        {...props}
      />
    </SidebarNavContext.Provider>
  );
}

function SidebarNavPage({
  name,
  className,
  ...props
}: React.ComponentProps<"div"> & { name?: string }) {
  const { current, direction } = useSidebarNav();

  if ((name ?? null) !== current) return null;

  return (
    <div
      data-slot="sidebar-nav-page"
      data-direction={direction}
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        "animate-in fade-in duration-200",
        "data-[direction=forward]:slide-in-from-right-4 data-[direction=back]:slide-in-from-left-4",
        className,
      )}
      {...props}
    />
  );
}

function SidebarNavTrigger({
  to,
  children,
  onClick,
  variant = "primary",
  size = "md",
  ...props
}: React.ComponentProps<typeof SidebarButton> & { to: string }) {
  const { push } = useSidebarNav();
  const { state, isMobile, setOpen } = useSidebar();

  return (
    <SidebarButton
      variant={variant}
      size={size}
      data-slot="sidebar-nav-trigger"
      data-sidebar="nav-trigger"
      onClick={(event) => {
        onClick?.(event);
        if (state === "collapsed" && !isMobile) setOpen(true);
        push(to);
      }}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto group-data-[collapsible=icon]:hidden" />
    </SidebarButton>
  );
}

function SidebarNavBack({
  children,
  variant = "primary",
  size = "md",
  tooltip = "back",
  onClick,
  ...props
}: React.ComponentProps<typeof SidebarButton>) {
  const { pop } = useSidebarNav();

  return (
    <SidebarButton
      variant={variant}
      size={size}
      data-slot="sidebar-nav-back"
      data-sidebar="nav-back"
      tooltip={tooltip}
      onClick={(event) => {
        onClick?.(event);
        pop();
      }}
      {...props}
    >
      <ChevronLeft />
      {children}
    </SidebarButton>
  );
}

const SidebarExports = Object.assign(SidebarRoot, {
  Provider: SidebarProvider,
  Inset: SidebarInset,
  Trigger: SidebarTrigger,
  Rail: SidebarRail,
  Header: SidebarHeader,
  Footer: SidebarFooter,
  Body: SidebarBody,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  List: SidebarList,
  Button: SidebarButton,
  ButtonField: SidebarButtonField,
  Sub: SidebarSub,
  SubTrigger: SidebarSubTrigger,
  SubList: SidebarSubList,
  SubButton: SidebarSubButton,
  Nav: SidebarNav,
  NavPage: SidebarNavPage,
  NavTrigger: SidebarNavTrigger,
  NavBack: SidebarNavBack,
});

export {
  SidebarExports as Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
  SidebarBody,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarList,
  SidebarButton,
  SidebarButtonField,
  SidebarSub,
  SidebarSubTrigger,
  SidebarSubList,
  SidebarSubButton,
  SidebarNav,
  SidebarNavPage,
  SidebarNavTrigger,
  SidebarNavBack,
  useSidebar,
  useSidebarNav,
  type SidebarContextProps,
  type SidebarNavContextProps,
  type SidebarButtonSize,
};
