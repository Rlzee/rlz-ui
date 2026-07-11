import { LeftPanel } from "@/components/creator/presets/left-panel";
import { RightPanel } from "@/components/creator/presets/right-panel";

export default function Page() {
  return (
    <main className="flex w-screen h-[calc(100vh-var(--header-height))] overflow-hidden">
      <LeftPanel />
      <RightPanel />
    </main>
  );
}
