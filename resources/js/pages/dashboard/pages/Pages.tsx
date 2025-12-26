import React, { useEffect, useState } from 'react';
import { ImageOff, Plus, Edit3, Trash2, ArrowLeft, Search, FileText, Clock, CheckCircle, Eye, Calendar } from 'lucide-react';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import { router, usePage } from '@inertiajs/react';
import BackButton from '@/components/ui/BackButton';

type Page = {
  id: number;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  created_at: string;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export default function Pages() {
  const { pages, filters } = usePage().props as {
    pages: { data: Page[]; links: PaginationLink[] };
    filters?: { search?: string };
  };

  const [query, setQuery] = useState(filters?.search ?? '');
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    router.get(
      route('dashboard.pages.index'),
      { search: debounced, page: 1 },
      {
        only: ['pages', 'filters'],
        preserveState: true,
        replace: true,
        onStart: () => setLoading(true),
        onFinish: () => setLoading(false),
      }
    );
  }, [debounced]);

  const deletePage = (id: number) => {
    if (confirm('Supprimer cette page ?')) {
      router.delete(route('dashboard.pages.destroy', id), { preserveScroll: true });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
            <Clock size={12} className="mr-1" />
            Brouillon
          </span>
        );
      case 'published':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
            <CheckCircle size={12} className="mr-1" />
            Publié
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 shadow-sm">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const goTo = (url: string | null) => {
    if (!url) return;
    const u = new URL(url, window.location.origin);
    if (query) u.searchParams.set('search', query);
    else u.searchParams.delete('search');

    router.visit(u.toString(), {
      only: ['pages', 'filters'],
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onStart: () => setLoading(true),
      onFinish: () => setLoading(false),
    });
  };

  const publishedPages = pages.data.filter(page => page.status === 'published').length;
  const draftPages = pages.data.filter(page => page.status === 'draft').length;

  return (
    <Dashboard>
      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl shadow-lg shadow-amber-500/5 border-b border-amber-200/30 sticky top-0 z-1">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <BackButton />
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                  Gestion des Pages
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mt-1">
                  Créez et gérez les pages de votre site
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                <input
                  type="text"
                  placeholder="Rechercher une page..."
                  className={`w-full pl-10 pr-4 py-3 border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm text-sm shadow-sm ${loading ? 'opacity-70' : ''}`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button 
                    onClick={() => setQuery('')} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600 transition-colors"
                    aria-label="Effacer"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <button
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-6 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                onClick={() => router.visit(route('dashboard.pages.create'))}
              >
                <Plus size={18} />
                <span>Nouvelle page</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <FileText size={24} className="text-white" />
                </div>
                <div className="flex items-center text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">
                  <Plus size={16} className="mr-1" />
                  Total
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{pages.data.length}</div>
              <div className="text-sm text-slate-600">Total des pages</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div className="flex items-center text-amber-600 text-sm font-medium bg-amber-50 px-2 py-1 rounded-lg">
                  <Eye size={16} className="mr-1" />
                  Publiées
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{publishedPages}</div>
              <div className="text-sm text-slate-600">Pages publiées</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Clock size={24} className="text-white" />
                </div>
                <div className="flex items-center text-amber-600 text-sm font-medium bg-amber-50 px-2 py-1 rounded-lg">
                  <Edit3 size={16} className="mr-1" />
                  Brouillons
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{draftPages}</div>
              <div className="text-sm text-slate-600">En brouillon</div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden">
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="w-full hidden md:table">
                <thead className="bg-amber-50/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Titre</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Date de création</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200/30">
                  {pages.data.map((page, index) => (
                    <tr 
                      key={page.id} 
                      className="hover:bg-amber-50/30 transition-colors"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{page.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600">{page.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(page.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {formatDate(page.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-amber-600 hover:text-amber-900 p-1 rounded hover:bg-amber-50 transition-colors"
                            onClick={() => router.visit(route('dashboard.pages.edit', page.id))}
                            title="Modifier"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            onClick={() => deletePage(page.id)}
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden">
                {pages.data.map((page, index) => (
                  <div
                    key={page.id}
                    className="p-4 border-b border-amber-200/30 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-base font-medium text-slate-900">{page.title}</h3>
                        <p className="text-sm text-slate-500">{page.slug}</p>
                      </div>
                      {getStatusBadge(page.status)}
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Date de création</span>
                        <span className="text-sm text-slate-900">{formatDate(page.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-amber-600 hover:text-amber-900 p-2 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
                        onClick={() => router.visit(route('dashboard.pages.edit', page.id))}
                        title="Modifier"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                        onClick={() => deletePage(page.id)}
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {pages.data.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-amber-100/50 flex items-center justify-center">
                      <ImageOff size={32} className="text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucune page trouvée</h3>
                    <p className="text-slate-600">
                      {query ? 'Aucune page ne correspond à votre recherche' : 'Commencez par créer votre première page'}
                    </p>
                    <button
                      className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 mx-auto transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      onClick={() => router.visit(route('dashboard.pages.create'))}
                    >
                      <Plus size={18} />
                      Créer une page
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

       

        {/* Pagination */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              {pages.data.length > 0 ? (
                <>
                  Affichage de {pages.data.length} pages
                </>
              ) : (
                'Aucune page'
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {pages.links.map((link, index) => (
                <button
                  key={index}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    link.active 
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                      : 'text-slate-600 hover:bg-amber-100 hover:text-amber-700'
                  } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!link.url}
                  onClick={() => goTo(link.url)}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}