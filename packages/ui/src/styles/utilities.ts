/**
 * The shared utility classes the design system authors in the `@layer utilities`
 * block of its stylesheet: the components carry them in their own class lists, so
 * every title, every focus ring and every invalid field is drawn through one of
 * these four. A preset that wants to retune them all rewrites the definition
 * instead of editing the components one by one.
 *
 * The values are the class lists the `@apply` receives, and `globals.css` stays
 * what an app really ships - keep the two in step.
 */
export const designSystemUtilities = {
  "state-invalid":
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

  "state-focus-ring":
    "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2",

  "ui-title": "text-lg text-foreground leading-none font-semibold",

  "ui-description": "text-sm text-muted-foreground",
} as const;

export type DesignSystemUtility = keyof typeof designSystemUtilities;
