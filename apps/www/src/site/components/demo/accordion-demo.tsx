import { Accordion } from "@ui/components/accordion";

const code = `import { Accordion } from "@ui/components/accordion";

export default function Example() {
  return (
    <Accordion type="single" collapsible>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>
            Item 1
            <Accordion.Icon />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Content for item 1.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>
            Item 2
            <Accordion.Icon />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Content for item 2.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}`;

const Component = () => {
  return (
    <Accordion type="single" collapsible className="max-w-[600px] mx-auto">
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>
            Item 1
            <Accordion.Icon />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Content for item 1.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>
            Item 2
            <Accordion.Icon />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Content for item 2.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};

export const AccordionDemo = {
  code,
  component: <Component />,
};
