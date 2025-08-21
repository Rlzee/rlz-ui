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

import { ThemeProvider } from "@ui/utils/themes-provider";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-svh flex-col bg-background">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
