import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useGetArticleById, useGetArticlesByCategory } from '../hooks/useQueries';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RelatedNews from '../components/RelatedNews';
import CategoryBadge from '../components/CategoryBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, getPlaceholderImage } from '../lib/utils';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useCategoryFilter, Category } from '../hooks/useCategoryFilter';
import { useState } from 'react';

export default function ArticleDetail() {
  const { id } = useParams({ from: '/article/$id' });
  const articleId = BigInt(id);

  const { data: article, isLoading } = useGetArticleById(articleId);
  const { data: relatedArticles = [] } = useGetArticlesByCategory(
    article?.category ?? ''
  );

  const [searchQuery, setSearchQuery] = useState('');
  const { activeCategory, setActiveCategory } = useCategoryFilter([]);

  const handleCategoryChange = (cat: Category | null) => {
    setActiveCategory(cat);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="w-full h-72 rounded-xl" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-16 text-center">
          <p className="text-2xl font-bold text-muted-foreground">Article not found.</p>
          <Link to="/" className="text-primary underline mt-4 inline-block">
            Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Article Header */}
        <article>
          <div className="mb-4">
            <CategoryBadge category={article.category} className="mb-3 inline-block" />
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
              {article.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {article.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <time dateTime={article.date}>{formatDate(article.date)}</time>
            </div>
          </div>

          {/* Article Image */}
          <div className="rounded-xl overflow-hidden mb-8 aspect-video">
            <img
              src={article.imageUrl || getPlaceholderImage(Number(article.id))}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getPlaceholderImage(
                  Number(article.id)
                );
              }}
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {article.content.split('\n').map((para, i) => (
              <p key={i} className="mb-4 leading-relaxed text-foreground">
                {para}
              </p>
            ))}
          </div>
        </article>

        {/* Related News */}
        {relatedArticles.length > 0 && (
          <RelatedNews
            articles={relatedArticles}
            currentArticleId={article.id}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
