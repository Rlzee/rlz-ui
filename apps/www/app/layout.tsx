import "./globals.css";

import type { Metadata } from "next";
import { spaceGrotesk, inter } from "@/app/fonts/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/"
  ),
  title: "rlz/ui",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased bg-background`}
      >
        {children}
      </body>
    </html>
  );
}