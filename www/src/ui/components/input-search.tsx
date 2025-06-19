"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/ui/components/button";
import { cn } from "@/src/lib/utils";

interface InputSearchProps {
  className?: string;
  placeholder?: string;
  key?: string;
}

const InputSearch = ({
  className,
  placeholder = "Search",
  key = "k",
}: InputSearchProps) => {
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
      data-slot="input-search"
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
      <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-background text-muted-foreground text-[10px] font-mono rounded-md shadow-sm">
        <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>
        <span>{key}</span>
      </kbd>
    </Button>
  );
};

export { InputSearch };
