"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  ComponentPropsWithoutRef,
} from "react";
import {
  motion,
  AnimatePresence,
  Transition,
  type MotionProps,
} from "framer-motion";
import { cn } from "@ui/lib/utils";

type RotatingTextRef = {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
};

interface RotatingTextProps
  extends Omit<
    ComponentPropsWithoutRef<typeof motion.span>,
    "children" | "transition" | "initial" | "animate" | "exit"
  > {
  texts: string[];
  transition?: Transition;
  initial?: MotionProps["initial"];
  animate?: MotionProps["animate"];
  exit?: MotionProps["exit"];
  animatePresenceMode?: "sync" | "wait";
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

const RotatingText = forwardRef<RotatingTextRef, RotatingTextProps>(
  (
    {
      texts,
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-120%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      ...rest
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const splitIntoCharacters = (text: string): string[] => {
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
        return Array.from(segmenter.segment(text), (s) => s.segment);
      }
      return Array.from(text);
    };

    const elements = useMemo(() => {
      const currentText = texts[currentIndex];

      const splitText = (
        text: string
      ): { characters: string[]; needsSpace: boolean }[] => {
        if (splitBy === "characters") {
          return text.split(" ").map((word, i, arr) => ({
            characters: splitIntoCharacters(word),
            needsSpace: i < arr.length - 1,
          }));
        }

        const separator =
          splitBy === "words" ? " " : splitBy === "lines" ? "\n" : splitBy;

        return text.split(separator).map((part, i, arr) => ({
          characters: [part],
          needsSpace: i < arr.length - 1,
        }));
      };

      return splitText(currentText);
    }, [texts, currentIndex, splitBy]);

    const getStaggerDelay = useCallback(
      (index: number, total: number) => {
        switch (staggerFrom) {
          case "first":
            return index * staggerDuration;
          case "last":
            return (total - 1 - index) * staggerDuration;
          case "center": {
            const center = Math.floor(total / 2);
            return Math.abs(center - index) * staggerDuration;
          }
          case "random":
            const randomIndex = Math.floor(Math.random() * total);
            return Math.abs(randomIndex - index) * staggerDuration;
          default:
            return Math.abs((staggerFrom as number) - index) * staggerDuration;
        }
      },
      [staggerFrom, staggerDuration]
    );

    const changeIndex = useCallback(
      (newIndex: number) => {
        setCurrentIndex(newIndex);
        onNext?.(newIndex);
      },
      [onNext]
    );

    const next = useCallback(() => {
      const nextIndex =
        currentIndex === texts.length - 1
          ? loop
            ? 0
            : currentIndex
          : currentIndex + 1;
      if (nextIndex !== currentIndex) changeIndex(nextIndex);
    }, [currentIndex, texts.length, loop, changeIndex]);

    const previous = useCallback(() => {
      const prevIndex =
        currentIndex === 0
          ? loop
            ? texts.length - 1
            : currentIndex
          : currentIndex - 1;
      if (prevIndex !== currentIndex) changeIndex(prevIndex);
    }, [currentIndex, texts.length, loop, changeIndex]);

    const jumpTo = useCallback(
      (index: number) => {
        const clamped = Math.max(0, Math.min(index, texts.length - 1));
        if (clamped !== currentIndex) changeIndex(clamped);
      },
      [texts.length, currentIndex, changeIndex]
    );

    const reset = useCallback(() => {
      if (currentIndex !== 0) changeIndex(0);
    }, [currentIndex, changeIndex]);

    useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [
      next,
      previous,
      jumpTo,
      reset,
    ]);

    useEffect(() => {
      if (!auto) return;
      const interval = setInterval(next, rotationInterval);
      return () => clearInterval(interval);
    }, [next, rotationInterval, auto]);

    return (
      <motion.span
        data-slot="rotating-text"
        {...rest}
        layout
        transition={transition}
        className={cn(
          "flex flex-wrap whitespace-pre-wrap relative",
          mainClassName
        )}
      >
        <span className="sr-only">{texts[currentIndex]}</span>
        <AnimatePresence
          data-slot="rotating-text-animate-presence"
          mode={animatePresenceMode}
          initial={animatePresenceInitial}
        >
          <motion.span
            data-slot="rotating-text-motion-span"
            key={currentIndex}
            layout
            aria-hidden="true"
            className={cn(
              splitBy === "lines"
                ? "flex flex-col w-full"
                : "flex flex-wrap whitespace-pre-wrap relative"
            )}
          >
            {elements.map((word, wordIdx, wordArr) => {
              const offset = wordArr
                .slice(0, wordIdx)
                .reduce((acc, w) => acc + w.characters.length, 0);

              return (
                <span
                  data-slot="rotating-text-word"
                  key={wordIdx}
                  className={cn("inline-flex", splitLevelClassName)}
                >
                  {word.characters.map((char, charIdx) => (
                    <motion.span
                      data-slot="rotating-text-character"
                      key={charIdx}
                      initial={initial}
                      animate={animate}
                      exit={exit}
                      transition={{
                        ...transition,
                        delay: getStaggerDelay(
                          offset + charIdx,
                          wordArr.reduce(
                            (acc, w) => acc + w.characters.length,
                            0
                          )
                        ),
                      }}
                      className={cn("inline-block", elementLevelClassName)}
                    >
                      {char}
                    </motion.span>
                  ))}
                  {word.needsSpace && <span className="whitespace-pre"> </span>}
                </span>
              );
            })}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    );
  }
);

export { RotatingText };
