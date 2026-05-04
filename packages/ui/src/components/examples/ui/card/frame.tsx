import { CardFrame, Card } from "@rlz/ui/components/ui/card";
import { Button } from "@rlz/ui/components/ui/button";

export default function Example() {
  return (
    <CardFrame className="w-full max-w-sm" variant="secondary">
      <CardFrame.Header>
        <Card.Title>Payment method</Card.Title>
        <Card.Description>Update your billing details.</Card.Description>
      </CardFrame.Header>
      <Card>
        <Card.Header>
          <Card.Title>Visa ending in 4242</Card.Title>
          <Card.Description>Expires 08 / 2026</Card.Description>
        </Card.Header>
        <Card.Body>
          <p className="text-sm text-muted-foreground">
            This card is used for all future invoices.
          </p>
        </Card.Body>
      </Card>
      <CardFrame.Footer className="justify-end gap-2 py-4">
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </CardFrame.Footer>
    </CardFrame>
  );
}
