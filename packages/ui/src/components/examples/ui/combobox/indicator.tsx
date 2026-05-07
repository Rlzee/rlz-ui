"use client";

import { Combobox } from "@rlz/ui/components/ui/combobox";

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
    <Combobox items={langs} defaultValue={langs[0].value}>
      <Combobox.Field placeholder="Select a language" />
      <Combobox.Popup>
        <Combobox.Empty>No fruits found.</Combobox.Empty>
        <Combobox.List>
          {(item) => (
            <Combobox.Item key={item.id} value={item.value}>
              <Combobox.ItemIndicator />
              <Combobox.ItemText>{item.value}</Combobox.ItemText>
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Popup>
    </Combobox>
  );
}
