import path from "path";
import { getUiFile } from "./get-ui-file";

export async function replaceGlobalsCss() {
  // Find globals.css in the project (apps/test/app/globals.css)
  const appDir = path.join(process.cwd(), "app");
  const globalsPath = path.join(appDir, "globals.css");
  const url = "https://raw.githubusercontent.com/Rlzee/rlz-ui-source/main/style/globals.css";

  // Download and replace or create the globals.css file
  await getUiFile(url, globalsPath);
}
