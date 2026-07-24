import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { router, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    Edit3,
    Eye,
    FileText,
    ImageOff,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const { pages, filters } = usePage().props as unknown as {
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
            },
        );
    }, [debounced]);

    const deletePage = (id: number) => {
        if (confirm(t('dashboard_ui.pages.delete_confirmation'))) {
            router.delete(route('dashboard.pages.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return (
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-[#1E3A5F]/10 px-2.5 py-1 text-xs font-medium text-[#0d2340] shadow-sm">
                        <Clock size={12} className="mr-1" />
                        {t('dashboard_ui.common.draft')}
                    </span>
                );
            case 'published':
                return (
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 shadow-sm">
                        <CheckCircle size={12} className="mr-1" />
                        {t('dashboard_ui.common.published')}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 shadow-sm">
                        {status}
                    </span>
                );
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
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

    const publishedPages = pages.data.filter(
        (page) => page.status === 'published',
    ).length;
    const draftPages = pages.data.filter(
        (page) => page.status === 'draft',
    ).length;

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                {/* Header Section */}
                <div className="dashboard-section-header sticky top-0 z-10 border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-xl">
                    <div className="px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <BackButton />

                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="dashboard-page-title text-2xl font-bold sm:text-3xl">
                                    {t('dashboard_ui.pages.title')}
                                </h1>
                                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                                    {t('dashboard_ui.pages.description')}
                                </p>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row">
                            <div className="relative max-w-md flex-1">
                                <Search
                                    size={20}
                                    className="absolute top-1/2 left-3 -translate-y-1/2 text-[#C9A84C]"
                                />
                                <input
                                    type="text"
                                    placeholder={t(
                                        'dashboard_ui.pages.search_placeholder',
                                    )}
                                    className={`w-full rounded-xl border border-slate-200 bg-white/80 py-3 pr-4 pl-10 text-sm shadow-sm backdrop-blur-sm focus:border-slate-200 focus:ring-2 focus:ring-slate-200 focus:outline-none ${loading ? 'opacity-70' : ''}`}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery('')}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[#1E3A5F] transition-colors hover:text-[#1E3A5F]"
                                        aria-label="Effacer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <button
                                className="dashboard-primary-action flex transform items-center gap-2 rounded-xl px-6 py-3 font-medium shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                                onClick={() =>
                                    router.visit(
                                        route('dashboard.pages.create'),
                                    )
                                }
                            >
                                <Plus size={18} />
                                <span>{t('dashboard_ui.pages.new')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="transform rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:shadow-xl">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#A8882E] shadow-lg shadow-sm">
                                    <FileText
                                        size={24}
                                        className="text-white"
                                    />
                                </div>
                                <div className="flex items-center rounded-lg bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-600">
                                    <Plus size={16} className="mr-1" />
                                    {t('dashboard_ui.common.total')}
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {pages.data.length}
                            </div>
                            <div className="text-sm text-slate-600">
                                {t('dashboard_ui.pages.total')}
                            </div>
                        </div>

                        <div className="transform rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:shadow-xl">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
                                    <CheckCircle
                                        size={24}
                                        className="text-white"
                                    />
                                </div>
                                <div className="flex items-center rounded-lg bg-slate-50 px-2 py-1 text-sm font-medium text-[#1E3A5F]">
                                    <Eye size={16} className="mr-1" />
                                    {t('dashboard_ui.pages.published_short')}
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {publishedPages}
                            </div>
                            <div className="text-sm text-slate-600">
                                {t('dashboard_ui.pages.published')}
                            </div>
                        </div>

                        <div className="transform rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:shadow-xl">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#A8882E] shadow-lg shadow-sm">
                                    <Clock size={24} className="text-white" />
                                </div>
                                <div className="flex items-center rounded-lg bg-slate-50 px-2 py-1 text-sm font-medium text-[#1E3A5F]">
                                    <Edit3 size={16} className="mr-1" />
                                    {t('dashboard_ui.pages.drafts')}
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {draftPages}
                            </div>
                            <div className="text-sm text-slate-600">
                                {t('dashboard_ui.common.draft')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-sm">
                        <div className="overflow-x-auto">
                            {/* Desktop Table */}
                            <table className="hidden w-full md:table">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-700 uppercase">
                                            {t(
                                                'dashboard_ui.pages.title_column',
                                            )}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-700 uppercase">
                                            {t('dashboard_ui.pages.slug')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-700 uppercase">
                                            {t('dashboard_ui.common.status')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-700 uppercase">
                                            {t(
                                                'dashboard_ui.common.created_at',
                                            )}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-700 uppercase">
                                            {t('dashboard_ui.common.actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {pages.data.map((page, index) => (
                                        <tr
                                            key={page.id}
                                            className="dashboard-data-row group transition-colors"
                                            style={{
                                                animationDelay: `${index * 0.05}s`,
                                            }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-slate-900">
                                                    {page.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-600">
                                                    {page.slug}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(page.status)}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">
                                                {formatDate(page.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                <div className="dashboard-row-actions flex space-x-2 rounded-xl p-1 md:pointer-events-none md:translate-x-2 md:opacity-0 md:group-focus-within:pointer-events-auto md:group-focus-within:translate-x-0 md:group-focus-within:opacity-100 md:group-hover:pointer-events-auto md:group-hover:translate-x-0 md:group-hover:opacity-100">
                                                    <button
                                                        className="rounded p-1 text-[#1E3A5F] transition-colors hover:bg-slate-100 hover:text-[#1E3A5F]"
                                                        onClick={() =>
                                                            router.visit(
                                                                route(
                                                                    'dashboard.pages.edit',
                                                                    page.id,
                                                                ),
                                                            )
                                                        }
                                                        title={t(
                                                            'dashboard_ui.common.edit',
                                                        )}
                                                        aria-label={t(
                                                            'dashboard_ui.pages.edit_label',
                                                            {
                                                                title: page.title,
                                                            },
                                                        )}
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        className="rounded p-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-900"
                                                        onClick={() =>
                                                            deletePage(page.id)
                                                        }
                                                        title={t(
                                                            'dashboard_ui.common.delete',
                                                        )}
                                                        aria-label={t(
                                                            'dashboard_ui.pages.delete_label',
                                                            {
                                                                title: page.title,
                                                            },
                                                        )}
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
                                        className="border-b border-slate-200 p-4 last:border-b-0"
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div>
                                                <h3 className="text-base font-medium text-slate-900">
                                                    {page.title}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    {page.slug}
                                                </p>
                                            </div>
                                            {getStatusBadge(page.status)}
                                        </div>

                                        <div className="mb-3 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-500">
                                                    {t(
                                                        'dashboard_ui.common.created_at',
                                                    )}
                                                </span>
                                                <span className="text-sm text-slate-900">
                                                    {formatDate(
                                                        page.created_at,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="rounded-lg bg-slate-50 p-2 text-[#1E3A5F] transition-colors hover:bg-slate-100 hover:text-[#1E3A5F]"
                                                onClick={() =>
                                                    router.visit(
                                                        route(
                                                            'dashboard.pages.edit',
                                                            page.id,
                                                        ),
                                                    )
                                                }
                                                title={t(
                                                    'dashboard_ui.common.edit',
                                                )}
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-900"
                                                onClick={() =>
                                                    deletePage(page.id)
                                                }
                                                title={t(
                                                    'dashboard_ui.common.delete',
                                                )}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {pages.data.length === 0 && (
                                    <div className="py-12 text-center">
                                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#1E3A5F]/10">
                                            <ImageOff
                                                size={32}
                                                className="text-[#C9A84C]"
                                            />
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold text-slate-900">
                                            {t('dashboard_ui.pages.empty')}
                                        </h3>
                                        <p className="text-slate-600">
                                            {query
                                                ? t(
                                                      'dashboard_ui.pages.empty_search',
                                                  )
                                                : t(
                                                      'dashboard_ui.pages.empty_description',
                                                  )}
                                        </p>
                                        <button
                                            className="mx-auto mt-4 flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-slate-100 to-slate-100 px-4 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-slate-100 hover:to-slate-100 hover:shadow-xl"
                                            onClick={() =>
                                                router.visit(
                                                    route(
                                                        'dashboard.pages.create',
                                                    ),
                                                )
                                            }
                                        >
                                            <Plus size={18} />
                                            {t('dashboard_ui.pages.create')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="text-sm text-slate-600">
                            {pages.data.length > 0 ? (
                                <>
                                    {t('dashboard_ui.pages.displaying', {
                                        count: pages.data.length,
                                    })}
                                </>
                            ) : (
                                t('dashboard_ui.pages.none')
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {pages.links.map((link, index) => (
                                <button
                                    key={index}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        link.active
                                            ? 'bg-slate-500 text-white shadow-lg shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-[#0d2340]'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={!link.url}
                                    onClick={() => goTo(link.url)}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
