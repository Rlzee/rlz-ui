import Link from "next/link";
import { notFound } from "next/navigation";
import { useMDXComponents } from "@/components/mdx";
import { getPageImage, source } from "@/lib/source";
import { findNeighbour } from "fumadocs-core/page-tree";

import { absoluteUrl } from "@/lib/utils";

import { DocsTableOfContents } from "@/components/docs-toc";
import { SeparatorBorder } from "@rlz/ui/components/ui/separator-border";
import { Button } from "@rlz/ui/components/ui/button";
import { DocsCopyPage } from "@/components/docs-copy-page";
import { ArrowLeft, ArrowRight } from "lucide-react";

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const doc = page.data;

  if (!doc.title || !doc.description) notFound();

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const doc = page.data;
  const MDX = doc.body;
  const neighbours = findNeighbour(source.pageTree, page.url);
  const raw = await page.data.getText("raw");

  return (
    <div className="flex items-stretch w-full h-full" data-slot="docs">
      <SeparatorBorder
        orientation="vertical"
        className="hidden lg:block opacity-60"
      />
      <div className="relative flex w-full min-w-0 flex-1 flex-col md:py-8 md:mx-12 py-4 mx-8">
        <div className="flex items-center justify-between md:items-start">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight xl:text-4xl">
            {doc.title}
          </h1>
          <div className="docs-nav flex items-center gap-2">
            <div className="hidden sm:block">
              <DocsCopyPage page={raw} url={absoluteUrl(page.url)} />
            </div>
            <div className="ml-auto flex gap-2">
              {neighbours.previous && (
                <Button
                  variant="secondary"
                  size="icon-md"
                  className="h-8 w-8"
                  render={
                    <Link href={neighbours.previous.url}>
                      <ArrowLeft />
                      <span className="sr-only">Previous</span>
                    </Link>
                  }
                />
              )}
              {neighbours.next && (
                <Button
                  variant="secondary"
                  size="icon-md"
                  className="h-8 w-8"
                  render={
                    <Link href={neighbours.next.url}>
                      <ArrowRight />
                      <span className="sr-only">Next</span>
                    </Link>
                  }
                />
              )}
            </div>
          </div>
        </div>
        {doc.description && (
          <p className="text-[1.05rem] text-muted-foreground sm:text-base sm:max-w-[60%] max-w-[80%]">
            {doc.description}
          </p>
        )}
        <div className="flex flex-col mt-8 gap-6">
          <MDX components={useMDXComponents()} />
        </div>
        <div className="mt-12 hidden w-full items-center gap-2 px-4 sm:flex sm:px-0">
          {neighbours.previous && (
            <Button
              variant="secondary"
              size="sm"
              render={
                <Link href={neighbours.previous.url}>
                  <ArrowLeft /> {neighbours.previous.name}
                  <span className="sr-only">Previous</span>
                </Link>
              }
            />
          )}
          {neighbours.next && (
            <Button
              variant="secondary"
              size="sm"
              className="ml-auto shadow-none"
              render={
                <Link href={neighbours.next.url}>
                  <ArrowRight /> {neighbours.next.name}
                  <span className="sr-only">Next</span>
                </Link>
              }
            />
          )}
        </div>
      </div>
      <SeparatorBorder
        orientation="vertical"
        className="hidden xl:block opacity-60"
      />
      <div className="sticky top-(--header-height) z-30 ms-auto hidden h-[calc(100svh-var(--header-height))] w-72 flex-col overflow-hidden overscroll-none xl:flex">
        <DocsTableOfContents toc={doc.toc} />
      </div>
    </div>
  );
}
