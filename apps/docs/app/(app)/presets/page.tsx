import { Suspense } from "react";
import SearchField from "./search-field";
import PresetsList from "./presets-list";

export default function Page() {
  return (
    <div className="container w-full">
      <section data-slot="themes">
        <div className="container flex flex-col items-center gap-0.5 px-0 pt-8 text-center md:pt-12 lg:pt-16">
          <h1 className="font-sans text-4xl lg:text-5xl font-bold">
            Presets Community
          </h1>
          <p className="text-[1.05rem] sm:text-base text-muted-foreground lg:text-lg">
            Browse and apply community-made Presets, or create your own to match
            your brand.
          </p>
        </div>
        <Suspense>
          <SearchField />
        </Suspense>
        <Suspense>
          <PresetsList />
        </Suspense>
      </section>
    </div>
  );
}
