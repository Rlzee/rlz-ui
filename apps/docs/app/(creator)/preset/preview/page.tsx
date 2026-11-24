import type { Metadata } from "next";
import { PlaygroundCanvas } from "../components/preview/playground-canvas";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return <PlaygroundCanvas />;
}
