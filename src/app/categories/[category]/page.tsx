import Container from "@/app/_components/container";
import ArticleCard from "@/app/_components/article-card";
import { getAllCategoryIds, getCategoryName } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/api";
import Link from "next/link";
import { Metadata } from "next";

type CategoryParams = {
  category: string;
};

export async function generateMetadata({ 
  params 
}: { 
  params: CategoryParams 
}): Promise<Metadata> {
  const categoryName = getCategoryName(params.category);
  
  return {
    title: `${categoryName}の記事一覧 | Futene Tech Lab`,
    description: `Futene Tech Labの${categoryName}に関する記事一覧です。`,
  };
}

export function generateStaticParams(): Array<{ category: string }> {
  const categories = getAllCategoryIds();
  
  return categories.map((category) => ({
    category,
  }));
}

export default function CategoryPage({
  params,
}: {
  params: CategoryParams;
}) {
  const { category } = params;
  const posts = getPostsByCategory(category);
  const categoryName = getCategoryName(category);
  
  return (
    <Container>
      <div className="max-w-6xl mx-auto py-16">
        <div className="flex items-center mb-8">
          <Link href="/categories" className="text-blue-600 hover:underline mr-4">
            ← カテゴリ一覧に戻る
          </Link>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight mb-12">
          {categoryName}の記事一覧
        </h1>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
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
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-8">
              このカテゴリの記事はまだありません。
            </p>
            <Link
              href="/categories"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              他のカテゴリを見る
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
} 