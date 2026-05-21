import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Textarea } from "@rlz/ui/components/ui/textarea";
import { Button } from "@rlz/ui/components/ui/button";

export default function Example() {
  return (
    <InputGroup className="max-w-xs has-data-[align=inline-start]:[&_input]:ps-0">
      <Textarea unstyled placeholder="Write a comment..." />
      <InputGroup.Addon align="block-end">
        <InputGroup.Text>0/280</InputGroup.Text>
        <Button size="sm" className="ml-auto">
          Post
        </Button>
      </InputGroup.Addon>
    </InputGroup>
  );
}
