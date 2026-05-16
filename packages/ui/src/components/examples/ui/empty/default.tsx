import { Empty } from "@rlz/ui/components/ui/empty";
import { Package, ArrowUpRight } from "lucide-react";
import { Button } from "@rlz/ui/components/ui/button";

export default function Example() {
  return (
    <Empty>
      <Empty.Header>
        <Empty.Media>
          <Package />
        </Empty.Media>
        <Empty.Title>No Projects Yet</Empty.Title>
        <Empty.Description>
          You haven't created any projects yet. Get started by creating your
          first project.
        </Empty.Description>
      </Empty.Header>
      <Empty.Actions>
        <Button>Create Project</Button>
        <Button variant="outline">Import Project</Button>
      </Empty.Actions>
      <Button
        variant="link"
        className="text-muted-foreground"
        size="sm"
        render={
          <a href="#">
            Learn More <ArrowUpRight />
          </a>
        }
      />
    </Empty>
  );
}
