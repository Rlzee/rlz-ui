"use client";

import { Sidebar } from "@rlz/ui/components/ui/sidebar";
import { Badge } from "@rlz/ui/components/ui/badge";
import { Separator } from "@rlz/ui/components/ui/separator";
import { Input } from "@rlz/ui/components/ui/input";
import {
  Bell,
  CreditCard,
  FolderOpen,
  Home,
  Settings,
  Shield,
  User,
} from "lucide-react";

const PRIMARY = [
  { label: "Home", href: "#home", icon: Home },
  { label: "Projects", href: "#projects", icon: FolderOpen, badge: "new" },
  { label: "Notifications", href: "#notifications", icon: Bell },
];

const TEAM = ["Amélie", "Nils", "Yuki"];

export default function Examples() {
  return (
    <Sidebar.Provider
      defaultOpen
      className="relative h-72 min-h-0 w-full max-w-md overflow-hidden rounded-lg border"
    >
      <Sidebar collapsible="icon" className="absolute inset-y-0 h-full">
        <Sidebar.Header>
          <Input placeholder="Find" />
        </Sidebar.Header>

        <Sidebar.Nav>
          <Sidebar.NavPage>
            <Sidebar.Body className="mb-2">
              <Sidebar.Group>
                <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
                <Sidebar.List>
                  {PRIMARY.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Sidebar.ButtonField key={item.label}>
                        <Sidebar.Button
                          isActive={index === 0}
                          tooltip={item.label}
                        >
                          <Icon />
                          {item.label}
                        </Sidebar.Button>
                        {item.badge && (
                          <Badge variant="success">{item.badge}</Badge>
                        )}
                      </Sidebar.ButtonField>
                    );
                  })}
                </Sidebar.List>
              </Sidebar.Group>

              <Separator />

              <Sidebar.Group>
                <Sidebar.GroupLabel>Account</Sidebar.GroupLabel>
                <Sidebar.List>
                  <Sidebar.Sub>
                    <Sidebar.SubTrigger tooltip="Team">
                      <User />
                      Team
                    </Sidebar.SubTrigger>
                    <Sidebar.SubList>
                      {TEAM.map((item) => (
                        <Sidebar.SubButton key={item} tooltip={item}>
                          {item}
                        </Sidebar.SubButton>
                      ))}
                    </Sidebar.SubList>
                  </Sidebar.Sub>

                  <Sidebar.NavTrigger to="settings" tooltip="Settings">
                    <Settings />
                    Settings
                  </Sidebar.NavTrigger>
                </Sidebar.List>
              </Sidebar.Group>
            </Sidebar.Body>
          </Sidebar.NavPage>

          <Sidebar.NavPage name="settings">
            <Sidebar.Body>
              <Sidebar.List>
                <Sidebar.NavBack>Settings</Sidebar.NavBack>
                <Sidebar.Button isActive tooltip="Profile">
                  <User />
                  Profile
                </Sidebar.Button>
                <Sidebar.Button tooltip="Security">
                  <Shield />
                  Security
                </Sidebar.Button>
                <Sidebar.NavTrigger to="billing" tooltip="Billing">
                  <CreditCard />
                  Billing
                </Sidebar.NavTrigger>
              </Sidebar.List>
            </Sidebar.Body>
          </Sidebar.NavPage>

          <Sidebar.NavPage name="billing">
            <Sidebar.Body>
              <Sidebar.List>
                <Sidebar.NavBack>Billing</Sidebar.NavBack>
                <Sidebar.SubButton>Invoices</Sidebar.SubButton>
                <Sidebar.Button>Plans</Sidebar.Button>
              </Sidebar.List>
            </Sidebar.Body>
          </Sidebar.NavPage>
        </Sidebar.Nav>
      </Sidebar>

      <Sidebar.Inset className="gap-3 p-4">
        <div className="flex items-center gap-2">
          <Sidebar.Trigger />
          <span className="text-sm font-medium">Dashboard</span>
        </div>
        <p className="text-sm text-muted-foreground">
          The rail and the <code className="font-mono">⌘B</code> shortcut both
          collapse the sidebar down to its icons.
        </p>
      </Sidebar.Inset>
    </Sidebar.Provider>
  );
}
