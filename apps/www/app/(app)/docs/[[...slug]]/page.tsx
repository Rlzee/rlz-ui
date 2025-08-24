import { allDocs, type Doc } from ".contentlayer/generated";
import { notFound } from "next/navigation";
import { Mdx } from "@/src/components/mdx-components";

import { ArrowUpRight } from "lucide-react";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug?.join("/") || "";
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
        {doc.links && (
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
      </div>
      <Mdx code={doc.body.code} />
    </div>
  );
}
