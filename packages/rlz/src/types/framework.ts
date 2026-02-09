import { z } from "zod";
import { frameworkSchema } from "../schemas/framework";

export type Framework = z.infer<typeof frameworkSchema>;

export type FrameworkInfo = {
  framework: Framework | "invalid";
};
