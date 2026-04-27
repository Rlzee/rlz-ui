import { Button } from "@rlz/ui/components/ui/button";
import {
  BorderFlash,
  BorderFlashBox,
  BorderFlashBoxContent,
} from "@rlz/ui/components/animations/border-flash";
import { SiteFooter } from "@/components/site-footer";

export default function IndexPage() {
  return (
    <div className="min-h-[calc(100vh-var(--header-height))] flex flex-col">
      <main className="flex-1 relative w-full">
        <section
          id="header"
          className="container flex flex-col items-center gap-2 max-w-4xl py-8 justify-center md:py-12 lg:py-16 xl:gap-4 text-center"
        >
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold">
            UI Components{" "}
            <span className="bg-gradient-to-b from-neutral-50 to-neutral-500 text-transparent bg-clip-text">
              designed to build{" "}
            </span>
            Modern{" "}
            <span className="bg-gradient-to-b from-neutral-50 to-neutral-500 text-transparent bg-clip-text">
              web applications.
            </span>
          </h1>
          <div className="flex gap-3 mt-2">
            <Button>Get Started</Button>
            <Button variant="outline">Explore</Button>
          </div>
        </section>

        <div className="relative">
          <BorderFlash border="bottom" animation="right" dashed />
          <div className="container pointer-events-none absolute bottom-0 inset-x-0 overflow-visible">
            <BorderFlashBox className="absolute -bottom-[3.5px] -left-[11.5px] -ml-1 size-2 bg-background shadow-xs/5 p-0 z-50">
              <BorderFlashBoxContent className="p-0" />
            </BorderFlashBox>
            <BorderFlashBox className="absolute -bottom-[3.5px] -right-[11.5px] -mr-1 size-2 bg-background shadow-xs/5 dark:bg-clip-border p-0 z-50">
              <BorderFlashBoxContent className="p-0" />
            </BorderFlashBox>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
