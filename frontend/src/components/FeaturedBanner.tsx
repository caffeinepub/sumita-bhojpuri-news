import React from 'react';
import { Link } from '@tanstack/react-router';
import type { Article } from '../backend';
import { formatDate, getPlaceholderImage } from '../lib/utils';
import CategoryBadge from './CategoryBadge';

interface FeaturedBannerProps {
  article: Article;
}

export default function FeaturedBanner({ article }: FeaturedBannerProps) {
  const imgSrc =
    article.imageUrl && article.imageUrl.startsWith('http')
      ? article.imageUrl
      : getPlaceholderImage(article.id);

  return (
    <Link
      to="/article/$id"
      params={{ id: article.id.toString() }}
      className="block group"
    >
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{ aspectRatio: '16/7' }}
      >
        <img
          src={imgSrc}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getPlaceholderImage(article.id);
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
              Featured
            </span>
            <CategoryBadge category={article.category} />
          </div>
          <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-2 group-hover:underline">
            {article.title}
          </h2>
          <p className="text-white/80 text-sm sm:text-base line-clamp-2 hidden sm:block">
            {article.description}
          </p>
          <p className="text-white/60 text-xs mt-2">{formatDate(article.date)}</p>
        </div>
      </div>
    </Link>
  );
}
