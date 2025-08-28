import { Sidebar } from "@ui/components/sidebar";
import { Collapsible } from "@ui/components/collapsible";
import { ChevronRight } from "lucide-react";
import { useHydration } from "@site/hooks/use-hydration";

const ContentSidebar = ({
  items,
  label,
}: {
  items: {
    title: string;
    url?: string;
    href?: string;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  label?: string;
}) => {
  const isHydrated = useHydration();

  return (
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu className="gap-0">
          {label && (
            <Sidebar.GroupLabel>
              {label.replace(/(?!^)([A-Z])/g, " $1")}
            </Sidebar.GroupLabel>
          )}
          {items.map((item) => {
            if (item.items && item.items.length > 0) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <Sidebar.MenuItem>
                    <Collapsible.Trigger asChild>
                      <Sidebar.MenuButton className="text-sm" size="sm">
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </Sidebar.MenuButton>
                    </Collapsible.Trigger>
                    <Collapsible.Content>
                      <Sidebar.MenuSub>
                        {item.items?.map((subItem) => (
                          <Sidebar.MenuSubItem key={subItem.title}>
                            <Sidebar.MenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </Sidebar.MenuSubButton>
                          </Sidebar.MenuSubItem>
                        ))}
                      </Sidebar.MenuSub>
                    </Collapsible.Content>
                  </Sidebar.MenuItem>
                </Collapsible>
              );
            } else {
              return (
                <Sidebar.MenuItem key={item.title}>
                  <Sidebar.MenuButton
                    className="text-sm"
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      const targetUrl = item.href || item.url;
                      if (targetUrl && isHydrated) {
                        window.location.href = targetUrl;
                      }
                    }}
                    isActive={
                      isHydrated &&
                      window.location.pathname === (item.href || item.url)
                    }
                  >
                    {item.title}
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              );
            }
          })}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  );
};

export { ContentSidebar };
