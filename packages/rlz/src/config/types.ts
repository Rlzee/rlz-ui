import { z } from "zod";
import { presetConfigSchema, rlzConfigSchema } from "./schemas";

export type PresetConfig = z.infer<typeof presetConfigSchema>;
export type rlzConfig = z.infer<typeof rlzConfigSchema>;
