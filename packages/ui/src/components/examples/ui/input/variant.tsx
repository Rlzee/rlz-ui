import { Input } from "@rlz/ui/components/ui/input";

export default function Example() {
  return (
    <div className="grid gap-4">
      <Input
        className="w-64"
        aria-label="Default"
        placeholder="Default"
        type="text"
      />
      <Input
        variant="secondary"
        className="w-64"
        aria-label="Secondary"
        placeholder="Secondary"
        type="text"
      />
    </div>
  );
}
