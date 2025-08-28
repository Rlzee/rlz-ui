import { CodeWrapper } from "@ui/components/code-wrapper";
import { Clipboard } from "./clipboard";

const CodeBlock = ({ code }: { code: string }) => {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <Clipboard text={code} />
      </div>
      <CodeWrapper code={code} language="tsx" showLineNumbers={true} />
    </div>
  );
};

export { CodeBlock };