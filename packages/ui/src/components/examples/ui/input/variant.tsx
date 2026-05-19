import { Input } from "@rlz/ui/components/ui/input";

export default function Example() {
  return (
    <div className="flex gap-3">
      <Input
        className="w-64"
        aria-label="Enter text"
        placeholder="Enter text"
        type="text"
      />
      <Input
        variant="secondary"
        className="w-64"
        aria-label="Enter text"
        placeholder="Enter text"
        type="text"
      />
    </div>
  );
}
