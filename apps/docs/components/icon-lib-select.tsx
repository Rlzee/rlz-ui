import { Combobox } from "@rlz/ui/components/ui/combobox";

const iconLibList = ["lucide", "tabler"];

type IconLibSelectProps = {
  value?: string;
  onValueChange?: (lib: string) => void;
  defaultValue?: string;
};

export function IconLibSelect({
  value,
  onValueChange,
  defaultValue,
}: IconLibSelectProps) {
  return (
    <Combobox
      items={iconLibList}
      value={value}
      onValueChange={(lib) => lib && onValueChange?.(lib)}
      defaultValue={defaultValue}
    >
      <Combobox.Field clearable />
      <Combobox.Popup
        positionerProps={{
          className: "z-60",
        }}
      >
        <Combobox.Empty>No lib found.</Combobox.Empty>
        <Combobox.List>
          {(item) => (
            <Combobox.Item key={item} value={item}>
              {item}
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Popup>
    </Combobox>
  );
}
