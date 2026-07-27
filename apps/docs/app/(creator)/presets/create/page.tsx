import { Header } from "@/app/(creator)/presets/components/header";
import { LeftPanel } from "@/app/(creator)/presets/components/left-panel";
import { RightPanel } from "@/app/(creator)/presets/components/right-panel";

export default function Page() {
  return (
    <main className="flex flex-col w-screen h-[calc(100vh-var(--header-height))] overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <RightPanel />
      </div>
    </main>
  );
}
