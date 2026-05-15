import { Drawer } from "@rlz/ui/components/ui/drawer";
import { Button } from "@rlz/ui/components/ui/button";
import { Field } from "@rlz/ui/components/ui/field";
import { Input } from "@rlz/ui/components/ui/input";
import { Dialog } from "@rlz/ui/components/ui/dialog";

export default function Example() {
  return (
    <Drawer layout="inset">
      <Drawer.Trigger render={<Button variant="outline" />}>
        Open parent drawer inset
      </Drawer.Trigger>
      <Drawer.Popup showCloseButton={false}>
        <Drawer.Header>
          <Drawer.Title>Manage team member</Drawer.Title>
          <Drawer.Description>
            View and manage a user in your team.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <div className="grid gap-1">
            <p className="text-muted-foreground text-sm">Name</p>
            <p className="font-medium text-sm">Bora Baloglu</p>
          </div>
          <div className="grid gap-1">
            <p className="text-muted-foreground text-sm">Email</p>
            <p className="font-medium text-sm">bora@example.com</p>
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer variant="bare-top" layout="inset">
            <Drawer.Trigger render={<Button variant="outline" />}>
              Edit details
            </Drawer.Trigger>
            <Drawer.Popup showCloseButton={false}>
              <Drawer.Header>
                <Drawer.Title>Edit details</Drawer.Title>
                <Drawer.Description>
                  Make changes to the member&apos;s information.
                </Drawer.Description>
              </Drawer.Header>
              <Drawer.Body>
                <Field>
                  <Field.Label>Name</Field.Label>
                  <Input defaultValue="Bora Baloglu" type="text" />
                </Field>
                <Field>
                  <Field.Label>Email</Field.Label>
                  <Input defaultValue="bora@example.com" type="text" />
                </Field>
              </Drawer.Body>
              <Drawer.Footer>
                <Dialog.Close render={<Button variant="ghost" />}>
                  Cancel
                </Dialog.Close>
                <Button type="submit">Save changes</Button>
              </Drawer.Footer>
            </Drawer.Popup>
          </Drawer>
        </Drawer.Footer>
      </Drawer.Popup>
    </Drawer>
  );
}
