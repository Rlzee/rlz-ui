import { CopyButton } from "./copy-button";

function ComponentCode({
  code,
  highlightedCode,
  language,
  title,
}: {
  code: string;
  highlightedCode: string;
  language: string;
  title: string | undefined;
}) {
  return (
    <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
      {title && (
        <figcaption
          data-rehype-pretty-code-title=""
          className="flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70"
          data-language={language}
        >
          {/*{getIconForLanguageExtension(language)}*/}
          {title}
        </figcaption>
      )}
      <CopyButton code={code} />
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />{" "}
    </figure>
  );
}
