import { CodeBlock } from "@/components/code-block";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col gap-3 max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight xl:text-4xl">
          Heading Font
        </h1>

        <h2 className="text-xl xl:text-2xl font-medium tracking-tight">
          Elegant headings for your interface
        </h2>

        <h3 className="font-semibold text-lg">Subheading</h3>

        <p className="leading-relaxed text-muted-foreground font-sans">
          Body font used for paragraphs, descriptions, and longer content. It
          should remain comfortable to read at any size.
        </p>
      </div>
    </div>
  );
}
