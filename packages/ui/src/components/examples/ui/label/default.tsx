import { Label } from "@rlz/ui/components/ui/label";
import { Input } from "@rlz/ui/components/ui/input";

export default function Example() {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input aria-label="Email" placeholder="rlz@example.com" type="email" />
    </div>
  );
}
