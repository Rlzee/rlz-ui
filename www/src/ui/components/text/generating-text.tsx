"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/src/lib/utils";

/* ------------------------------ Render Words ------------------------------ */

type RenderWordsProps = {
  scope: any;
  wordsArray: string[];
  blur?: boolean;
};

const renderWords = ({ scope, wordsArray, blur }: RenderWordsProps) => {
  return (
    <motion.div ref={scope}>
      {wordsArray.map((word, idx) => {
        return (
          <motion.span
            key={word + idx}
            className="opacity-0"
            style={{
              filter: blur ? "blur(10px)" : "none",
            }}
          >
            {word}{" "}
          </motion.span>
        );
      })}
    </motion.div>
  );
};

/* ------------------------------ Generating Text Component ------------------------------ */

type GeneratingTextProps = {
  words: string;
  className?: string;
  blur?: boolean;
  duration?: number;
};

const GeneratingText = ({
  words,
  className,
  blur = false,
  duration = 0.5,
}: GeneratingTextProps) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: blur ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2),
      }
    );
  }, [scope.current]);

  return (
    <div
      className={cn(
        "text-foreground text-2xl leading-snug tracking-wide",
        className
      )}
    >
      {renderWords({ scope, wordsArray, blur })}
    </div>
  );
};

/* ------------------------------ Exports ------------------------------ */

export { GeneratingText, renderWords };
