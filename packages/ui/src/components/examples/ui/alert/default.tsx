import { Alert } from "@rlz/ui/components/ui/alert";

export default function Example() {
  return (
    <Alert className="max-w-lg">
      <Alert.Title>Notice</Alert.Title>
      <Alert.Description>
        This is a default alert used to display general information.
      </Alert.Description>
    </Alert>
  );
}
