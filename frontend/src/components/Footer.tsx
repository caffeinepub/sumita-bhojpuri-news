import React from 'react';
import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { CATEGORIES } from '../hooks/useCategoryFilter';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'sumita-bhojpuri-news');

  return (
    <footer className="bg-foreground text-background dark:bg-card dark:text-foreground mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img
              src="/assets/generated/logo-banner.dim_400x80.png"
              alt="Sumita Bhojpuri News"
              className="h-9 object-contain mb-1 brightness-0 invert"
            />
            <p className="text-sm font-semibold opacity-80 mb-2">
              सुमिता भोजपुरी समाचार
            </p>
            <p className="text-sm opacity-60 leading-relaxed">
              Your trusted source for the latest Bhojpuri entertainment, politics, viral news, and exclusive interviews.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-xs mb-3 opacity-90 uppercase tracking-wide">Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to="/"
                    className="text-sm opacity-60 hover:opacity-100 transition-opacity hover:text-primary"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-xs mb-3 opacity-90 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 dark:border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm opacity-60">
          <p>© {year} Sumita Bhojpuri News – All Rights Reserved</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-primary fill-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-100"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
