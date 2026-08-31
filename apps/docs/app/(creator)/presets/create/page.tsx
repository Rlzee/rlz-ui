"use client";

import { useAtom } from "jotai";
import { presetBuilderAtom } from "../preset-builder";
import { usePreset } from "../use-preset";
import { useTheme } from "next-themes";

import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";

export default function Page() {
  const { tab } = usePreset();
  const [preset] = useAtom(presetBuilderAtom);
  const { resolvedTheme } = useTheme();

  return (
    <div className="h-full z-5">
      {tab === "base" && (
        <div className="flex h-full items-center justify-center">
          <div className="flex max-w-xl flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-tight xl:text-4xl">
              Heading Font
            </h1>

            <h2 className="text-xl xl:text-2xl font-medium tracking-tight">
              Elegant headings for your interface
            </h2>

            <h3 className="font-semibold text-lg">Subheading</h3>

            <p className="leading-relaxed text-muted-foreground font-sans">
              Body font used for paragraphs, descriptions, and longer content.
              It should remain comfortable to read at any size.
            </p>

            <p className="relative w-fit rounded-md bg-accent px-1.5 py-0.5 font-mono text-[.8125rem] text-muted-foreground outline-none">
              npm install @rlz/ui
            </p>
          </div>
        </div>
      )}
      {tab === "colors" && (
        <ScrollArea className="h-full" scrollFade>
          <div className="mx-auto w-full max-w-6xl space-y-10 px-10 py-12">
            {preset.colors.map((section) => (
              <div key={section.id} className="space-y-4">
                <h2 className="text-lg font-semibold">{section.name}</h2>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {section.tokens.map((token) => (
                    <div key={token.cssVar} className="space-y-2">
                      <div
                        className="aspect-square rounded-xl border shadow-sm"
                        style={{
                          background:
                            resolvedTheme === "dark"
                              ? token.dark.value
                              : token.light.value,
                        }}
                      />

                      <div>
                        <p className="text-sm font-medium">{token.label}</p>

                        <p className="font-mono text-xs text-muted-foreground">
                          {resolvedTheme === "dark"
                            ? token.dark.value
                            : token.light.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
