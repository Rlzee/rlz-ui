import { Slider } from '@ui/components/slider';

const code = `import { Slider } from "@ui/components/slider";

export function Example() {
    return <Slider defaultValue={[33]} max={100} step={1} />;
}`;

const Component = () => {
  return (
    <div className="max-w-[400px] mx-auto">
        <Slider defaultValue={[33]} max={100} step={1} />
    </div>
  );
};

export const SliderDemo = {
  code,
  component: <Component />,
};
