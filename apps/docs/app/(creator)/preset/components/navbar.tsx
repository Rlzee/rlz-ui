import { Button, type ButtonProps } from "@rlz/ui/components/ui/button";
import { RefreshCw, CloudBackup, Braces, type LucideIcon } from "lucide-react";

type NavButtonType = {
  name: string;
  icon: LucideIcon;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
};

const NavButtons: NavButtonType[] = [
  {
    name: "Reset",
    icon: RefreshCw,
  },
  {
    name: "Export",
    icon: Braces,
  },
  {
    name: "Publish",
    icon: CloudBackup,
    variant: "primary",
  },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-transparent px-4 sm:px-6">
      <div className="relative flex h-(--header-height) w-full items-center justify-between gap-2">
        <div>
          <span className="text-lg">United</span>
        </div>
        <nav className="hidden items-center gap-1.5 lg:flex">
          {NavButtons.map((b) => {
            const Icon = b.icon;

            return (
              <Button
                key={b.name}
                variant={b.variant ?? "ghost"}
                size={b.size || "sm"}
              >
                <Icon />
                {b.name}
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
