import { CommandMenu } from "@/components/command-menu";
import { ProjectDialog } from "@/components/project-dialog";

import { source } from "@/lib/source";
import { siteConfig } from "@/lib/config";

export function GlobalDialogs() {
  return (
    <>
      <ProjectDialog />
      <CommandMenu navItems={siteConfig.navItems} tree={source.pageTree} />
    </>
  );
}
