import * as React from "react";
import { Progress } from "@ui/components/progress";

const code = `import * as React from "react";
import { Progress } from "@ui/components/progress";

export default function Example() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress value={progress} className="w-[60%]" />
}`;

const Component = () => {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex items-center justify-center">
      <Progress value={progress} className="w-[60%]" />
    </div>
  );
};

export const ProgressDemo = {
  code,
  component: <Component />,
};
