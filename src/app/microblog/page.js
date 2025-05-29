import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import moment from "moment";

export async function generateMetadata() {
  return {
    title: "微博 Microblog",
    description: "微博 Microblog",
  };
}

export default async function LinksPage() {
  const filePath = path.join(process.cwd(), "data", "microblog.yaml");
  const links = fs.readFileSync(filePath, "utf8");
  const microblogs = yaml.load(links);

  return (
    <div  className="max-w-3xl mx-auto py-4">
      <h1 className="text-2xl font-bold pb-8 text-center">微博 Microblog</h1>
      {microblogs
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((microblog, index) => (
          <div key={`${microblog.date}-${index}`}>
            <div className="py-3 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xs hover:shadow-md dark:shadow-zinc-700 transition px-6 my-4">
              <time className="prose-sm text-zinc-500 dark:text-zinc-400">
                {moment(microblog.date).format("LL")}
              </time>
              <p className="py-1 leading-7">{microblog.content}</p>
            </div>
          </div>
        ))}
    </div>
  );
}
