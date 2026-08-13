"use client";

import { getDocsComponents } from "@/lib/docs";

import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Input } from "@rlz/ui/components/ui/input";

import { Search } from "lucide-react";

export function AnimationProperties() {
  const components = getDocsComponents();

  return (
    <section id="editor-animation" className="flex h-full min-h-0 flex-col">
      <div className="px-4 py-3 flex gap-1.5">
        <InputGroup>
          <InputGroup.Addon align="inline-start">
            <Search />
          </InputGroup.Addon>

          <Input
            // value={search}
            // onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Components..."
            unstyled
          />
        </InputGroup>
      </div>

      <div className="grid grid-cols-3 gap-3 px-4">
        {components.map((component: any) => (
          <div
            key={component.$id}
            className="border rounded-md px-3 py-2 bg-secondary hover:bg-accent text-center cursor-pointer"
          >
            {component.name}
          </div>
        ))}
      </div>
    </section>
  );
}
