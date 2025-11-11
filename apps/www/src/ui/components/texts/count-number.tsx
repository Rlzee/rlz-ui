"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

type CountNumberProps = {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
};

const CountNumber = ({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}: CountNumberProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const startValue = direction === "down" ? to : from;
  const endValue = direction === "down" ? from : to;

  const motionValue = useMotionValue(startValue);
  const animatedValue = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration),
  });

  const isInView = useInView(ref, { once: true });

  const getDecimalPlaces = (num: number) => {
    const [, decimals] = num.toString().split(".");
    return decimals && !/^0+$/.test(decimals) ? decimals.length : 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));
  const hasDecimals = maxDecimals > 0;

  const formatOptions: Intl.NumberFormatOptions = {
    useGrouping: !!separator,
    minimumFractionDigits: hasDecimals ? maxDecimals : 0,
    maximumFractionDigits: hasDecimals ? maxDecimals : 0,
  };

  // Init display
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(startValue);
    }
  }, [startValue]);

  // Trigger animation
  useEffect(() => {
    if (!isInView || !startWhen) return;

    onStart?.();

    const startTimeout = setTimeout(() => {
      motionValue.set(endValue);
    }, delay * 1000);

    const endTimeout = setTimeout(() => {
      onEnd?.();
    }, (delay + duration) * 1000);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(endTimeout);
    };
  }, [
    isInView,
    startWhen,
    delay,
    duration,
    endValue,
    motionValue,
    onStart,
    onEnd,
  ]);

  // Update DOM on value change
  useEffect(() => {
    const unsubscribe = animatedValue.on("change", (latest) => {
      if (ref.current) {
        const formatted = Intl.NumberFormat("en-US", formatOptions).format(
          latest
        );
        ref.current.textContent = separator
          ? formatted.replace(/,/g, separator)
          : formatted;
      }
    });

    return () => unsubscribe();
  }, [animatedValue, separator, formatOptions]);

  return (
    <span
      data-slot="count-number"
      aria-live="polite"
      className={className}
      ref={ref}
    />
  );
};

export { CountNumber };
