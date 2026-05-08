import { Kbd } from "@rlz/ui/components/ui/kbd";

export default function Example() {
  return (
    <Kbd.Group className="gap-2">
      <Kbd>Ctrl</Kbd>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
      <Kbd>Delete</Kbd>
    </Kbd.Group>
  );
}
