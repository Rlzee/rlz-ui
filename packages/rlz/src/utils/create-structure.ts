import fs from "fs-extra";
import path from "path";

type FileTree = {
  [name: string]: string | FileTree; // string = file content, object = folder
};

/**
 * Creates a folder/file from a JSON structure
 * @param basePath The base path where to create the structure
 * @param structure The tree structure to create
 */
export async function createStructure(basePath: string, structure: FileTree) {
  for (const key in structure) {
    const value = structure[key];
    const targetPath = path.join(basePath, key);
    if (typeof value === "string") {
      await fs.outputFile(targetPath, value);
    } else {
      await fs.ensureDir(targetPath);
      await createStructure(targetPath, value);
    }
  }
}
