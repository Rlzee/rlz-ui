import { Tooltip } from "@rlz/ui/components/ui/tooltip";
import { Button } from "@rlz/ui/components/ui/button";

export default function Example() {
  return (
    <Tooltip
      triggerRender={<Button variant="outline">Hover Me</Button>}
      popupContent="Hello !"
      popupProps={{
        variant: "outline",
      }}
    />
  );
}
