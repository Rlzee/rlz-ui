import { Drawer } from "@ui/components/drawer";
import { Button } from "@ui/components/button";

const code = `import { Drawer } from "@ui/components/drawer";
import { Button } from "@ui/components/button";

export default function Example() {
  return (
    <Drawer>
      <Drawer.Trigger asChild className="flex items-center justify-center mx-auto">
        <Button>Open Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Handle />
        <Drawer.Header>
          <div className="w-full max-w-lg mx-auto !text-left mt-4">
            <Drawer.Title>Drawer Title</Drawer.Title>
            <Drawer.Description>
              This is a description of the drawer content.
            </Drawer.Description>
          </div>
        </Drawer.Header>
        <Drawer.Body>
          <div className="w-full max-w-lg mx-auto !text-left mb-4 mt-2">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque,
              quasi dolorum aliquid corporis nesciunt exercitationem ipsa
              assumenda incidunt, error neque temporibus tempora possimus earum
              veritatis praesentium aperiam iure, quae ipsam ut? Ipsam harum
              esse sit error, odio ab blanditiis molestiae laudantium
              perspiciatis veniam voluptates libero eum debitis velit qui in?
            </p>
          </div>
        </Drawer.Body>
        <Drawer.Footer className="border-t border-border mt-4 bg-background-secondary">
          <div className="w-full max-w-lg mx-auto flex justify-end gap-2">
            <a href="" className="underline text-sm text-muted-foreground">
              Documentations
            </a>
            <a href="https://github.com/Rlzee/rlz-ui" className="underline text-sm text-muted-foreground">
              GitHub
            </a>
          </div>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}`;

const Component = () => {
  return (
    <Drawer>
      <Drawer.Trigger asChild className="flex items-center justify-center mx-auto">
        <Button variant="outline">Open Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Handle />
        <Drawer.Header>
          <div className="w-full max-w-lg mx-auto !text-left mt-4">
            <Drawer.Title>Drawer Title</Drawer.Title>
            <Drawer.Description>
              This is a description of the drawer content.
            </Drawer.Description>
          </div>
        </Drawer.Header>
        <Drawer.Body>
          <div className="w-full max-w-lg mx-auto !text-left mb-4 mt-2">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque,
              quasi dolorum aliquid corporis nesciunt exercitationem ipsa
              assumenda incidunt, error neque temporibus tempora possimus earum
              veritatis praesentium aperiam iure, quae ipsam ut? Ipsam harum
              esse sit error, odio ab blanditiis molestiae laudantium
              perspiciatis veniam voluptates libero eum debitis velit qui in?
            </p>
          </div>
        </Drawer.Body>
        <Drawer.Footer className="border-t border-border mt-4 bg-background-secondary">
          <div className="w-full max-w-lg mx-auto flex justify-end gap-2">
            <a href="" className="underline text-sm text-muted-foreground">
              Documentations
            </a>
            <a href="https://github.com/Rlzee/rlz-ui" className="underline text-sm text-muted-foreground">
              GitHub
            </a>
          </div>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

export const DrawerDemo = {
  code,
  component: <Component />,
};
