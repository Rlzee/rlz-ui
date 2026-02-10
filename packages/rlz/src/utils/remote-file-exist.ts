import https from "https";
import { URL } from "url";

export async function remoteFileExists(
  urlStr: string,
  timeoutMs = 8000
): Promise<boolean> {
  return new Promise((resolve) => {
    let redirects = 0;
    const maxRedirects = 5;

    const check = (u: string) => {
      const req = https.request(new URL(u), { method: "HEAD" }, (res) => {
        // follow redirects
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          if (redirects >= maxRedirects) return resolve(false);
          redirects++;
          res.resume();
          return check(res.headers.location);
        }

        if (res.statusCode === 200) return resolve(true);
        // Some servers reject HEAD; if 405 or similar, try GET
        if (
          res.statusCode &&
          (res.statusCode === 405 || res.statusCode === 403)
        ) {
          res.resume();
          // fallback to GET
          const getReq = https.request(
            new URL(u),
            { method: "GET" },
            (getRes) => {
              if (
                getRes.statusCode &&
                getRes.statusCode >= 200 &&
                getRes.statusCode < 300
              )
                return resolve(true);
              return resolve(false);
            }
          );
          getReq.on("error", () => resolve(false));
          getReq.setTimeout(timeoutMs, () => getReq.destroy());
          getReq.end();
          return;
        }

        return resolve(false);
      });

      req.on("error", () => resolve(false));
      req.setTimeout(timeoutMs, () => req.destroy());
      req.end();
    };

    try {
      check(urlStr);
    } catch (err) {
      resolve(false);
    }
  });
}
