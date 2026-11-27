import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { after, before, test } from "node:test";
import { chromium, type Browser, type Page } from "playwright";
import { createStore } from "jotai";
import { creatorDraftContentAtom } from "../state/creator-draft";
import { CREATOR_DRAFT_KEY, type CreatorDraft } from "../lib/creator-draft";
import { DEFAULT_ANIMATION } from "../lib/animation-model";

let browser: Browser;
const baseUrl = process.env.RLZ_PREVIEW_URL ?? "http://localhost:3000";
before(async () => {
  const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
  browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
      (process.platform === "win32" && existsSync(edge) ? edge : undefined),
  });
});
after(async () => {
  await browser?.close();
});

async function open(page: Page) {
  await page.goto(`${baseUrl}/preset/create`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
}
const nameInput = (page: Page) =>
  page.getByRole("textbox", { name: "Preset name", exact: true });
async function saved(page: Page, name: string) {
  await page.waitForFunction(
    ({ key, name }) => {
      const raw = localStorage.getItem(key);
      return raw && JSON.parse(raw).preset.name === name;
    },
    { key: CREATOR_DRAFT_KEY, name }
  );
}
async function seed(page: Page, raw: string) {
  await open(page);
  await nameInput(page).waitFor();
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: CREATOR_DRAFT_KEY,
    raw,
  });
  await page.reload();
}

test(
  "an untouched visit creates no draft and asks no resume question",
  { timeout: 120_000 },
  async () => {
    const page = await browser.newPage();
    try {
      await open(page);
      await nameInput(page).waitFor();
      assert.equal(
        await page.evaluate(
          (key) => localStorage.getItem(key),
          CREATOR_DRAFT_KEY
        ),
        null
      );
      await page.reload();
      await nameInput(page).waitFor();
      assert.equal(
        await page
          .getByRole("button", { name: "Resume draft", exact: true })
          .count(),
        0
      );
      assert.equal(
        await page.evaluate(
          (key) => localStorage.getItem(key),
          CREATOR_DRAFT_KEY
        ),
        null
      );
    } finally {
      await page.close();
    }
  }
);

test(
  "changes save automatically, reload offers resume, and start fresh removes the only draft",
  { timeout: 120_000 },
  async () => {
    const page = await browser.newPage();
    try {
      await open(page);
      await nameInput(page).fill("My local theme");
      await saved(page, "My local theme");
      await page.reload();
      await page
        .getByRole("button", { name: "Resume draft", exact: true })
        .waitFor();
      assert.equal(await nameInput(page).count(), 0);
      await page
        .getByRole("button", { name: "Resume draft", exact: true })
        .click();
      assert.equal(await nameInput(page).inputValue(), "My local theme");
      await nameInput(page).fill("Last keystroke");
      // pagehide must flush even before the debounce finishes.
      await page.reload();
      await page.getByText("Last keystroke", { exact: true }).waitFor();
      await page
        .getByRole("button", { name: "Start fresh", exact: true })
        .click();
      await nameInput(page).waitFor();
      assert.notEqual(await nameInput(page).inputValue(), "Last keystroke");
      assert.equal(
        await page.evaluate(
          (key) => localStorage.getItem(key),
          CREATOR_DRAFT_KEY
        ),
        null
      );
    } finally {
      await page.close();
    }
  }
);

test(
  "resuming preserves component, group and animation edits in the next autosave",
  { timeout: 120_000 },
  async () => {
    const page = await browser.newPage();
    try {
      const content = structuredClone(
        createStore().get(creatorDraftContentAtom)
      );
      content.preset.name = "Complete draft";
      content.preset.base!.layout.radius = 1.25;
      content.edits = { button: { partClasses: { Root: "rounded-full" } } };
      content.groups.push({
        id: "mine",
        name: "My group",
        members: [],
        values: { gap: "4" },
      });
      content.animationSettings = {
        '["dialog","Popup","enter"]': {
          mode: "custom",
          animation: structuredClone(DEFAULT_ANIMATION),
        },
      };
      const draft: CreatorDraft = {
        ...content,
        version: 1,
        createdAt: 100,
        updatedAt: 200,
      };
      await seed(page, JSON.stringify(draft));
      await page
        .getByRole("button", { name: "Resume draft", exact: true })
        .click();
      await nameInput(page).fill("Complete draft updated");
      await saved(page, "Complete draft updated");
      const stored = await page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)!),
        CREATOR_DRAFT_KEY
      );
      assert.deepEqual(stored.edits, content.edits);
      assert.deepEqual(stored.groups, content.groups);
      assert.deepEqual(stored.animationSettings, content.animationSettings);
      assert.equal(stored.preset.base.layout.radius, 1.25);
      assert.equal(stored.createdAt, 100);
    } finally {
      await page.close();
    }
  }
);

test(
  "invalid data is not silently overwritten, and unavailable storage is clearly reported",
  { timeout: 120_000 },
  async () => {
    const page = await browser.newPage();
    try {
      await seed(page, "{invalid");
      await page
        .getByRole("heading", {
          name: "Unable to read your draft",
          exact: true,
        })
        .waitFor();
      assert.equal(
        await page.evaluate(
          (key) => localStorage.getItem(key),
          CREATOR_DRAFT_KEY
        ),
        "{invalid"
      );
      await page
        .getByRole("button", { name: "Start fresh", exact: true })
        .click();
      await nameInput(page).waitFor();
      await page.evaluate((key) => {
        const setItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function (name, value) {
          if (name === key)
            throw new DOMException("Quota exceeded", "QuotaExceededError");
          return setItem.call(this, name, value);
        };
      }, CREATOR_DRAFT_KEY);
      await nameInput(page).fill("Not saved");
      await page
        .getByRole("alert")
        .filter({ hasText: "Local autosave is unavailable" })
        .waitFor();
      assert.equal(
        await page.evaluate(
          (key) => localStorage.getItem(key),
          CREATOR_DRAFT_KEY
        ),
        null
      );
    } finally {
      await page.close();
    }
  }
);

test(
  "two tabs cannot silently overwrite each other's local draft",
  { timeout: 120_000 },
  async () => {
    const context = await browser.newContext();
    const first = await context.newPage();
    const second = await context.newPage();
    try {
      await open(first);
      await nameInput(first).waitFor();
      await open(second);
      await nameInput(second).waitFor();
      await nameInput(first).fill("First tab");
      await saved(first, "First tab");
      await nameInput(second).fill("Second tab");
      await second
        .getByRole("alert")
        .filter({ hasText: "Another tab changed" })
        .waitFor();
      assert.equal(
        await second.evaluate(
          (key) => JSON.parse(localStorage.getItem(key)!).preset.name,
          CREATOR_DRAFT_KEY
        ),
        "First tab"
      );
    } finally {
      await context.close();
    }
  }
);
