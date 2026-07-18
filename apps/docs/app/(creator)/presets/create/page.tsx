import { Header } from "@/components/creator/presets/header";
import { LeftPanel } from "@/components/creator/presets/left-panel";
import { RightPanel } from "@/components/creator/presets/right-panel";

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
