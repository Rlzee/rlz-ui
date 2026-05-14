import { Dialog } from "@rlz/ui/components/ui/dialog";
import { Field } from "@rlz/ui/components/ui/field";
import { Input } from "@rlz/ui/components/ui/input";
import { Button } from "@rlz/ui/components/ui/button";
import { Form } from "@rlz/ui/components/ui/form";

export default function Example() {
  return (
    <Dialog variant="bare-bottom">
      <Dialog.Trigger render={<Button variant="outline" />}>
        Open Dialog
      </Dialog.Trigger>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here. Click save when you&apos;re done.
          </Dialog.Description>
        </Dialog.Header>
        <Form>
          <Dialog.Body>
            <Field>
              <Field.Label>Name</Field.Label>
              <Input defaultValue="Rlz Lzone" type="text" />
            </Field>
            <Field>
              <Field.Label>Username</Field.Label>
              <Input defaultValue="@rlz.lzone" type="text" />
            </Field>
          </Dialog.Body>
        </Form>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="ghost" />}>
            Cancel
          </Dialog.Close>
          <Button type="submit">Save</Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
}
