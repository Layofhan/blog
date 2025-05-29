import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import FriendLinks from "../../components/friendlinks";

export async function generateMetadata() {
  return {
    title: "友情链接 Friend Links",
    description: "但愿十年后的某天，这些链接仍存活，与各位作者共勉。",
  };
}

export default async function LinksPage() {
  const filePath = path.join(process.cwd(), "data", "links.yaml");
  const links = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(links);

  return (
    <div>
      <FriendLinks friends={data} />
    </div>
  );
}
