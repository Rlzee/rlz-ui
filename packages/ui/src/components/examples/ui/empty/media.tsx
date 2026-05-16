import { Empty } from "@rlz/ui/components/ui/empty";
import { Cloud } from "lucide-react";
import { Button } from "@rlz/ui/components/ui/button";

export default function Example() {
  return (
    <Empty className="border border-dashed">
      <Empty.Header>
        <Empty.Media variant="secondary">
          <Cloud />
        </Empty.Media>
        <Empty.Title>Cloud Storage Empty</Empty.Title>
        <Empty.Description>
          Upload files to your cloud storage to access them anywhere.
        </Empty.Description>
      </Empty.Header>
      <Empty.Actions>
        <Button variant="outline">Upload Files</Button>
      </Empty.Actions>
    </Empty>
  );
}
