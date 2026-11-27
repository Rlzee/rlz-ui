import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { after, before, test } from "node:test";
import { chromium, type Browser, type Frame, type Page } from "playwright";
import { sourcePreviewComponents } from "../lib/source-preview/catalog";
import { playgroundExamples } from "../lib/playground-examples";
import { defaultPreset } from "@rlz/ui/styles/presets";
import type { PresetComponentCustomization } from "@rlz/registry";
import type { PlaygroundState } from "../lib/playground-state";

declare global {
  interface Window {
    __rlzTestState: PlaygroundState;
    __rlzTestFrame: HTMLIFrameElement;
    __rlzTestNodes: Record<string, Element | null>;
  }
}

let browser: Browser;
let page: Page;
let frame: Frame;
let currentSlug = "button";
let currentEdits = "{}";
let navigations = 0;
const pageErrors: string[] = [];
const baseUrl = process.env.RLZ_PREVIEW_URL ?? "http://localhost:3000";
const edits = (component: string, value: PresetComponentCustomization) => ({
  [component]: value,
});

async function ready(slug: string) {
  const root = frame.locator(`[data-source-preview="${slug}"]`);
  await root.waitFor({ timeout: 90_000 });
  await root
    .locator('[data-preview-status="pending"]')
    .waitFor({ state: "hidden", timeout: 90_000 });
  const errors = await root
    .locator('[data-preview-status="error"]')
    .allTextContents();
  assert.deepEqual(errors, [], `${slug}: ${errors.join("; ")}`);
  // Modal dialogs intentionally aria-hide the canvas sections behind them.
  await root.locator('section[aria-label="Preset preview"]').waitFor();
}

async function select(slug: string, nextEdits: PlaygroundState["edits"] = {}) {
  const serialized = JSON.stringify(nextEdits);
  const changed = slug !== currentSlug || serialized !== currentEdits;
  const response = changed
    ? page.waitForResponse(
        (response) => {
          if (!response.url().endsWith("/preset/preview/source/compile"))
            return false;
          const body = response.request().postDataJSON();
          return (
            body.slug === slug && JSON.stringify(body.edits) === serialized
          );
        },
        { timeout: 90_000 }
      )
    : undefined;
  await page.evaluate(
    ({ slug, nextEdits }) => {
      window.__rlzTestState.selected = { id: slug };
      window.__rlzTestState.edits = nextEdits;
      window.__rlzTestFrame.contentWindow!.postMessage(
        { type: "rlz:playground:state", state: window.__rlzTestState },
        location.origin
      );
    },
    { slug, nextEdits }
  );
  if (response) {
    const result = await response;
    assert.equal(result.status(), 200, `${slug}: ${await result.text()}`);
    await result.finished();
  }
  currentSlug = slug;
  currentEdits = serialized;
  await ready(slug);
}

const scenario = (slug: string) =>
  frame.locator(`[data-preview-scenario="${slug}"]`);
const popup = (slot: string) =>
  frame.locator(`[data-slot="${slot}"]`).filter({ visible: true });

