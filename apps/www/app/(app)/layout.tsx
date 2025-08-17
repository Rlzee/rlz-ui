export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-grid flex flex-1 flex-col">
      {/* Header here */}
      <main className="flex-1">{children}</main>
    </div>
  );
}