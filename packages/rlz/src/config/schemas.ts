import { z } from "zod";
import { frameworkSchema } from "../schemas/framework";
import { DIR_DEFINITION } from "./def";
import { iconLibSchema } from "../icons/schema";

const dirKeys = Object.keys(DIR_DEFINITION) as (keyof typeof DIR_DEFINITION)[];

export const aliasesSchema = z.object(
  Object.fromEntries(dirKeys.map((key) => [key, z.string()])) as Record<
    (typeof dirKeys)[number],
    z.ZodString
  >
);

export const dirsSchema = z
  .object({
    root: z.string(),
  })
  .extend(
    Object.fromEntries(
      Object.keys(DIR_DEFINITION).map((key) => [key, z.string().optional()])
    ) as Record<string, z.ZodOptional<z.ZodString>>
  );

export const rlzConfigSchema = z.object({
  framework: frameworkSchema,
  dirs: dirsSchema,
  css: z.string(),
  aliases: aliasesSchema,
  icons: iconLibSchema,
});
