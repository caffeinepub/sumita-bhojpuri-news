import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetArticles,
  useIsCallerAdmin,
  useAddArticle,
  useUpdateArticle,
  useDeleteArticle,
  useInitArticles,
} from '../hooks/useQueries';
import { Article } from '../backend';
import ArticleForm from '../components/ArticleForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  ArrowLeft,
  Loader2,
  Database,
  Newspaper,
} from 'lucide-react';
import { formatDate } from '../lib/utils';
import CategoryBadge from '../components/CategoryBadge';

type ViewMode = 'list' | 'add' | 'edit';

export default function AdminDashboard() {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: articles = [], isLoading: articlesLoading } = useGetArticles();

  const addArticle = useAddArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();
  const initArticles = useInitArticles();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  // Redirect if not admin
  React.useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate({ to: '/admin/login' });
    }
  }, [isAdmin, adminLoading, navigate]);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleAdd = async (data: Omit<Article, 'id'>) => {
    await addArticle.mutateAsync(data);
    setViewMode('list');
  };

  const handleUpdate = async (data: Omit<Article, 'id'>) => {
    if (!editingArticle) return;
    await updateArticle.mutateAsync({ ...data, id: editingArticle.id });
    setViewMode('list');
    setEditingArticle(null);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    await deleteArticle.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleInit = async () => {
    await initArticles.mutateAsync();
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="header-brand px-4 py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img
                src="/assets/generated/logo-banner.dim_400x80.png"
                alt="Sumita Bhojpuri News"
                className="h-9 object-contain"
              />
            </Link>
            <span className="text-primary-foreground/70 text-sm hidden sm:block">
              | Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary-foreground/80 text-sm hidden sm:block">
              {identity?.getPrincipal().toString().slice(0, 12)}...
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/15"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {viewMode !== 'list' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setViewMode('list');
                  setEditingArticle(null);
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-primary" />
              {viewMode === 'list'
                ? 'Article Management'
                : viewMode === 'add'
                ? 'Add New Article'
                : 'Edit Article'}
            </h1>
          </div>

          {viewMode === 'list' && (
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleInit}
                disabled={initArticles.isPending}
              >
                {initArticles.isPending ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Database className="w-4 h-4 mr-1" />
                )}
                Load Sample Data
              </Button>
              <Button
                size="sm"
                onClick={() => setViewMode('add')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Article
              </Button>
            </div>
          )}
        </div>

        {/* Form View */}
        {(viewMode === 'add' || viewMode === 'edit') && (
          <Card>
            <CardHeader>
              <CardTitle>
                {viewMode === 'add' ? 'New Article' : 'Edit Article'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ArticleForm
                article={viewMode === 'edit' ? editingArticle : null}
                onSubmit={viewMode === 'add' ? handleAdd : handleUpdate}
                onCancel={() => {
                  setViewMode('list');
                  setEditingArticle(null);
                }}
                isLoading={addArticle.isPending || updateArticle.isPending}
              />
            </CardContent>
          </Card>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <Card>
            <CardContent className="p-0">
              {articlesLoading ? (
                <div className="p-6 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : articles.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No articles found.</p>
                  <p className="text-sm mt-1">
                    Click "Add Article" to create one, or "Load Sample Data" to get started.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">#</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {articles.map((article) => (
                          <TableRow key={article.id.toString()}>
                            <TableCell className="text-muted-foreground text-sm">
                              {article.id.toString()}
                            </TableCell>
                            <TableCell>
                              <p className="font-medium line-clamp-1 max-w-xs">
                                {article.title}
                              </p>
                            </TableCell>
                            <TableCell>
                              <CategoryBadge category={article.category} />
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                              {formatDate(article.date)}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1 flex-wrap">
                                {article.isFeatured && (
                                  <Badge variant="default" className="text-xs">
                                    Featured
                                  </Badge>
                                )}
                                {article.isTrending && (
                                  <Badge variant="secondary" className="text-xs">
                                    Trending
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingArticle(article);
                                    setViewMode('edit');
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => setDeleteId(article.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden divide-y divide-border">
                    {articles.map((article) => (
                      <div key={article.id.toString()} className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm leading-snug flex-1">
                            {article.title}
                          </p>
                          <div className="flex gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingArticle(article);
                                setViewMode('edit');
                              }}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(article.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <CategoryBadge category={article.category} />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(article.date)}
                          </span>
                          {article.isFeatured && (
                            <Badge variant="default" className="text-xs">
                              Featured
                            </Badge>
                          )}
                          {article.isTrending && (
                            <Badge variant="secondary" className="text-xs">
                              Trending
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteArticle.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteArticle.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteArticle.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
