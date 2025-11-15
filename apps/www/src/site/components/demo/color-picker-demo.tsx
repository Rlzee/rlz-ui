import { ColorPicker } from "@ui/components/color-picker";

const code = `import { ColorPicker } from "@ui/components/color-picker";

export default function Example() {
  return (
    <ColorPicker
      defaultColor="#ff6b6b"
      className="border border-border rounded-md"
    >
      <ColorPicker.Preview />
      <ColorPicker.Saturation />
      <div className="flex items-center gap-2">
        <ColorPicker.EyeDropper />
        <div className="flex-col w-full">
          <ColorPicker.Hue className="mb-2" />
          <ColorPicker.Alpha />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ColorPicker.FormatSelector />
        <ColorPicker.Input />
      </div>
    </ColorPicker>
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
      <ColorPicker
        defaultColor="#ff6b6b"
        className="border border-border rounded-md"
      >
        <ColorPicker.Preview />
        <ColorPicker.Saturation />
        <div className="flex items-center gap-2">
          <ColorPicker.EyeDropper />
          <div className="flex-col w-full">
            <ColorPicker.Hue className="mb-2" />
            <ColorPicker.Alpha />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPicker.FormatSelector />
          <ColorPicker.Input />
        </div>
      </ColorPicker>
    </div>
  );
};

export const ColorPickerDemo = {
  code,
  component: <Component />,
};
