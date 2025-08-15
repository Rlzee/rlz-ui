import { getUiFile } from "./get-ui-file";
import { uiUrl } from "../config";
import path from "path";
import { createStructure } from "./create-structure";
import { addComponent } from "./add-component";
import { getConfigOrDefault } from "./config-manager";

export async function initializeStructure() {
  const config = await getConfigOrDefault();
  const baseDir = path.join(process.cwd(), config.uiPath);
  const structure = {
    components: {},
    lib: {
      // The file content will be fetched after structure creation
      "utils.ts": "",
    },
  };
  createStructure(baseDir, structure);
  // Fetch the actual utils.ts content from remote
  const filePath = path.join(baseDir, "lib", "utils.ts");
  const url = `${uiUrl}/lib/utils.ts`;
  await getUiFile(url, filePath);
  await addComponent({ component: "button", options: {} });
}
