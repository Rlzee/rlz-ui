import { PropsTable } from "./props-table";
import { props } from "./props/props";

const ComponentProps = ({ name }: { name: keyof typeof props }) => {
  const componentProps = props[name];

  if (!componentProps) {
    return null;
  }

  if (typeof componentProps === "object" && !Array.isArray(componentProps)) {
    const hasMain = "main" in componentProps;

    return (
      <div>
        {Object.entries(componentProps).map(([subComponentName, propsDataRaw]) => {
          // Support multiple shapes for the value:
          // - PropRow[] (existing behavior)
          // - string (use as explicit title)
          // - { title: string, props: PropRow[] } (explicit title + props)
          let title: string;
          let propsData: any = propsDataRaw;

          if (typeof propsDataRaw === "string") {
            // If the string is empty, use the sub-component name verbatim
            // (this avoids automatically prefixing the component name).
            title = propsDataRaw === "" ? subComponentName : propsDataRaw;
            propsData = [];
          } else if (Array.isArray(propsDataRaw)) {
            if (subComponentName === "main") title = name;
            else if (subComponentName === "root") title = hasMain ? `${name}.Root` : `${name} (root)`;
            else title = `${name}.${subComponentName}`;
          } else if (
            propsDataRaw &&
            typeof propsDataRaw === "object" &&
            "title" in propsDataRaw &&
            Array.isArray((propsDataRaw as any).props)
          ) {
            title = (propsDataRaw as any).title;
            propsData = (propsDataRaw as any).props;
          } else {
            // Fallback to previous formatting
            title = `${name}.${subComponentName}`;
          }

          return (
            <div key={subComponentName}>
              <PropsTable props={propsData} title={title} />
            </div>
          );
        })}
      </div>
    );
  }

  return <PropsTable props={componentProps} />;
};

export { ComponentProps };
