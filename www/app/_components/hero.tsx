"use client";

import { Button } from "@/src/ui/components/button";
import Link from "next/link";
import { BorderFlash } from "@/src/ui/components/border-flash";

export function Hero() {
  return (
    <section className="bg-background relative overflow-hidden">
      <main className="mx-auto xl:mx-52 lg:mx-8 md:px-4 relative">
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
        <div className="h-auto lg:max-w-4xl mx-auto md:px-8">
          <BorderFlash
            border="x"
            Animation="top"
            className="lg:h-20 h-4 mb-4 lg:visible invisible"
            dashed
          />
          <div className="text-center md:px-12 md:py-12 px-4 py-4">
            <h1 className="text-4xl font-bold tracking-tighter md:text-6xl lg:text-7xl font-sans text-nowrap">
              The all-in-one UI kit
            </h1>
            <BorderFlash
              border="top"
              Animation="left"
              className="mt-2"
              dashed
            />
            <p className="mt-3 md:text-lg text-sm text-muted-foreground font-mono">
              Build beautiful, modern websites with a comprehensive set of
              components and utilities designed for Next.js and Tailwind CSS
            </p>
            <BorderFlash
              border="top"
              Animation="right"
              className="mt-2"
              dashed
            />
            <div className="mt-6 flex justify-center gap-4">
              <Button asChild>
                <Link href="/docs">Get Started</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/docs/components">Explore Components</Link>
              </Button>
            </div>
          </div>
          <BorderFlash
            border="x"
            Animation="bottom"
            className="lg:h-20 h-4 mt-4 lg:visible invisible"
            dashed
          />
        </div>
      </main>
      <BorderFlash border="top" Animation="left" />
    </section>
  );
}
