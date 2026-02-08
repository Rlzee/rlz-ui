export const DEFAULT_CSS_BY_FRAMEWORK: Record<
  string,
  (rootDir: string) => string
> = {
  next: () => "app/globals.css",
  vite: (rootDir) => (rootDir === "." ? "index.css" : "src/index.css"),
  react: (rootDir) => (rootDir === "." ? "index.css" : "src/index.css"),
};
