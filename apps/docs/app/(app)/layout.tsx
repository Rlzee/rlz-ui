import { BorderFlashFrame } from "@rlz/ui/components/animations/border-flash";
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
      <main className="relative flex flex-1 flex-col overflow-clip rounded-md bg-background">
        <BorderFlashFrame className="z-10" />
        <div
          aria-hidden="true"
          className="pointer-events-none sticky top-(--header-height) z-30 h-0 shrink-0"
        >
          <div className="absolute inset-x-0 top-0 h-2 overflow-hidden">
            <div className="absolute left-0 top-0 size-2 bg-background" />
            <div className="absolute right-0 top-0 size-2 bg-background" />
            <BorderFlashFrame className="h-4" />
          </div>
        </div>
        {children}
      </main>
      <SiteFooter />
      <GlobalDialogs />
    </div>
  );
}
