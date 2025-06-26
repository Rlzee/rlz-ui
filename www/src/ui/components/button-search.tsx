"use client";

import { Button } from "@/src/ui/components/button";
import { Kbd } from "./kbd";
import { cn } from "@/src/lib/utils";
import { CommandPortalName } from "./command";
import { usePortal } from "@/src/ui/stores/portal.store";

interface ButtonSearchProps {
  className?: string;
  placeholder?: string;
  shortcutKey?: string;
}

const ButtonSearch = ({
  className,
  placeholder = "Search",
  shortcutKey = "⌘k",
}: ButtonSearchProps) => {
  const { openPortal } = usePortal();

  return (
    <Button
      data-slot="button-search"
      variant="secondary"
      size="sm"
      onClick={() => openPortal(CommandPortalName)}
      className={cn(
        "flex justify-between items-center gap-2 px-3 py-1.5 font-normal",
        "w-[8rem] sm:w-[10rem] md:w-[12rem] lg:w-[14rem] xl:w-[16rem] max-w-full truncate",

        className
      )}
      aria-label="Open search"
    >
      <span className="truncate text-muted-foreground">{placeholder}</span>
      <Kbd shortcutKey={shortcutKey} />
    </Button>
  );
};

export { ButtonSearch };
