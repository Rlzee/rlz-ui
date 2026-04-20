import { SiteHeader } from "@/components/site-header";
import {
  BorderFlash,
  BorderFlashBox,
  BorderFlashBoxContent,
} from "@rlz/ui/components/animations/border-flash";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="layout"
      className="relative isolate flex min-h-svh flex-col overflow-x-clip"
    >
      <div
        aria-hidden="true"
        className="container pointer-events-none absolute inset-0 z-45"
      >
        <BorderFlash
          border="left"
          animation="top"
          className="absolute inset-y-0 -left-3 h-full border-sidebar-border"
          dashed
        />
        <BorderFlash
          border="right"
          animation="bottom"
          className="absolute inset-y-0 -right-3 h-full border-sidebar-border"
          dashed
        />
      </div>

      <div
        aria-hidden="true"
        className="container pointer-events-none fixed inset-0 z-45"
      >
        <BorderFlashBox className="absolute top-[calc(var(--header-height)-4.5px)] -left-[11.5px] -ml-1 size-2 rounded-[2px] bg-popover shadow-xs/5 p-0">
          <BorderFlashBoxContent className="p-0" />
        </BorderFlashBox>
        <BorderFlashBox className="absolute top-[calc(var(--header-height)-4.5px)] -right-[11.5px] -mr-1 size-2 rounded-[2px] bg-background shadow-xs/5 dark:bg-clip-border p-0">
          <BorderFlashBoxContent className="p-0" />
        </BorderFlashBox>
      </div>

      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
