import { z } from "zod";
import { rlzConfigSchema } from "./schemas";

export type rlzConfig = z.infer<typeof rlzConfigSchema>;
