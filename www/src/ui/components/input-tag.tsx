"use client";

import { useId, useState } from "react";
import { Tag, TagInput } from "emblor";

/* ------------------------------ Base Input Tag ------------------------------ */

type BaseProps = {
  initialTags?: Tag[];
  placeholder?: string;
  styleClasses?: Parameters<typeof TagInput>[0]["styleClasses"];
};

type InputTagProps = BaseProps & {
  tagsPosition?: "above" | "below";
};

type Variant = "default" | "inline";

const DEFAULT_STYLE_CLASSES = {
  default: {
    tagList: {
      container: "gap-1",
    },
    input:
      "bg-secondary border border-border rounded-md transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-border outline-none focus-visible:ring-[2px] focus-visible:ring-muted",
    tag: {
      body: "relative h-7 bg-secondary border border-border dark:hover:bg-secondary/80 hover:brightness-95 rounded-md font-medium text-xs ps-2 pe-7",
      closeButton:
        "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none text-muted-foreground/80",
    },
  },
  inline: {
    inlineTagsContainer:
      "border-border rounded-md bg-secondary shadow-xs transition-[color,box-shadow] focus-within:border-border outline-none focus-within:ring-[2px] focus-within:ring-muted p-1 gap-1",
    input:
      "w-full min-w-[80px] shadow-none px-2 h-7 ounded-md outline-none",
    tag: {
      body: "h-7 relative bg-secondary border border-border dark:hover:bg-secondary/80 hover:brightness-95 rounded-md font-medium text-xs ps-2 pe-7",
      closeButton:
        "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none text-muted-foreground/80",
    },
  },
};

const TagInputWrapper = ({
  initialTags = [],
  placeholder = "Add a tag",
  styleClasses = {},
  variant,
  inputFieldPosition,
}: BaseProps & { variant: Variant; inputFieldPosition?: "top" | "bottom" }) => {
  const id = useId();
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const combinedStyles = {
    ...DEFAULT_STYLE_CLASSES[variant],
    ...styleClasses,
  };

  return (
    <TagInput
      data-slot="input-tag"
      id={id}
      tags={tags}
      setTags={setTags}
      placeholder={placeholder}
      styleClasses={combinedStyles}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      inlineTags={variant === "inline"}
      inputFieldPosition={
        variant === "default" ? inputFieldPosition : undefined
      }
    />
  );
};

/* ------------------------------ Input Tag ------------------------------ */

const InputTag = ({ tagsPosition = "below", ...props }: InputTagProps) => {
  const inputFieldPosition = tagsPosition === "below" ? "top" : "bottom";

  return (
    <TagInputWrapper
      {...props}
      variant="default"
      inputFieldPosition={inputFieldPosition}
    />
  );
};

/* ------------------------------ Input Inner Tag ------------------------------ */

const InputInnnerTag = (props: BaseProps) => (
  <TagInputWrapper {...props} variant="inline" />
);

/* ------------------------------ Exports ------------------------------ */

export { InputTag, InputInnnerTag };
