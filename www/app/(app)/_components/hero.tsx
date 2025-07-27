"use client";

import { Button } from "@/src/ui/components/button";
import Link from "next/link";
import { BorderFlash } from "@/src/ui/components/animated/border-flash";

export function Hero() {
  return (
    <section className="bg-background relative overflow-hidden">
      <main className="mx-auto xl:mx-52 lg:mx-8 px-4 relative">
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
        <div className="h-auto lg:max-w-4xl mx-auto md:px-8 pt-4">
          <div className="text-center md:px-18 md:py-12 px-4 py-4">
            <h1 className="text-4xl font-bold tracking-tighter md:text-6xl lg:text-7xl text-nowrap">
              The all-in-one UI kit
            </h1>
            <BorderFlash
              border="top"
              Animation="left"
              className="mt-2"
              dashed
            />
            <p className="mt-3 md:text-lg text-sm text-muted-foreground">
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
              <Button variant="outline" asChild>
                <Link href="/docs/components">Explore</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <BorderFlash
              border="x"
              Animation="bottom"
              className="lg:h-12 h-4 lg:visible invisible absolute bottom-0 left-0 w-full"
              dashed
            />
          </div>
        </div>
      </main>
      <BorderFlash border="top" Animation="left" />
      <main className="mx-auto xl:mx-52 lg:mx-8 px-4 relative">
        <BorderFlash
          border="x"
          Animation="top"
          className="lg:h-24 h-8 lg:visible invisible absolute top-0 left-0 w-full"
        />
        <div className="h-auto lg:max-w-4xl mx-auto md:px-8">
          <BorderFlash
            border="x"
            Animation="top"
            className="lg:h-12 h-4 lg:visible invisible"
            dashed
          />
          <div>
            
          </div>
        </div>
      </main>
    </section>
  );
}
