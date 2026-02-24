import { useState, useMemo } from 'react';
import { Article } from '../backend';

export type Category =
  | 'Bhojpuri Cinema'
  | 'Viral News'
  | 'Politics'
  | 'Interview';

export const CATEGORIES: Category[] = [
  'Bhojpuri Cinema',
  'Viral News',
  'Politics',
  'Interview',
];

export function useCategoryFilter(articles: Article[]) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const filteredArticles = useMemo(() => {
    if (!activeCategory) return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  return { activeCategory, setActiveCategory, filteredArticles };
}
