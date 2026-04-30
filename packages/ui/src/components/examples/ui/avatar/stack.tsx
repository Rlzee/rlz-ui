import { Avatar } from "@rlz/ui/components/ui/avatar";

export default function Example() {
  return (
    <Avatar.Stack space="lg">
      <Avatar
        src="https://randomuser.me/api/portraits/men/32.jpg"
        fallback="A"
        size="lg"
      />
      <Avatar
        src="https://randomuser.me/api/portraits/women/44.jpg"
        fallback="B"
        size="lg"
      />
      <Avatar
        src="https://randomuser.me/api/portraits/men/12.jpg"
        fallback="C"
        size="lg"
      />
      <Avatar
        src="https://randomuser.me/api/portraits/women/68.jpg"
        fallback="D"
        size="lg"
      />
      <Avatar
        src="https://randomuser.me/api/portraits/men/75.jpg"
        fallback="E"
        size="lg"
      />
    </Avatar.Stack>
  );
}
