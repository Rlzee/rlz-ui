"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/src/lib/utils";

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const BlurText = ({
  text = "Blur Text Animation",
  delay = 0,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom = {
    filter: "blur(10px)",
    opacity: 0,
    y: direction === "top" ? -20 : 20,
  },
  animationTo = [
    {
      filter: "blur(5px)",
      opacity: 0.5,
      y: 0,
    },
    {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
    },
  ],
  easing = (t: number) => t * (2 - t),
  onAnimationComplete,
  stepDuration = 0.4,
}: BlurTextProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const isInView = useInView(ref, {
    amount: threshold,
    margin: rootMargin as any,
    once: true,
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  const textElements = React.useMemo(() => {
    if (animateBy === "words") {
      return text.split(" ");
    } else {
      return text.split("");
    }
  }, [text, animateBy]);

  const handleAnimationComplete = () => {
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: animateBy === "words" ? 0.1 : 0.03,
        delayChildren: delay,
      },
    },
  };

  const elementVariants = {
    hidden: animationFrom,
    visible: {
      ...animationTo[animationTo.length - 1],
      transition: {
        duration: stepDuration,
        ease: easing,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      data-slot="blur-text"
      className={cn("inline-block", className)}
      variants={containerVariants}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      onAnimationComplete={handleAnimationComplete}
    >
      {textElements.map((element, index) => (
        <motion.span
          key={index}
          data-slot="blur-text-element"
          variants={elementVariants}
          className="inline-block"
          style={{
            marginRight: animateBy === "words" ? "0.25em" : "0",
          }}
        >
          {element}
          {animateBy === "words" && index < textElements.length - 1 && " "}
        </motion.span>
      ))}
    </motion.div>
  );
};

export { BlurText };
