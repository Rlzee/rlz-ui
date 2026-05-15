import { Drawer } from "@rlz/ui/components/ui/drawer";
import { Button } from "@rlz/ui/components/ui/button";
import { Form } from "@rlz/ui/components/ui/form";
import { Field } from "@rlz/ui/components/ui/field";
import { Input } from "@rlz/ui/components/ui/input";
import { Textarea } from "@rlz/ui/components/ui/textarea";

export default function Example() {
  return (
    <Drawer>
      <Drawer.Trigger render={<Button variant="outline" />}>
        Edit profile
      </Drawer.Trigger>
      <Drawer.Popup>
        <Drawer.Header>
          <Drawer.Title>Edit profile</Drawer.Title>
          <Drawer.Description>
            Update your public profile information.
          </Drawer.Description>
        </Drawer.Header>
        <Form className="h-full">
          <Drawer.Body>
            <Field>
              <Field.Label>Name</Field.Label>
              <Input defaultValue="Alice Martin" type="text" />
            </Field>
            <Field>
              <Field.Label>Bio</Field.Label>
              <Textarea
                rows={3}
                defaultValue="Product designer focused on design systems."
              />
            </Field>
          </Drawer.Body>
        </Form>
        <Drawer.Footer>
          <Drawer.Close render={<Button variant="ghost" />}>
            Cancel
          </Drawer.Close>
          <Button>Save changes</Button>
        </Drawer.Footer>
      </Drawer.Popup>
    </Drawer>
  );
}
