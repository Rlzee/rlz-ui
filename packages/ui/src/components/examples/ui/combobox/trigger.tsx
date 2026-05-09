"use client";

import { Combobox } from "@rlz/ui/components/ui/combobox";
import { Button } from "@rlz/ui/components/ui/button";

const langs = [
  { id: "js", value: "JavaScript" },
  { id: "ts", value: "TypeScript" },
  { id: "py", value: "Python" },
  { id: "java", value: "Java" },
  { id: "cpp", value: "C++" },
  { id: "cs", value: "C#" },
  { id: "php", value: "PHP" },
  { id: "ruby", value: "Ruby" },
  { id: "go", value: "Go" },
  { id: "rust", value: "Rust" },
  { id: "swift", value: "Swift" },
];

export default function Example() {
  return (
    <Combobox items={langs} defaultValue={langs[0]}>
      <Combobox.Trigger
        className="w-60"
        render={
          <Button
            variant="outline"
            className="justify-between data-popup-open:bg-accent"
          />
        }
      >
        <Combobox.Value />
        <Combobox.Icon />
      </Combobox.Trigger>
      <Combobox.Popup>
        <Combobox.Input placeholder="Select fruit" />
        <Combobox.Empty className="pt-2">No fruits found.</Combobox.Empty>
        <Combobox.List className="pt-2">
          {(item) => (
            <Combobox.Item key={item.id} value={item.value}>
              {item.value}
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Popup>
    </Combobox>
  );
}
