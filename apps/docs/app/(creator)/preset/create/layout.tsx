import { SidebarProvider, SidebarInset } from "@rlz/ui/components/ui/sidebar";
import { BorderFlashFrame } from "@rlz/ui/components/animations/border-flash";
import { getDocsExplorerSections } from "@/lib/docs";
import { Navbar } from "../components/layout/navbar";
import { Explorer } from "../components/layout/explorer";
import { PropertiesPanel } from "../components/properties/properties-panel";
import { PlaygroundPreset } from "../components/preview/playground-preset";

export default function Layout({ children }: { children: React.ReactNode }) {
  const sections = getDocsExplorerSections();

  return (
    <SidebarProvider className="flex-col">
      <Navbar />
      <PlaygroundPreset />
      <div className="relative mx-2 mb-2 flex min-h-0 flex-1 rounded-md border border-transparent">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px z-20"
        >
          <BorderFlashFrame />
        </div>
        <Explorer sections={sections} />
        <PropertiesPanel sections={sections} />
        <SidebarInset
          id="playground"
          className="h-[calc(100svh-var(--header-height)-0.5rem-2px)] min-h-0 flex-1 overflow-hidden rounded-r-md [&:fullscreen]:m-0 [&:fullscreen]:h-full [&:fullscreen]:w-full [&:fullscreen]:rounded-none [&:fullscreen]:border-0 [&:fullscreen]:bg-background"
        >
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
