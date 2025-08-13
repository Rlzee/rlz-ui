import { getUiFile } from "./get-ui-file";
import { uiUrl } from "../config";
import path from "path";
import { createStructure } from "./create-structure";
import { addComponent } from "./add-component";

export async function defaultStructure() {
  const baseDir = path.join(process.cwd(), "src");
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
  await addComponent({ component: "button", options: {} });
}
