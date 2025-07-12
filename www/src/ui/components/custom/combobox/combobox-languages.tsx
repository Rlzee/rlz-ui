"use client";

import { useMemo, useState } from "react";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxTriggerButton,
} from "@/src/ui/components/combobox";
import { Check } from "lucide-react";
import { cn } from "@/src/lib/utils";

const languageCodes = [
  "aa",
  "ab",
  "ae",
  "af",
  "ak",
  "am",
  "an",
  "ar",
  "as",
  "av",
  "ay",
  "az",
  "ba",
  "be",
  "bg",
  "bh",
  "bi",
  "bm",
  "bn",
  "bo",
  "br",
  "bs",
  "ca",
  "ce",
  "ch",
  "co",
  "cr",
  "cs",
  "cu",
  "cv",
  "cy",
  "da",
  "de",
  "dv",
  "dz",
  "ee",
  "el",
  "en",
  "eo",
  "es",
  "et",
  "eu",
  "fa",
  "ff",
  "fi",
  "fj",
  "fo",
  "fr",
  "fy",
  "ga",
  "gd",
  "gl",
  "gn",
  "gu",
  "gv",
  "ha",
  "he",
  "hi",
  "ho",
  "hr",
  "ht",
  "hu",
  "hy",
  "hz",
  "ia",
  "id",
  "ie",
  "ig",
  "ii",
  "ik",
  "io",
  "is",
  "it",
  "iu",
  "ja",
  "jv",
  "ka",
  "kg",
  "ki",
  "kj",
  "kk",
  "kl",
  "km",
  "kn",
  "ko",
  "kr",
  "ks",
  "ku",
  "kv",
  "kw",
  "ky",
  "la",
  "lb",
  "lg",
  "li",
  "ln",
  "lo",
  "lt",
  "lu",
  "lv",
  "mg",
  "mh",
  "mi",
  "mk",
  "ml",
  "mn",
  "mr",
  "ms",
  "mt",
  "my",
  "na",
  "nb",
  "nd",
  "ne",
  "ng",
  "nl",
  "nn",
  "no",
  "nr",
  "nv",
  "ny",
  "oc",
  "oj",
  "om",
  "or",
  "os",
  "pa",
  "pi",
  "pl",
  "ps",
  "pt",
  "qu",
  "rm",
  "rn",
  "ro",
  "ru",
  "rw",
  "sa",
  "sc",
  "sd",
  "se",
  "sg",
  "si",
  "sk",
  "sl",
  "sm",
  "sn",
  "so",
  "sq",
  "sr",
  "ss",
  "st",
  "su",
  "sv",
  "sw",
  "ta",
  "te",
  "tg",
  "th",
  "ti",
  "tk",
  "tl",
  "tn",
  "to",
  "tr",
  "ts",
  "tt",
  "tw",
  "ty",
  "ug",
  "uk",
  "ur",
  "uz",
  "ve",
  "vi",
  "vo",
  "wa",
  "wo",
  "xh",
  "yi",
  "yo",
  "za",
  "zh",
  "zu",
];

interface ComboboxLanguagesProps {
  onChange?: (value: string) => void;
  locale?: string;
}

const ComboboxLanguages = ({
  onChange,
  locale = "en",
}: ComboboxLanguagesProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const languageNames = useMemo(
    () => new Intl.DisplayNames([locale], { type: "language" }),
    [locale]
  );

  const handleSelect = (code: string) => {
    setSelected(code);
    onChange?.(code);
  };

  return (
    <Combobox open={open} onOpenChange={setOpen}>
      <ComboboxTrigger>
        <ComboboxTriggerButton
          placeholder={
            selected
              ? languageNames.of(selected) || selected
              : "Select a language"
          }
        />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput placeholder="Search for a language..." />
        <ComboboxList>
          <ComboboxGroup>
            {languageCodes.map((code) => {
              const label = languageNames.of(code);
              if (!label) return null;
              return (
                <ComboboxItem
                  key={code}
                  onSelect={() => {
                    handleSelect(code);
                    setOpen(false);
                  }}
                >
                  <span>{label}</span>
                  <Check
                    className={cn(
                      "ml-auto",
                      selected === code ? "opacity-100" : "opacity-0"
                    )}
                  />
                </ComboboxItem>
              );
            })}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export { ComboboxLanguages };
