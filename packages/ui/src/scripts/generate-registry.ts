import fs from "fs/promises";
import path from "path";
import { RegistrySchema } from "@rlz/registry";
import { REGISTRY } from "../registry/index";

const scriptPath =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  process.argv.length > 1
    ? process.argv[1]
    : undefined;

const scriptDir = scriptPath
  ? path.dirname(path.resolve(scriptPath))
  : process.cwd();

async function generateRegistry() {
  try {
    const outputDir = path.resolve(scriptDir, "..", "..");
    await fs.mkdir(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, "registry.json");

    // Round-trip through the schema so a malformed item (e.g. bad capabilities
    // or preset components) fails the build instead of shipping a broken JSON.
    // The capabilities it carries were detected by `detect-capabilities`, which
    // runs first (`build:registry`): an item only describes what its source has.
    const parsed = RegistrySchema.parse(REGISTRY);

    const json = JSON.stringify(parsed, null, 2);

    await fs.writeFile(outputPath, json, "utf8");

    console.log("Registry generated:", outputPath);
  } catch (error) {
    console.error("Failed to generate registry:", error);
    process.exit(1);
  }
}

generateRegistry();
