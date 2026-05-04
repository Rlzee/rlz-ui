import { Card } from "@rlz/ui/components/ui/card";
import { Avatar } from "@rlz/ui/components/ui/avatar";
import { Button } from "@rlz/ui/components/ui/button";

export default function Example() {
  return (
    <Card className="w-full max-w-xs">
      <Card.Header>
        <Avatar
          src="https://randomuser.me/api/portraits/women/15.jpg"
          alt="Alice Martin"
          fallback="AM"
          className="mb-2"
        />
        <Card.Title>Alice Martin</Card.Title>
        <Card.Description>Product Designer</Card.Description>
      </Card.Header>
      <Card.Body>
        <p className="text-sm text-muted-foreground">
          Focused on design systems and component-driven interfaces.
        </p>
      </Card.Body>
      <Card.Footer>
        <Button variant="outline" size="sm">
          View profile
        </Button>
      </Card.Footer>
    </Card>
  );
}
