"use client";

import {
  type EmojiPickerListCategoryHeaderProps,
  type EmojiPickerListEmojiProps,
  type EmojiPickerListRowProps,
  EmojiPicker as EmojiPickerPrimitive,
} from "frimousse";
import { cn } from "@ui/lib/utils";
import { ComponentProps } from "react";
import { SearchIcon, LoaderIcon } from "lucide-react";

/* ------------------------------ Emoji Picker ------------------------------ */

const EmojiPicker = ({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Root>) => {
  return (
    <EmojiPickerPrimitive.Root
      className={cn(
        "isolate flex h-full w-fit flex-col overflow-hidden rounded-md",
        className
      )}
      data-slot="emoji-picker"
      {...props}
    />
  );
};

/* ---------------------------- Emoji Picker Search ---------------------------- */

function EmojiPickerSearch({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Search>) {
  return (
    <div
      className={cn("flex h-9 items-center gap-2 border-border border-b px-2", className)}
      data-slot="emoji-picker-search"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <EmojiPickerPrimitive.Search
        className="outline-hidden placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        data-slot="emoji-picker-search"
        {...props}
      />
    </div>
  );
}

/* ---------------------------- Emoji Picker Viewport ---------------------------- */

const EmojiPickerViewport = (
  props: ComponentProps<typeof EmojiPickerPrimitive.Viewport>
) => {
  return (
    <EmojiPickerPrimitive.Viewport
      data-slot="emoji-picker-viewport"
      {...props}
    />
  );
};

/* ---------------------------- Emoji Picker Row ---------------------------- */

const EmojiPickerRow = ({ children, ...props }: EmojiPickerListRowProps) => {
  return (
    <div data-slot="emoji-picker-row" {...props} className="scroll-my-1 px-1">
      {children}
    </div>
  );
};

/* ---------------------------- Emoji Picker Loading ---------------------------- */

const EmojiPickerLoading = (
  props: ComponentProps<typeof EmojiPickerPrimitive.Loading>
) => {
  return (
    <EmojiPickerPrimitive.Loading data-slot="emoji-picker-loading" {...props} />
  );
};

/* ---------------------------- Emoji Picker Empty ---------------------------- */

const EmojiPickerEmpty = ({
  children,
  className,
  ...props
}: ComponentProps<typeof EmojiPickerPrimitive.Empty>) => {
  return (
    <EmojiPickerPrimitive.Empty
      data-slot="emoji-picker-empty"
      className={cn(
        "absolute inset-0 flex items-center justify-center text-muted-foreground text-sm",
        className
      )}
      {...props}
    >
      {children || "No emojis found"}
    </EmojiPickerPrimitive.Empty>
  );
};

/* ---------------------------- Emoji Picker List ---------------------------- */

const EmojiPickerList = ({
  components,
  className,
  onEmojiClick,
  ...props
}: ComponentProps<typeof EmojiPickerPrimitive.List> & {
  onEmojiClick?: (emoji: any) => void;
}) => {
  const defaultComponents = {
    Row: EmojiPickerRow,
    Emoji: onEmojiClick
      ? (emojiProps: any) => (
          <EmojiPickerEmoji {...emojiProps} onClick={onEmojiClick} />
        )
      : EmojiPickerEmoji,
    CategoryHeader: EmojiPickerCategoryHeader,
  };

  return (
    <EmojiPickerPrimitive.List
      className="select-none pb-1"
      components={components || defaultComponents}
      data-slot="emoji-picker-list"
      {...props}
    />
  );
};

/* ---------------------------- Emoji Picker List Category Header ---------------------------- */

const EmojiPickerCategoryHeader = ({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) => {
  return (
    <div
      {...props}
      className="bg-popover text-muted-foreground px-3 pb-2 pt-3.5 text-xs leading-none"
      data-slot="emoji-picker-category-header"
    >
      {category.label}
    </div>
  );
};

/* ---------------------------- Emoji Picker Emoji ---------------------------- */

const EmojiPickerEmoji = ({
  emoji,
  className,
  onClick,
  ...props
}: EmojiPickerListEmojiProps & {
  onClick?: (emoji: any) => void;
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(emoji);
    }
  };

  return (
    <button
      data-slot="emoji-picker-emoji"
      aria-label={emoji.label}
      className={cn(
        "data-[active]:bg-secondary flex size-7 items-center justify-center rounded-sm text-base hover:bg-secondary/50 transition-colors",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {emoji.emoji}
    </button>
  );
};

/* ---------------------------- Emoji Picker Content ---------------------------- */

const EmojiPickerContent = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Viewport>) => {
  return (
    <EmojiPickerViewport
      className={cn("outline-hidden relative flex-1", className)}
      {...props}
    >
      <EmojiPickerLoading
        className="absolute inset-0 flex items-center justify-center text-muted-foreground"
        data-slot="emoji-picker-loading"
      >
        <LoaderIcon className="size-4 animate-spin" />
      </EmojiPickerLoading>
      {children}
    </EmojiPickerViewport>
  );
};

/* ---------------------------- Exports ---------------------------- */

const EmojiPickerComposed = Object.assign(EmojiPicker, {
  Search: EmojiPickerSearch,
  Viewport: EmojiPickerViewport,
  Loading: EmojiPickerLoading,
  Empty: EmojiPickerEmpty,
  List: EmojiPickerList,
  Row: EmojiPickerRow,
  Content: EmojiPickerContent,
  CategoryHeader: EmojiPickerCategoryHeader,
  Emoji: EmojiPickerEmoji,
});

export {
  EmojiPickerComposed as EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerViewport,
  EmojiPickerLoading,
  EmojiPickerEmpty,
  EmojiPickerList,
  EmojiPickerRow,
  EmojiPickerContent,
  EmojiPickerCategoryHeader,
  EmojiPickerEmoji,
};
