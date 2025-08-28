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
      Background: [{ title: "Grid", href: "" }],
      Components: [
        { title: "Accordion", href: "/docs/components/accordion" },
        { title: "Avatar", href: "/docs/components/avatar" },
        { title: "Badge", href: "/docs/components/badge" },
        { title: "Breadcrumb", href: "/docs/components/breadcrumb" },
        { title: "Button", href: "/docs/components/button" },
        { title: "Card", href: "/docs/components/card" },
        { title: "Collapsible", href: "/docs/components/collapsible" },
        { title: "Dialog", href: "/docs/components/dialog" },
      ],
      Text: [
        { title: "Gradient Text", href: "/docs/components/gradient-text" },
      ],
    },
    itemsRight: {
      OneThisPage: [
        { title: "Installation", href: "" },
        { title: "Props", href: "" },
      ],
    },
  },
};
