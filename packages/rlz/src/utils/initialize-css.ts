import path from "path";
import { getUiFile } from "./get-ui-file";
import { uiUrl } from "../config";
import { getConfigOrDefault } from "./config-manager";

export async function initializeCss() {
  const config = await getConfigOrDefault();
  const cssPath = path.join(process.cwd(), config.cssPath);
  const url = `${uiUrl}/style/globals.css`;
  // Download and replace or create the css file
  await getUiFile(url, cssPath);
}
