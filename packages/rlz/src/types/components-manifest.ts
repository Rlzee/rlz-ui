import { z } from "zod";
import { ComponentManifestSchema } from "../shemas/component-manifest";

export type ComponentManifest = z.infer<typeof ComponentManifestSchema>;
