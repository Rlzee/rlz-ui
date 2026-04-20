import "./globals.css";
import { fontVariables } from "@/lib/fonts";

import { RootProvider } from "fumadocs-ui/provider/next";
import { ThemeProvider } from "@/components/theme-provider";
import { META_THEME_COLORS } from "@/lib/config";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
                if (localStorage.layout) {
                  document.documentElement.classList.add('layout-' + localStorage.layout)
                }
              } catch (_) {}
            `,
          }}
        />
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body
        className="relative bg-background antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <RootProvider>{children}</RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
