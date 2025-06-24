"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/src/lib/utils";

interface KeyboardShortcutProps extends React.ComponentProps<"kbd"> {
  className?: string;
  shortcutKey: string;
}

const MAC_TO_WIN: Record<string, string> = {
  "⌘": "Ctrl",
  "⌥": "Alt",
  "⇧": "Shift",
  "^": "Ctrl",
  "fn": "Fn",
};

const WIN_TO_MAC: Record<string, string> = {
  Ctrl: "⌘",
  Alt: "⌥",
  Shift: "⇧",
  Fn: "fn",
};

const isMacModifier = (key: string) => Object.keys(MAC_TO_WIN).includes(key);

const splitShortcut = (shortcut: string) => {
  if (shortcut.includes("+")) {
    return shortcut.split("+");
  } else {
    const parts: string[] = [];
    let buffer = "";
    for (let i = 0; i < shortcut.length; i++) {
      const char = shortcut[i];
      if (isMacModifier(char)) {
        if (buffer) {
          parts.push(buffer);
          buffer = "";
        }
        parts.push(char);
      } else {
        buffer += char;
      }
    }
    if (buffer) parts.push(buffer);
    return parts;
  }
};

const replaceModifiers = (
  shortcut: string,
  map: Record<string, string>
) => {
  const parts = splitShortcut(shortcut);
  return parts
    .map((key) => map[key] ?? key)
    .join("+");
};

const convertShortcut = (shortcut: string, isMac: boolean) => {
  if (isMac) {
    return replaceModifiers(shortcut, WIN_TO_MAC);
  } else {
    return replaceModifiers(shortcut, MAC_TO_WIN);
  }
};

const KeyboardShortcut = ({
  shortcutKey,
  className,
  ...props
}: KeyboardShortcutProps) => {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform));
  }, []);

  const displayShortcut = convertShortcut(shortcutKey, isMac);

  return (
    <kbd
      data-slot="keyboard-shortcut"
      className={cn(
        "hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-background text-muted-foreground text-[10px] font-mono rounded-md shadow-sm",
        className
      )}
      {...props}
    >
      <span>{displayShortcut}</span>
    </kbd>
  );
};

export { KeyboardShortcut };
