import { Meter } from "@rlz/ui/components/ui/meter";

export default function Example() {
  return (
    <div className="max-w-xs w-full">
      <Meter value={72} min={0} max={100}>
        <div className="flex items-center justify-between mb-1.5">
          <Meter.Label>Storage usage</Meter.Label>
          <Meter.Value />
        </div>
      </Meter>
    </div>
  );
}
