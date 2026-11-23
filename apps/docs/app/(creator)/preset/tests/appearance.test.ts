import assert from "node:assert/strict";
import test from "node:test";
import {
  appearanceFields,
  appearanceConflicts,
  setAppearanceValue,
} from "../lib/appearance";

test("border widths, styles and radius are recognized independently of colors", () => {
  const fields = appearanceFields(
    "border border-x-2 border-y-4 border-t-[1.5px] border-r-0 border-b-8 border-l-1 border-s-2 border-e-4 border-dashed rounded-lg border-border border-t-primary/50"
  );
  assert.deepEqual(
    fields.map(({ prefix, value }) => [prefix, value]),
    [
      ["border", ""],
      ["border-x", "2"],
      ["border-y", "4"],
      ["border-t", "[1.5px]"],
      ["border-r", "0"],
      ["border-b", "8"],
      ["border-l", "1"],
      ["border-s", "2"],
      ["border-e", "4"],
      ["border-style", "dashed"],
      ["rounded", "lg"],
    ]
  );
});

test("border edits preserve color tokens, variants and other border properties", () => {
  const classes =
    "border border-border border-t-primary border-dashed rounded-lg hover:border-4";
  assert.equal(
    setAppearanceValue(classes, "border", "2"),
    "border-2 border-border border-t-primary border-dashed rounded-lg hover:border-4"
  );
  assert.equal(
    setAppearanceValue(classes, "border-style", "solid"),
    "border border-border border-t-primary border-solid rounded-lg hover:border-4"
  );
  assert.equal(
    setAppearanceValue(classes, "border", ""),
    "border-border border-t-primary border-dashed rounded-lg hover:border-4"
  );
  assert.equal(setAppearanceValue(classes, "border", "primary"), classes);
  assert.equal(setAppearanceValue(classes, "border-style", "primary"), classes);
});

test("arbitrary border lengths do not capture arbitrary colors", () => {
  for (const value of [
    "3",
    "[0.5px]",
    "[length:var(--width)]",
    "(length:--width)",
    "[calc(1px+1px)]",
  ]) {
    assert.equal(appearanceFields(`border-t-${value}`)[0]?.value, value);
  }
  assert.deepEqual(
    appearanceFields(
      "border-[#fff] border-[color:var(--border)] border-t-(--color) border-r-[rgb(0_0_0)]"
    ),
    []
  );
});

test("border width overlaps are separate from radius, style and color", () => {
  assert.deepEqual(
    appearanceConflicts(
      "border-2 border-t-4 border-dotted rounded-lg border-border"
    ),
    [{ first: "border-2", second: "border-t-4" }]
  );
});

test("dimensions accept named, numeric, fractional and arbitrary values", () => {
  for (const [prefix, value] of [
    ["max-w", "sm"],
    ["w", "64"],
    ["w", "1/2"],
    ["h", "[320px]"],
    ["min-h", "screen"],
    ["size", "8"],
    ["max-w", "(--panel-width)"],
  ]) {
    const classes = setAppearanceValue("", prefix!, value!);
    assert.deepEqual(
      appearanceFields(classes).map(({ prefix, value }) => [prefix, value]),
      [[prefix, value]]
    );
  }
  assert.deepEqual(appearanceConflicts("size-8 w-4"), [
    { first: "size-8", second: "w-4" },
  ]);
});

test("alignment updates preserve text size, colors and unrelated utilities", () => {
  const classes = "text-sm text-primary text-left items-center justify-between";
  assert.equal(
    setAppearanceValue(classes, "text-align", "right"),
    "text-sm text-primary text-right items-center justify-between"
  );
  assert.equal(
    setAppearanceValue(classes, "text", "lg"),
    classes.replace("text-sm", "text-lg")
  );
  assert.equal(setAppearanceValue(classes, "justify", "items-center"), classes);
  assert.deepEqual(
    appearanceFields("justify-items-center items-center-safe"),
    []
  );
});

