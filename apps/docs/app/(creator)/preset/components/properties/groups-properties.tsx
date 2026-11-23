"use client";

import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { Button } from "@rlz/ui/components/ui/button";
import { Alert } from "@rlz/ui/components/ui/alert";
import { Input } from "@rlz/ui/components/ui/input";
import { Select } from "@rlz/ui/components/ui/select";
import { Combobox } from "@rlz/ui/components/ui/combobox";
import { partsOf } from "@rlz/ui/registry/resolve-capabilities";
import { registryComponents } from "@rlz/ui/registry/components";
import { Plus, Trash2, X, RefreshCw, Info } from "lucide-react";
import {
  styleGroupsAtom,
  selectedStyleGroupAtom,
} from "../../state/style-group-state";
import { APPEARANCE_PROPERTIES } from "../../lib/appearance-options";
import { appearanceFields, setAppearanceValue } from "../../lib/appearance";
import type { StyleGroup } from "../../lib/style-groups";
import { AppearancePart } from "./component/appearance-part";
import { CollapsibleProperties } from "../shared/collapsible-properties";
import { ClassesField } from "../shared/classes-field";
import { GroupAnimations } from "./group-animations";
import {
  updateStyleGroupAtom,
  applyGroupAppearanceAtom,
  applyGroupClassesAtom,
  reapplyStyleGroupAtom,
} from "../../state/style-group-actions";

const MEMBER_OPTIONS = Object.keys(registryComponents).flatMap((component) =>
  partsOf(component).map(({ name }) => ({
    component,
    part: name,
    label: `${component} · ${name}`,
  }))
);

