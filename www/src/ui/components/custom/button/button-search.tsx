"use client";

import { Button } from "@/src/ui/components/button";
import { Kbd } from "@/src/ui/components/kbd";
import { cn } from "@/src/lib/utils";
import { COMMAND_DIALOG_NAME } from "@/src/ui/components/command";
import { useDialog } from "@/src/ui/stores/dialog.store";

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
  const { openDialog } = useDialog();

  return (
    <Button
      data-slot="button-search"
      variant="secondary"
      size="sm"
      onClick={() => openDialog(COMMAND_DIALOG_NAME)}
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
