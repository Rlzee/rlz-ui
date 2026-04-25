import { Alert } from "@rlz/ui/components/ui/alert";

export default function Example() {
  return (
    <Alert variant="info" className="max-w-lg">
      <Alert.Title>Information</Alert.Title>
      <Alert.Description>
        Your session will expire in 5 minutes. Please save your work.
      </Alert.Description>
    </Alert>
  );
}
