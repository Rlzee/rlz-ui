import { Button } from "@rlz/ui/components/ui/button";
import { Loader2 } from "lucide-react";

function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof Loader2>) {
  return (
    <Loader2
      aria-label="Loading"
      className="animate-spin"
      role="status"
      {...props}
    />
  );
}

export default function Example() {
  return (
    <Button disabled>
      <Spinner />
      Loading
    </Button>
  );
}
