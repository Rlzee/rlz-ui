import path from "path";
import { getUiFile } from "./get-ui-file";
import { uiUrl } from "../config";

export async function replaceGlobalsCss(srcDir: boolean) {
  let globalsPath;

  if (srcDir) {
    const appDir = path.join(process.cwd(), "src/app");
    globalsPath = path.join(appDir, "globals.css");
  } else {
    const appDir = path.join(process.cwd(), "app");
    globalsPath = path.join(appDir, "globals.css");
  }

  const url = `${uiUrl}/style/globals.css`;

  // Download and replace or create the globals.css file
  await getUiFile(url, globalsPath);
}
