import { Combobox } from "@ui/components/combobox";
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@ui/lib/utils";

const FrameworkLists = [
  { name: "React" },
  { name: "Vue" },
  { name: "Angular" },
  { name: "Svelte" },
  { name: "Ember" },
  { name: "Preact" },
  { name: "Solid" },
  { name: "Alpine.js" },
];

const FrameworkLists2 = [
  { name: "Backbone.js" },
  { name: "jQuery" },
  { name: "Lit" },
  { name: "Mithril" },
  { name: "Stimulus" },
  { name: "Polymer" },
];

const code = `import { Combobox } from "@ui/components/combobox";
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@ui/lib/utils";

const FrameworkLists = [
  { name: "React" },
  { name: "Vue" },
  { name: "Angular" },
  { name: "Svelte" },
  { name: "Ember" },
  { name: "Preact" },
  { name: "Solid" },
  { name: "Alpine.js" },
];

const FrameworkLists2 = [
  { name: "Backbone.js" },
  { name: "jQuery" },
  { name: "Lit" },
  { name: "Mithril" },
  { name: "Stimulus" },
  { name: "Polymer" },
];

export default function Example() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  const handleSelect = (val: string) => {
    setValue(val);
    setOpen(false);
  };

  return (
    <Combobox open={open} onOpenChange={setOpen}>
      <Combobox.Trigger>
        <Combobox.TriggerButton
          chevron="both"
          placeholder={value ? value : "Select a framework"}
        />
      </Combobox.Trigger>
      <Combobox.Content>
        <Combobox.Input placeholder="Search..." />
        <Combobox.List>
          <Combobox.Empty>Framework not found</Combobox.Empty>
          <Combobox.Group>
            <Combobox.Label>Frameworks</Combobox.Label>
            {FrameworkLists.map((framework) => (
              <Combobox.Item
                key={framework.name}
                value={framework.name}
                disabled={framework.name === "Ember"}
                onSelect={() => handleSelect(framework.name)}
              >
                <span>{framework.name}</span>
                <Check
                  className={cn(
                    "ml-auto",
                    value === framework.name ? "opacity-100" : "opacity-0"
                  )}
                />
              </Combobox.Item>
            ))}
          </Combobox.Group>
          <Combobox.Group className="border-t border-border">
            <Combobox.Label>More Frameworks</Combobox.Label>
            {FrameworkLists2.map((framework) => (
              <Combobox.Item
                key={framework.name}
                value={framework.name}
                onSelect={() => handleSelect(framework.name)}
               >
                <span>{framework.name}</span>
                <Check
                  className={cn(
                    "ml-auto",
                    value === framework.name ? "opacity-100" : "opacity-0"
                  )}
                />
              </Combobox.Item>
            ))}
          </Combobox.Group>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
  );
}`;

const Component = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  const handleSelect = (val: string) => {
    setValue(val);
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-center">
      <Combobox open={open} onOpenChange={setOpen}>
        <Combobox.Trigger>
          <Combobox.TriggerButton
            chevron="both"
            placeholder={value ? value : "Select a framework"}
          />
        </Combobox.Trigger>
        <Combobox.Content>
          <Combobox.Input placeholder="Search..." />
          <Combobox.List>
            <Combobox.Empty>Framework not found</Combobox.Empty>
            <Combobox.Group>
              <Combobox.Label>Frameworks</Combobox.Label>
              {FrameworkLists.map((framework) => (
                <Combobox.Item
                  key={framework.name}
                  value={framework.name}
                  disabled={framework.name === "Ember"}
                  onSelect={() => handleSelect(framework.name)}
                >
                  <span>{framework.name}</span>
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </Combobox.Item>
              ))}
            </Combobox.Group>
            <Combobox.Group className="border-t border-border">
              <Combobox.Label>More Frameworks</Combobox.Label>
              {FrameworkLists2.map((framework) => (
                <Combobox.Item
                  key={framework.name}
                  value={framework.name}
                  onSelect={() => handleSelect(framework.name)}
                >
                  <span>{framework.name}</span>
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </Combobox.Item>
              ))}
            </Combobox.Group>
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </div>
  );
};

export const ComboboxDemo = {
  code,
  component: <Component />,
};
