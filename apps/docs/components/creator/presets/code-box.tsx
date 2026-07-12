"use client";

import * as React from "react";
import { Tabs } from "@rlz/ui/components/ui/tabs";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { CopyButton } from "@/components/copy-button";

const CODE_TABS = ["Script Tag", "Next.js (App)", "Next.js (Pages)", "Vite"];
type CodeTabs = (typeof CODE_TABS)[number];

const CODE_SNIPPETS: Record<string, string> = {
  "Script Tag": `<script src="https://tweakcn.com/live-preview.min.js"></script>`,
  "Next.js (App)": `// app/layout.tsx\nimport Script from 'next/script'\n\nexport default function RootLayout({ children }) {\n  return (\n    <html>\n      <head>\n        <Script src="https://tweakcn.com/live-preview.min.js" />\n      </head>\n      <body>{children}</body>\n    </html>\n  )\n}`,
  "Next.js (Pages)": `// pages/_document.tsx\nimport { Html, Head, Main, NextScript } from 'next/document'\n\nexport default function Document() {\n  return (\n    <Html>\n      <Head>\n        <script src="https://tweakcn.com/live-preview.min.js" />\n      </Head>\n      <body>\n        <Main />\n        <NextScript />\n      </body>\n    </Html>\n  )\n}`,
  Vite: `<!-- index.html -->\n<head>\n  <script src="https://tweakcn.com/live-preview.min.js"></script>\n</head>`,
};

export function CodeBox() {
  const [activeTab, setActiveTab] = React.useState<CodeTabs>("Next.js (App)");

  return (
    <Tabs
      className="bg-secondary rounded-md border"
      onValueChange={(value) => setActiveTab(value)}
    >
      <div className="flex items-center justify-between w-full p-1 border-b bg-background rounded-t-md px-3">
        <div className="flex items-center">
          <Tabs.List>
            {CODE_TABS.map((tab) => (
              <Tabs.Tab key={tab} value={tab}>
                {tab}
              </Tabs.Tab>
            ))}
            <Tabs.Indicator className="h-6" />
          </Tabs.List>
        </div>
        <CopyButton code={CODE_SNIPPETS[activeTab]} />
      </div>
      <Tabs.Panel value={activeTab}>
        <ScrollArea
          orientation="horizontal"
          className="relative px-3 pb-2.5 mt-0.5"
        >
          <pre>
            <code className="font-mono text-sm">
              {CODE_SNIPPETS[activeTab]}
            </code>
          </pre>
        </ScrollArea>
      </Tabs.Panel>
    </Tabs>
  );
}
