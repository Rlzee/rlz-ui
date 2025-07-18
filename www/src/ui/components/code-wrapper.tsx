"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Tooltip } from "@/src/ui/components/tooltip";

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
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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
        <Tooltip.Root openDelay={0} closeDelay={500}>
          <Tooltip.Trigger asChild>
            <button
              onClick={handleCopy}
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-8 w-8 items-center justify-center rounded-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
              aria-label={copied ? "Copied" : "Copy to clipboard"}
              disabled={copied}
            >
              <div
                className={cn(
                  "transition-all",
                  copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
              >
                <CheckIcon
                  className="stroke-emerald-500"
                  size={16}
                  aria-hidden="true"
                />
              </div>
              <div
                className={cn(
                  "absolute transition-all",
                  copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                )}
              >
                <CopyIcon size={16} aria-hidden="true" />
              </div>
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content className="px-2 py-1 text-xs">
            {copied ? "Copied!" : "Copy to clipboard"}
          </Tooltip.Content>
        </Tooltip.Root>
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
