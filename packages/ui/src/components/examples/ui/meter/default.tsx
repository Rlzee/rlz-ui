import { Meter } from "@rlz/ui/components/ui/meter";

export default function Example() {
  return (
    <div className="max-w-xs w-full">
      <Meter label="Storage usage" value={72} min={0} max={100} />
    </div>
  );
}
