import { CodeWrapper } from "@ui/components/code-wrapper";
import { Clipboard } from "./clipboard";

const CodeBlock = ({ code }: { code: string }) => {
  return (
    <div className="relative pt-1">
      <div className="absolute top-6 right-2">
        <Clipboard text={code} />
      </div>
      <CodeWrapper
        code={code}
        language="tsx"
        showLineNumbers={true}
        customStyle={{
          background: "var(--background-secondary)",
          borderRadius: "0.5rem",
          maxHeight: "450px",
          /* Hide scrollbar for Webkit browsers */
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE 10+
          overflow: "auto",
        }}
      />
    </div>
  );
};

export { CodeBlock };
