import { Button } from "@ui/components/button";

const code = `<div className="flex flex-col gap-2">
  <Button variant="primary">Primary Button</Button>
  <Button variant="secondary">Secondary Button</Button>
  <Button variant="outline">Outline Button</Button>
  <Button variant="ghost">Ghost Button</Button>
  <Button variant="link">Link Button</Button>
  <Button variant="destructive">Destructive Button</Button>
</div>
`;

const Component = () => {
  return (
    <div className="flex flex-col gap-3 max-w-[200px] mx-auto">
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="ghost">Ghost Button</Button>
      <Button variant="link">Link Button</Button>
      <Button variant="destructive">Destructive Button</Button>
    </div>
  );
};

export const ButtonDemo = {
  code,
  component: <Component />,
};
