import { Badge } from "@ui/components/badge";

const code = `import { Badge } from "@ui/components/badge";

export default function Example() {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="primary">Primary Badge</Badge>
      <Badge variant="outline">Outline Badge</Badge>
      <Badge variant="background">Secondary Badge</Badge>
    </div>
  );
};`;

const Components = () => {
  return (
    <div className="flex items-center justify-center gap-2 mx-auto max-w-[600px]">
      <Badge variant="primary">Primary Badge</Badge>
      <Badge variant="outline">Outline Badge</Badge>
      <Badge variant="background">Secondary Badge</Badge>
    </div>
  );
};

export const BadgeDemo = {
  code,
  component: <Components />,
};
