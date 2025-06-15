import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import readingTime from "reading-time";
import rehypeFigure from "rehype-figure";
import remarkGemoji from "remark-gemoji";
import rehypeRaw from "rehype-raw";
import brPreserver from './src/components/br-preserver';

/** @type {import('contentlayer2/source-files').ComputedFields} */
const computedFields = {
  urlslug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`.toLowerCase(),
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) =>
      doc._raw.flattenedPath.split("/").slice(1).join("/").toLowerCase(),
  },
  readingTime: {
    type: "json",
    resolve: (doc) => readingTime(doc.body.raw, { wordsPerMinute: 1000 }),
  },
  headings: {
    type: "json",
    resolve: async (doc) => {
      const withoutCodeBlocks = doc.body.raw.replace(/```[\s\S]*?```/g, "");
      const regXHeader = /^(?<flag>#{1,3})\s+(?<content>.+)$/gm;
      const headings = Array.from(withoutCodeBlocks.matchAll(regXHeader)).map(
        ({ groups }) => {
          const flag = groups?.flag;
          const content = groups?.content;
          return {
            level:
              flag?.length == 1 ? "one" : flag?.length == 2 ? "two" : "three",
            text: content,
            id: content.split(" ").join("-").toLowerCase().split("、").join("").split(/\./).join("").split(/\//).join(""),
          };
        }
      );
      return headings;
    },
  },
};

export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `pages/**/*.md`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
  },
  computedFields,
}));

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/**/*.md`,
  contentType: "markdown",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    publishDate: {
      type: "date",
      required: true,
    },
    lastmod: {
      type: "date",
      required: false,
    },
    image: {
      type: "string",
      default: "",
    },
    draft: {
      type: "boolean",
      default: false,
      required: false,
    },
    featured: {
      type: "boolean",
      default: false,
      required: false,
    },
    categories: {
      type: "list",
      default: [],
      of: { type: "string" },
    },
    tags: {
      type: "list",
      default: [],
      of: { type: "string" },
    },
    imageDesc: {
      type: "string",
      default: "",
    },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: "./data/content",
  documentTypes: [Post, Page],
  markdown: {
    remarkPlugins: [remarkGfm, remarkMath, remarkGemoji, brPreserver],
    rehypePlugins: [
      [
        rehypeShiki,
        {
          themes: {
            light: "material-theme-lighter",
            dark: "material-theme-darker",
          },
        },
      ],
      rehypeKatex,
      rehypeSlug,
      rehypeFigure,
    ],
  },
});
