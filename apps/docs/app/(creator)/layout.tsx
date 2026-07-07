import { SiteHeader } from "@/components/site-header";
import { GlobalDialogs } from "@/components/global-dialogs";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-slot="creator-layout"
      className="relative isolate flex min-h-svh flex-col overflow-x-clip"
    >
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <GlobalDialogs />
    </div>
  );
}
