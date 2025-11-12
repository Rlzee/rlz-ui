import React, { ReactNode } from "react";
import { cn } from "@ui/lib/utils";

type GradientTextProps = {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
};

const GradientText = ({
  children,
  className = "",
  colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
  animationSpeed = 8,
  showBorder = false,
}: GradientTextProps) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    backgroundSize: "300% 100%",
    animation: `gradient ${animationSpeed}s linear infinite`,
  };

  const keyframesStyle = `
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  return (
    <>
      <style>{keyframesStyle}</style>
      <div
        data-slot="gradient-text"
        className={cn(
          "relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-xl font-medium backdrop-blur-sm transition-shadow duration-500 ease-out overflow-hidden cursor-pointer",
          className
        )}
      >
        {showBorder && (
          <div
            className="absolute inset-0 rounded-inherit z-0 pointer-events-none before:content-[''] before:absolute before:inset-0 before:rounded-inherit before:w-[calc(100%-2px)] before:h-[calc(100%-2px)] before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[#060010] before:-z-10"
            style={gradientStyle}
          />
        )}
        <div
          className="inline-block relative z-20 bg-clip-text text-transparent"
          style={gradientStyle}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export { GradientText };
