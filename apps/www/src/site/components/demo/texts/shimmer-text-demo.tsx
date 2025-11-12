import { TextShimmer } from "@ui/components/texts/shimmer-text";

const code = `import { TextShimmer } from "@ui/components/texts/shimmer-text";

export default function Example() {
  return <TextShimmer className="text-xl">Generating code...</TextShimmer>;
}`;

const Component = () => {
  return (
    <div className="text-center">
      <TextShimmer className="text-xl">Generating code...</TextShimmer>
    </div>
  );
};

export const ShimmerTextDemo = {
  code,
  component: <Component />,
};
