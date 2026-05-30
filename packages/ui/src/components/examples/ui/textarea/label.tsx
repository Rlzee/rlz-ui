import { Textarea } from "@rlz/ui/components/ui/textarea";
import { Label } from "@rlz/ui/components/ui/label";

export default function Example() {
  return (
    <div className="flex flex-col items-start gap-1.5 w-full max-w-xs">
      <Label htmlFor="message">Message</Label>
      <Textarea placeholder="Type your message here" />
    </div>
  );
}
