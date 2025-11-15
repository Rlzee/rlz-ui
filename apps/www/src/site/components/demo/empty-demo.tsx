import { Empty } from "@ui/components/empty";
import { CircleX } from "lucide-react";

const code = `import { Empty } from "@ui/components/empty";

export default function Example() {
  return (
    <Empty>
      <Empty.Header>
        <Empty.Icon variant="secondary">
          <CircleX />
        </Empty.Icon>
        <Empty.Title>Demo Component</Empty.Title>
        <Empty.Description>
          This is a demo component description.
        </Empty.Description>
      </Empty.Header>
    </Empty>
  );
}`;

const Component = () => {
  return (
    <Empty>
      <Empty.Header>
        <Empty.Icon variant="secondary">
          <CircleX />
        </Empty.Icon>
        <Empty.Title>Demo Component</Empty.Title>
        <Empty.Description>
          This is a demo component description.
        </Empty.Description>
      </Empty.Header>
    </Empty>
  );
};

export const EmptyDemo = {
  code,
  component: <Component />,
};
