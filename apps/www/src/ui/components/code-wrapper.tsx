"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, CSSProperties } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeWrapperProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  customStyle?: CSSProperties;
}

const CodeWrapper = ({
  code,
  language = "tsx",
  showLineNumbers = false,
  customStyle,
}: CodeWrapperProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const theme = resolvedTheme === "dark" ? oneDark : oneLight;

  return (
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
        ...customStyle,
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
  );
};

export { CodeWrapper };
