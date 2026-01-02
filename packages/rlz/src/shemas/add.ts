import { z } from "zod";

export const componentSchema = z
  .string()
  .min(1, "Component name cannot be empty")
  .regex(
    /^[a-zA-Z][a-zA-Z0-9-_]*$/,
    "Component name must be valid (alphanumeric, hyphens, underscores)"
  );
