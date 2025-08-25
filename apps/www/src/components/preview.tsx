import { ComponentPreview } from "./component-preview";

interface PreviewProps {
  code: string;
  children: React.ReactNode;
}

export const Preview = ({ code, children }: PreviewProps) => {
  return (
    <ComponentPreview code={code}>
      {children}
    </ComponentPreview>
  );
};
