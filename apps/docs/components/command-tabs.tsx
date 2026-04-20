"use client";

import React from "react";

import { useConfig } from "@/hooks/use-config";

import { Tabs } from "@rlz/ui/components/ui/tabs";
import { CopyButton } from "@/components/copy-button";
import { Terminal } from "lucide-react";

type Props = React.ComponentProps<"pre"> & {
  __npm__?: string;
  __yarn__?: string;
  __pnpm__?: string;
  __bun__?: string;
};

export function CommandTabs({ __npm__, __yarn__, __pnpm__, __bun__ }: Props) {
  const [config, setConfig] = useConfig();

  const selectedPackageManager = config.packageManager || "pnpm";
  const tabs = React.useMemo(() => {
    return {
      pnpm: __pnpm__,
      npm: __npm__,
      yarn: __yarn__,
      bun: __bun__,
    };
  }, [__npm__, __pnpm__, __yarn__, __bun__]);

  return (
    <Tabs
      className="bg-secondary rounded-md border"
      onValueChange={(value) => {
        setConfig({
          ...config,
          packageManager: value as "pnpm" | "npm" | "yarn" | "bun",
        });
      }}
      value={selectedPackageManager}
    >
      <div className="flex items-center justify-between w-full p-1 border-b bg-background rounded-t-md px-3">
        <div className="flex items-center">
          <Terminal className="h-4 w-4 mr-2 text-muted-foreground" />
          <Tabs.List>
            {Object.entries(tabs).map(([key]) => (
              <Tabs.Tab key={key} value={key}>
                {key}
              </Tabs.Tab>
            ))}
            <Tabs.Indicator className="h-6" />
          </Tabs.List>
        </div>
        <CopyButton code={tabs[selectedPackageManager] || ""} />
      </div>
      {Object.entries(tabs).map(([key, value]) => {
        return (
          <Tabs.Panel
            key={key}
            value={key}
            className="relative w-max px-3 pb-2.5 mt-0.5"
          >
            <pre>
              <code
                className="relative font-mono text-sm leading-none text-muted-foreground"
                data-language="bash"
              >
                {value}
              </code>
            </pre>
          </Tabs.Panel>
        );
      })}
    </Tabs>
  );
}
