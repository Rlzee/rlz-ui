"use client";

import { useState } from "react";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { source } from "@/lib/source";
import { useNavPages } from "@/hooks/use-nav-pages";

import { Popover } from "@rlz/ui/components/ui/popover";
import { Button } from "@rlz/ui/components/ui/button";

import { cn } from "@rlz/ui/lib/cn";

export function MobileNav({
  tree,
  items,
  className,
}: {
  tree: typeof source.pageTree;
  items: { href: string; label: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const groups = useNavPages(tree, items);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        render={
          <Button
            variant="ghost"
            className={cn(
              "extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 p-0! hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent",
              className
            )}
          />
        }
      >
        <div className="relative flex h-8 w-4 items-center justify-center">
          <div className="relative size-4">
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100",
                open ? "top-[0.4rem] -rotate-45" : "top-1"
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100",
                open ? "top-[0.4rem] rotate-45" : "top-2.5"
              )}
            />
          </div>
          <span className="sr-only">Toggle Menu</span>
        </div>
        {/*<span className="flex h-8 items-center text-lg leading-none font-medium">
          Menu
        </span>*/}
      </Popover.Trigger>
      <Popover.Popup
        className="lg:hidden no-scrollbar h-full w-full overflow-y-auto rounded-none border-none backdrop-blur bg-background/82 p-0 shadow-none duration-100 data-open:animate-none!"
        positionerProps={{
          align: "start",
          side: "bottom",
          sideOffset: 0,
          alignOffset: 0,
          className:
            "!fixed !inset-x-0 !top-14 !bottom-0 !transform-none !w-screen !h-auto",
        }}
      >
        <div className="flex flex-col gap-12 overflow-auto px-6 py-6">
          {groups.map((group) => (
            <div key={group.value} className="flex flex-col gap-4">
              <div className="text-sm font-medium text-foreground">
                {group.value}
              </div>
              <div className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <MobileLink
                    key={item.value}
                    href={item.url}
                    onOpenChange={setOpen}
                  >
                    {item.label}
                  </MobileLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Popover.Popup>
    </Popover>
  );
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(
        "text-muted-foreground hover:text-foreground flex items-center gap-2 text-2xl font-medium",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
