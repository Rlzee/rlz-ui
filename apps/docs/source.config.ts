import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { transformers } from "./lib/transformers";

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        dark: "github-dark",
        light: "github-light",
      },
      transformers,
    },
  },
});

export const docs = defineDocs({ dir: "content/docs" });
