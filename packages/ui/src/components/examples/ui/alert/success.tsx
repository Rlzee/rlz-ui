import { Alert } from "@rlz/ui/components/ui/alert";

export default function Example() {
  return (
    <Alert variant="success" className="max-w-lg">
      <Alert.Title>Success</Alert.Title>
      <Alert.Description>
        Your changes have been successfully saved.
      </Alert.Description>
    </Alert>
  );
}
