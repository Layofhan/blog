import { allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import siteMetadata from "../../data/sitemetadata";
import AboutMe from "../components/aboutme";
import Articles from "../components/articles";

export default function Home() {
  const filterposts = allPosts
    .sort((a, b) => {
      return compareDesc(new Date(a.publishDate), new Date(b.publishDate));
    })
    .map((post) => ({
      title: post.title,
      description: post.description,
      draft: post.draft,
      featured: post.featured,
      slug: post.slug,
      tags: post.tags,
      publishDate: post.publishDate,
    }));

  const tagCount = filterposts.reduce((acc, article) => {
    article.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const mostCommonTag = Object.keys(tagCount).reduce((a, b) =>
    tagCount[a] > tagCount[b] ? a : b
  );

  return (
    <div className="relative">
      <div className="mx-auto max-w-2xl py-28 max-h-screen mt-8">
        <h1 className="text-2xl font-semibold py-8">
          {siteMetadata.headerTitle}
        </h1>
        <p className="text-xl">{siteMetadata.description}</p>
      </div>

      <div className="lg:grid lg:grid-cols-9 lg:gap-8 pt-20 max-w-6xl">
        <div className="max-w-4xl  col-span-7 pt-12">
          <Articles articles={filterposts} mostCommonTag={mostCommonTag} />
        </div>
        <div className="col-span-2 max-w-lg mx-auto">
          <div className="sticky top-0 pt-12">
            <AboutMe />
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    images: [siteMetadata.cover],
    authors: [siteMetadata.author],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.cover],
  },
  locale: siteMetadata.language,
  type: "website",
};
