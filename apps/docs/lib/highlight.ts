import { codeToHtml } from "shiki";

export async function highlightCode(code: string, lang = "tsx") {
  return codeToHtml(code, {
    lang,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
    defaultColor: false,
  });
}
