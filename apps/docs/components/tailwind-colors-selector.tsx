"use client";

import * as React from "react";

import { Popover } from "@rlz/ui/components/ui/popover";
import { Button } from "@rlz/ui/components/ui/button";
import { Tabs } from "@rlz/ui/components/ui/tabs";
import { Separator } from "@rlz/ui/components/ui/separator";
import { Command } from "@rlz/ui/components/ui/command";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { cn } from "@rlz/ui/lib/cn";

import { TAILWIND_PALETTE } from "@/utils/tailwind-colors";

import TailwindCSS from "./icons/tailwind-css";
import { LayoutGrid, List } from "lucide-react";

type ColorItem = { id: string; value: string; color: string };
type ColorGroup = { value: string; items: ColorItem[] };

const baseGroup: ColorGroup = {
  value: "base",
  items: (["white", "black", "transparent"] as const).map((key) => ({
    id: key,
    value: key,
    color: TAILWIND_PALETTE[key].DEFAULT,
  })),
};

const colorGroups: ColorGroup[] = Object.entries(TAILWIND_PALETTE)
  .filter(([key]) => !["white", "black", "transparent"].includes(key))
  .map(([key, colors]) => ({
    value: key,
    items: Object.entries(colors).map(([shade, color]) => ({
      id: shade === "DEFAULT" ? key : `${key}-${shade}`,
      value: shade === "DEFAULT" ? key : `${key}-${shade}`,
      color,
    })),
  }));

const groups: ColorGroup[] = [baseGroup, ...colorGroups];

export function TailwindColorsSelector({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  function handleSelect(item: ColorItem) {
    onChange?.(item.color);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger render={<Button size="icon-xs" variant="secondary" />}>
        <TailwindCSS className="text-foreground group-hover:text-accent-foreground size-4 transition-colors" />
      </Popover.Trigger>
      <Popover.Popup
        className="size-auto gap-0 overflow-hidden p-0"
        positionerProps={{
          align: "end",
        }}
      >
        <Tabs>
          <div className="flex items-center justify-between gap-4 pt-2 px-2">
            <div className="ml-2 flex items-center gap-1.5">
              <TailwindCSS className="size-4" />
              <span className="text-muted-foreground text-sm tabular-nums">
                Tailwind v4
              </span>
            </div>

            <Tabs.List>
              <Tabs.Tab value="list" className="h-7 px-2">
                <List className="h-4 w-4" />
              </Tabs.Tab>
              <Tabs.Tab value="palette" className="h-7 px-2">
                <LayoutGrid className="h-4 w-4" />
              </Tabs.Tab>
              <Tabs.Indicator className="h-7" />
            </Tabs.List>
          </div>
          <div className="px-2">
            <Separator />
          </div>

          <Tabs.Panel value="list" className="my-0 min-w-[300px]">
            <Command items={groups} className="flex h-84 flex-col border-0">
              <Command.Input placeholder="Search Tailwind colors..." />

              <Command.Empty className="text-muted-foreground p-4 text-center">
                No Tailwind color found.
              </Command.Empty>

              <Command.List>
                {(group: ColorGroup) => (
                  <Command.Group key={group.value} items={group.items}>
                    {group.value !== "base" && (
                      <Command.GroupLabel>{group.value}</Command.GroupLabel>
                    )}
                    <Command.Collection>
                      {(item: ColorItem) => (
                        <Command.Item
                          key={item.id}
                          value={item}
                          onClick={() => handleSelect(item)}
                          data-selected={item.color === value || undefined}
                          className="flex items-center gap-2"
                        >
                          <ColorSwatch
                            color={item.color}
                            name={item.value}
                            size="md"
                            isSelected={item.color === value}
                          />
                          <span>{item.value}</span>
                        </Command.Item>
                      )}
                    </Command.Collection>
                  </Command.Group>
                )}
              </Command.List>
            </Command>
          </Tabs.Panel>

          <Tabs.Panel value="palette" className="my-0 w-full">
            <ScrollArea className="h-84 w-full">
              <div className="flex flex-col gap-0.5 p-1">
                <div className="flex gap-0.5">
                  {(["white", "black", "transparent"] as const).map((key) => (
                    <ColorSwatch
                      key={key}
                      name={key}
                      color={TAILWIND_PALETTE[key].DEFAULT}
                      size="md"
                      className="rounded-none"
                      isSelected={key === value}
                      onClick={() =>
                        handleSelect({
                          id: key,
                          value: key,
                          color: TAILWIND_PALETTE[key].DEFAULT,
                        })
                      }
                    />
                  ))}
                </div>

                {Object.entries(TAILWIND_PALETTE)
                  .filter(
                    ([key]) => !["white", "black", "transparent"].includes(key)
                  )
                  .map(([key, colors]) => (
                    <div key={key} className="flex gap-0.5">
                      {Object.entries(colors).map(([shade, color]) => {
                        const itemValue =
                          shade === "DEFAULT" ? key : `${key}-${shade}`;
                        return (
                          <ColorSwatch
                            key={itemValue}
                            name={itemValue}
                            color={color}
                            size="md"
                            className="rounded-none"
                            isSelected={itemValue === value}
                            onClick={() =>
                              handleSelect({
                                id: itemValue,
                                value: itemValue,
                                color,
                              })
                            }
                          />
                        );
                      })}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </Tabs.Panel>
        </Tabs>
      </Popover.Popup>
    </Popover>
  );
}

interface ColorSwatchProps extends React.HTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
  color: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

function ColorSwatch({
  color,
  name,
  className,
  isSelected,
  size = "sm",
  ...props
}: ColorSwatchProps) {
  const sizeClasses = {
    sm: "size-5",
    md: "size-6",
    lg: "size-8",
  };

  const isTransparent = color === "transparent";

  return (
    <button
      aria-label={`Select color ${name}`}
      title={name}
      className={cn(
        "group relative cursor-pointer rounded-md border transition-all hover:z-10 hover:scale-110 hover:shadow-lg",
        isTransparent
          ? "[background-image:linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] [background-size:8px_8px] [background-position:0_0,0_4px,4px_-4px,-4px_0px]"
          : "bg-(--color)",
        sizeClasses[size],
        isSelected &&
          (isTransparent ? "ring-2 ring-border" : "ring-2 ring-(--color)"),
        className
      )}
      style={
        !isTransparent
          ? ({ "--color": color } as React.CSSProperties)
          : undefined
      }
      {...props}
    >
      <div className="group-hover:ring-foreground/50 absolute inset-0 rounded-[inherit] ring-2 ring-transparent transition-all duration-200" />
    </button>
  );
}
