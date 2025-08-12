import { getUiFile } from "./get-ui-file";
import { uiUrl } from "../config";
import path from "path";
import { createStructure } from "./create-structure";

export async function defaultStructure(srcDir: boolean) {
  const baseDir = srcDir ? path.join(process.cwd(), "src") : process.cwd();
  const structure = {
    ui: {
      components: {},
      lib: {
        // The file content will be fetched after structure creation
        "utils.ts": ""
      }
    }
  };
  createStructure(baseDir, structure);
  // Fetch the actual utils.ts content from remote
  const filePath = path.join(baseDir, "ui", "lib", "utils.ts");
  const url = `${uiUrl}/lib/utils.ts`;
  await getUiFile(url, filePath);
}
