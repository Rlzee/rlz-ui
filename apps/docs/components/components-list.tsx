import Link from "next/link";
import { PAGES_NEW, getDocsComponents } from "@/lib/docs";

export function ComponentsList() {
  const components = getDocsComponents();

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
      {components.map((component: any) => (
        <Link
          key={component.$id}
          href={component.url}
          className="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base text-muted-foreground hover:text-foreground"
        >
          {component.name}
          {PAGES_NEW.includes(component.url) && (
            <span className="flex size-2 rounded-full bg-success" title="New" />
          )}
        </Link>
      ))}
    </div>
  );
}
