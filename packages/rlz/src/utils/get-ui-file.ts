import fs from "fs-extra";
import path from "path";
import https from "https";

/**
 * Downloads a file from a URL and saves it locally.
 * @param url Full URL of the file to download.
 * @param destPath Local path where to write the file (must include the file name).
 */
export function getUiFile(
  url: string,
  destPath: string,
  timeoutMs = 15000
): Promise<void> {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (err) {
      return reject(err);
    }

    const request = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Download failed. Status code: ${res.statusCode}`));
        res.resume();
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);

      fileStream.on("finish", () => {
        fileStream.close();
        resolve();
      });

      fileStream.on("error", (err) => {
        fs.unlink(destPath, () => reject(err));
      });
    });

    request.setTimeout(timeoutMs, () => {
      request.abort();
      reject(new Error("Request timeout"));
    });

    request.on("error", (err) => {
      reject(err);
    });
  });
}
