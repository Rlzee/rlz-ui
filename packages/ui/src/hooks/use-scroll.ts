"use client";

import * as React from "react";

export function useScroll(downThreshold: number, upThreshold?: number) {
  const [scrolled, setScrolled] = React.useState(false);
  const scrollUpThreshold = upThreshold ?? downThreshold / 2;

  React.useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => {
        if (prev) {
          return y > scrollUpThreshold;
        }
        return y > downThreshold;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [downThreshold, scrollUpThreshold]);

  return scrolled;
}
