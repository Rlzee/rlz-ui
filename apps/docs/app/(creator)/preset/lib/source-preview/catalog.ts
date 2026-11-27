import { registryComponents } from "@rlz/ui/registry/components";
import { registryBaseComponents } from "@rlz/ui/registry/base_components";

/** The registry is the allowlist, never a separate table of supported components. */
export const sourcePreviewComponents = {
  ...registryBaseComponents,
  ...registryComponents,
};

export const sourcePreviewComponentIds = Object.keys(sourcePreviewComponents);

export function isSourcePreviewComponent(slug: unknown): slug is string {
  return (
    typeof slug === "string" &&
    Object.prototype.hasOwnProperty.call(sourcePreviewComponents, slug)
  );
}
