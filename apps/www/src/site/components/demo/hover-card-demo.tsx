import { HoverCard } from "@ui/components/hover-card";

const code = `import { HoverCard } from "@ui/components/hover-card";

export default function Example() {
  return (
    <HoverCard>
      <HoverCard.Trigger>
        <span className="cursor-pointer hover:underline">Hover me</span>
      </HoverCard.Trigger>
      <HoverCard.Content className="w-64">
        <div className="text-sm">
          This is some hover card content. It appears when the user hovers over
          the trigger.
        </div>
      </HoverCard.Content>
    </HoverCard>
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
      <HoverCard>
        <HoverCard.Trigger>
          <span className="cursor-pointer hover:underline">Hover me</span>
        </HoverCard.Trigger>
        <HoverCard.Content className="w-64">
          <div className="text-sm">
            This is some hover card content. It appears when the user hovers
            over the trigger.
          </div>
        </HoverCard.Content>
      </HoverCard>
    </div>
  );
};

export const HoverCardDemo = {
  code,
  component: <Component />,
};
