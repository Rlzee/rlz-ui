import { Tabs } from "@rlz/ui/components/ui/tabs";

export default function Example() {
  return (
    <Tabs
      defaultValue="profile"
      orientation="vertical"
      className="w-full max-w-md flex-row! gap-4"
    >
      <Tabs.List className="shrink-0 flex-col! self-start">
        <Tabs.Tab value="profile" className="justify-start">
          Profile
        </Tabs.Tab>
        <Tabs.Tab value="billing" className="justify-start">
          Billing
        </Tabs.Tab>
        <Tabs.Tab value="team" className="justify-start">
          Team
        </Tabs.Tab>
        <Tabs.Indicator className="top-(--active-tab-top)! h-(--active-tab-height)! translate-x-0! translate-y-0!" />
      </Tabs.List>
      <Tabs.Panel value="profile" className="min-w-0 rounded-lg border p-4">
        <h3 className="text-sm font-medium">Your profile</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize your display name, avatar, and public bio.
        </p>
      </Tabs.Panel>
      <Tabs.Panel value="billing" className="min-w-0 rounded-lg border p-4">
        <h3 className="text-sm font-medium">Billing</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription, payment method, and invoices.
        </p>
      </Tabs.Panel>
      <Tabs.Panel value="team" className="min-w-0 rounded-lg border p-4">
        <h3 className="text-sm font-medium">Team members</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Invite collaborators and manage their permissions.
        </p>
      </Tabs.Panel>
    </Tabs>
  );
}
