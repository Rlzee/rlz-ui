import { ScrollHighlight } from "@ui/components/texts/highlight-text";

const code = `import { HighlightText, ScrollHighlight, ControlledHighlight } from "@ui/components/texts/highlight-text";

export default function Example() {
  return (
    <ScrollHighlight color="#af002d">This text highlights on scroll</ScrollHighlight>
  );
}`;

const Component = () => {
  return (
    <div className="text-center">
      <ScrollHighlight color="#af002d">This text highlights on scroll</ScrollHighlight>
    </div>
  );
};

export const HighlightTextDemo = {
  code,
  component: <Component />,
};
