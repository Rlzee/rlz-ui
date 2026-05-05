import { Checkbox } from "@rlz/ui/components/ui/checkbox";
import { Label } from "@rlz/ui/components/ui/label";

export default function Particle() {
  return (
    <Label className="flex items-start gap-2 rounded-lg border p-3 bg-card hover:bg-accent has-data-checked:border-primary/48 has-data-checked:bg-accent">
      <Checkbox defaultChecked />
      <div className="flex flex-col gap-1">
        <p>Enable notifications</p>
        <p className="text-muted-foreground text-xs">
          You can enable or disable notifications at any time.
        </p>
      </div>
    </Label>
  );
}
