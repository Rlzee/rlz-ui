import { z } from "zod";
import { cssPathResponseSchema } from "../schemas/init";
import { UI_URL } from "../config";
import { getUiFile } from "./get-ui-file";
import fs from "fs-extra";
import path from "path";
import { logger } from "./logger";

/**
 * Download UI-provided `index.css` and `theme.css`, concatenate them and
 * write the combined result to the given destination CSS path.
 *
 * @param dest - destination CSS path (relative to `cwd` or absolute). Must end with `.css`
 * @param cwd - working directory to resolve relative `dest` against (defaults to process.cwd())
 */
export async function initializeCss(
  dest: string,
  cwd = process.cwd()
): Promise<void> {
  // Validate the provided destination path shape
  cssPathResponseSchema.parse({ cssPath: dest });

  const indexCssUrl = `${UI_URL}/styles/index.css`;
  const themeCssUrl = `${UI_URL}/styles/theme.css`;

  const destPath = path.resolve(cwd, dest);
  const destDir = path.dirname(destPath);

  // Temporary folder next to the destination to store downloaded files
  const tmpDir = path.join(destDir, ".rlz_tmp_css");

  try {
    await fs.ensureDir(destDir);
    await fs.ensureDir(tmpDir);

    const indexTmp = path.join(tmpDir, "index.css");
    const themeTmp = path.join(tmpDir, "theme.css");

    // Download both files in parallel
    await Promise.all([
      getUiFile(indexCssUrl, indexTmp),
      getUiFile(themeCssUrl, themeTmp),
    ]);

    // Read contents
    const [indexContent, themeContent] = await Promise.all([
      fs.readFile(indexTmp, "utf8"),
      fs.readFile(themeTmp, "utf8"),
    ]);

    // Combine: index first, then a separator and theme
    const combined = [
      "/* rlz-ui: combined index.css */",
      indexContent.trim(),
      "",
      "/* rlz-ui: theme.css */",
      themeContent.trim(),
      "",
    ].join("\n");

    await fs.writeFile(destPath, combined, "utf8");

    // Cleanup temporary files
    await fs.remove(tmpDir);

    logger.info(`Combined CSS written to ${destPath}`);
  } catch (err: any) {
    // Attempt cleanup on error
    try {
      await fs.remove(tmpDir);
    } catch {
      // ignore cleanup errors
    }

    logger.error(
      `Failed to initialize CSS at "${dest}": ${err?.message ?? err}`
    );
    // rethrow so callers can handle if desired
    throw err;
  }
}
