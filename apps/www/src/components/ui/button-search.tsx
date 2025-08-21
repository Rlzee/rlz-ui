"use client";

import { Button } from "@ui/components/button";
import { Kbd } from "@ui/components/kbd";
import { cn } from "@ui/lib/utils";
import { CommandDialogName } from "@ui/components/command";
import { useDialog } from "@ui/stores/dialog.store";

interface ButtonSearchProps {
  className?: string;
  placeholder?: string;
  shortcutKey?: string;
  fullWidth?: boolean;
}

const ButtonSearch = ({
  className,
  placeholder = "Search",
  shortcutKey = "⌘k",
  fullWidth = false,
}: ButtonSearchProps) => {
  const { openDialog } = useDialog();

  return (
    <Button
      data-slot="button-search"
      variant="secondary"
      size="sm"
      onClick={() => openDialog(CommandDialogName)}
      className={cn(
        "flex justify-between items-center gap-2 px-3 py-1.5 font-normal",
        fullWidth 
          ? "w-full" 
          : "w-[8rem] sm:w-[10rem] md:w-[12rem] lg:w-[14rem] xl:w-[16rem] max-w-full truncate",
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
