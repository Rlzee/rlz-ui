import { allDocs, type Doc } from ".contentlayer/generated";
import { notFound } from "next/navigation";
import { Mdx } from "@site/components/mdx-components";

import { ArrowUpRight } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@ui/components/toggle-group";

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getDocFromParams({ params }: DocPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.join("/") || "";
  const doc = allDocs.find((doc: Doc) => doc.slugAsParams === slug);

  if (!doc) {
    return null;
  }

  return doc;
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params });

  if (!doc) {
    notFound();
  }

  return (
    <div className="flex flex-col flex-1 gap-8">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">{doc.title}</p>
        {doc.links && doc.component && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 cursor-default hover:underline">
              <a href={doc.links.doc} target="_blank" rel="noreferrer">
                Docs
              </a>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 cursor-default hover:underline">
              <a href={doc.links.api} target="_blank" rel="noreferrer">
                Api
              </a>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        )}
        {!doc.component && (
          <ToggleGroup
            type="single"
            defaultValue="next"
            className="w-fit bg-background-secondary p-1 rounded-lg"
            size="custom"
          >
            <ToggleGroupItem
              value="next"
              className="rounded-md px-4 hover:bg-transparent cursor-pointer"
            >
              Next.js
            </ToggleGroupItem>
            <ToggleGroupItem
              value="vite"
              disabled
              className="rounded-md px-4 hover:bg-transparent cursor-pointer"
            >
              Vite
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </div>
      <Mdx code={doc.body.code} />
    </div>
  );
}
