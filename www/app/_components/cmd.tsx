"use client";

import { StickyNote } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CommandPortalName,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/ui/components/command";
import { pages } from "./_data/data";
import { usePortal } from "@/src/ui/stores/portal.store";

import * as React from "react";

export function Cmd() {
  const router = useRouter();
  const { closePortal, openPortal, getPortalState } = usePortal();
  const isOpen = getPortalState(CommandPortalName);
  const shortcutKey = "k";

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === shortcutKey.toLowerCase() &&
        (e.ctrlKey || e.metaKey)
      ) {
        e.preventDefault();
        if (isOpen) {
          closePortal(CommandPortalName);
        } else {
          openPortal(CommandPortalName);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcutKey, isOpen]);

  const HandleClick = (href: string) => {
    if (href) {
      router.push(href);
      closePortal(CommandPortalName);
    }
  };

  return (
    <CommandDialog shortcutKey={shortcutKey}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {pages.map((page) => (
            <CommandItem
              key={page.label}
              onSelect={() => HandleClick(page.href)}
            >
              <StickyNote />
              {page.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
