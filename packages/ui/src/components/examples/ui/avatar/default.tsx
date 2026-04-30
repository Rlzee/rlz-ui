import { Avatar } from "@rlz/ui/components/ui/avatar";

export default function Example() {
  return (
    <Avatar
      src="https://randomuser.me/api/portraits/men/1.jpg"
      alt="User Avatar"
      fallback="CP"
      size="lg"
    />
  );
}
