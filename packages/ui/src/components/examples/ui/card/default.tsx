import { Card } from "@rlz/ui/components/ui/card";
import { Meter } from "@rlz/ui/components/ui/meter";

export default function Example() {
  return (
    <Card className="w-full max-w-xs">
      <Card.Header>
        <Card.Title>Storage usage</Card.Title>
        <Card.Description>Your current plan includes 10 GB.</Card.Description>
      </Card.Header>
      <Card.Body>
        <Meter label="Used space" value={72} min={0} max={100} />
      </Card.Body>
      <Card.Footer>
        <span className="text-xs text-muted-foreground">
          Resets on June 1st
        </span>
      </Card.Footer>
    </Card>
  );
}