before(
  async () => {
    const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
    browser = await chromium.launch({
      headless: true,
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
        (process.platform === "win32" && existsSync(edge) ? edge : undefined),
    });
    page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("request", (request) => {
      if (
        request.isNavigationRequest() &&
        request.frame() !== page.mainFrame() &&
        new URL(request.url()).pathname === "/preset/preview"
      )
        navigations++;
    });
    await page.goto(`${baseUrl}/preset/preview`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    await page.evaluate((preset) => {
      const iframe = document.createElement("iframe");
      iframe.src = "/preset/preview";
      iframe.style.cssText = "width:100%;height:1000px";
      window.__rlzTestFrame = iframe;
      window.__rlzTestState = {
        preset,
        edits: {},
        selected: { id: "button" },
        groups: [],
        selectedGroup: "",
        dark: false,
      };
      window.addEventListener("message", (event) => {
        if (
          event.source === iframe.contentWindow &&
          event.data?.type === "rlz:playground:ready"
        )
          iframe.contentWindow!.postMessage(
            { type: "rlz:playground:state", state: window.__rlzTestState },
            location.origin
          );
      });
      document.body.appendChild(iframe);
    }, structuredClone(defaultPreset));
    await page
      .frameLocator("iframe")
      .locator('[data-source-preview="button"] section')
      .first()
      .waitFor({ timeout: 120_000 });
    frame = page
      .frames()
      .find((frame) => frame.parentFrame() === page.mainFrame())!;
    await ready("button");
  },
  { timeout: 180_000 }
);

after(async () => {
  await browser?.close();
});

test(
  "every public component renders with its full scenario catalog in the same live canvas",
  { timeout: 600_000 },
  async () => {
    const failures: string[] = [];
    for (const [slug, item] of Object.entries(sourcePreviewComponents)) {
      if (item.allowManualInstall === false) continue;
      try {
        await select(slug);
        const examples = playgroundExamples(slug);
        assert.ok(examples.length, `${slug}: missing examples`);
        const selector = frame.getByRole("combobox", {
          name: "Preview scenario",
          exact: true,
        });
        await selector.click();
        await frame.waitForFunction(() => {
          const trigger = document.querySelector(
            '[aria-label="Preview scenario"]'
          );
          return (
            trigger?.getAttribute("aria-expanded") === "true" &&
            trigger.hasAttribute("aria-controls")
          );
        });
        const popupId = await selector.getAttribute("aria-controls");
        assert.ok(popupId);
        const scenarioList = frame.locator(`[id="${popupId}"]`);
        await scenarioList.waitFor({ state: "visible" });
        await scenarioList.getByRole("option").first().waitFor();
        assert.equal(
          await scenarioList.getByRole("option").count(),
          examples.length + 1,
          slug
        );
        await selector.press("Escape");
        await scenarioList.waitFor({ state: "hidden" });
        assert.equal(
          await frame
            .getByText("compatibility styling", { exact: false })
            .count(),
          0
        );
      } catch (error) {
        failures.push(`${slug}: ${String(error)}`);
      }
    }
    assert.deepEqual(failures, []);
    assert.deepEqual(pageErrors, []);
    assert.equal(navigations, 1);
  }
);

test(
  "text, focus and tab selection survive source class edits",
  { timeout: 120_000 },
  async () => {
    await select("input");
    const input = scenario("input").locator('[data-slot="input"]');
    await input.fill("Preserved value");
    await input.focus();
    await frame.evaluate(() => {
      window.__rlzTestNodes = { input: document.activeElement };
    });
    const classes = await input.getAttribute("class");
    await select(
      "input",
      edits("input", {
        partClasses: {
          Root: `${classes} outline outline-4 outline-fuchsia-500`,
        },
      })
    );
    assert.equal(await input.inputValue(), "Preserved value");
    assert.ok(
      await input.evaluate(
        (element) =>
          element === window.__rlzTestNodes.input &&
          element === document.activeElement
      )
    );
    await select("tabs");
    const security = scenario("tabs").getByRole("tab", {
      name: "Security",
      exact: true,
    });
    await security.click();
    assert.equal(await security.getAttribute("aria-selected"), "true");
    await select(
      "tabs",
      edits("tabs", { partClasses: { Panel: "rounded-xl border p-8" } })
    );
    assert.equal(await security.getAttribute("aria-selected"), "true");
  }
);

test(
  "advanced documentation scenarios are selectable and survive style updates",
  { timeout: 120_000 },
  async () => {
    await select("button");
    const advanced = playgroundExamples("button").find(
      ({ path }) =>
        !["default", "disabled", "loading"].includes(path.split("/").pop()!)
    )!;
    assert.ok(advanced);
    const selector = frame.getByRole("combobox", {
      name: "Preview scenario",
      exact: true,
    });
    await selector.click();
    await frame
      .getByRole("option", { name: advanced.label, exact: true })
      .click();
    await scenario(advanced.key).waitFor();
    assert.equal(await scenario("button").count(), 0);
    await select(
      "button",
      edits("button", { partClasses: { Root: "rounded-full p-3" } })
    );
    assert.equal(await selector.textContent(), advanced.label);
    await scenario(advanced.key).waitFor();
  }
);

test(
  "combobox data and selected value survive source edits",
  { timeout: 120_000 },
  async () => {
    await select("combobox");
    const input = scenario("combobox").getByRole("combobox");
    await input.fill("Type");
    await frame
      .getByRole("option", { name: "TypeScript", exact: true })
      .click();
    const before = await input.inputValue();
    assert.ok(before.includes("TypeScript"));
    await select(
      "combobox",
      edits("combobox", {
        partClasses: { Input: "h-10 rounded-xl outline outline-2" },
      })
    );
    assert.equal(await input.inputValue(), before);
  }
);

test(
  "open overlays keep their DOM, input value and focus while styling changes",
  { timeout: 180_000 },
  async () => {
    for (const [slug, trigger] of [
      ["dialog", "Open Dialog"],
      ["drawer", "Edit profile"],
    ] as const) {
      await select(slug);
      await scenario(slug)
        .getByRole("button", { name: trigger, exact: true })
        .click();
      const overlay = popup(`${slug}-popup`);
      await overlay.waitFor();
      const input = overlay.locator("input").first();
      await input.fill("Kept in the overlay");
      await input.focus();
      await frame.evaluate((slot) => {
        window.__rlzTestNodes = {
          popup: document.querySelector(`[data-slot="${slot}-popup"]`),
          header: document.querySelector(`[data-slot="${slot}-header"]`),
          input: document.activeElement,
        };
      }, slug);
      const header = overlay.locator(`[data-slot="${slug}-header"]`);
      const classes = await header.getAttribute("class");
      await select(
        slug,
        edits(slug, {
          partClasses: {
            Header: `${classes} outline outline-4 outline-fuchsia-500`,
          },
        })
      );
      assert.equal(await input.inputValue(), "Kept in the overlay");
      assert.ok(
        await overlay.evaluate(
          (element) => element === window.__rlzTestNodes.popup
        )
      );
      assert.ok(
        await header.evaluate(
          (element) => element === window.__rlzTestNodes.header
        )
      );
      assert.ok(
        await input.evaluate(
          (element) =>
            element === window.__rlzTestNodes.input &&
            element === document.activeElement
        )
      );
      await input.press("Escape");
      await overlay.waitFor({ state: "hidden" });
    }
    assert.equal(navigations, 1);
  }
);

test(
  "a composed popup receives a new variant through its real consuming part",
  { timeout: 120_000 },
  async () => {
    await select(
      "tooltip",
      edits("tooltip", {
        props: { variant: "brand" },
        variants: {
          variant: [
            { value: "primary" },
            { value: "outline" },
            {
              value: "brand",
              partClasses: { Popup: "bg-[#132768] text-white" },
            },
          ],
        },
      })
    );
    // Previous scenarios can leave the pointer at the new trigger's coordinates.
    await page.mouse.move(0, 0);
    await scenario("tooltip")
      .getByRole("button", { name: "Hover Me", exact: true })
      .hover();
    const tooltip = popup("tooltip-popup");
    await tooltip.waitFor();
    assert.ok((await tooltip.getAttribute("class"))!.includes("bg-[#132768]"));
    await page.mouse.move(0, 0);
    await select(
      "menu",
      edits("menu", {
        props: { variant: "brand" },
        variants: {
          variant: [
            ...["default", "destructive", "solid", "switch"].map((value) => ({
              value,
            })),
            {
              value: "brand",
              partClasses: {
                Item: "text-fuchsia-600",
                CheckboxItem: "text-fuchsia-600",
              },
            },
          ],
        },
      })
    );
    await scenario("menu")
      .getByRole("button", { name: "Open", exact: true })
      .click();
    const menu = popup("menu-popup");
    await menu.waitFor();
    assert.ok(
      (await menu
        .getByRole("menuitem", { name: /Forward/ })
        .getAttribute("class"))!.includes("text-fuchsia-600")
    );
    const switchItem = menu.getByRole("menuitemcheckbox", {
      name: "Autosave",
      exact: true,
    });
    assert.ok(
      !(await switchItem.getAttribute("class"))!.includes("text-fuchsia-600")
    );
    await menu.press("Escape");
    assert.deepEqual(pageErrors, []);
  }
);

test(
  "toast managers retain active notifications while dependencies are restyled",
  { timeout: 120_000 },
  async () => {
    await select("toast");
    const trigger = scenario("toast").getByRole("button", {
      name: "Show toast",
      exact: true,
    });
    await trigger.click();
    const title = frame
      .locator('[data-slot="toast-title"]')
      .filter({ hasText: "Changes saved" })
      .first();
    await title.waitFor();
    await title.evaluate((element) => {
      window.__rlzTestNodes = { toast: element };
    });
    const classes = await trigger.getAttribute("class");
    await select(
      "toast",
      edits("button", { partClasses: { Root: `${classes} outline outline-2` } })
    );
    assert.ok(await title.isVisible());
    assert.ok(
      await title.evaluate((element) => element === window.__rlzTestNodes.toast)
    );
    assert.equal(navigations, 1);
    assert.deepEqual(pageErrors, []);
  }
);
