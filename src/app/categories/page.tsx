import Container from "@/app/_components/container";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";
import { Metadata } from "next";
import { CMS_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `カテゴリ一覧 | ${CMS_NAME}`,
  description: `${CMS_NAME}のカテゴリ一覧ページです。Web開発、フロントエンド、バックエンド、AI・機械学習、DevOps、デザイン、その他のカテゴリから記事を探せます。`,
  metadataBase: new URL('https://app.futene-web-design.jp'),
  openGraph: {
    title: `カテゴリ一覧 | ${CMS_NAME}`,
    description: `${CMS_NAME}のカテゴリ一覧ページです。Web開発、フロントエンド、バックエンド、AI・機械学習、DevOps、デザイン、その他のカテゴリから記事を探せます。`,
    url: '/categories',
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
    title: `カテゴリ一覧 | ${CMS_NAME}`,
    description: `${CMS_NAME}のカテゴリ一覧ページです。Web開発、フロントエンド、バックエンド、AI・機械学習、DevOps、デザイン、その他のカテゴリから記事を探せます。`,
    site: '@SaitoMai383768',
    creator: '@SaitoMai383768',
    images: {
      url: '/top.png',
      alt: 'Futene Tech Lab',
    },
  },
};

export default function CategoriesPage() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto py-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight mb-12">
          カテゴリ一覧
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="block p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {category.name}に関する記事一覧
              </p>
              <div className="mt-4 text-blue-600 dark:text-blue-400">
                記事を見る →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
} 