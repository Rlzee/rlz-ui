import { GeneratingText } from "@ui/components/texts/generating-text";

const code = `import { GeneratingText } from "@ui/components/texts/generating-text";

export default function Example() {
  return (
    <GeneratingText
      words="This is a generating text effect example with Framer Motion"
      className="text-3xl font-bold"
      duration={0.5}
    />
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
      <GeneratingText
        words="This is a generating text effect example with Framer Motion"
        className="text-3xl font-bold"
        duration={0.5}
      />
    </div>
  );
};

export const GeneratingTextDemo = {
  code,
  component: <Component />,
};
