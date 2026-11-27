"use client";

import { useEffect } from "react";
import { useStore } from "jotai";
import {
  clearLocalDraft,
  draftFingerprint,
  writeLocalDraft,
  DraftConflictError,
  type CreatorDraft,
  type CreatorDraftContent,
  type DraftStorage,
} from "../lib/creator-draft";
import {
  creatorDraftContentAtom,
  draftSaveStatusAtom,
} from "../state/creator-draft";

export function useCreatorDraftAutosave(
  storage: DraftStorage | undefined,
  initial: { raw: string | null; draft?: CreatorDraft },
  empty: CreatorDraftContent
) {
  const store = useStore();
  useEffect(() => {
    if (!storage) return;
    let raw = initial.raw;
    let createdAt = initial.draft?.createdAt || undefined;
    let lastContent = JSON.stringify(store.get(creatorDraftContentAtom));
    let dirty = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const emptyFingerprint = draftFingerprint(empty);
    const flush = () => {
      clearTimeout(timer);
      if (!dirty) return;
      try {
        const content = store.get(creatorDraftContentAtom);
        if (draftFingerprint(content) === emptyFingerprint) {
          clearLocalDraft(storage, raw);
          raw = null;
          createdAt = undefined;
          store.set(draftSaveStatusAtom, { state: "empty" });
        } else {
          const now = Date.now();
          raw = writeLocalDraft(
            storage,
            {
              ...content,
              version: 1,
              createdAt: createdAt ?? now,
              updatedAt: now,
            },
            raw
          );
          createdAt ??= now;
          store.set(draftSaveStatusAtom, { state: "saved", updatedAt: now });
        }
        lastContent = JSON.stringify(content);
        dirty = false;
      } catch (error) {
        store.set(draftSaveStatusAtom, {
          state: "error",
          message:
            error instanceof DraftConflictError
              ? error.message
              : "Local autosave is unavailable. Export your preset before leaving to keep your changes.",
        });
      }
    };
    const unsubscribe = store.sub(creatorDraftContentAtom, () => {
      if (JSON.stringify(store.get(creatorDraftContentAtom)) === lastContent)
        return;
      dirty = true;
      store.set(draftSaveStatusAtom, { state: "saving" });
      clearTimeout(timer);
      timer = setTimeout(flush, 400);
    });
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      unsubscribe();
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
      flush();
    };
  }, [store, storage, initial, empty]);
}
