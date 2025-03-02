import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

// カテゴリでフィルタリングした記事を取得する関数
export function getPostsByCategory(category: string): Post[] {
  const allPosts = getAllPosts();
  
  // カテゴリが指定されていない場合はすべての記事を返す
  if (!category) {
    return allPosts;
  }
  
  // カテゴリでフィルタリング
  return allPosts.filter((post) => post.category === category);
}

// 記事に含まれるすべてのカテゴリを取得する関数
export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set<string>();
  
  posts.forEach((post) => {
    if (post.category) {
      categories.add(post.category);
    }
  });
  
  return Array.from(categories);
}
