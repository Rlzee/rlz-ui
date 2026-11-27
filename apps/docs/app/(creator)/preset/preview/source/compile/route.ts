import { PresetComponentCustomizationSchema } from "@rlz/registry";
import { compileSourcePreview } from "../../../lib/source-preview/compile.server";
import { isSourcePreviewComponent } from "../../../lib/source-preview/catalog";

export const runtime = "nodejs";

/** Only registered, local sources are compiled. Presets are bounded data, never code. */
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return new Response("Invalid origin", { status: 403 });
  const reader = request.body?.getReader();
  if (!reader) return new Response("Missing request body", { status: 400 });
  let text = "";
  let size = 0;
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 256_000) {
      await reader.cancel();
      return new Response("Preset is too large for the source preview.", {
        status: 413,
      });
    }
    text += decoder.decode(value, { stream: true });
  }
  try {
    const body = JSON.parse(text + decoder.decode());
    if (
      !isSourcePreviewComponent(body.slug) ||
      !body.edits ||
      typeof body.edits !== "object" ||
      Array.isArray(body.edits) ||
      Object.keys(body.edits).length > 100
    )
      return new Response("Invalid source preview request", { status: 400 });
    const edits = Object.fromEntries(
      Object.entries(body.edits).map(([key, value]) => [
        key,
        PresetComponentCustomizationSchema.parse(value),
      ])
    );
    return Response.json(await compileSourcePreview(body.slug, edits));
  } catch (error) {
    console.error("Source preview compilation failed:", error);
    return new Response(
      "Source preview compilation failed. The last valid preview was kept.",
      { status: 400 }
    );
  }
}
