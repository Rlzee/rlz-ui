"use client";

import { useId, useState } from "react";
import { Tag, TagInput } from "emblor";

type InputTagProps = {
  initialTags?: Tag[];
  placeholder?: string;
  styleClasses?: Parameters<typeof TagInput>[0]["styleClasses"];
};

const InputTag = ({
  initialTags = [],
  placeholder = "Add a tag",
  styleClasses,
}: InputTagProps) => {
  const id = useId();
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  return (
    <TagInput
      id={id}
      tags={tags}
      setTags={setTags}
      placeholder={placeholder}
      styleClasses={{
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
        ...styleClasses,
      }}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      inlineTags={false}
      inputFieldPosition="top"
    />
  );
};

const InputInnnerTag = ({
  initialTags = [],
  placeholder = "Add a tag",
  styleClasses,
}: InputTagProps) => {
  const id = useId();
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  return (
    <TagInput
      id={id}
      tags={tags}
      setTags={(newTags) => {
        setTags(newTags);
      }}
      placeholder={placeholder}
      styleClasses={{
        inlineTagsContainer:
          "border-border rounded-md bg-secondary shadow-xs transition-[color,box-shadow] focus-within:border-border outline-none focus-within:ring-[2px] focus-within:ring-muted p-1 gap-1",
        input: "w-full min-w-[80px] shadow-none px-2 h-7",
        tag: {
          body: "h-7 relative bg-secondary border border-border dark:hover:bg-secondary/80 hover:brightness-95 rounded-md font-medium text-xs ps-2 pe-7",
          closeButton:
            "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none text-muted-foreground/80",
        },
        ...styleClasses,
      }}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
    />
  );
};

export { InputTag, InputInnnerTag };
