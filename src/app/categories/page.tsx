import Container from "@/app/_components/container";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";

export const metadata = {
  title: 'カテゴリ一覧 | Futene Tech Lab',
  description: 'Futene Tech Labのカテゴリ一覧ページです。Web開発、フロントエンド、バックエンド、AI・機械学習、DevOps、デザイン、その他のカテゴリから記事を探せます。',
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