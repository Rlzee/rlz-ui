import { Separator } from "@rlz/ui/components/ui/separator";

export default function Example() {
  return (
    <div className="max-w-72 text-center">
      <div className="flex gap-3">
        <p>Vertical</p>
        <Separator orientation="vertical" />
        <p>Separator</p>
      </div>
      <Separator className="my-1.5" />
      <p>Horizontal Separator</p>
    </div>
  );
}
