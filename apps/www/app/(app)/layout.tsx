import SiteHeader from "@site/components/site-header";
import { docsConfig } from "@site/config/docs";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-grid flex flex-1 flex-col">
      <SiteHeader config={docsConfig} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
