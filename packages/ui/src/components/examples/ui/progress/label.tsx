import { Progress } from "@rlz/ui/components/ui/progress";

export default function Example() {
  return (
    <div className="max-w-xs w-full">
      <Progress value={72} min={0} max={100}>
        <div className="flex items-center justify-between mb-1.5">
          <Progress.Label>Progress</Progress.Label>
          <Progress.Value />
        </div>
      </Progress>
    </div>
  );
}
