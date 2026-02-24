import React from 'react';
import { Link } from '@tanstack/react-router';
import type { Article } from '../backend';
import { formatDate, getPlaceholderImage } from '../lib/utils';
import CategoryBadge from './CategoryBadge';

interface NewsCardProps {
  article: Article;
  variant?: 'default' | 'horizontal' | 'compact';
}

export default function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  const imgSrc =
    article.imageUrl && article.imageUrl.startsWith('http')
      ? article.imageUrl
      : getPlaceholderImage(article.id);

  if (variant === 'horizontal') {
    return (
      <Link
        to="/article/$id"
        params={{ id: article.id.toString() }}
        className="flex gap-3 group p-2 rounded-lg hover:bg-muted/50 transition-colors"
      >
        <div className="shrink-0 w-24 h-20 sm:w-32 sm:h-24 overflow-hidden rounded-lg">
          <img
            src={imgSrc}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getPlaceholderImage(article.id);
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <CategoryBadge category={article.category} className="mb-1" />
          <h3 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors mt-1">
            {article.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{formatDate(article.date)}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to="/article/$id"
        params={{ id: article.id.toString() }}
        className="flex gap-2 group py-2 border-b border-border last:border-0"
      >
        <div className="shrink-0 w-16 h-14 overflow-hidden rounded">
          <img
            src={imgSrc}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getPlaceholderImage(article.id);
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(article.date)}</p>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link
      to="/article/$id"
      params={{ id: article.id.toString() }}
      className="flex flex-col group bg-card rounded-xl overflow-hidden border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img
          src={imgSrc}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getPlaceholderImage(article.id);
          }}
        />
      </div>
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge category={article.category} />
          {article.isTrending && (
            <span className="text-xs font-bold text-orange-500">🔥 Trending</span>
          )}
        </div>
        <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {article.description}
        </p>
        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
          {formatDate(article.date)}
        </p>
      </div>
    </Link>
  );
}
