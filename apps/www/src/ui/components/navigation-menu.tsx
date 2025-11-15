import { ComponentProps, ComponentPropsWithoutRef } from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva, VariantProps } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Navigation Menu ------------------------------ */

interface NavigationMenuProps
  extends ComponentProps<typeof NavigationMenuPrimitive.Root> {
  viewport?: boolean;
}

const NavigationMenu = ({
  className,
  children,
  viewport = true,
  ...props
}: NavigationMenuProps) => {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
};

/* ------------------------------ Navigation Menu List ------------------------------ */

const NavigationMenuList = ({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.List>) => {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Navigation Menu Item ------------------------------ */

const NavigationMenuItem = ({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Item>) => {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
};

/* ------------------------------ Navigation Menu Indicator ------------------------------ */

const navigationMenuTriggerStyle = cva("group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-2 py-1 text-sm font-medium text-muted-foreground disabled:pointer-events-none disabled:opacity-50 outline-none transition-[color,box-shadow]", {
  variants: {
    variant: {
      default:
        "hover:bg-secondary data-[state=open]:hover:bg-secondary hover:text-foreground py-1 rounded-md focus:bg-muted focus:text-foreground data-[state=open]:text-foreground data-[state=open]:bg-secondary",
      primary: "hover:text-foreground data-[state=open]:text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const NavigationMenuTrigger = ({
  className,
  children,
  variant = "default",
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Trigger> & VariantProps<typeof navigationMenuTriggerStyle>) => {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle({ variant }), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
};

/* ------------------------------ Navigation Menu Content ------------------------------ */

const NavigationMenuContent = ({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Content>) => {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border border-border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Navigation Menu Viewport ------------------------------ */

const NavigationMenuViewport = ({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Viewport>) => {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-popover text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props}
      />
    </div>
  );
};

/* ------------------------------ Navigation Menu Link ------------------------------ */

const NavigationMenuLink = ({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Link>) => {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active=true]:focus:bg-muted data-[active=true]:hover:bg-secondary data-[active=true]:bg-secondary hover:bg-secondary focus:bg-muted [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Navigation Menu Indicator ------------------------------ */

const NavigationMenuIndicator = ({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Indicator>) => {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
};

/* ------------------------------ Navigation Menu List Item ------------------------------ */

const NavigationMenuListItem = ({
  title,
  children,
  href,
  ...props
}: ComponentPropsWithoutRef<"li"> & { href: string }) => {
  return (
    <li {...props}>
      <NavigationMenuLink asChild data-slot="navigation-menu-list-item">
        <a href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
};

/* ------------------------------ Exports ------------------------------ */

const NavigationMenuComposed = Object.assign(NavigationMenu, {
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Content: NavigationMenuContent,
  Trigger: NavigationMenuTrigger,
  Link: NavigationMenuLink,
  Indicator: NavigationMenuIndicator,
  Viewport: NavigationMenuViewport,
  ListItem: NavigationMenuListItem,
});

export {
  NavigationMenuComposed as NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
  NavigationMenuListItem,
};
