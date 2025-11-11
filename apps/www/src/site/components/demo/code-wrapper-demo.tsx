import { CodeWrapper } from "@/src/ui/components/code-wrapper";

const code = `import { CodeWrapper } from '@ui/components/code-wrapper';

export default function Example() {
  return (
    <div className="flex justify-center">
      <CodeWrapper language="tsx" code={code} showLineNumbers={true} customStyle={{
        background: "var(--background-secondary)"
      }} />
    </div>
  );
}`;

const Component = () => {
  const code = "console.log('Hello, World!');";
  return (
    <div className="flex justify-center">
      <CodeWrapper language="tsx" code={code} showLineNumbers={true} customStyle={{
        background: "var(--background-secondary)"
      }} />
    </div>
  );
};

export const CodeWrapperDemo = {
  code,
  component: <Component />,
};
