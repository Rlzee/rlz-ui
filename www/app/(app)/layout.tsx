import { Header } from "@/src/components/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-grid flex flex-1 flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
