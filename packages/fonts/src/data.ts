import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import type { FontInfo } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const GOOGLE_FONTS: FontInfo[] = JSON.parse(
  readFileSync(path.join(__dirname, "../data/google-fonts.json"), "utf-8")
);
