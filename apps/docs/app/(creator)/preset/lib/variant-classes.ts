import type { ComponentVariant } from "@rlz/registry";

import { buttonVariants } from "@rlz/ui/components/ui/button";

/**
 * cva functions the Creator can introspect, keyed by registry component id.
 * Only cva-backed components can answer: a component whose variants come from a
 * plain TypeScript union (Input) or a context prop (Dialog) has no class data
 * to read here, so its values start without built-in classes.
 */
const cvaVariants: Record<string, unknown> = {
  button: buttonVariants,
};

// cva only declares the call signature on its return type (0.7.1 attaches
// nothing else to the function at runtime), so the lookup is cast to the shape
// actually being called.
type CvaFn = (props?: Record<string, string>) => string;

// cva joins every class it selects into one space-separated string.
function tokenize(classes: string) {
  return classes.split(/\s+/).filter(Boolean);
}

/**
 * Built-in classes of one variant value, read from the component itself - never
 * copied into the manifest, which would drift from the source. cva 0.7.1 no
 * longer exposes its config on the returned function, so the classes are
 * recovered by *calling* it: the base classes and the defaults of the other
 * axes are identical for every value of the axis, so whatever a value does not
 * share with all the others is exactly the classes it owns.
 */
export function builtinVariantClasses(
  slug: string,
  axis: ComponentVariant,
  value: string
): string | undefined {
  const fn = cvaVariants[slug] as CvaFn | undefined;

  // A value the Creator made up is refused: cva answers an unknown value with
  // the axis' default, which would pass another value's styling off as this
  // one's.
  if (!fn || !axis.values.includes(value)) return undefined;

  const tokensByValue = axis.values.map((candidate) =>
    tokenize(fn({ [axis.name]: candidate }))
  );
  const own = tokensByValue[axis.values.indexOf(value)];

  // Shared by every value -> belongs to the component, not to this value.
  const shared = new Set(
    own.filter((token) =>
      tokensByValue.every((tokens) => tokens.includes(token))
    )
  );

  const classes = [...new Set(own.filter((token) => !shared.has(token)))];

  return classes.length > 0 ? classes.join(" ") : undefined;
}
