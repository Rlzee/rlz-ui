import {
  BorderFlash,
  BorderFlashBox,
  BorderFlashBoxContent,
} from "@rlz/ui/components/animations/border-flash";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GlobalDialogs } from "@/components/global-dialogs";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="layout"
      className="relative isolate flex min-h-svh flex-col overflow-x-clip mx-2 pb-2"
    >
      <div
        aria-hidden="true"
        className="container pointer-events-none absolute inset-0 z-45"
      >
        <BorderFlash
          border="left"
          animation="top"
          className="absolute inset-y-0 -left-3 h-full"
          dashed
        />
        <BorderFlash
          border="right"
          animation="bottom"
          className="absolute inset-y-0 -right-3 h-full"
          dashed
        />
      </div>

      <div
        aria-hidden="true"
        className="container pointer-events-none fixed inset-0 z-45"
      >
        <BorderFlashBox className="absolute top-[calc(var(--header-height)-4.5px)] -left-[11.5px] -ml-1 size-2 rounded-[2px] bg-background shadow-xs/5 p-0">
          <BorderFlashBoxContent className="p-0" />
        </BorderFlashBox>
        <BorderFlashBox className="absolute top-[calc(var(--header-height)-4.5px)] -right-[11.5px] -mr-1 size-2 rounded-[2px] bg-background shadow-xs/5 p-0">
          <BorderFlashBoxContent className="p-0" />
        </BorderFlashBox>
      </div>

      <SiteHeader container />
      <main className="relative flex flex-1 flex-col bg-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
        >
          <BorderFlash
            border="top"
            animation="left"
            className="absolute inset-x-0 top-0"
          />
          <BorderFlash
            border="right"
            animation="bottom"
            className="absolute inset-y-0 right-0"
          />
          <BorderFlash
            border="bottom"
            animation="right"
            className="absolute inset-x-0 bottom-0"
          />
          <BorderFlash
            border="left"
            animation="top"
            className="absolute inset-y-0 left-0"
          />
        </div>
        {children}
      </main>

      <GlobalDialogs />
    </div>
  );
}
