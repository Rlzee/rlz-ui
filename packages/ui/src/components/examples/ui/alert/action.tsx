import { Alert } from "@rlz/ui/components/ui/alert";
import { Button } from "@rlz/ui/components/ui/button";

export default function Example() {
  return (
    <Alert className="max-w-lg">
      <Alert.Title>Failed to upload</Alert.Title>
      <Alert.Description>
        There was an issue uploading your file. Please try again.
      </Alert.Description>
      <Alert.Action>
        <Button size="xs">Retry</Button>
      </Alert.Action>
    </Alert>
  );
}
