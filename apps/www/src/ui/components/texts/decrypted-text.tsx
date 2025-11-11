"use client";

import { useEffect, useState, useRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@ui/lib/utils";

interface DecryptedTextProps extends HTMLMotionProps<"span"> {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: "view" | "hover";
}

const DecryptedText = ({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className = "",
  encryptedClassName = "",
  parentClassName = "",
  animateOn = "hover",
  ...props
}: DecryptedTextProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(
    new Set()
  );
  const [isScrambling, setIsScrambling] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const containerRef = useRef<HTMLSpanElement>(null);

  const availableChars = useOriginalCharsOnly
    ? Array.from(new Set(text.replace(/ /g, "").split("")))
    : characters.split("");

  const shuffleText = (revealed: Set<number>) =>
    text
      .split("")
      .map((char, i) =>
        char === " " || revealed.has(i)
          ? text[i]
          : availableChars[Math.floor(Math.random() * availableChars.length)]
      )
      .join("");

  const shuffleOriginalCharsOnly = (revealed: Set<number>) => {
    const unrevealed = text
      .split("")
      .map((c, i) => (revealed.has(i) || c === " " ? null : c));
    const shuffled = unrevealed.filter(Boolean).sort(() => Math.random() - 0.5);

    let index = 0;
    return text
      .split("")
      .map((char, i) =>
        char === " " ? " " : revealed.has(i) ? char : shuffled[index++] || char
      )
      .join("");
  };

  const getNextRevealIndex = (revealed: Set<number>): number => {
    const len = text.length;
    switch (revealDirection) {
      case "start":
        return revealed.size;
      case "end":
        return len - 1 - revealed.size;
      case "center":
        const mid = Math.floor(len / 2);
        const offset = Math.floor(revealed.size / 2);
        const index = revealed.size % 2 === 0 ? mid + offset : mid - offset - 1;
        if (!revealed.has(index)) return index;
        for (let i = 0; i < len; i++) if (!revealed.has(i)) return i;
        return 0;
      default:
        return revealed.size;
    }
  };

  useEffect(() => {
    if (!isHovering) {
      setDisplayText(text);
      setRevealedIndices(new Set());
      setIsScrambling(false);
      return;
    }

    setIsScrambling(true);
    let iteration = 0;
    const interval = setInterval(() => {
      setRevealedIndices((prev) => {
        if (sequential && prev.size < text.length) {
          const newSet = new Set(prev).add(getNextRevealIndex(prev));
          setDisplayText(
            useOriginalCharsOnly
              ? shuffleOriginalCharsOnly(newSet)
              : shuffleText(newSet)
          );
          return newSet;
        }

        if (!sequential) {
          setDisplayText(
            useOriginalCharsOnly
              ? shuffleOriginalCharsOnly(prev)
              : shuffleText(prev)
          );
          iteration++;
          if (iteration >= maxIterations) {
            clearInterval(interval);
            setIsScrambling(false);
            setDisplayText(text);
          }
        } else if (prev.size >= text.length) {
          clearInterval(interval);
          setIsScrambling(false);
        }

        return prev;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [
    isHovering,
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    characters,
    useOriginalCharsOnly,
  ]);

  useEffect(() => {
    if (animateOn !== "view") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setIsHovering(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [animateOn, hasAnimated]);

  const hoverHandlers =
    animateOn === "hover"
      ? {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false),
        }
      : {};

  return (
    <motion.span
      data-slot="decrypted-text"
      ref={containerRef}
      className={cn("inline-block whitespace-pre-wrap", parentClassName)}
      {...hoverHandlers}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, i) => (
          <span
            key={i}
            data-slot="decrypted-char"
            className={
              revealedIndices.has(i) || !isScrambling || !isHovering
                ? className
                : encryptedClassName
            }
          >
            {char}
          </span>
        ))}
      </span>
    </motion.span>
  );
};

export { DecryptedText };
