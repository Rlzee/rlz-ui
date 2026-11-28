"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useStore } from "jotai";
import { selectedComponentAtom } from "@/hooks/use-selected-component";
import { Dialog } from "@rlz/ui/components/ui/dialog";
import { Button } from "@rlz/ui/components/ui/button";
import { LoaderCircle } from "lucide-react";
import {
  CREATOR_DRAFT_KEY,
  clearLocalDraft,
  readLocalDraft,
  DraftFormatError,
  type CreatorDraft,
  type CreatorDraftContent,
  type DraftStorage,
} from "../../lib/creator-draft";
import {
  creatorDraftContentAtom,
  draftSaveStatusAtom,
  restoreCreatorDraftAtom,
} from "../../state/creator-draft";
import { resetPresetAtom } from "../../state/preset-builder";
import { useCreatorDraftAutosave } from "../../hooks/use-creator-draft-autosave";

type Session = {
  storage?: DraftStorage;
  initial: { raw: string | null; draft?: CreatorDraft };
  empty: CreatorDraftContent;
};

/** The editor stays visible but inert; persistence waits for the user's choice. */
export function CreatorDraftSession({ children }: { children: ReactNode }) {
  const store = useStore();
  const [session, setSession] = useState<Session>();
  const [candidate, setCandidate] = useState<CreatorDraft | "invalid">();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    store.set(resetPresetAtom);
    store.set(draftSaveStatusAtom, { state: "empty" });
    const empty = store.get(creatorDraftContentAtom);
    let storage: DraftStorage | undefined;
    let raw: string | null = null;
    try {
      storage = window.localStorage;
      raw = storage.getItem(CREATOR_DRAFT_KEY);
      const initial = readLocalDraft(storage, empty);
      setSession({ storage, initial, empty });
      if (initial.draft) setCandidate(initial.draft);
      else setReady(true);
    } catch (error) {
      setSession({
        storage: error instanceof DraftFormatError ? storage : undefined,
        initial: { raw },
        empty,
      });
      if (error instanceof DraftFormatError) setCandidate("invalid");
      else {
        store.set(draftSaveStatusAtom, {
          state: "error",
          message:
            "Local storage is unavailable. Export your preset before leaving to keep your changes.",
        });
        setReady(true);
      }
    }
  }, [store]);

  const resume = () => {
    if (!candidate || candidate === "invalid") return;
    store.set(restoreCreatorDraftAtom, candidate);
    store.set(draftSaveStatusAtom, {
      state: "saved",
      updatedAt: candidate.updatedAt,
    });
    setReady(true);
  };
  const startFresh = () => {
    if (!session?.storage) return;
    try {
      clearLocalDraft(session.storage, session.initial.raw);
      store.set(resetPresetAtom);
      store.set(selectedComponentAtom, null);
      store.set(draftSaveStatusAtom, { state: "empty" });
      setSession({ ...session, initial: { raw: null } });
      setReady(true);
    } catch {
      setError(
        "The saved draft could not be removed. Reload the page and try again."
      );
    }
  };

  return (
    <>
      <div inert={!ready} aria-hidden={!ready || undefined}>
        {children}
      </div>
      {ready && session && <ActiveSession session={session} />}
      {!ready &&
        (candidate ? (
          <Dialog open onOpenChange={() => {}}>
            <Dialog.Popup showCloseButton={false}>
              <Dialog.Header>
                <Dialog.Title>
                  {candidate === "invalid"
                    ? "Unable to read your draft"
                    : "Resume your draft?"}
                </Dialog.Title>
                <Dialog.Description>
                  {candidate === "invalid"
                    ? "The saved data is invalid or comes from an unsupported version. Starting fresh will remove it."
                    : "You have an unfinished preset saved in this browser. Pick up where you left off, or start fresh."}
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                {candidate !== "invalid" && (
                  <div className="rounded-lg bg-muted/20 p-4">
                    <p className="text-sm font-medium text-foreground">
                      {candidate.preset.name.trim() || "Untitled preset"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {candidate.updatedAt
                        ? `Last saved ${new Date(
                            candidate.updatedAt
                          ).toLocaleString()}`
                        : "Saved by an earlier version of the Creator"}
                    </p>
                  </div>
                )}
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Only one draft is kept on this device. Starting fresh deletes
                  the previous draft. Nothing is uploaded or shared.
                </p>
                {error && (
                  <p role="alert" className="mt-3 text-xs text-destructive">
                    {error}
                  </p>
                )}
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={startFresh}>
                  Start fresh
                </Button>
                {candidate !== "invalid" && (
                  <Button onClick={resume} autoFocus>
                    Resume draft
                  </Button>
                )}
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog>
        ) : (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <p
              role="status"
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <LoaderCircle className="size-4 animate-spin" /> Opening Creator…
            </p>
          </div>
        ))}
    </>
  );
}

function ActiveSession({ session }: { session: Session }) {
  useCreatorDraftAutosave(session.storage, session.initial, session.empty);
  return null;
}