test("shadow sizes do not capture shadow colors; opacity validates its range", () => {
  assert.equal(
    setAppearanceValue("shadow-sm shadow-red-500/30", "shadow", "lg"),
    "shadow-lg shadow-red-500/30"
  );
  assert.equal(appearanceFields("shadow")[0]?.value, "");
  assert.equal(
    appearanceFields("shadow-[0_2px_4px_rgb(0_0_0/0.2)]")[0]?.prefix,
    "shadow"
  );
  assert.deepEqual(
    appearanceFields("shadow-[#fff] shadow-(color:--shadow-color)"),
    []
  );
  assert.equal(
    setAppearanceValue("opacity-100", "opacity", "50"),
    "opacity-50"
  );
  assert.equal(
    setAppearanceValue("opacity-100", "opacity", "101"),
    "opacity-100"
  );
});

test("reads all margin families including negative and auto values", () => {
  const fields = appearanceFields(
    "m-4 mx-auto my-2 -mt-3 mr-1 mb-6 ml-0 ms-2 me-4 md:mx-8 -p-2"
  );
  assert.deepEqual(
    fields.map(({ prefix, value }) => [prefix, value]),
    [
      ["m", "4"],
      ["mx", "auto"],
      ["my", "2"],
      ["mt", "-3"],
      ["mr", "1"],
      ["mb", "6"],
      ["ml", "0"],
      ["ms", "2"],
      ["me", "4"],
    ]
  );
});

test("updates margin signs and removes both positive and negative duplicates", () => {
  assert.equal(
    setAppearanceValue("mt-2 -mt-4 p-3 md:mt-6", "mt", "-1.5"),
    "-mt-1.5 p-3 md:mt-6"
  );
  assert.equal(setAppearanceValue("-mt-4 p-3", "mt", "2"), "mt-2 p-3");
  assert.equal(setAppearanceValue("-mt-4 p-3", "mt", ""), "p-3");
  assert.equal(setAppearanceValue("mx-2", "mx", "auto"), "mx-auto");
  assert.equal(setAppearanceValue("", "ml", "-[12px]"), "-ml-[12px]");
});

test("margin conflicts stay separate from padding and gap", () => {
  assert.deepEqual(appearanceConflicts("m-4 -mt-2 p-4 gap-2"), [
    { first: "m-4", second: "-mt-2" },
  ]);
});

test("reads typography without treating colors or font families as editable sizes/weights", () => {
  const fields = appearanceFields(
    "text-sm text-primary text-center font-sans font-semibold leading-6 tracking-wide md:text-lg hover:font-bold"
  );
  assert.deepEqual(fields, [
    { prefix: "text-align", label: "Text align", value: "center" },
    { prefix: "text", label: "Font size", value: "sm" },
    { prefix: "font", label: "Font weight", value: "semibold" },
    { prefix: "leading", label: "Line height", value: "6" },
    { prefix: "tracking", label: "Letter spacing", value: "wide" },
  ]);
});

test("updates and removes only the intended typography family", () => {
  const classes = "text-sm text-red-500 font-sans font-medium md:text-lg";
  assert.equal(
    setAppearanceValue(classes, "text", "xl"),
    "text-xl text-red-500 font-sans font-medium md:text-lg"
  );
  assert.equal(
    setAppearanceValue(classes, "font", ""),
    "text-sm text-red-500 font-sans md:text-lg"
  );
  assert.equal(setAppearanceValue(classes, "text", "red-500"), classes);
  assert.equal(setAppearanceValue(classes, "font", "serif"), classes);
});

test("recognizes arbitrary sizes, weights and combined line heights safely", () => {
  for (const value of [
    "[14px]",
    "[length:var(--size)]",
    "[clamp(1rem,2vw,2rem)]",
    "(length:--size)",
    "sm/6",
  ]) {
    assert.equal(appearanceFields(`text-${value}`)[0]?.value, value);
  }
  assert.equal(appearanceFields("font-[650]")[0]?.value, "[650]");
  assert.deepEqual(
    appearanceFields(
      "text-[#fff] text-[color:var(--color)] text-(--color) font-(--family)"
    ),
    []
  );
});

test("reports duplicate typography utilities without unrelated conflicts", () => {
  assert.deepEqual(
    appearanceConflicts("text-sm text-lg text-primary font-bold"),
    [{ first: "text-sm", second: "text-lg" }]
  );
});
