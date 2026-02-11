import { zodToJsonSchema } from "zod-to-json-schema";
import { rlzConfigSchema } from "../src/config/schemas";
import { z } from "zod";
import fs from "fs";
import path from "path";

const baseSchema: z.ZodTypeAny = rlzConfigSchema;
const schema = zodToJsonSchema(baseSchema as any);
const outPath = path.resolve("schema/rlz.config.schema.json");

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(schema, null, 2));

console.log("Schema generated:", outPath);
