import { z } from "zod";

// Schema for component types
export const componentTypeSchema = z.enum(["text", "background", "animation"]).nullable();

// Schema for utility types
export const utilsTypeSchema = z.enum(["helpers", "hooks", "lib", "types", "stores", "utils"]);

// Schema for aliases
export const aliasesSchema = z.object({
  components: z.string(),
  utils: z.string(),
  lib: z.string(),
  stores: z.string(),
  helpers: z.string(),
  types: z.string(),
  hooks: z.string(),
});

// Schema for RLZ configuration
export const rlzConfigSchema = z.object({
  cssPath: z.string(),
  uiPath: z.string().optional(),
  aliases: aliasesSchema.optional(),
});

// Schema for configuration with defaults
export const rlzConfigWithDefaultsSchema = z.object({
  cssPath: z.string(),
  uiPath: z.string(),
  aliases: aliasesSchema,
});

// Schema for add command options
export const addCommandOptionsSchema = z.object({
  type: z.union([componentTypeSchema, utilsTypeSchema]).optional(),
});

// Schema for addComponent parameters
export const addComponentParamsSchema = z.object({
  component: z.string().min(1, "Component name cannot be empty").regex(/^[a-zA-Z][a-zA-Z0-9-_]*$/, "Component name must be valid (alphanumeric, hyphens, underscores)"),
  options: z.object({
    type: componentTypeSchema.optional(),
  }),
});

// Schema for addUtils parameters
export const addUtilsParamsSchema = z.object({
  name: z.string().min(1, "Utility name cannot be empty").regex(/^[a-zA-Z][a-zA-Z0-9-_.]*$/, "Utility name must be valid (alphanumeric, hyphens, underscores, dots)"),
  type: utilsTypeSchema,
});

// Schema for URLs
export const urlSchema = z.string().url("Invalid URL format");

// Schema for file paths
export const filePathSchema = z.string().min(1, "File path cannot be empty");

// Schema for npm package names
export const npmPackageNameSchema = z.string().regex(/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/, "Invalid npm package name");

// TypeScript types derived from Zod schemas
export type ComponentType = z.infer<typeof componentTypeSchema>;
export type UtilsType = z.infer<typeof utilsTypeSchema>;
export type Aliases = z.infer<typeof aliasesSchema>;
export type RlzConfig = z.infer<typeof rlzConfigSchema>;
export type RlzConfigWithDefaults = z.infer<typeof rlzConfigWithDefaultsSchema>;
export type AddCommandOptions = z.infer<typeof addCommandOptionsSchema>;
export type AddComponentParams = z.infer<typeof addComponentParamsSchema>;
export type AddUtilsParams = z.infer<typeof addUtilsParamsSchema>;
