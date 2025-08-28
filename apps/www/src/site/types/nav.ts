export type NavItem = {
  title: string;
  href: string;
};

export type SidebarData = {
  itemsLeft: {
    [key: string]: NavItem[];
  };
  itemsRight: {
    [key: string]: NavItem[];
  };
};

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends SidebarData {}
