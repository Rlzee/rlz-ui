import { Button } from "@rlz/ui/components/ui/button";
import V0 from "./icons/v0";

export function OpenInV0Button({
  size = "md",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      size={size}
      className="gap-1"
      render={<a href="" target="_blank" className="cursor-default" />}
      {...props}
    >
      Open in <V0 className="size-5" />
    </Button>
  );
}
