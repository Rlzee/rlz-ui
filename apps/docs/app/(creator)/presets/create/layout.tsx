import { SidebarProvider, SidebarInset } from "@rlz/ui/components/ui/sidebar";
import { PresetSidebar } from "../components/preset-sidebar";
import { PresetProperties } from "../components/preset-properties";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PresetSidebar />
      <SidebarInset className="bg-secondary">
        <main>{children}</main>
      </SidebarInset>
      <PresetProperties />
    </SidebarProvider>
  );
}
