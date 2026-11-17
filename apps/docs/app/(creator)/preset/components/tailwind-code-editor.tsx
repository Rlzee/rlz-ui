"use client";

import * as React from "react";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  keymap,
  drawSelection,
  highlightActiveLine,
  placeholder as cmPlaceholder,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
  autocompletion,
  startCompletion,
  type CompletionContext,
  type Completion,
} from "@codemirror/autocomplete";
import {
  completionFragment,
  tailwindCompletions,
} from "../lib/tailwind-completions";

/** CodeMirror only mounts while the expanded class dialog is open. */
export function TailwindCodeEditor({
  value,
  onChange,
  onApply,
  autoFocus = true,
  colorTokens = [],
  insertRequest,
}: {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  autoFocus?: boolean;
  colorTokens?: string[];
  insertRequest?: { id: number; text: string } | null;
}) {
  const host = React.useRef<HTMLDivElement>(null);
  const view = React.useRef<EditorView | null>(null);
  const onChangeRef = React.useRef(onChange);
  const onApplyRef = React.useRef(onApply);
  const externalUpdate = React.useRef(false);
  const tokensRef = React.useRef(colorTokens);
  tokensRef.current = colorTokens;

  function complete(context: CompletionContext) {
    const before = context.state.sliceDoc(0, context.pos);
    const fragment = completionFragment(before);
    if (!fragment || (!fragment.full && !context.explicit)) return null;
    const { full, prefix, fragment: query } = fragment;
    const from = context.pos - full.length;
    const candidates = tailwindCompletions(tokensRef.current);
    const options: Completion[] = candidates
      .filter(
        (item) =>
          item.label.startsWith(query) && (!prefix || item.detail !== "Variant")
      )
      .map((item) => ({
        ...item,
        label: `${prefix}${item.label}`,
        apply: `${prefix}${item.label}`,
      }));
    return { from, options, validFor: /^[^\s]*$/ };
  }
  onChangeRef.current = onChange;
  onApplyRef.current = onApply;

  React.useEffect(() => {
    if (!host.current) return;
    const editor = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          history(),
          autocompletion({
            override: [complete],
            activateOnTyping: true,
            maxRenderedOptions: 12,
          }),
          drawSelection(),
          highlightActiveLine(),
          keymap.of([
            {
              key: "Mod-Enter",
              run: () => {
                onApplyRef.current();
                return true;
              },
            },
            { key: "Mod-Space", run: startCompletion },
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          cmPlaceholder("Enter Tailwind utility classes…"),
          EditorView.lineWrapping,
          EditorView.theme({
            "&": {
              minHeight: "240px",
              maxHeight: "55vh",
              fontSize: "13px",
              background: "transparent",
              color: "var(--foreground)",
            },
            ".cm-content": {
              padding: "12px",
              fontFamily: "var(--font-mono, ui-monospace, monospace)",
              caretColor: "var(--foreground)",
            },
            ".cm-scroller": { overflow: "auto", fontFamily: "inherit" },
            ".cm-focused": { outline: "none" },
            ".cm-cursor": { borderLeftColor: "var(--foreground)" },
            ".cm-selectionBackground": {
              backgroundColor: "var(--accent) !important",
            },
            ".cm-activeLine": {
              backgroundColor:
                "color-mix(in srgb, var(--accent) 35%, transparent)",
            },
            ".cm-placeholder": { color: "var(--muted-foreground)" },
            ".cm-tooltip-autocomplete": {
              backgroundColor: "var(--popover)",
              color: "var(--popover-foreground)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              overflow: "hidden",
            },
            ".cm-tooltip-autocomplete ul li[aria-selected]": {
              backgroundColor: "var(--accent)",
              color: "var(--accent-foreground)",
            },
            ".cm-completionInfo": {
              backgroundColor: "var(--popover)",
              color: "var(--popover-foreground)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "10px",
              maxWidth: "280px",
              fontSize: "12px",
            },
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged && !externalUpdate.current) {
              onChangeRef.current(update.state.doc.toString());
            }
          }),
        ],
      }),
    });
    view.current = editor;
    if (autoFocus) editor.focus();
    return () => {
      view.current = null;
      editor.destroy();
    };
    // Intentionally mount once: external value updates are synchronized below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const editor = view.current;
    if (!editor || editor.state.doc.toString() === value) return;
    externalUpdate.current = true;
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: value },
    });
    externalUpdate.current = false;
  }, [value]);

  const lastInsertId = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (!insertRequest || lastInsertId.current === insertRequest.id) return;
    const editor = view.current;
    if (!editor) return;
    lastInsertId.current = insertRequest.id;
    const { from, to } = editor.state.selection.main;
    const before = editor.state.sliceDoc(0, from);
    const after = editor.state.sliceDoc(to);
    const left = before && !/\\s$/.test(before) ? " " : "";
    const right = after && !/^\\s/.test(after) ? " " : "";
    const insertion = left + insertRequest.text + right;
    editor.dispatch({
      changes: { from, to, insert: insertion },
      selection: { anchor: from + insertion.length - right.length },
      scrollIntoView: true,
    });
    editor.focus();
  }, [insertRequest]);

  return (
    <div
      ref={host}
      role="group"
      aria-label="Tailwind class code editor"
      className="min-w-0 overflow-hidden rounded-md border border-input bg-background focus-within:ring-1 focus-within:ring-ring"
    />
  );
}
