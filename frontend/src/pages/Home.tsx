import React, { useState } from 'react';
import Header from '../components/Header';
import BreakingNewsTicker from '../components/BreakingNewsTicker';
import FeaturedBanner from '../components/FeaturedBanner';
import NewsCard from '../components/NewsCard';
import TrendingSidebar from '../components/TrendingSidebar';
import Footer from '../components/Footer';
import { useGetArticles } from '../hooks/useQueries';
import { useCategoryFilter, Category } from '../hooks/useCategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Clock } from 'lucide-react';

export default function Home() {
  const { data: articles = [], isLoading } = useGetArticles();
  const [searchQuery, setSearchQuery] = useState('');

  const { activeCategory, setActiveCategory, filteredArticles } =
    useCategoryFilter(articles);

  const handleCategoryChange = (cat: Category | null) => {
    setActiveCategory(cat);
  };

  const displayedArticles = searchQuery
    ? filteredArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredArticles;

  const featuredArticle = articles.find((a) => a.isFeatured) ?? articles[0];
  const latestArticles = displayedArticles.slice(0, 8);
  const trendingArticles = articles.filter((a) => a.isTrending);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {!isLoading && articles.length > 0 && (
        <BreakingNewsTicker articles={articles} />
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="w-full h-72 rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-lg" />
              ))}
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No articles available yet.</p>
            <p className="text-sm mt-2">
              Visit the{' '}
              <a href="/admin" className="text-primary underline">
                admin panel
              </a>{' '}
              to add articles.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Banner */}
            {featuredArticle && !searchQuery && !activeCategory && (
              <FeaturedBanner article={featuredArticle} />
            )}

            <div className="flex flex-col lg:flex-row gap-8 mt-8">
              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Latest News */}
                <section>
                  <h2 className="news-section-heading flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    {searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : activeCategory
                      ? activeCategory
                      : 'Latest News'}
                  </h2>

                  {displayedArticles.length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center">
                      No articles found.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {latestArticles.map((article) => (
                        <NewsCard
                          key={article.id.toString()}
                          article={article}
                          variant="default"
                        />
                      ))}
                    </div>
                  )}
                </section>

                {/* Trending Section (mobile) */}
                {trendingArticles.length > 0 && (
                  <section className="mt-8 lg:hidden">
                    <h2 className="news-section-heading flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Trending
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {trendingArticles.slice(0, 4).map((article) => (
                        <NewsCard
                          key={article.id.toString()}
                          article={article}
                          variant="horizontal"
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <aside className="hidden lg:block w-72 shrink-0">
                <TrendingSidebar articles={articles} />
              </aside>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
