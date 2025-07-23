"use client";

import { useEffect, useState, ComponentProps } from "react";
import { cn } from "@/src/lib/utils";

interface KbdProps extends ComponentProps<"kbd"> {
  className?: string;
  shortcutKey: string;
  onShortcutPressed?: () => void;
}

const MAC_TO_WIN: Record<string, string> = {
  "⌘": "Ctrl",
  "⌥": "Alt",
  "⇧": "Shift",
  "^": "Ctrl",
  fn: "Fn",
};

const WIN_TO_MAC: Record<string, string> = {
  Control: "⌘",
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

const replaceModifiers = (shortcut: string, map: Record<string, string>) => {
  const parts = splitShortcut(shortcut);
  return parts.map((key) => map[key] ?? key).join(" ");
};

const convertShortcut = (shortcut: string, isMac: boolean) => {
  if (isMac) {
    return replaceModifiers(shortcut, WIN_TO_MAC);
  } else {
    return replaceModifiers(shortcut, MAC_TO_WIN);
  }
};

const Kbd = ({
  shortcutKey,
  className,
  onShortcutPressed,
  ...props
}: KbdProps) => {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const parts = convertShortcut(shortcutKey, isMac)
        .toLowerCase()
        .split("+");

      const isMatch = parts.every((part) => {
        if (part === "ctrl" || part === "control") return event.ctrlKey;
        if (part === "alt") return event.altKey;
        if (part === "shift") return event.shiftKey;
        if (part === "meta" || part === "⌘") return event.metaKey;
        return event.key.toLowerCase() === part;
      });

      if (isMatch && onShortcutPressed) {
        event.preventDefault();
        onShortcutPressed();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcutKey, isMac, onShortcutPressed]);

  const displayShortcut = convertShortcut(shortcutKey, isMac);

  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-popover text-muted-foreground text-[9px] font-mono rounded-sm shadow-sm border border-muted",
        className
      )}
      {...props}
    >
      <span>{displayShortcut}</span>
    </kbd>
  );
};

export { Kbd };
