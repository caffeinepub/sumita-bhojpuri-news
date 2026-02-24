import React from 'react';
import { Link } from '@tanstack/react-router';
import { TrendingUp } from 'lucide-react';
import { Article } from '../backend';
import { getPlaceholderImage } from '../lib/utils';

interface TrendingSidebarProps {
  articles: Article[];
}

export default function TrendingSidebar({ articles }: TrendingSidebarProps) {
  const trending = articles.filter((a) => a.isTrending).slice(0, 5);

  return (
    <aside className="w-full">
      <h2 className="news-section-heading flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Trending
      </h2>
      <div className="flex flex-col gap-3">
        {trending.map((article, index) => (
          <Link
            key={article.id.toString()}
            to="/article/$id"
            params={{ id: article.id.toString() }}
            className="flex items-start gap-3 group news-card-hover"
          >
            <span className="text-2xl font-black text-primary/30 leading-none w-6 shrink-0 mt-1">
              {index + 1}
            </span>
            <div className="flex gap-2 flex-1">
              <img
                src={article.imageUrl || getPlaceholderImage(index + 1)}
                alt={article.title}
                className="w-16 h-16 object-cover rounded shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getPlaceholderImage(index + 1);
                }}
              />
              <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-3">
                {article.title}
              </p>
            </div>
          </Link>
        ))}
        {trending.length === 0 && (
          <p className="text-muted-foreground text-sm">No trending news available.</p>
        )}
      </div>
    </aside>
  );
}
