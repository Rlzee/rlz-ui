import { type PropRow } from "@site/types/props";

export const codeWrapperProps: PropRow[] = [
  {
    prop: "code",
    type: "string",
    default: "-",
    description: "Code string to render inside the syntax highlighter."
  },
  {
    prop: "language",
    type: "string",
    default: '"tsx"',
    description: "Language identifier for syntax highlighting (e.g. 'tsx', 'js', 'css')."
  },
  {
    prop: "showLineNumbers",
    type: "boolean",
    default: "false",
    description: "Whether to show line numbers alongside the code."
  },
  {
    prop: "customStyle",
    type: "CSSProperties",
    default: "-",
    description: "Optional inline style object applied to the underlying SyntaxHighlighter container."
  }
];

const codeWrapperPropsExport = { main: codeWrapperProps };

export { codeWrapperPropsExport };
