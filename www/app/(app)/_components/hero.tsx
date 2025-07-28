"use client";

import { Button } from "@/src/ui/components/button";
import Link from "next/link";
import { BorderFlash } from "@/src/ui/components/animated/border-flash";
import { Badge } from "@/src/ui/components/badge";
import { GradientText } from "@/src/ui/components/text/gradient-text";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <main className="mx-auto xl:mx-40 lg:mx-8 px-4 relative">
        <BorderFlash
          border="left"
          Animation="top"
          className="hidden lg:block absolute top-0 left-0 h-full"
        />
        <BorderFlash
          border="right"
          Animation="bottom"
          className="hidden lg:block absolute top-0 right-0 h-full"
        />
        <div className="h-auto lg:max-w-4xl mx-auto md:px-8 pt-4 md:py-12 py-8">
          <div className="text-center px-4">
            <Badge className="mb-4 md:mt-0 mt-3" variant="background" asChild>
              <div className="grid gap-1">
                <Sparkles className="h-4 w-4 animate-pulse text-foreground" />
                <GradientText
                  className="text-sm"
                  colors={["#40ffaa", "#4079ff", "#40ffaa"]}
                  animationSpeed={8}
                >
                  Beta Testing
                </GradientText>
              </div>
            </Badge>
          </div>
          <div className="text-center px-4">
            <h1 className="text-4xl font-bold md:text-6xl lg:text-7xl">
              The all-in-one UI kit
            </h1>
            <p className="mt-3 md:text-lg text-sm text-muted-foreground tracking-tighter md:px-24 px-16">
              Build beautiful, modern websites with a comprehensive set of
              components and utilities designed for Next.js and Tailwind CSS
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button asChild>
                <Link href="/docs">Get Started</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/components">Explore</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <BorderFlash border="top" Animation="left" />
      <main className="mx-auto xl:mx-40 lg:mx-8 px-4 relative">
        <BorderFlash
          border="x"
          Animation="top"
          className="lg:h-24 h-8 lg:visible invisible absolute top-0 left-0 w-full"
        />
        <div className="h-auto lg:max-w-4xl mx-auto md:px-8">
          <div className="py-4 md:px-8 md:py-12 flex justify-start">
            <div className="h-[600px] w-[450px]"></div>
          </div>
          <BorderFlash
            border="x"
            Animation="bottom"
            className="lg:h-24 h-8 lg:visible invisible absolute bottom-0 left-0 w-full"
          />
        </div>
      </main>
      <BorderFlash border="top" Animation="right" />
      <footer className="text-center text-muted-foreground p-4 text-sm">
        Built by Rlzee,{" "}
        <a
          href="https://github.com/Rlzee/rlz-ui"
          className="text-primary hover:underline"
        >
          GitHub
        </a>
      </footer>
    </section>
  );
}
