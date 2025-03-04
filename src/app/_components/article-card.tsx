'use client';

import Image from 'next/image';
import Link from 'next/link';
import { parseISO, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';
import { getCategoryName } from '@/lib/categories';
import Avatar from './avatar';
import CoverImage from './cover-image';
import type { Author } from '@/interfaces/author';
import { useRouter } from 'next/navigation';

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
  category?: string;
  compact?: boolean;
};

export default function ArticleCard({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
  category,
  compact = false,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const categoryName = category ? getCategoryName(category) : null;
  const router = useRouter();
  
  // カテゴリに応じた背景色を設定
  const getCategoryBgColor = (categoryId?: string) => {
    if (!categoryId) return 'bg-gray-600';
    
    const colorMap: Record<string, string> = {
      'web-development': 'bg-blue-600',
      'frontend': 'bg-indigo-600',
      'backend': 'bg-purple-600',
      'ai-ml': 'bg-green-600',
      'devops': 'bg-orange-600',
      'design': 'bg-pink-600',
      'other': 'bg-gray-600',
    };
    
    return colorMap[categoryId] || 'bg-gray-600';
  };

  // カテゴリがクリックされたときの処理
  const handleCategoryClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (category) {
      router.push(`/posts?category=${category}`);
    }
  };
  
  return (
    <Link 
      href={`/posts/${slug}`}
      className={`block group overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white border border-gray-100 ${
        compact ? 'h-[320px]' : 'h-[400px]'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full">
        {/* 画像 */}
        <div className="absolute inset-0 w-full h-full bg-gray-100">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={`Cover Image for ${title}`}
              className={`object-cover transition-transform duration-700 ease-in-out ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500" />
          )}
          
          {/* オーバーレイ */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-90' : 'opacity-80'
          }`} />
        </div>
        
        {/* コンテンツ */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          {/* カテゴリー */}
          <div className="mb-3">
            {categoryName ? (
              <span 
                onClick={handleCategoryClick}
                className={`inline-block px-3 py-1 text-xs font-semibold ${getCategoryBgColor(category)} rounded-full hover:opacity-90 transition-opacity cursor-pointer transform group-hover:translate-y-0 translate-y-1 opacity-0 group-hover:opacity-100 transition-all duration-300`}
              >
                {categoryName}
              </span>
            ) : (
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-gray-600 rounded-full transform group-hover:translate-y-0 translate-y-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                カテゴリなし
              </span>
            )}
          </div>
          
          {/* タイトル */}
          <h3 className={`font-bold leading-tight mb-2 transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300 ${
            compact ? 'text-lg' : 'text-xl md:text-2xl'
          }`}>
            {title}
          </h3>
          
          {/* 抜粋（コンパクトモードでは非表示） */}
          {!compact && (
            <p className="text-sm text-gray-200 mb-4 line-clamp-2 transform group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75">
              {excerpt}
            </p>
          )}
          
          {/* 著者と日付 */}
          <div className="flex items-center mt-2 transform group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150">
            {author.picture && (
              <div className="relative w-8 h-8 mr-3 rounded-full overflow-hidden border border-white/20">
                <Image
                  src={author.picture}
                  alt={author.name}
                  className="object-cover"
                  fill
                  sizes="32px"
                />
              </div>
            )}
            <div>
              <p className="text-sm font-medium">{author.name}</p>
              <time className="text-xs text-gray-300" dateTime={date}>
                {format(parseISO(date), 'yyyy年MM月dd日', { locale: ja })}
              </time>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 