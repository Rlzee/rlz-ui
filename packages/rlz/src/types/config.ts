import { z } from "zod";
import { rlzConfigSchema } from "../shemas/config";

export type rlzConfig = z.infer<typeof rlzConfigSchema>;
