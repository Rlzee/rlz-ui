"use client";

import * as React from "react";
import { useSetAtom } from "jotai";

import type { DocsNavSection } from "@/lib/docs";
import { useSelectedComponent } from "@/hooks/use-selected-component";
import { classEditorRequestAtom } from "../../state/class-editor-state";

import { Sidebar } from "@rlz/ui/components/ui/sidebar";
import { BorderFlash } from "@rlz/ui/components/animations/border-flash";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Input } from "@rlz/ui/components/ui/input";

import { Search } from "lucide-react";

type ExplorerProps = React.ComponentProps<typeof Sidebar> & {
  sections: DocsNavSection[];
};

// Entry selected when the creator opens with nothing chosen yet.
const DEFAULT_SELECTED_ID = "info";

export function Explorer({ sections, ...props }: ExplorerProps) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = useSelectedComponent();
  const setClassEditorRequest = useSetAtom(classEditorRequestAtom);

  React.useEffect(() => {
    if (selected) return;

    const fallback = sections
      .flatMap((section) => section.items)
      .find((item) => item.id === DEFAULT_SELECTED_ID);

    if (fallback) {
      setSelected(fallback);
    }
  }, [sections, selected, setSelected]);

  const visibleSections = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return (
      sections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) =>
            item.name.toLowerCase().includes(q)
          ),
        }))
        // Empty sections only stay visible while no search is running.
        .filter((section) => section.items.length > 0 || !q)
    );
  }, [sections, query]);

  return (
    <Sidebar
      variant="sidebar"
      className="top-[calc(var(--header-height)+1px)]! bottom-[calc(0.5rem+1px)]! ml-[calc(0.5rem+1px)] h-auto! p-0! border-r-transparent! **:data-[slot=sidebar-inner]:relative **:data-[slot=sidebar-inner]:rounded-l-md **:data-[slot=sidebar-inner]:bg-background!"
      {...props}
    >
      <BorderFlash
        border="right"
        animation="bottom"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden md:block"
      />
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
            <Sidebar.List>
              {section.items.map((item) => (
                <Sidebar.ButtonField key={item.id}>
                  <Sidebar.Button
                    size="sm"
                    isActive={selected?.id === item.id}
                    onClick={() => {
                      if (selected?.id !== item.id) {
                        setClassEditorRequest(null);
                      }
                      setSelected(item);
                    }}
                  >
                    {item.name}
                  </Sidebar.Button>
                </Sidebar.ButtonField>
              ))}
            </Sidebar.List>
          </Sidebar.Group>
        ))}
        {visibleSections.length === 0 && (
          <Sidebar.Group>
            <Sidebar.List className="text-muted-foreground">
              No results for "{query}".
            </Sidebar.List>
          </Sidebar.Group>
        )}
      </Sidebar.Body>
    </Sidebar>
  );
}
