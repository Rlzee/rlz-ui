import { Card } from "@ui/components/card";

const code = `import { Card } from "@ui/components/card";

export default function Example() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Card Title</Card.Title>
        <Card.Description>
          This is a description of the card.
        </Card.Description>
      </Card.Header>
      <Card.Body>
        This is the main content area of the card. You can put any content here.
      </Card.Body>
      <Card.Footer>This is the footer of the card.</Card.Footer>
    </Card>
  );
};`

const Component = () => {
  return (
    <div className="max-w-[400px] mx-auto">
      <Card>
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
          <Card.Description>
            This is a description of the card.
          </Card.Description>
        </Card.Header>
        <Card.Body>
          This is the main content area of the card. You can put any content
          here.
        </Card.Body>
        <Card.Footer>This is the footer of the card.</Card.Footer>
      </Card>
    </div>
  );
};

export const CardDemo = {
  code,
  component: <Component />,
};
