import { Alert } from "@ui/components/alert";
import { AlertCircle } from "lucide-react";

const code = `import { Alert } from "@ui/components/alert";

export default function Example() {
    return (
    <Alert
        title="Alert with Icon"
        icon={<AlertCircle className="w-4 h-4" />}
        description="This default alert includes an icon."
      />
      <Alert
        title="Success Alert"
        variant="success"
        description="This alert indicates a successful action."
      />
      <Alert
        title="Warning Alert"
        variant="warning"
        description="This alert warns about a potential issue."
      />
      <Alert
        title="Info Alert"
        variant="info"
        description="This alert provides informational content."
      />
      <Alert
        title="Error Alert"
        variant="destructive"
        description="This alert indicates an error or critical issue."
      />
    );
};`;

const Component = () => {
  return (
    <div className="flex flex-col gap-4 mx-auto max-w-[400px]">
      <Alert
        title="Alert with Icon"
        icon={<AlertCircle className="w-4 h-4" />}
        description="This default alert includes an icon."
      />
      <Alert
        title="Success Alert"
        variant="success"
        description="This alert indicates a successful action."
      />
      <Alert
        title="Warning Alert"
        variant="warning"
        description="This alert warns about a potential issue."
      />
      <Alert
        title="Info Alert"
        variant="info"
        description="This alert provides informational content."
      />
      <Alert
        title="Error Alert"
        variant="destructive"
        description="This alert indicates an error or critical issue."
      />
    </div>
  );
};

export const AlertDemo = {
  code,
  component: <Component />,
};
