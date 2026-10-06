import { BorderFlash } from "@rlz/ui/components/animations/border-flash";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GlobalDialogs } from "@/components/global-dialogs";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="layout"
      className="relative isolate flex min-h-svh flex-col overflow-x-clip mx-2"
    >
      <SiteHeader container />
      <main className="relative flex flex-1 flex-col bg-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
        >
          <BorderFlash
            border="right"
            animation="bottom"
            className="absolute inset-y-0 right-0"
          />
          <BorderFlash
            border="left"
            animation="top"
            className="absolute inset-y-0 left-0"
          />
        </div>
        {children}
      </main>
      <SiteFooter />
      <GlobalDialogs />
    </div>
  );
}
