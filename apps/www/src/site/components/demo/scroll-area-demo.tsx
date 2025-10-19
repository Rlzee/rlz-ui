import * as React from "react";
import { ScrollArea } from "@ui/components/scroll-area";
import { Separator } from "@ui/components/separator";

const code = `import * as React from "react";
import { ScrollArea } from "@ui/components/scroll-area";
import { Separator } from "@ui/components/separator";

export default function Example() {
  const tags = Array.from({ length: 50 }).map(
    (_, i, a) => \`v1.2.0-beta.\${a.length - i}\`
  );

  return (
    <ScrollArea className="h-72 w-48 border border-border rounded-md bg-background-secondary">
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" orientation="horizontal" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}`;

const Components = () => {
  const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  );

  return (
    <div className="flex items-center justify-center">
      <ScrollArea className="h-72 w-48 border border-border rounded-md bg-background-secondary">
        <div className="p-4">
          <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
          {tags.map((tag) => (
            <React.Fragment key={tag}>
              <div className="text-sm">{tag}</div>
              <Separator className="my-2" orientation="horizontal" />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export const ScrollAreaDemo = {
  code,
  component: <Components />,
};
