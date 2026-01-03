import https from "https";

export function getComponentManifest<T = unknown>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(
            new Error(`Failed to fetch component manifest (${res.statusCode})`)
          );
          res.resume();
          return;
        }

        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(new Error("Invalid JSON in component manifest"));
          }
        });
      })
      .on("error", reject);
  });
}
