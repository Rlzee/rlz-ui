import { SidebarProvider, SidebarInset } from "@rlz/ui/components/ui/sidebar";
import { getDocsExplorerSections } from "@/lib/docs";
import { Navbar } from "../components/navbar";
import { Explorer } from "../components/explorer";
import { PropertiesPanel } from "../components/properties-panel";

export default function Layout({ children }: { children: React.ReactNode }) {
  const sections = getDocsExplorerSections();

  return (
    <SidebarProvider className="flex-col">
      <Navbar />
      <div className="flex w-full min-h-0 flex-1">
        <Explorer sections={sections} />
        <PropertiesPanel />
        <SidebarInset
          id="playground"
          className="h-[calc(100svh-var(--header-height)-0.5rem)] min-h-0 flex-1 overflow-hidden border border-sidebar-border rounded-md mx-2 mb-2"
        >
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
