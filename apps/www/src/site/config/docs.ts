import { type MainNavItem, type SidebarNavItem } from "@site/types/nav";

export interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem;
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Docs",
      href: "/docs",
    },
  ],
  sidebarNav: {
    itemsLeft: {
      GettingStarted: [
        { title: "Installation", href: "/docs" },
      ],
      // Background: [{ title: "Grid", href: "" }],
      Components: [
        { title: "Accordion", href: "/docs/components/accordion" },
        { title: "Avatar", href: "/docs/components/avatar" },
        { title: "Badge", href: "/docs/components/badge" },
        { title: "Breadcrumb", href: "/docs/components/breadcrumb" },
        { title: "Button Group", href: "/docs/components/button-group" },
        { title: "Button", href: "/docs/components/button" },
        { title: "Checkbox", href: "/docs/components/checkbox" },
        { title: "Divider", href: "/docs/components/divider" },
        { title: "Input Addon", href: "/docs/components/input-addon" },
        { title: "Input", href: "/docs/components/input" },
        { title: "Kbd", href: "/docs/components/kbd" },
        { title: "Label", href: "/docs/components/label" },
        { title: "Separator Border", href: "/docs/components/separator-border" },
        { title: "Separator", href: "/docs/components/separator" },
        { title: "Switch", href: "/docs/components/switch" },
        { title: "Textarea", href: "/docs/components/textarea" },
      ],
      // Text: [
      //   { title: "Gradient Text", href: "/docs/components/gradient-text" },
      // ],
    },
    itemsRight: {
      OneThisPage: [
        { title: "Preview", href: "" },
        { title: "Installation", href: "" },
        { title: "Usage", href: "" },
        { title: "Props", href: "" },
      ],
    },
  },
};
