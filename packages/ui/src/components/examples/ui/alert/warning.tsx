import { Alert } from "@rlz/ui/components/ui/alert";

export default function Example() {
  return (
    <Alert variant="warning" className="max-w-lg">
      <Alert.Title>Warning</Alert.Title>
      <Alert.Description>
        You are approaching your storage limit. Consider upgrading your plan.
      </Alert.Description>
    </Alert>
  );
}
