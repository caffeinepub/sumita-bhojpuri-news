import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getCategoryBadgeClass(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes('cinema')) return 'category-badge-cinema';
  if (lower.includes('viral')) return 'category-badge-viral';
  if (lower.includes('politics') || lower.includes('political')) return 'category-badge-politics';
  if (lower.includes('interview')) return 'category-badge-interview';
  return 'category-badge-default';
}

export function getPlaceholderImage(id: bigint | number = 1): string {
  const num = Number(id);
  const idx = ((num - 1) % 4) + 1;
  return `/assets/generated/news-placeholder-${idx}.dim_800x450.png`;
}
