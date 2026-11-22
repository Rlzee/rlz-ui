import { Tabs } from "@rlz/ui/components/ui/tabs";

export default function Example() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-sm">
      <Tabs.List>
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Tab value="security">Security</Tabs.Tab>
        <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="account" className="rounded-lg border p-4">
        <h3 className="text-sm font-medium">Account</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, email address, and personal information.
        </p>
      </Tabs.Panel>
      <Tabs.Panel value="security" className="rounded-lg border p-4">
        <h3 className="text-sm font-medium">Security</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your password and enable two-factor authentication.
        </p>
      </Tabs.Panel>
      <Tabs.Panel value="notifications" className="rounded-lg border p-4">
        <h3 className="text-sm font-medium">Notifications</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose which updates you receive and how we notify you.
        </p>
      </Tabs.Panel>
    </Tabs>
  );
}
