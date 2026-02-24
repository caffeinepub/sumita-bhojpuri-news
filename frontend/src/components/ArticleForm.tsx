import React, { useState, useEffect } from 'react';
import { Article } from '../backend';
import { CATEGORIES } from '../hooks/useCategoryFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface ArticleFormProps {
  article?: Article | null;
  onSubmit: (data: Omit<Article, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const emptyForm = {
  title: '',
  description: '',
  content: '',
  category: CATEGORIES[0],
  imageUrl: '',
  date: new Date().toISOString().split('T')[0],
  isFeatured: false,
  isTrending: false,
};

export default function ArticleForm({
  article,
  onSubmit,
  onCancel,
  isLoading,
}: ArticleFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (article) {
      setForm({
        title: article.title,
        description: article.description,
        content: article.content,
        category: article.category as typeof CATEGORIES[number],
        imageUrl: article.imageUrl,
        date: article.date,
        isFeatured: article.isFeatured,
        isTrending: article.isTrending,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [article]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    if (!form.description.trim()) newErrors.description = 'Description is required.';
    if (!form.content.trim()) newErrors.content = 'Content is required.';
    if (!form.category) newErrors.category = 'Category is required.';
    if (!form.date) newErrors.date = 'Date is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter article title"
          disabled={isLoading}
        />
        {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Enter a short description"
          rows={2}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-destructive text-xs">{errors.description}</p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Enter full article content"
          rows={5}
          disabled={isLoading}
        />
        {errors.content && <p className="text-destructive text-xs">{errors.content}</p>}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={form.category}
          onValueChange={(val) => setForm({ ...form, category: val as typeof CATEGORIES[number] })}
          disabled={isLoading}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-destructive text-xs">{errors.category}</p>}
      </div>

      {/* Image URL */}
      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
          disabled={isLoading}
        />
      </div>

      {/* Date */}
      <div className="space-y-1.5">
        <Label htmlFor="date">Date *</Label>
        <Input
          id="date"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          disabled={isLoading}
        />
        {errors.date && <p className="text-destructive text-xs">{errors.date}</p>}
      </div>

      {/* Toggles */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-3">
          <Switch
            id="isFeatured"
            checked={form.isFeatured}
            onCheckedChange={(val) => setForm({ ...form, isFeatured: val })}
            disabled={isLoading}
          />
          <Label htmlFor="isFeatured">Featured</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            id="isTrending"
            checked={form.isTrending}
            onCheckedChange={(val) => setForm({ ...form, isTrending: val })}
            disabled={isLoading}
          />
          <Label htmlFor="isTrending">Trending</Label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none">
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {article ? 'Update Article' : 'Add Article'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
