import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { CATEGORIES, Category } from '../hooks/useCategoryFilter';

interface HeaderProps {
  activeCategory: Category | null;
  onCategoryChange: (category: Category | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (category: Category | null) => {
    onCategoryChange(category);
    setMobileMenuOpen(false);
    navigate({ to: '/' });
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      {/* Brand Bar */}
      <div className="header-brand">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          {/* Logo + Brand Name */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src="/assets/generated/logo-banner.dim_400x80.png"
              alt="Sumita Bhojpuri News"
              className="h-9 object-contain"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-primary-foreground font-bold text-base tracking-wide font-serif">
                सुमिता भोजपुरी समाचार
              </span>
              <span className="text-primary-foreground/70 text-xs tracking-widest uppercase font-medium">
                Sumita Bhojpuri News
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/50" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-sm bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 border border-primary-foreground/20 focus:outline-none focus:ring-1 focus:ring-primary-foreground/40 text-sm transition-colors hover:bg-primary-foreground/15"
              />
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggle}
              className="p-2 rounded hover:bg-primary-foreground/15 transition-colors"
              aria-label="Toggle theme"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Moon className="w-4 h-4 text-primary-foreground" />
              )}
            </button>
            <button
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                setMobileMenuOpen(false);
              }}
              className="md:hidden p-2 rounded hover:bg-primary-foreground/15 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-primary-foreground" />
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setMobileSearchOpen(false);
              }}
              className="md:hidden p-2 rounded hover:bg-primary-foreground/15 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Menu className="w-4 h-4 text-primary-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-primary-foreground/15 px-4 py-2.5">
            <div className="relative max-w-7xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/50" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-sm bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 border border-primary-foreground/20 focus:outline-none focus:ring-1 focus:ring-primary-foreground/40 text-sm"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Navigation Bar */}
      <nav className="header-nav border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                activeCategory === null
                  ? 'border-primary-foreground text-primary-foreground'
                  : 'border-transparent text-primary-foreground/70 hover:text-primary-foreground hover:border-primary-foreground/40'
              }`}
            >
              All News
            </button>
            <div className="w-px h-4 bg-primary-foreground/20 mx-1" />
            {CATEGORIES.map((cat, idx) => (
              <React.Fragment key={cat}>
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                    activeCategory === cat
                      ? 'border-primary-foreground text-primary-foreground'
                      : 'border-transparent text-primary-foreground/70 hover:text-primary-foreground hover:border-primary-foreground/40'
                  }`}
                >
                  {cat}
                </button>
                {idx < CATEGORIES.length - 1 && (
                  <div className="w-px h-4 bg-primary-foreground/20 mx-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden header-nav border-t border-primary-foreground/15">
          <div className="max-w-7xl mx-auto px-4 py-1">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`w-full px-3 py-2.5 text-sm font-semibold text-left uppercase tracking-wide transition-colors ${
                activeCategory === null
                  ? 'text-primary-foreground'
                  : 'text-primary-foreground/70 hover:text-primary-foreground'
              }`}
            >
              All News
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`w-full px-3 py-2.5 text-sm font-semibold text-left uppercase tracking-wide transition-colors border-t border-primary-foreground/10 ${
                  activeCategory === cat
                    ? 'text-primary-foreground'
                    : 'text-primary-foreground/70 hover:text-primary-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
