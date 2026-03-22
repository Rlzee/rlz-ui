import fs from "fs/promises";
import path from "path";
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
    const outputDir = path.resolve(scriptDir, "..", "registry");
    await fs.mkdir(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, "registry.json");

    const json = JSON.stringify(REGISTRY, null, 2);

    await fs.writeFile(outputPath, json, "utf8");

    console.log("Registry generated:", outputPath);
  } catch (error) {
    console.error("Failed to generate registry:", error);
    process.exit(1);
  }
}

generateRegistry();
