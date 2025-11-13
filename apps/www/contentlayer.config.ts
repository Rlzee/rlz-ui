import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from "contentlayer2/source-files";
import { type ComputedFields } from "contentlayer2/source-files";

const computedFields: ComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
};

const LinksProperties = defineNestedType(() => ({
  name: "LinksProperties",
  fields: {
    doc: { type: "string" },
    api: { type: "string" },
  },
}));

export const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: `docs/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    component: { type: "boolean", default: false },
    install: { type: "boolean", default: false },
    links: { type: "nested", of: LinksProperties },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Doc],
  disableImportAliasWarning: true
});
