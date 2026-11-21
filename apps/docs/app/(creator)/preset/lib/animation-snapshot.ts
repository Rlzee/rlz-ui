import type { PreviewPatch } from "./preset-styles";

function clonePreviewPart(
  element: HTMLElement,
  slot: string,
  patches: PreviewPatch[]
) {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));

  const originalStyle = window.getComputedStyle(element);
  for (const name of originalStyle) {
    if (!name.startsWith("--")) continue;
    const value = originalStyle.getPropertyValue(name);
    if (value.trim()) clone.style.setProperty(name, value);
  }

  clone.style.setProperty("position", "relative", "important");
  clone.style.setProperty("inset", "auto", "important");
  clone.style.setProperty("transform", "none");
  clone.style.setProperty("animation", "none", "important");
  clone.style.setProperty("transition", "none", "important");
  clone.style.maxHeight = "100%";
  clone.style.maxWidth = "100%";

  for (const patch of patches.filter((patch) => patch.slot === slot)) {
    const classes = new Set((clone.getAttribute("class") ?? "").split(/\s+/));
    if (!patch.wholeSlot && !patch.remove.every((name) => classes.has(name)))
      continue;
    patch.remove.forEach((name) => classes.delete(name));
    patch.add.forEach((name) => classes.add(name));
    clone.setAttribute("class", [...classes].filter(Boolean).join(" "));
  }
  return clone;
}

/** Capture a lazily mounted part, opening its demo if the part lives in a portal. */
export function captureAnimationSnapshot({
  source,
  slot,
  patches,
  onCapture,
  onError,
}: {
  source: HTMLElement;
  slot: string;
  patches: PreviewPatch[];
  onCapture: (snapshot: HTMLElement) => void;
  onError: (message: string) => void;
}) {
  const selector = `[data-slot="${CSS.escape(slot)}"]`;
  const needsOpening = /popup|content|viewport|listbox/i.test(slot);
  const existingPortals = new Set(
    document.querySelectorAll<HTMLElement>(selector)
  );
  let disposed = false;
  let captured = false;
  let opened = false;
  let openingAt = 0;
  let pendingFrame: number | undefined;
  let backdropGuard: HTMLStyleElement | null = null;
  let closeTimer: number | undefined;

  const suppressBackdrop = () => {
    if (backdropGuard) return;
    backdropGuard = document.createElement("style");
    backdropGuard.dataset.animationStudioBackdropGuard = "";
    backdropGuard.textContent = `
      [data-slot$="-backdrop"],
      [data-slot$="-overlay"],
      [data-slot="dialog-backdrop"],
      [data-slot="alert-dialog-backdrop"] {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
    `;
    document.head.appendChild(backdropGuard);
  };
  const releaseBackdrop = () => {
    backdropGuard?.remove();
    backdropGuard = null;
  };

  const copy = (element: HTMLElement) => {
    if (disposed || captured) return;
    captured = true;
    onCapture(clonePreviewPart(element, slot, patches));
    if (!source.contains(element)) {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Escape",
          code: "Escape",
          bubbles: true,
          cancelable: true,
        })
      );
      closeTimer = window.setTimeout(releaseBackdrop, 250);
    } else {
      releaseBackdrop();
    }
  };

  const find = () => {
    const local = source.querySelector<HTMLElement>(selector);
    if (local) {
      copy(local);
      return true;
    }
    if (opened) {
      const external = [
        ...document.querySelectorAll<HTMLElement>(selector),
      ].find(
        (node) =>
          !existingPortals.has(node) &&
          !source.contains(node) &&
          !node.closest("[data-animation-studio-snapshot]")
      );
      if (external) {
        copy(external);
        return true;
      }
    }
    return false;
  };

  const attempt = () => {
    if (disposed || captured || find()) return;
    if (!needsOpening || opened) return;
    const trigger = source.querySelector<HTMLElement>(
      '[data-slot$="-trigger"], button, [role="combobox"], input'
    );
    if (!trigger) return;
    opened = true;
    openingAt = performance.now();
    suppressBackdrop();
    if (trigger instanceof HTMLInputElement) {
      trigger.focus();
      trigger.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      trigger.click();
    }
  };

  const schedule = () => {
    if (pendingFrame !== undefined || disposed || captured) return;
    pendingFrame = requestAnimationFrame(() => {
      pendingFrame = undefined;
      attempt();
    });
  };
  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true });
  schedule();

  const retryId = window.setInterval(() => {
    if (disposed || captured) return;
    attempt();
    if (opened && performance.now() - openingAt > 1200 && !captured) {
      onError(
        "Unable to open this part automatically. Try another example or part."
      );
      releaseBackdrop();
    }
  }, 100);
  const timeoutId = window.setTimeout(() => {
    if (!disposed && !captured) {
      onError(
        "Preview unavailable: the component or its popup did not appear."
      );
      releaseBackdrop();
    }
  }, 4500);

  return () => {
    disposed = true;
    observer.disconnect();
    if (pendingFrame !== undefined) cancelAnimationFrame(pendingFrame);
    window.clearInterval(retryId);
    window.clearTimeout(timeoutId);
    window.clearTimeout(closeTimer);
    releaseBackdrop();
  };
}
