import { PropsTable } from "./props-table";
import { props } from "./props/props";

const ComponentProps = ({ name }: { name: keyof typeof props }) => {
  const componentProps = props[name];

  if (!componentProps) {
    return null;
  }

  if (typeof componentProps === 'object' && !Array.isArray(componentProps)) {
    return (
      <div className="space-y-8">
        {Object.entries(componentProps).map(([subComponentName, propsData]) => (
          <div key={subComponentName}>
            <PropsTable props={propsData} title={`${name}.${subComponentName === 'root' ? '(root)' : subComponentName}`} />
          </div>
        ))}
      </div>
    );
  }

  return <PropsTable props={componentProps} />;
};

export { ComponentProps };
