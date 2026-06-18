import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@rlz/ui/lib/cn";

// -- Body Font
const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

// -- Heading Font
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// -- Exports
export const fontVariables = cn(fontSans.variable, fontMono.variable);
