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
        { title: "Importing", href: "/docs/importing" },
      ],
      // Background: [{ title: "Grid", href: "" }],
      Texts: [
        { title: "Blur", href: "/docs/components/blur-text" },
        { title: "Count Number", href: "/docs/components/count-number" },
        { title: "Decrypted", href: "/docs/components/decrypted-text" },
        { title: "Generating", href: "/docs/components/generating-text" },
        { title: "Gradient", href: "/docs/components/gradient-text" },
        { title: "Highlight", href: "/docs/components/highlight-text" },
        { title: "Rotating", href: "/docs/components/rotating-text" },
        { title: "Shimmer", href: "/docs/components/shimmer-text" },
      ],
      Components: [
        { title: "Accordion", href: "/docs/components/accordion" },
        { title: "Alert Dialog", href: "/docs/components/alert-dialog" },
        { title: "Alert", href: "/docs/components/alert" },
        { title: "Avatar", href: "/docs/components/avatar" },
        { title: "Badge", href: "/docs/components/badge" },
        { title: "Breadcrumb", href: "/docs/components/breadcrumb" },
        { title: "Button Group", href: "/docs/components/button-group" },
        { title: "Button", href: "/docs/components/button" },
        { title: "Calendar", href: "/docs/components/calendar" },
        { title: "Card", href: "/docs/components/card" },
        { title: "Carousel", href: "/docs/components/carousel" },
        { title: "Checkbox", href: "/docs/components/checkbox" },
        { title: "Clipboard", href: "/docs/components/clipboard" },
        { title: "Code Wrapper", href: "/docs/components/code-wrapper" },
        { title: "Collapsible", href: "/docs/components/collapsible" },
        { title: "Color Picker", href: "/docs/components/color-picker" },
        { title: "Combobox", href: "/docs/components/combobox" },
        { title: "Command", href: "/docs/components/command" },
        { title: "Context Menu", href: "/docs/components/context-menu" },
        { title: "Dialog", href: "/docs/components/dialog" },
        { title: "Divider", href: "/docs/components/divider" },
        { title: "Drawer", href: "/docs/components/drawer" },
        { title: "Dropdown Menu", href: "/docs/components/dropdown-menu" },
        { title: "Emoji Picker", href: "/docs/components/emoji-picker" },
        { title: "Empty", href: "/docs/components/empty" },
        { title: "Hover Card", href: "/docs/components/hover-card" },
        { title: "Input Addon", href: "/docs/components/input-addon" },
        { title: "Input OTP", href: "/docs/components/input-otp" },
        { title: "Input", href: "/docs/components/input" },
        { title: "Kbd", href: "/docs/components/kbd" },
        { title: "Label", href: "/docs/components/label" },
        { title: "Menubar", href: "/docs/components/menubar" },
        { title: "Navigation Menu", href: "/docs/components/navigation-menu" },
        { title: "Progress", href: "/docs/components/progress" },
        { title: "Popover", href: "/docs/components/popover" },
        { title: "Radio Group", href: "/docs/components/radio-group" },
        { title: "Scroll Area", href: "/docs/components/scroll-area" },
        { title: "Select", href: "/docs/components/select" },
        { title: "Separator Border", href: "/docs/components/separator-border" },
        { title: "Separator", href: "/docs/components/separator" },
        { title: "Sheet", href: "/docs/components/sheet" },
        { title: "Slider", href: "/docs/components/slider" },
        { title: "Switch", href: "/docs/components/switch" },
        { title: "Table", href: "/docs/components/table" },
        { title: "Tabs", href: "/docs/components/tabs" },
        { title: "Textarea", href: "/docs/components/textarea" },
        { title: "Toggle Group", href: "/docs/components/toggle-group" },
        { title: "Toggle", href: "/docs/components/toggle" },
        { title: "Tooltip", href: "/docs/components/tooltip" },
      ],
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
