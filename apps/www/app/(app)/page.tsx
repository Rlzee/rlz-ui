import { Button } from "@ui/components/button";
import { Badge } from "@ui/components/badge";
import { BorderFlash } from "@ui/components/animations/border-flash";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function IndexPage() {
  return (
    <div className="relative overflow-hidden">
      <section className="mx-auto xl:mx-40 lg:mx-8 px-4 relative">
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
                <span className="text-primary animate-pulse">Beta Testing</span>
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
              <Button variant="secondary" asChild>
                <Link href="/docs/components">View Components</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
