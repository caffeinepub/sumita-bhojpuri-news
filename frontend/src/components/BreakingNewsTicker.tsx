import React from 'react';
import { Link } from '@tanstack/react-router';
import { Article } from '../backend';

interface BreakingNewsTickerProps {
  articles: Article[];
}

export default function BreakingNewsTicker({ articles }: BreakingNewsTickerProps) {
  const trendingArticles = articles.filter((a) => a.isTrending).slice(0, 6);

  if (trendingArticles.length === 0) return null;

  return (
    <div className="breaking-ticker flex items-center overflow-hidden py-2">
      <div className="shrink-0 px-3 py-0.5 bg-primary-foreground/20 text-primary-foreground font-bold text-sm uppercase tracking-wider mr-3 rounded-sm">
        Breaking
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-ticker flex gap-8 whitespace-nowrap">
          {trendingArticles.map((article) => (
            <Link
              key={article.id.toString()}
              to="/article/$id"
              params={{ id: article.id.toString() }}
              className="text-primary-foreground text-sm hover:underline shrink-0"
            >
              {article.title}
            </Link>
          ))}
          {/* Duplicate for seamless loop */}
          {trendingArticles.map((article) => (
            <Link
              key={`dup-${article.id.toString()}`}
              to="/article/$id"
              params={{ id: article.id.toString() }}
              className="text-primary-foreground text-sm hover:underline shrink-0"
            >
              {article.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
