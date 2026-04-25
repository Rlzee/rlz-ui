import { Alert } from "@rlz/ui/components/ui/alert";

export default function Example() {
  return (
    <Alert variant="error" className="max-w-lg">
      <Alert.Title>Error</Alert.Title>
      <Alert.Description>
        Something went wrong. Please try again later.
      </Alert.Description>
    </Alert>
  );
}
