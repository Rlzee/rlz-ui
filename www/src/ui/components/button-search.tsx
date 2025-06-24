"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/ui/components/button";
import { KeyboardShortcut } from "./keyboard-shortcut";
import { cn } from "@/src/lib/utils";

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
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform));
  }, []);

  const handleClick = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      code: "KeyK",
      metaKey: isMac,
      ctrlKey: !isMac,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <Button
      data-slot="button-search"
      variant="secondary"
      size="sm"
      onClick={handleClick}
      className={cn(
        "flex justify-between items-center gap-2 px-3 py-1.5 font-normal",
        "w-[8rem] sm:w-[10rem] md:w-[12rem] lg:w-[14rem] xl:w-[16rem] max-w-full truncate",

        className
      )}
      aria-label="Open search"
    >
      <span className="truncate text-muted-foreground">{placeholder}</span>
      <KeyboardShortcut
        shortcutKey={shortcutKey}
        onClick={handleClick}
      />
    </Button>
  );
};

export { ButtonSearch };
