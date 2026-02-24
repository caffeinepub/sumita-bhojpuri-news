import React from 'react';
import { Article } from '../backend';
import NewsCard from './NewsCard';

interface RelatedNewsProps {
  articles: Article[];
  currentArticleId: bigint;
}

export default function RelatedNews({ articles, currentArticleId }: RelatedNewsProps) {
  const related = articles
    .filter((a) => a.id !== currentArticleId)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="news-section-heading">Related News</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {related.map((article) => (
          <NewsCard key={article.id.toString()} article={article} variant="default" />
        ))}
      </div>
    </section>
  );
}
