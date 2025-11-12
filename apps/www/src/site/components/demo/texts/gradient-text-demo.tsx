import { GradientText } from "@/src/ui/components/texts/gradient-text";

const code = `import { GradientText } from "@ui/components/texts/gradient-text";

export default function Example() {
  return (
    <GradientText
      className="text-4xl font-bold"
      colors={["#ff7a18", "#af002d", "#319197"]}
    >
      Gradient Text
    </GradientText>
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
      <GradientText
        className="text-4xl font-bold"
        colors={["#ff7a18", "#af002d", "#319197"]}
      >
        Gradient Text
      </GradientText>
    </div>
  );
};

export const GradientTextDemo = {
  code,
  component: <Component />,
};
