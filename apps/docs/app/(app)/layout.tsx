import { SiteHeader } from "@/components/site-header";
import { CommandMenu } from "@/components/command-menu";
import { ProjectDialog } from "@/components/project-dialog";

import { source } from "@/lib/source";
import { siteConfig } from "@/lib/config";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="layout"
      className="relative isolate flex min-h-svh flex-col overflow-x-clip"
    >
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>

      {/* Dialog */}
      <ProjectDialog />
      <CommandMenu navItems={siteConfig.navItems} tree={source.pageTree} />
    </div>
  );
}
