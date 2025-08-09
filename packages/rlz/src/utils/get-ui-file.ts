import fs from "fs";
import path from "path";
import https from "https";

/**
 * Downloads a file from a URL and saves it locally.
 * @param url Full URL of the file to download.
 * @param destPath Local path where to write the file (must include the file name).
 */
export function getUiFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
  // Create parent directory if needed
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Download failed. Status code: ${res.statusCode}`));
        res.resume(); // consume response to free up memory
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
    }).on("error", (err) => {
      reject(err);
    });
  });
}
