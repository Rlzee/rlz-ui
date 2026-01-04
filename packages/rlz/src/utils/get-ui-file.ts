import fs from "fs-extra";
import path from "path";
import https from "https";
import { URL } from "url";

export function getUiFile(
  url: string,
  destPathOrDir: string,
  timeoutMs = 15_000
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Allow callers to pass either a full destination file path or a destination
    // directory. If a directory is provided (no extension), derive the file
    // name from the URL's pathname.
    const isLikelyDirectory = path.extname(destPathOrDir) === "";
    const destPath = isLikelyDirectory
      ? path.join(destPathOrDir, path.basename(new URL(url).pathname))
      : destPathOrDir;

    const dir = path.dirname(destPath);
    fs.ensureDirSync(dir);

    const requestFile = (fileUrl: string) => {
      const req = https.get(new URL(fileUrl), (res) => {
        // Handle redirects
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          res.resume();
          return requestFile(res.headers.location);
        }

        if (res.statusCode !== 200) {
          res.resume();
          return reject(
            new Error(`Download failed (${res.statusCode}) for ${fileUrl}`)
          );
        }

        const fileStream = fs.createWriteStream(destPath);

        res.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });

        fileStream.on("error", (err) => {
          fs.remove(destPath).finally(() => reject(err));
        });
      });

      req.setTimeout(timeoutMs, () => {
        req.destroy(new Error("Request timeout"));
      });

      req.on("error", (err) => {
        fs.remove(destPath).finally(() => reject(err));
      });
    };

    requestFile(url);
  });
}
