"use client";

import { usePathname } from "fumadocs-core/framework";

import {
  BorderFlash,
  BorderFlashBox,
  BorderFlashBoxContent,
} from "@rlz/ui/components/animations/border-flash";
import { cn } from "@rlz/ui/lib/cn";

export function SiteFooter() {
  const path = usePathname();
  const isHomePage = path === "/";

  return (
    <>
      <div
        aria-hidden="true"
        className="container pointer-events-none fixed inset-0 z-45"
      >
        <BorderFlashBox
          className={cn(
            "absolute -left-[11.5px] -ml-1 size-2 rounded-[2px] bg-background shadow-xs/5 p-0",
            isHomePage
              ? "bottom-[calc(var(--header-height)-4.5px)]"
              : "bottom-[5.5px]"
          )}
        >
          <BorderFlashBoxContent className="p-0" />
        </BorderFlashBox>
        <BorderFlashBox
          className={cn(
            "absolute -right-[11.5px] -mr-1 size-2 rounded-[2px] bg-background shadow-xs/5 p-0",
            isHomePage
              ? "bottom-[calc(var(--header-height)-4.5px)]"
              : "bottom-[5.5px]"
          )}
        >
          <BorderFlashBoxContent className="p-0" />
        </BorderFlashBox>
      </div>

      <div
        className={cn(
          "fixed inset-x-2 bottom-0 z-40 bg-sidebar-background",
          isHomePage ? "h-(--header-height)" : "h-2"
        )}
      >
        <BorderFlash
          border="top"
          animation="left"
          className="absolute inset-x-0 top-0"
        />

        {isHomePage ? (
          <div className="bg-sidebar-background text-muted-foreground h-(--header-height) text-sm w-full flex items-center justify-center gap-1">
            Built by Rlzee,{" "}
            <a
              href="https://github.com/Rlzee/rlz-ui"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
          </div>
        ) : null}
      </div>
    </>
  );
}
