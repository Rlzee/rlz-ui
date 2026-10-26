"use client";

import * as React from "react";

import type { DocsNavSection } from "@/lib/docs";
import { useSelectedComponent } from "@/hooks/use-selected-component";

import { Sidebar } from "@rlz/ui/components/ui/sidebar";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Input } from "@rlz/ui/components/ui/input";

import { Search } from "lucide-react";

type ExplorerProps = React.ComponentProps<typeof Sidebar> & {
  sections: DocsNavSection[];
};

export function Explorer({ sections, ...props }: ExplorerProps) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = useSelectedComponent();

  const visibleSections = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.name.toLowerCase().includes(q)
        ),
      }))
      // Placeholder sections (e.g. Foundation) stay visible until a search runs.
      .filter((section) => section.items.length > 0 || !q);
  }, [sections, query]);

  return (
    <Sidebar
      variant="floating"
      className="top-(--header-height)! h-auto! mb-2 p-0! [&_[data-slot=sidebar-inner]]:bg-background! ml-2"
      {...props}
    >
      <Sidebar.Header>
        <InputGroup>
          <InputGroup.Addon align="inline-start">
            <Search />
          </InputGroup.Addon>
          <Input
            unstyled
            type="search"
            placeholder="Find"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </InputGroup>
      </Sidebar.Header>
      <Sidebar.Body>
        {visibleSections.map((section) => (
          <Sidebar.Group key={section.title}>
            <Sidebar.GroupLabel>{section.title}</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {section.items.map((item) => (
                  <Sidebar.MenuItem key={item.url}>
                    <Sidebar.MenuButton
                      size="sm"
                      isActive={selected?.url === item.url}
                      onClick={() => setSelected(item)}
                    >
                      {item.name}
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                ))}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        ))}
        {visibleSections.length === 0 && (
          <Sidebar.Group>
            <Sidebar.GroupContent className="text-muted-foreground">
              No results for "{query}".
            </Sidebar.GroupContent>
          </Sidebar.Group>
        )}
      </Sidebar.Body>
    </Sidebar>
  );
}
