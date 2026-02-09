import { z } from "zod";

export const cssPathResponseSchema = z.object({
  cssPath: z
    .string()
    .min(1, "CSS path cannot be empty")
    .endsWith(".css", "CSS path must end with .css"),
});
