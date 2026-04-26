"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { PAGES_NEW } from "@/lib/docs";
import { source } from "@/lib/source";

import { Sidebar } from "@rlz/ui/components/ui/sidebar";
import { Badge } from "@rlz/ui/components/ui/badge";
import { ComponentProps } from "react";

// Docs Sidebar Component

type Props = ComponentProps<typeof Sidebar> & {
  tree: typeof source.pageTree;
};

export function DocsSidebar({ tree, ...props }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar
      className="group-data-[side=left]:border-r-0 sticky top-(--header-height) z-30 hidden h-[calc(100svh-var(--header-height))] bg-transparent lg:flex pt-6 lg:pt-8"
      collapsible="none"
      {...props}
    >
      <Sidebar.Body>
        {tree.children.map((item) => (
          <Sidebar.Group key={item.$id} className="px-6 pt-0">
            <Sidebar.GroupLabel>{item.name}</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              {item.type === "folder" && (
                <Sidebar.Menu>
                  {item.children.map((page) => {
                    return (
                      page.type === "page" && (
                        <Sidebar.MenuItem key={page.url}>
                          <Sidebar.MenuButton
                            size="sm"
                            variant="ghost"
                            isActive={
                              page.url === "/docs"
                                ? pathname === page.url
                                : pathname === page.url ||
                                  pathname.startsWith(page.url + "/")
                            }
                            onClick={() => router.push(page.url)}
                          >
                            {page.name}
                          </Sidebar.MenuButton>
                          {PAGES_NEW.includes(page.url) && (
                            <Sidebar.MenuBadge>
                              <Badge variant="success">New</Badge>
                            </Sidebar.MenuBadge>
                          )}
                        </Sidebar.MenuItem>
                      )
                    );
                  })}
                </Sidebar.Menu>
              )}
            </Sidebar.GroupContent>
          </Sidebar.Group>
        ))}
      </Sidebar.Body>
    </Sidebar>
  );
}
