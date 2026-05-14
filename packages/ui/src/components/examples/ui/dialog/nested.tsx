import { Dialog } from "@rlz/ui/components/ui/dialog";
import { Field } from "@rlz/ui/components/ui/field";
import { Input } from "@rlz/ui/components/ui/input";
import { Button } from "@rlz/ui/components/ui/button";
import { Form } from "@rlz/ui/components/ui/form";

export default function Example() {
  return (
    <Dialog variant="bare-top">
      <Dialog.Trigger render={<Button variant="outline" />}>
        Open parent dialog
      </Dialog.Trigger>
      <Dialog.Popup showCloseButton={false}>
        <Dialog.Header>
          <Dialog.Title>Manage team member</Dialog.Title>
          <Dialog.Description>
            View and manage a user in your team.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <div className="grid gap-1">
            <p className="text-muted-foreground text-sm">Name</p>
            <p className="font-medium text-sm">Rlz lzone</p>
          </div>
          <div className="grid gap-1">
            <p className="text-muted-foreground text-sm">Email</p>
            <p className="font-medium text-sm">rlz@example.com</p>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog variant="bare-top">
            <Dialog.Trigger render={<Button variant="outline" />}>
              Edit details
            </Dialog.Trigger>
            <Dialog.Popup showCloseButton={false}>
              <Dialog.Header>
                <Dialog.Title>Edit details</Dialog.Title>
                <Dialog.Description>
                  Make changes to the member&apos;s information.
                </Dialog.Description>
              </Dialog.Header>
              <Form>
                <Dialog.Body>
                  <Field>
                    <Field.Label>Name</Field.Label>
                    <Input defaultValue="Rlz lzone" type="text" />
                  </Field>
                  <Field>
                    <Field.Label>Email</Field.Label>
                    <Input defaultValue="rlz@example.com" type="text" />
                  </Field>
                </Dialog.Body>
              </Form>
              <Dialog.Footer>
                <Dialog.Close render={<Button variant="ghost" />}>
                  Cancel
                </Dialog.Close>
                <Button type="submit">Save changes</Button>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
}
