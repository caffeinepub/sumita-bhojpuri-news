import React from 'react';
import { getCategoryBadgeClass } from '../lib/utils';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span className={`${getCategoryBadgeClass(category)} ${className ?? ''}`}>
      {category}
    </span>
  );
}
