import { Breadcrumb }  from "@ui/components/breadcrumb";

const code = `import { Breadcrumb }  from "@ui/components/breadcrumb";

export default function Example() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="#">Library</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item isActive>Data</Breadcrumb.Item>
    </Breadcrumb>
  );
}`;

const Components = () => {
  return (
    <div className="mx-auto max-w-[600px] flex items-center justify-center">
      <Breadcrumb>
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item href="#">Library</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item isActive>Data</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};

export const BreadcrumbDemo = {
    code,
    component: <Components />
};
