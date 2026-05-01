import { Badge } from "@rlz/ui/components/ui/badge";

export default function Example() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Badge>Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
      <div className="flex gap-2">
        <Badge variant="info">Info</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
      </div>
    </div>
  );
}
