"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/src/lib/utils";
import { Clipboard } from "./clipboard";

interface CodeWrapperProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  className?: string;
}

const CodeWrapper = ({
  code,
  language = "tsx",
  showLineNumbers = false,
  maxHeight = "500px",
  className,
}: CodeWrapperProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const theme = resolvedTheme === "dark" ? oneDark : oneLight;

  return (
    <div
      className={cn("relative overflow-auto", className)}
      style={{
        maxHeight,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
      <div className="sticky top-2 right-2 z-10 float-right">
        <Clipboard text={code} position="relative" />
      </div>
      <SyntaxHighlighter
        language={language}
        style={theme}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          background: "transparent",
        }}
        codeTagProps={{
          className: "font-mono",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export { CodeWrapper };
