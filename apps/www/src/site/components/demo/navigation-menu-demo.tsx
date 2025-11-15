import { NavigationMenu } from "@ui/components/navigation-menu";
import { navigationMenuTriggerStyle } from "@ui/components/navigation-menu";
import Link from "next/link";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

const components = [
  {
    title: "Accordion",
    href: "/docs/components/accordion",
    description:
      "Display collapsible content panels for presenting information in a limited amount of space.",
  },
  {
    title: "Alert",
    href: "/docs/components/alert",
    description: "Display important messages to attract user attention.",
  },
  {
    title: "Avatar",
    href: "/docs/components/avatar",
    description: "Display user profile pictures with fallback options.",
  },
  {
    title: "Badge",
    href: "/docs/components/badge",
    description: "Show small count or status information.",
  },
];

const code = `import { NavigationMenu } from "@ui/components/navigation-menu";

const components = [
  {
    title: "Accordion",
    href: "/docs/components/accordion",
    description:
      "Display collapsible content panels for presenting information in a limited amount of space.",
  },
  {
    title: "Alert",
    href: "/docs/components/alert",
    description: "Display important messages to attract user attention.",
  },
  {
    title: "Avatar",
    href: "/docs/components/avatar",
    description: "Display user profile pictures with fallback options.",
  },
  {
    title: "Badge",
    href: "/docs/components/badge",
    description: "Show small count or status information.",
  },
];

export default function Example() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger variant="primary">Home</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenu.Link asChild>
                  <a
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">shadcn/ui</div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Beautifully designed components built with Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenu.Link>
              </li>
              <NavigationMenu.ListItem href="/docs" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </NavigationMenu.ListItem>
              <NavigationMenu.ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </NavigationMenu.ListItem>
              <NavigationMenu.ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </NavigationMenu.ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <NavigationMenu.ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </NavigationMenu.ListItem>
              ))}
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild className={navigationMenuTriggerStyle()}>
            <Link href="/docs">Docs</Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>List</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenu.Link asChild>
                  <Link href="#">
                    <div className="font-medium">Components</div>
                    <div className="text-muted-foreground">Browse all components in the library.</div>
                  </Link>
                </NavigationMenu.Link>
                <NavigationMenu.Link asChild>
                  <Link href="#">
                    <div className="font-medium">Documentation</div>
                    <div className="text-muted-foreground">Learn how to use the library.</div>
                  </Link>
                </NavigationMenu.Link>
                <NavigationMenu.Link asChild>
                  <Link href="#">
                    <div className="font-medium">Blog</div>
                    <div className="text-muted-foreground">Read our latest blog posts.</div>
                  </Link>
                </NavigationMenu.Link>
              </li>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Simple</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenu.Link asChild>
                  <Link href="#">Components</Link>
                </NavigationMenu.Link>
                <NavigationMenu.Link asChild>
                  <Link href="#">Documentation</Link>
                </NavigationMenu.Link>
                <NavigationMenu.Link asChild>
                  <Link href="#">Blocks</Link>
                </NavigationMenu.Link>
              </li>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>With Icon</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenu.Link asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <CircleHelpIcon />
                    Backlog
                  </Link>
                </NavigationMenu.Link>
                <NavigationMenu.Link asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <CircleIcon />
                    To Do
                  </Link>
                </NavigationMenu.Link>
                <NavigationMenu.Link asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <CircleCheckIcon />
                    Done
                  </Link>
                </NavigationMenu.Link>
              </li>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  );
}
`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
      <NavigationMenu viewport={false}>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger variant="primary">
              Home
            </NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenu.Link asChild>
                    <a
                      className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mt-4 mb-2 text-lg font-medium">
                        rlz/ui
                      </div>
                      <p className="text-muted-foreground text-sm leading-tight">
                        Beautifully designed components built with Tailwind CSS.
                      </p>
                    </a>
                  </NavigationMenu.Link>
                </li>
                <NavigationMenu.ListItem href="/docs" title="Introduction">
                  Re-usable components built using Radix UI and Tailwind CSS.
                </NavigationMenu.ListItem>
                <NavigationMenu.ListItem
                  href="/docs/installation"
                  title="Installation"
                >
                  How to install dependencies and structure your app.
                </NavigationMenu.ListItem>
                <NavigationMenu.ListItem
                  href="/docs/primitives/typography"
                  title="Typography"
                >
                  Styles for headings, paragraphs, lists...etc
                </NavigationMenu.ListItem>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {components.map((component) => (
                  <NavigationMenu.ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </NavigationMenu.ListItem>
                ))}
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/docs">Docs</Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>List</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <ul className="grid w-[300px] gap-4">
                <li>
                  <NavigationMenu.Link asChild>
                    <Link href="#">
                      <div className="font-medium">Components</div>
                      <div className="text-muted-foreground">
                        Browse all components in the library.
                      </div>
                    </Link>
                  </NavigationMenu.Link>
                  <NavigationMenu.Link asChild>
                    <Link href="#">
                      <div className="font-medium">Documentation</div>
                      <div className="text-muted-foreground">
                        Learn how to use the library.
                      </div>
                    </Link>
                  </NavigationMenu.Link>
                  <NavigationMenu.Link asChild>
                    <Link href="#">
                      <div className="font-medium">Blog</div>
                      <div className="text-muted-foreground">
                        Read our latest blog posts.
                      </div>
                    </Link>
                  </NavigationMenu.Link>
                </li>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Simple</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <ul className="grid w-[200px] gap-4">
                <li>
                  <NavigationMenu.Link asChild>
                    <Link href="#">Components</Link>
                  </NavigationMenu.Link>
                  <NavigationMenu.Link asChild>
                    <Link href="#">Documentation</Link>
                  </NavigationMenu.Link>
                  <NavigationMenu.Link asChild>
                    <Link href="#">Blocks</Link>
                  </NavigationMenu.Link>
                </li>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>With Icon</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <ul className="grid w-[200px] gap-4">
                <li>
                  <NavigationMenu.Link asChild>
                    <Link href="#" className="flex-row items-center gap-2">
                      <CircleHelpIcon />
                      Backlog
                    </Link>
                  </NavigationMenu.Link>
                  <NavigationMenu.Link asChild>
                    <Link href="#" className="flex-row items-center gap-2">
                      <CircleIcon />
                      To Do
                    </Link>
                  </NavigationMenu.Link>
                  <NavigationMenu.Link asChild>
                    <Link href="#" className="flex-row items-center gap-2">
                      <CircleCheckIcon />
                      Done
                    </Link>
                  </NavigationMenu.Link>
                </li>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  );
};

export const NavigationMenuDemo = {
  code,
  component: <Component />,
};
