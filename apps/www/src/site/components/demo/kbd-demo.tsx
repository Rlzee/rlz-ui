import { Kbd } from "@ui/components/kbd";

const code = `import { Kbd } from "@ui/components/kbd";

export default function Example() {
  return (
    <Kbd shortcutKey="⌘K" />
  );
};`;

const Component = () => {
  return (
    <div className="mx-auto max-w-[40px]">
      <Kbd shortcutKey="⌘K" />
    </div>
  );
};

export const KbdDemo = {
  code,
  component: <Component />,
};
