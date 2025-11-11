import { EmojiPicker } from "@ui/components/emoji-picker";

const code = `import { EmojiPicker } from '@ui/components/emoji-picker';

export default function Example() {
  return (
    <EmojiPicker className="h-[326px] rounded-lg border border-border">
      <EmojiPicker.Search />
      <EmojiPicker.Content>
        <EmojiPicker.Empty />
        <EmojiPicker.List />
      </EmojiPicker.Content>
    </EmojiPicker>
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
      <EmojiPicker className="h-[326px] rounded-lg border border-border">
        <EmojiPicker.Search />
        <EmojiPicker.Content>
          <EmojiPicker.Empty />
          <EmojiPicker.List />
        </EmojiPicker.Content>
      </EmojiPicker>
    </div>
  );
};

export const EmojiPickerDemo = {
  code,
  component: <Component />,
};
