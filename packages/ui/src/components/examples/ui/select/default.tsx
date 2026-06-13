import { Select } from "@rlz/ui/components/ui/select";

const fonts = [
  { label: "Sans-serif", value: "sans" },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "mono" },
  { label: "Cursive", value: "cursive" },
];

export default function Example() {
  return (
    <Select items={fonts}>
      <Select.Trigger className="max-w-50 w-full">
        <Select.Value placeholder="Select font" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Popup>
        <Select.List>
          {fonts.map(({ label, value }) => (
            <Select.Item key={label} value={value}>
              <Select.ItemIndicator />
              <Select.ItemText>{label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.List>
      </Select.Popup>
    </Select>
  );
}
