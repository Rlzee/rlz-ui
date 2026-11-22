import { Tabs } from "@rlz/ui/components/ui/tabs";

export default function Example() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-sm">
      <Tabs.List className="border-b">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
        <Tabs.Indicator variant="underline" />
      </Tabs.List>
      <Tabs.Panel value="overview" className="px-3 py-4">
        <h3 className="text-sm font-medium">Project overview</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep track of your project progress and upcoming milestones.
        </p>
      </Tabs.Panel>
      <Tabs.Panel value="activity" className="px-3 py-4">
        <h3 className="text-sm font-medium">Recent activity</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          See the latest changes and updates from your team.
        </p>
      </Tabs.Panel>
      <Tabs.Panel value="settings" className="px-3 py-4">
        <h3 className="text-sm font-medium">Project settings</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your project preferences and team access.
        </p>
      </Tabs.Panel>
    </Tabs>
  );
}
