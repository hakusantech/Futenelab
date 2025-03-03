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
  metadataBase: new URL('https://app.futene-web-design.jp'),
  openGraph: {
    title: `${CMS_NAME} - スタートアップ・ホームページ制作・Web開発メディア`,
    description: `東大発スタートアップFutene Web Designが運営するテックメディア。スタートアップ向けホームページ制作、Web開発、AI活用に関する最新情報を発信します。`,
    url: 'https://app.futene-web-design.jp',
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
    title: `${CMS_NAME} - スタートアップ・ホームページ制作・Web開発メディア`,
    description: `東大発スタートアップFutene Web Designが運営するテックメディア。スタートアップ向けホームページ制作、Web開発、AI活用に関する最新情報を発信します。`,
    site: '@SaitoMai383768',
    creator: '@SaitoMai383768',
    images: {
      url: '/top.png',
      alt: 'Futene Tech Lab',
    },
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
      
      {/* ピックアップとカテゴリを横並びに配置 */}
      <section className="bg-white py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* ピックアップ記事（左側3/4） */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-end mb-10">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                  <span className="text-sm font-medium text-blue-600 block mb-2 uppercase tracking-wider">Selected Content</span>
                  <span className="relative pb-2 inline-block">
                    FEATURED
                    <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-blue-600"></span>
                  </span>
                </h2>
                <Link href="/posts" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 group flex items-center">
                  <span className="mr-1">すべて見る</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    compact
                  />
                ))}
              </div>
            </div>
            
            {/* カテゴリ（右側1/4） */}
            <div className="lg:max-w-[240px] lg:border-l lg:border-gray-100 lg:pl-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 tracking-tight">
                <span className="text-xs font-medium text-blue-600 block mb-2 uppercase tracking-wider">Topics</span>
                <span className="relative pb-2 inline-block">
                  CATEGORIES
                  <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-blue-600"></span>
                </span>
              </h2>
              <div className="flex flex-col space-y-3">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    className="px-4 py-3 bg-white border-l-2 border-transparent hover:border-blue-600 hover:bg-blue-50/50 transition-all duration-200 text-gray-700 text-sm font-medium w-full flex items-center"
                  >
                    <span className="flex-1">{category.name}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-gray-400" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
      
      {/* 最新記事 */}
      <section className="bg-gray-50 py-16">
        <Container>
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              <span className="text-sm font-medium text-blue-600 block mb-2 uppercase tracking-wider">Fresh Content</span>
              <span className="relative pb-2 inline-block">
                LATEST ARTICLES
                <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-blue-600"></span>
              </span>
            </h2>
            <Link href="/posts" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 group flex items-center">
              <span className="mr-1">すべて見る</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
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
