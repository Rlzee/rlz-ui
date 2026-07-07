"use client";

import * as React from "react";
import Link from "next/link";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Autocomplete } from "@rlz/ui/components/ui/autocomplete";
import { Button } from "@rlz/ui/components/ui/button";
import { Search } from "lucide-react";

export default function SearchField() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="mx-auto max-w-2xl lg:py-6 py-4 flex gap-1.5">
      <Autocomplete>
        <InputGroup className="h-11" ref={inputRef}>
          <InputGroup.Addon align="inline-start">
            <Search className="size-5" />
          </InputGroup.Addon>
          <Autocomplete.Input unstyled className="text-base ps-1 pe-1" />
          <InputGroup.Addon align="inline-end" className="mr-[-0.50rem] ">
            <Button size="sm" render={<Link href={"/presets/create"} />}>
              Create
            </Button>
          </InputGroup.Addon>
        </InputGroup>
        <Autocomplete.Popup
          positionerProps={{
            anchor: inputRef,
          }}
        ></Autocomplete.Popup>
      </Autocomplete>
    </div>
  );
}
