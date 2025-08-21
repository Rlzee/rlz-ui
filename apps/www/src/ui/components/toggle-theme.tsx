"use client";

import { ComponentProps, useEffect, useState } from "react";
import { MoonStar, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/button";

const ThemeToggle = ({ className, variant = "ghost", ...props }: ComponentProps<typeof Button>) => {
  const [mounted, setMounted] = useState(false);
  const { theme = "light", setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        className={cn("rounded-md", className)}
        aria-label="Toggle theme"
        {...props}
      >
        <SunDim className="size-5" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      data-slot="theme-toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      variant={variant}
      className={cn("rounded-md", className)}
      aria-label="Toggle theme"
      {...props}
    >
      {isDark ? <SunDim className="size-5" /> : <MoonStar className="size-4" />}
    </Button>
  );
};

export { ThemeToggle };
