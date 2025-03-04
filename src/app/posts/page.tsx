import Container from "@/app/_components/container";
import ArticleCard from "@/app/_components/article-card";
import { getAllPosts, getPostsByCategory } from "@/lib/api";
import Link from "next/link";
import { CATEGORIES, getCategoryName } from "@/lib/categories";
import { CMS_NAME } from "@/lib/constants";
import { Metadata } from "next";

export async function generateMetadata({ 
  searchParams 
}: { 
  searchParams?: { category?: string } 
}): Promise<Metadata> {
  const categoryParam = searchParams?.category;
  const categoryName = categoryParam ? getCategoryName(categoryParam) : null;
  const title = categoryName 
    ? `${categoryName}の記事一覧 | ${CMS_NAME} - スタートアップ・ホームページ制作・Web開発メディア`
    : `記事一覧 | ${CMS_NAME} - スタートアップ・ホームページ制作・Web開発メディア`;
  const description = categoryName
    ? `東大発スタートアップFutene Web Designが運営するテックメディア。${categoryName}に関する記事一覧です。スタートアップ向けホームページ制作、Web開発、AI活用に関する情報をご覧いただけます。`
    : `東大発スタートアップFutene Web Designが運営するテックメディア。スタートアップ向けホームページ制作、Web開発、AI活用に関する最新記事一覧です。`;
  
  return {
    title,
    description,
    keywords: ["スタートアップ", "ホームページ制作", "Web開発", "AI", "テックブログ", "記事一覧", "Futene"],
    metadataBase: new URL('https://app.futene-web-design.jp'),
    openGraph: {
      title,
      description,
      url: categoryParam ? `/posts?category=${categoryParam}` : '/posts',
      siteName: "Futene Web Design",
      images: [
        {
          url: '/top.png',
          width: 1200,
          height: 630,
          alt: 'Futene Tech Lab',
          type: 'image/png',
        },
      ],
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@SaitoMai383768',
      creator: '@SaitoMai383768',
      images: {
        url: '/top.png',
        alt: 'Futene Tech Lab',
      },
    },
  };
}

export default function PostsPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const categoryParam = searchParams?.category;
  const allPosts = categoryParam ? getPostsByCategory(categoryParam) : getAllPosts();
  const categoryName = categoryParam ? getCategoryName(categoryParam) : null;
  
  return (
    <Container>
      <div className="max-w-6xl mx-auto py-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight mb-12">
          {categoryName ? `${categoryName}の記事一覧` : '記事一覧'}
        </h1>
        
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">カテゴリで絞り込む</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/posts"
              className={`px-4 py-2 ${!categoryParam ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'} rounded-full hover:bg-blue-700 hover:text-white transition-colors`}
            >
              すべて
            </Link>
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/posts?category=${category.id}`}
                className={`px-4 py-2 ${categoryParam === category.id ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'} rounded-full hover:bg-blue-700 hover:text-white transition-colors`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
        
        {/* 記事一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post) => (
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
        
        {/* 記事がない場合 */}
        {allPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-8">
              記事が見つかりませんでした
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              ホームに戻る
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
} 