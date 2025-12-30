import { z } from "zod";

export const frameworkSchema = z.enum(["next", "vite", "react"]);
