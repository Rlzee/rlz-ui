import { Sheet } from "@ui/components/sheet";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";

const code = `import { Sheet } from "@ui/components/sheet";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";

export default function Example() {
  return (
    <Sheet>
      <Sheet.Trigger asChild>
        <Button variant="secondary">Open</Button>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>Edit profile</Sheet.Title>
          <Sheet.Description>
            Make changes to your profile here. Click save when you&apos;re done.
          </Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Rlz UI" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@rlzui" />
          </div>
        </Sheet.Body>
        <Sheet.Footer>
          <Button type="submit">Save changes</Button>
          <Sheet.Close asChild>
            <Button variant="outline">Close</Button>
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  );
}`;

const Component = () => {
  return (
    <Sheet>
      <Sheet.Trigger asChild className="flex justify-center items-center mx-auto">
        <Button variant="secondary">Open</Button>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>Edit profile</Sheet.Title>
          <Sheet.Description>
            Make changes to your profile here. Click save when you&apos;re done.
          </Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Rlz UI" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@rlzui" />
          </div>
        </Sheet.Body>
        <Sheet.Footer>
          <Button type="submit">Save changes</Button>
          <Sheet.Close asChild>
            <Button variant="outline">Close</Button>
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  );
};

export const SheetDemo = {
  code,
  component: <Component />,
};
