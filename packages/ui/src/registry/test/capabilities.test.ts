import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveComponentCapabilities } from "@rlz/registry";

import { REGISTRY } from "../index";
import { capabilitiesOf, partsOf, variantClassesOf } from "../resolve-capabilities";

test("a full exclusion wins over detected capabilities and later overrides", () => {
  assert.equal(
    resolveComponentCapabilities(
      {
        variants: [{ name: "size", values: ["sm"] }],
        parts: ["Root"],
        editableProperties: ["arrow"],
      },
      { exclude: true },
      {
        variants: [{ name: "size", values: ["lg"] }],
        parts: ["Popup"],
        editableProperties: ["blur"],
      }
    ),
    undefined
  );
});

test("individual exclusions still preserve the other capabilities", () => {
  const result = resolveComponentCapabilities(
    { parts: ["Root", "Portal"], editableProperties: ["arrow"] },
    { exclude: { parts: ["Portal"] } }
  );

  assert.deepEqual(result?.parts, ["Root"]);
  assert.deepEqual(result?.editableProperties, ["arrow"]);
});

test("context-menu exposes no registry customization", () => {
  assert.equal(capabilitiesOf("context-menu"), undefined);
  assert.deepEqual(partsOf("context-menu"), []);
  assert.equal(variantClassesOf("context-menu"), undefined);
  assert.equal(REGISTRY.items["context-menu"].capabilities, undefined);
});

test("menu remains customizable independently of context-menu", () => {
  assert.ok(capabilitiesOf("menu"));
  assert.ok(partsOf("menu").length > 0);
});

test("form exposes no registry customization", () => {
  assert.equal(capabilitiesOf("form"), undefined);
  assert.deepEqual(partsOf("form"), []);
  assert.equal(variantClassesOf("form"), undefined);
  assert.equal(REGISTRY.items.form.capabilities, undefined);
});

test("collapsible keeps only its styled panel editable", () => {
  assert.deepEqual(capabilitiesOf("collapsible")?.parts, ["Panel"]);
  assert.deepEqual(partsOf("collapsible").map((part) => part.name), ["Panel"]);
});

test("alert-dialog hides positioning and blur but keeps visual customization", () => {
  const capabilities = capabilitiesOf("alert-dialog");

  assert.ok(capabilities?.parts?.includes("Popup"));
  assert.ok(capabilities?.editableProperties?.includes("backdrop"));
  assert.ok(!capabilities?.editableProperties?.includes("blur"));
  assert.ok(!capabilities?.editableProperties?.includes("backdropBlur"));
  assert.ok(!partsOf("alert-dialog").some((part) => part.name === "Viewport"));
  assert.ok(partsOf("alert-dialog").some((part) => part.name === "Popup"));
});
