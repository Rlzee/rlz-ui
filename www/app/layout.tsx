import "./globals.css";

import type { Metadata } from "next";
import { raleway, robotoMono } from "@/app/fonts/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/"),
  title: "rlz/ui",
  description: "",
};

import { ThemeProvider } from "@/src/ui/utils/themes-provider";
import { Header } from "@/app/_components/header";
import { Cmd } from "./_components/cmd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${raleway.variable} ${robotoMono.variable} antialiased bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Cmd />
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
