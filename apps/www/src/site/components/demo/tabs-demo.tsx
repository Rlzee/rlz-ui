import { Tabs } from "@ui/components/tabs";

const code = `import { Tabs } from "@ui/components/tabs";

export default function Example() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">
        Make changes to your account here.
      </Tabs.Content>
      <Tabs.Content value="password">Change your password here.</Tabs.Content>
    </Tabs>
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
      <Tabs defaultValue="account" className="w-[400px]">
        <Tabs.List>
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="password">Password</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="account">
          Make changes to your account here.
        </Tabs.Content>
        <Tabs.Content value="password">Change your password here.</Tabs.Content>
      </Tabs>
    </div>
  );
};

export const TabsDemo = {
  code,
  component: <Component />,
};
