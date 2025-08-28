import { Avatar } from "@ui/components/avatar";

const code = `import { Avatar } from "@ui/components/avatar";

export default function Example() {
  return (
    <div className="flex items-center gap-4 justify-center">
      {/* Avatar with image */}
      <Avatar
        src="/c.gif"
        alt="Avatar"
        fallback="CN"
        size="lg"
      />

      {/* Avatar with fallback text */}
      <Avatar
        fallback="JD"
        size="md"
      />

      {/* Small avatar */}
      <Avatar
        src="/c.gif"
        alt="Avatar"
        fallback="V"
        size="sm"
      />
    </div>
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center gap-4 justify-center">
      {/* Avatar with image */}
      <Avatar
        src="/c.gif"
        alt="Avatar"
        fallback="CN"
        size="lg"
      />

      {/* Avatar with fallback text */}
      <Avatar
        fallback="JD"
        size="md"
      />

      {/* Small avatar */}
      <Avatar
        src="/c.gif"
        alt="Avatar"
        fallback="V"
        size="sm"
      />
    </div>
  );
};

export const AvatarDemo = {
  code,
  component: <Component />,
};
