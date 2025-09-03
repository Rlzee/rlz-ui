import { Divider } from "@ui/components/divider";

const code = `import { Divider } from "@ui/components/divider";

export default function Example() {
  return (
    <Divider>or continue with</Divider>
    <Divider position="left">or continue with</Divider>
    <Divider position="right">or continue with</Divider>
  );
}`;

const Components = () => {
  return (
    <div className="mx-auto max-w-[400px] flex flex-col gap-3">
        <Divider>or continue with</Divider>
        <Divider position="left">or continue with</Divider>
        <Divider position="right">or continue with</Divider>
    </div>
  );
};

export const DividerDemo = {
    code,
    component: <Components />
};
