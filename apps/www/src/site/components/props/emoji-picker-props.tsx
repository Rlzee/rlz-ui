import { type PropRow } from "@site/types/props";

export const emojiPickerProps: PropRow[] = [
  {
    prop: "className",
    type: "string",
    default: "-",
    description: "Additional CSS classes applied to the root emoji picker."
  },
  {
    prop: "...props",
    type: "ComponentProps<typeof import('frimousse').EmojiPicker.Root>",
    default: "-",
    description: "All other props forwarded to the underlying Frimousse EmojiPicker Root."
  }
];

export const emojiPickerSearchProps: PropRow[] = [
  { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the search wrapper." },
  { prop: "...props", type: "ComponentProps<typeof import('frimousse').EmojiPicker.Search>", default: "-", description: "All other props forwarded to the search input." }
];

export const emojiPickerViewportProps: PropRow[] = [
  { prop: "...props", type: "ComponentProps<typeof import('frimousse').EmojiPicker.Viewport>", default: "-", description: "Props forwarded to the viewport container." }
];

export const emojiPickerListProps: PropRow[] = [
  { prop: "components", type: "Partial<Record<string, any>>", default: "-", description: "Custom render components for list parts (Row, Emoji, CategoryHeader)." },
  { prop: "onEmojiClick", type: "(emoji: any) => void", default: "-", description: "Optional callback invoked when an emoji is clicked." },
  { prop: "className", type: "string", default: "'select-none pb-1'", description: "Additional classes applied to the list container." },
  { prop: "...props", type: "ComponentProps<typeof import('frimousse').EmojiPicker.List>", default: "-", description: "All other props forwarded to the list component." }
];

export const emojiPickerRowProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "-", description: "Row children (emoji buttons)." },
  { prop: "className", type: "string", default: "'scroll-my-1 px-1'", description: "Classes applied to each row." },
  { prop: "...props", type: "EmojiPickerListRowProps", default: "-", description: "Row-specific props from Frimousse." }
];

export const emojiPickerEmptyProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "'No emojis found'", description: "Content shown when no emojis match the query." },
  { prop: "className", type: "string", default: "'absolute inset-0 flex items-center justify-center text-muted-foreground text-sm'", description: "Classes for the empty state wrapper." },
  { prop: "...props", type: "ComponentProps<typeof import('frimousse').EmojiPicker.Empty>", default: "-", description: "All other props forwarded to the empty component." }
];

export const emojiPickerCategoryHeaderProps: PropRow[] = [
  { prop: "category", type: "{ label: string }", default: "-", description: "Category object containing label and metadata." },
  { prop: "...props", type: "EmojiPickerListCategoryHeaderProps", default: "-", description: "Other header props from Frimousse." }
];

export const emojiPickerEmojiProps: PropRow[] = [
  { prop: "emoji", type: "{ emoji: string; label: string }", default: "-", description: "Emoji data object (character and accessible label)." },
  { prop: "onClick", type: "(emoji: any) => void", default: "-", description: "Click handler receiving the emoji object." },
  { prop: "className", type: "string", default: "'data-[active]:bg-secondary flex size-7 items-center justify-center rounded-sm'", description: "Classes applied to the emoji button." },
  { prop: "...props", type: "EmojiPickerListEmojiProps", default: "-", description: "Other emoji props from Frimousse." }
];

const emojiPickerPropsExport = {
  main: emojiPickerProps,
  search: emojiPickerSearchProps,
  viewport: emojiPickerViewportProps,
  list: emojiPickerListProps,
  row: emojiPickerRowProps,
  empty: emojiPickerEmptyProps,
  categoryHeader: emojiPickerCategoryHeaderProps,
  emoji: emojiPickerEmojiProps,
};

export { emojiPickerPropsExport };
