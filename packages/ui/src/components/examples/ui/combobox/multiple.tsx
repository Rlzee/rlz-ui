"use client";

import * as React from "react";
import { Combobox } from "@rlz/ui/components/ui/combobox";

type ProgrammingLanguage = {
  id: string;
  value: string;
};

const langs: ProgrammingLanguage[] = [
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
  const id = React.useId();

  return (
    <Combobox items={langs} multiple>
      <Combobox.Chips className="w-60">
        <Combobox.Value>
          {(value: ProgrammingLanguage[]) => (
            <React.Fragment>
              {value.map((lang) => (
                <Combobox.Chip key={lang.id} aria-label={lang.value}>
                  {lang.value}
                  <Combobox.ChipRemove aria-label="Remove" />
                </Combobox.Chip>
              ))}
              <Combobox.ChipsInput
                placeholder={
                  value.length > 0 ? undefined : "Select a language..."
                }
              />
            </React.Fragment>
          )}
        </Combobox.Value>
      </Combobox.Chips>

      <Combobox.Popup>
        <Combobox.Empty>No languages found.</Combobox.Empty>
        <Combobox.List>
          {(language: ProgrammingLanguage) => (
            <Combobox.Item key={language.id} value={language}>
              <Combobox.ItemIndicator />
              <Combobox.ItemText>{language.value}</Combobox.ItemText>
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Popup>
    </Combobox>
  );
}