export function GroupsProperties() {
  const [groups, setGroups] = useAtom(styleGroupsAtom);
  const [selectedId, setSelectedId] = useAtom(selectedStyleGroupAtom);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const updateGroup = useSetAtom(updateStyleGroupAtom);
  const applyAppearance = useSetAtom(applyGroupAppearanceAtom);
  const applyClasses = useSetAtom(applyGroupClassesAtom);
  const reapply = useSetAtom(reapplyStyleGroupAtom);
  const group = groups.find(({ id }) => id === selectedId) ?? groups[0];
  const available = MEMBER_OPTIONS.filter(
    (option) =>
      !group?.members.some(
        ({ component, part }) =>
          component === option.component && part === option.part
      )
  );

  function update(patch: Partial<StyleGroup>) {
    if (group) run(() => updateGroup(group.id, patch));
  }

  function run(action: () => void) {
    try {
      action();
      setError(null);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not apply group settings."
      );
    }
  }

  function createGroup() {
    if (!newName.trim()) return;
    const id = crypto.randomUUID();
    setGroups((previous) => [
      ...previous,
      { id, name: newName.trim(), members: [], values: {} },
    ]);
    setSelectedId(id);
    setNewName("");
  }

  let classes = group?.classes ?? "";
  for (const [prefix, value] of Object.entries(group?.values ?? {}))
    classes = setAppearanceValue(classes, prefix, value);
  const fields = appearanceFields(classes);

  return (
    <section className="flex min-w-0 flex-col gap-3 px-2 py-3">
      <p className="px-2 text-xs text-muted-foreground">
        Edit every member at once. Changes write directly to each part's
        classes, just like individual edits. The latest edit wins. Removing a
        member or group keeps its applied changes.
      </p>
      <Alert variant="info" role="note" className="mx-2 w-auto">
        <Info aria-hidden="true" />
        <Alert.Description className="text-xs">
          Values replace matching utilities; they do not add up. Applying{" "}
          <code>px-2</code> keeps an existing <code>px-2</code> unchanged and
          replaces <code>px-4</code> with <code>px-2</code>.
        </Alert.Description>
      </Alert>
      {error && (
        <p role="alert" className="px-2 text-xs text-destructive">
          {error}
        </p>
      )}
      <div className="flex items-center gap-1.5 px-2">
        <Input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="New group name"
          aria-label="New style group name"
          className="min-w-0 flex-1"
          onKeyDown={(event) => {
            if (event.key === "Enter") createGroup();
          }}
        />
        <Button
          type="button"
          size="icon-md"
          className="p-0"
          variant="outline"
          disabled={!newName.trim()}
          onClick={createGroup}
          aria-label="Create style group"
        >
          <Plus />
        </Button>
      </div>
      {!group ? (
        <p className="px-2 text-xs text-muted-foreground">
          Create a group to get started.
        </p>
      ) : (
        <>
          <div className="flex items-center gap-1 px-2">
            <Select
              value={group.id}
              onValueChange={(value) => {
                if (typeof value === "string") setSelectedId(value);
              }}
            >
              <Select.Trigger
                size="xs"
                className="min-w-0 flex-1"
                aria-label="Style group"
              >
                <Select.Value>{group.name}</Select.Value>
                <Select.Icon />
              </Select.Trigger>
              <Select.Popup>
                <Select.List>
                  {groups.map((item) => (
                    <Select.Item key={item.id} value={item.id}>
                      <Select.ItemIndicator />
                      <Select.ItemText>{item.name}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select>
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              disabled={!group.members.length}
              aria-label="Apply saved settings to all members"
              title="Apply saved settings to all members"
              onClick={() => run(() => reapply(group.id))}
            >
              <RefreshCw />
            </Button>
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              aria-label={`Delete ${group.name}`}
              onClick={() => {
                setGroups((previous) =>
                  previous.filter(({ id }) => id !== group.id)
                );
                setSelectedId(
                  groups.find(({ id }) => id !== group.id)?.id ?? ""
                );
              }}
            >
              <Trash2 />
            </Button>
          </div>
          <Input
            key={`${group.id}:${group.name}`}
            defaultValue={group.name}
            onBlur={(event) => {
              const name = event.target.value.trim();
              if (name) update({ name });
              else event.target.value = group.name;
            }}
            aria-label="Style group name"
            className="mx-2 w-auto"
          />
          {group.description && (
            <p className="px-2 text-xs text-muted-foreground">
              {group.description}
            </p>
          )}
          <CollapsibleProperties
            name={`Members (${group.members.length})`}
            defaultOpen
          >
            <div className="flex flex-col gap-2 px-2 py-2">
              {group.members.map((member) => (
                <div
                  key={`${member.component}:${member.part}`}
                  className="flex items-center justify-between gap-1 text-xs"
                >
                  <span className="min-w-0 truncate">
                    {member.component} · {member.part}
                  </span>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    aria-label={`Remove ${member.component} ${member.part}`}
                    onClick={() =>
                      update({
                        members: group.members.filter(
                          (entry) =>
                            entry.component !== member.component ||
                            entry.part !== member.part
                        ),
                      })
                    }
                  >
                    <X />
                  </Button>
                </div>
              ))}
              <Combobox
                items={available.map(({ label }) => label)}
                value={null}
                onValueChange={(label) => {
                  const member = available.find(
                    (entry) => entry.label === label
                  );
                  if (member)
                    update({
                      members: [
                        ...group.members,
                        { component: member.component, part: member.part },
                      ],
                    });
                }}
              >
                <Combobox.Field
                  placeholder="Add a component part…"
                  aria-label="Add group member"
                />
                <Combobox.Popup>
                  <Combobox.Empty>No parts found.</Combobox.Empty>
                  <Combobox.List className="max-h-64">
                    {available.map((member) => (
                      <Combobox.Item key={member.label} value={member.label}>
                        <Combobox.ItemText>{member.label}</Combobox.ItemText>
                      </Combobox.Item>
                    ))}
                  </Combobox.List>
                </Combobox.Popup>
              </Combobox>
            </div>
          </CollapsibleProperties>
          <CollapsibleProperties
            name={`Shared appearance (${fields.length})`}
            defaultOpen
          >
            <AppearancePart
              key={group.id}
              slot={group.id}
              label={group.name}
              classes={classes}
              fields={fields}
              edited={fields.length > 0}
              onValue={(prefix, value) => {
                if (
                  !APPEARANCE_PROPERTIES.some(
                    (property) => property.prefix === prefix
                  )
                )
                  return;
                run(() => applyAppearance(group.id, prefix, value));
              }}
              onRemoveValue={(prefix) => {
                run(() => applyAppearance(group.id, prefix, undefined));
              }}
            />
          </CollapsibleProperties>
          <CollapsibleProperties name="Shared classes" defaultOpen>
            <div className="flex flex-col gap-2 px-2 py-2">
              <p className="text-xs text-muted-foreground">
                These classes are merged into every member, without replacing
                its other classes. State and responsive utilities are supported.
              </p>
              <ClassesField
                target={{
                  subject: group.name,
                  builtIn: "",
                  override: group.classes ?? "",
                }}
                onClasses={(next) => run(() => applyClasses(group.id, next))}
              />
            </div>
          </CollapsibleProperties>
          <CollapsibleProperties name="Shared animations" defaultOpen>
            <GroupAnimations key={group.id} group={group} />
          </CollapsibleProperties>
        </>
      )}
    </section>
  );
}
