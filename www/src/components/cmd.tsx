"use client";

import { StickyNote } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  COMMAND_DIALOG_NAME,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/ui/components/command";
import { navLinks as pages } from "@/src/data/data";
import { useDialog } from "@/src/ui/stores/dialog.store";

import * as React from "react";

export function Cmd() {
  const router = useRouter();
  const { closeDialog, openDialog, getDialogState } = useDialog();
  const isOpen = getDialogState(COMMAND_DIALOG_NAME);
  const shortcutKey = "k";

  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === shortcutKey.toLowerCase() &&
        (e.ctrlKey || e.metaKey)
      ) {
        e.preventDefault();
        if (isOpen) {
          closeDialog(COMMAND_DIALOG_NAME);
        } else {
          openDialog(COMMAND_DIALOG_NAME);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcutKey, isOpen]);

  const HandleClick = (href: string) => {
    if (href) {
      router.push(href);
      closeDialog(COMMAND_DIALOG_NAME);
    }
  };

  return (
    <CommandDialog>
      <CommandInput
        placeholder="What are you looking for?"
        value={query}
        onValueChange={setQuery}
      />
      {query.trim() !== "" && (
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
      )}
    </CommandDialog>
  );
}
