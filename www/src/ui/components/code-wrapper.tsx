"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard } from "@/src/ui/components/custom/button/clipboard";
import { cn } from "@/src/lib/utils";

interface CodeWrapperProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  className?: string;
  showClipboard?: boolean;
}

const CodeWrapper = ({
  code,
  language = "tsx",
  showLineNumbers = false,
  maxHeight = "500px",
  className,
  showClipboard = false,
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
        minWidth: "100%",
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
      {showClipboard && (
        <div className="sticky top-2 right-2 z-50 float-right">
          <Clipboard text={code} position="relative" size="sm" />
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={theme}
        showLineNumbers={showLineNumbers}
        wrapLines={true}
        wrapLongLines={true}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          background: "transparent",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
        codeTagProps={{
          className: "font-mono",
          style: {
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export { CodeWrapper };
