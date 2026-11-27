import assert from "node:assert/strict";
import { test } from "node:test";
import { createStore } from "jotai";
import {
  CREATOR_DRAFT_KEY,
  clearLocalDraft,
  draftFingerprint,
  readLocalDraft,
  writeLocalDraft,
  DraftConflictError,
  DraftFormatError,
  type CreatorDraft,
  type DraftStorage,
} from "../lib/creator-draft";
import {
  creatorDraftContentAtom,
  restoreCreatorDraftAtom,
} from "../state/creator-draft";
import { resetPresetAtom } from "../state/preset-builder";
import { DEFAULT_ANIMATION } from "../lib/animation-model";

function fixture() {
  const store = createStore();
  store.set(resetPresetAtom);
  const empty = store.get(creatorDraftContentAtom);
  const draft: CreatorDraft = {
    ...structuredClone(empty),
    version: 1,
    createdAt: 100,
    updatedAt: 200,
  };
  draft.preset.name = "My saved theme";
  draft.edits = {
    button: {
      props: { variant: "outline" },
      partClasses: { Root: "rounded-full" },
    },
  };
  draft.groups.push({
    id: "custom",
    name: "My group",
    members: [{ component: "button", part: "Root" }],
    values: { radius: "full" },
  });
  draft.animationSettings = {
    '["dialog","Popup","enter"]': {
      mode: "custom",
      animation: structuredClone(DEFAULT_ANIMATION),
    },
  };
  return { store, empty, draft };
}
function memoryStorage() {
  const values = new Map<string, string>();
  const storage: DraftStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
  return { values, storage };
}

test("reading an empty browser creates no draft or storage entries", () => {
  const { storage, values } = memoryStorage();
  assert.deepEqual(readLocalDraft(storage, fixture().empty), { raw: null });
  assert.equal(values.size, 0);
});

test("one complete snapshot restores foundation, component edits, groups and animations", () => {
  const { store, empty, draft } = fixture();
  const { storage, values } = memoryStorage();
  const raw = writeLocalDraft(storage, draft, null);
  const read = readLocalDraft(storage, empty);
  assert.equal(read.raw, raw);
  assert.deepEqual(read.draft, draft);
  store.set(restoreCreatorDraftAtom, read.draft!);
  const { version, createdAt, updatedAt, ...content } = draft;
  assert.deepEqual(store.get(creatorDraftContentAtom), content);
  writeLocalDraft(storage, { ...draft, updatedAt: 300 }, raw);
  assert.equal(values.size, 1);
  assert.equal(readLocalDraft(storage, empty).draft!.updatedAt, 300);
});

test("draft detection ignores fresh identity, property ordering and undefined optionals", () => {
  const { empty } = fixture();
  const reordered = {
    ...empty,
    preset: { ...empty.preset, id: "another-id" },
    edits: { ...empty.edits },
  };
  assert.equal(draftFingerprint(reordered), draftFingerprint(empty));
  reordered.preset.name = "Changed";
  assert.notEqual(draftFingerprint(reordered), draftFingerprint(empty));
});

test("old local storage is offered for resume and removed only after successful migration", () => {
  const { storage, values } = memoryStorage();
  const { empty, draft } = fixture();
  storage.setItem("rlz-preset-builder", JSON.stringify(draft.preset));
  storage.setItem("rlz-component-edits", JSON.stringify(draft.edits));
  storage.setItem("rlz-style-groups", JSON.stringify(draft.groups));
  storage.setItem(
    "rlz-creator-animation-settings",
    JSON.stringify(draft.animationSettings)
  );
  storage.setItem("rlz-style-groups-batch-v1", "1");
  storage.setItem("rlz-style-group-suggestions-v2", "1");
  const read = readLocalDraft(storage, empty);
  assert.equal(read.raw, null);
  assert.equal(read.draft?.updatedAt, 0);
  assert.deepEqual(read.draft?.edits, draft.edits);
  assert.ok(values.has("rlz-preset-builder"));
  writeLocalDraft(storage, read.draft!, null);
  assert.deepEqual([...values.keys()], [CREATOR_DRAFT_KEY]);
});

test("an untouched old session is not mistaken for a draft", () => {
  const { storage } = memoryStorage();
  const { empty } = fixture();
  storage.setItem("rlz-preset-builder", JSON.stringify(empty.preset));
  assert.equal(readLocalDraft(storage, empty).draft, undefined);
});

test("invalid and future drafts remain untouched until explicitly discarded", () => {
  const { storage, values } = memoryStorage();
  const { empty, draft } = fixture();
  for (const raw of [
    "{",
    JSON.stringify({ ...draft, version: 99 }),
    JSON.stringify({ ...draft, groups: null }),
  ]) {
    storage.setItem(CREATOR_DRAFT_KEY, raw);
    assert.throws(() => readLocalDraft(storage, empty), DraftFormatError);
    assert.equal(values.get(CREATOR_DRAFT_KEY), raw);
  }
  storage.setItem("unrelated", "keep");
  clearLocalDraft(storage, storage.getItem(CREATOR_DRAFT_KEY));
  assert.deepEqual([...values.entries()], [["unrelated", "keep"]]);
});

test("a stale tab cannot overwrite or remove another tab's draft", () => {
  const { storage } = memoryStorage();
  const { draft } = fixture();
  const first = writeLocalDraft(storage, draft, null);
  const latest = writeLocalDraft(storage, { ...draft, updatedAt: 300 }, first);
  assert.throws(
    () => writeLocalDraft(storage, draft, first),
    DraftConflictError
  );
  assert.throws(() => clearLocalDraft(storage, first), DraftConflictError);
  assert.equal(storage.getItem(CREATOR_DRAFT_KEY), latest);
});

test("quota failures do not delete the previous snapshot or legacy work", () => {
  const { storage } = memoryStorage();
  const { draft } = fixture();
  const raw = writeLocalDraft(storage, draft, null);
  storage.setItem("rlz-preset-builder", JSON.stringify(draft.preset));
  const blocked: DraftStorage = {
    ...storage,
    setItem: () => {
      throw new Error("Quota exceeded");
    },
  };
  assert.throws(() => writeLocalDraft(blocked, draft, raw), /Quota exceeded/);
  assert.equal(storage.getItem(CREATOR_DRAFT_KEY), raw);
  assert.ok(storage.getItem("rlz-preset-builder"));
});
