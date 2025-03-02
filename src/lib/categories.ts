// カテゴリの定義
export const CATEGORIES = [
  { id: 'web-development', name: 'Web開発' },
  { id: 'frontend', name: 'フロントエンド' },
  { id: 'backend', name: 'バックエンド' },
  { id: 'ai-ml', name: 'AI・機械学習' },
  { id: 'devops', name: 'DevOps' },
  { id: 'design', name: 'デザイン' },
  { id: 'other', name: 'その他' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

// カテゴリIDから名前を取得する関数
export function getCategoryName(categoryId: string): string {
  const category = CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.name : 'カテゴリなし';
}

// すべてのカテゴリIDを取得する関数
export function getAllCategoryIds(): string[] {
  return CATEGORIES.map(category => category.id);
} 