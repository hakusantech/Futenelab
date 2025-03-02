import Container from "@/app/_components/container";
import { getAllPosts } from "@/lib/api";
import ArticleCard from "@/app/_components/article-card";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { Metadata } from "next";
import { CMS_NAME } from "@/lib/constants";
import Intro from "@/app/_components/intro";


export const metadata: Metadata = {
  title: `${CMS_NAME} - スタートアップ・ホームページ制作・Web開発メディア`,
  description: `東大発スタートアップFutene Web Designが運営するテックメディア。スタートアップ向けホームページ制作、Web開発、AI活用に関する最新情報を発信します。`,
  keywords: ["スタートアップ", "ホームページ制作", "Web開発", "AI", "テックブログ", "コスパ", "東大発","青森"],
  openGraph: {
    title: `${CMS_NAME} - スタートアップ・ホームページ制作・Web開発メディア`,
    description: `東大発スタートアップFutene Web Designが運営するテックメディア。スタートアップ向けホームページ制作、Web開発、AI活用に関する最新情報を発信します。`,
    url: "https://app.futene-web-design.jp/", // あなたのサイトのURLに置き換えてください
    siteName: "Futene Web Design",
    images: [
      {
        url: "top.png", // プレビューに使いたい画像のURL
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${CMS_NAME} - スタートアップ・ホームページ制作・Web開発メディア`,
    description: `東大発スタートアップFutene Web Designが運営するテックメディア。スタートアップ向けホームページ制作、Web開発、AI活用に関する最新情報を発信します。`,
    images: ["top.png"], // 同じ画像または別の画像を指定できます
  },
};

export default function Index() {
  const allPosts = getAllPosts();
  
  // ピックアップ記事（featured: trueの記事を取得）
  const pickupPosts = allPosts.filter(post => post.featured).slice(0, 3);
  
  // 最新記事（ピックアップ記事との重複を許可）
  const latestPosts = allPosts.slice(0, 6);

  return (
    <main className="bg-white">
      <Intro />
      {/* Category Navigation */}
      <section className="bg-white py-8">
        <Container>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">カテゴリ</h2>
          <div className="flex flex-wrap gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-800 font-medium"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Pickup記事 */}
      <section className="bg-white py-12">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">ピックアップ</h2>
            <Link href="/posts" className="text-blue-600 hover:underline">
              すべて見る →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pickupPosts.map((post) => (
              <ArticleCard
                key={post.slug}
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
                slug={post.slug}
                excerpt={post.excerpt}
                category={post.category}
              />
            ))}
          </div>
        </Container>
      </section>
      
      {/* 最新記事 */}
      <section className="bg-gray-50 py-12">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">最新記事</h2>
            <Link href="/posts" className="text-blue-600 hover:underline">
              すべて見る →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <ArticleCard
                key={post.slug}
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
                slug={post.slug}
                excerpt={post.excerpt}
                category={post.category}
                compact
              />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
