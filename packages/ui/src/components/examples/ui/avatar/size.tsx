"use client";

import { Avatar } from "@rlz/ui/components/ui/avatar";

export default function Example() {
  return (
    <div className="flex items-center justify-center gap-3">
      <Avatar src="/c.gif" alt="User Avatar" fallback="CP" size="xl" />
      <Avatar src="/c.gif" alt="User Avatar" fallback="CP" size="lg" />
      <Avatar src="/c.gif" alt="User Avatar" fallback="CP" size="md" />
      <Avatar src="/c.gif" alt="User Avatar" fallback="CP" size="sm" />
    </div>
  );
}
