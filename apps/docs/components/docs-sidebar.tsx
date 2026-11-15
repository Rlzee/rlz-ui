
"use client";

import { useRouter, usePathname } from "next/navigation";
import { PAGES_NEW } from "@/lib/docs";
import type { source } from "@/lib/source";

import { Sidebar } from "@rlz/ui/components/ui/sidebar";
import { Badge } from "@rlz/ui/components/ui/badge";
import { ComponentProps } from "react";

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
            <Sidebar.GroupLabel>
              {item.name}
            </Sidebar.GroupLabel>

            {item.type === "folder" && (
              <Sidebar.List>
                {item.children.map((page) => {
                  if (page.type !== "page") return null;

                  const isActive =
                    page.url === "/docs"
                      ? pathname === page.url
                      : pathname === page.url ||
                        pathname.startsWith(page.url + "/");

                  return (
                    <Sidebar.ButtonField key={page.url}>
                      <Sidebar.Button
                        size="sm"
                        className="cursor-pointer"
                        isActive={isActive}
                        onClick={() => router.push(page.url)}
                      >
                        {page.name}
                      </Sidebar.Button>

                      {PAGES_NEW.includes(page.url) && (
                        <Badge variant="success">
                          New
                        </Badge>
                      )}
                    </Sidebar.ButtonField>
                  );
                })}
              </Sidebar.List>
            )}
          </Sidebar.Group>
        ))}
      </Sidebar.Body>
    </Sidebar>
  );
}
