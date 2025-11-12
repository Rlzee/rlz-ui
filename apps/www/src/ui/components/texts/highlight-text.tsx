"use client";

import { useState, ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Types ------------------------------ */

type AnimationType = "slideIn" | "fadeIn" | "expand" | "wave";

type BaseProps = {
  children: ReactNode;
  color?: string;
  duration?: number;
  animationType?: AnimationType;
  className?: string;
  style?: CSSProperties;
};

type HighlightTextProps = BaseProps & {
  delay?: number;
};

type ScrollHighlightProps = BaseProps & {
  threshold?: number;
};

type ControlledHighlightProps = BaseProps & {
  isHighlighted?: boolean;
};

/* ------------------------------ Animation Variants ------------------------------ */

export const getAnimationVariants = (
  type: AnimationType,
  duration: number,
  delay = 0
) => {
  const variants = {
    slideIn: {
      initial: { width: 0 },
      animate: { width: "100%", transition: { duration, delay } },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 0.3, transition: { duration, delay } },
    },
    expand: {
      initial: { scaleX: 0 },
      animate: { scaleX: 1, transition: { duration, delay } },
    },
    wave: {
      initial: { width: 0, opacity: 0 },
      animate: {
        width: "100%",
        opacity: 0.3,
        transition: {
          width: { duration, delay },
          opacity: { duration: duration * 0.5, delay: delay + duration * 0.5 },
        },
      },
    },
  };

  return variants[type] || variants.slideIn;
};

/* ------------------------------ Base Highlight ------------------------------ */

const BaseHighlight = ({
  children,
  className = "",
  style = {},
  backgroundColor,
  animation,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  backgroundColor: string;
  animation: {
    initial: any;
    animate: any;
  };
}) => {
  return (
    <span className={cn("relative inline-block", className)} style={style}>
      <motion.span
        className="absolute inset-0 z-0"
        style={{
          backgroundColor,
          height: "100%",
          transformOrigin: "left center",
        }}
        initial={animation.initial}
        animate={animation.animate}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
};

/* ------------------------------ Highlight Text ------------------------------ */

const HighlightText = ({
  children,
  color = "#ffeb3b",
  delay = 0,
  duration = 0.8,
  animationType = "slideIn",
  className = "",
  style = {},
}: HighlightTextProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const animation = getAnimationVariants(animationType, duration, delay);

  return (
    <span
      className={cn("relative inline-block", className)}
      style={style}
      onMouseEnter={() => setIsVisible(true)}
    >
      <motion.span
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: color,
          height: "100%",
          transformOrigin: "left center",
        }}
        initial={animation.initial}
        animate={isVisible ? animation.animate : animation.initial}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
};

/* ------------------------------ Scroll Highlight ------------------------------ */

const ScrollHighlight = ({
  children,
  color = "#ffeb3b",
  threshold = 0.1,
  duration = 0.8,
  animationType = "slideIn",
  className = "",
  style = {},
}: ScrollHighlightProps) => {
  const animation = getAnimationVariants(animationType, duration);

  return (
    <motion.span
      className={cn("relative inline-block", className)}
      style={style}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: threshold }}
    >
      <motion.span
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: color,
          height: "100%",
          transformOrigin: "left center",
        }}
        variants={animation}
      />
      <span className="relative z-10">{children}</span>
    </motion.span>
  );
};

/* ------------------------------ Controlled Highlight ------------------------------ */

const ControlledHighlight = ({
  children,
  color = "#ffeb3b",
  isHighlighted = false,
  duration = 0.8,
  animationType = "slideIn",
  className = "",
  style = {},
}: ControlledHighlightProps) => {
  const animation = getAnimationVariants(animationType, duration);

  return (
    <BaseHighlight
      className={className}
      style={style}
      backgroundColor={color}
      animation={{
        initial: animation.initial,
        animate: isHighlighted ? animation.animate : animation.initial,
      }}
    >
      {children}
    </BaseHighlight>
  );
};

/* ------------------------------ Exports ------------------------------ */

export { BaseHighlight, HighlightText, ScrollHighlight, ControlledHighlight };
