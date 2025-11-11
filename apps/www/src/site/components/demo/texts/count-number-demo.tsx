import { CountNumber } from "@ui/components/texts/count-number";

const code = `import { CountNumber } from "@ui/components/texts/count-number";

export default function Example() {
  return (
    <CountNumber
      to={100}
      duration={2}
      className="text-3xl font-bold text-foreground"
    />
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center h-48 rounded-md p-4">
      <CountNumber
        to={100}
        duration={2}
        className="text-3xl font-bold text-foreground"
      />
    </div>
  );
};

export const CountNumberDemo = {
  code,
  component: <Component />,
};
