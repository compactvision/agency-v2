import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import usePermission from '@/hooks/usePermission';
import { router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    CreditCard,
    Loader2,
    Search,
    TrendingUp,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';

// ===== Types =====
type RoleUser = { roles?: string[] };

type PaymentPlan = {
    name?: string;
    price?: number | string;
};

type PaymentRequestModel = {
    id: number;
    plan?: PaymentPlan | null;
    payment_method?: string | null;
    payment_reference?: string | null;
    status: 'pending' | 'completed' | 'cancelled' | string;
    type: 'switch' | 'new' | string;
    created_at: string;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type Paginator<T> = {
    data: T[];
    meta: { current_page: number; last_page: number; total: number };
    links: PaginationLink[];
};

type PageProps = {
    auth: { user?: RoleUser } | any;
    paymentRequests: Paginator<PaymentRequestModel>;
    filters?: { search?: string };
};

// ===== Component =====
export default function Transactions() {
    const { t } = useTranslation();
    const { hasRole } = usePermission();
    const {
        paymentRequests = {
            data: [],
            meta: { current_page: 1, last_page: 1, total: 0 },
            links: [],
        },
        filters,
    } = usePage<PageProps>().props;

    const isAdmin = hasRole(['admin', 'super-admin']);

    const [searchQuery, setSearchQuery] = useState<string>(
        filters?.search ?? '',
    );
    const [isSearching, setIsSearching] = useState(false);

    const [adminNote, setAdminNote] = useState<{ [key: number]: string }>({});

    // Debounce 300ms + reload partiel
    useEffect(() => {
        const t = setTimeout(() => {
            router.get(
                route('dashboard.payment-requests.index'),
                { search: searchQuery || undefined },
                {
                    only: ['paymentRequests', 'filters'],
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    onStart: () => setIsSearching(true),
                    onFinish: () => setIsSearching(false),
                },
            );
        }, 300);

        return () => clearTimeout(t);
    }, [searchQuery]);

    const goTo = (url: string | null) => {
        if (!url) return;
        const u = new URL(url, window.location.origin);
        if (searchQuery) u.searchParams.set('search', searchQuery);
        else u.searchParams.delete('search');

        router.visit(u.toString(), {
            only: ['paymentRequests', 'filters'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onStart: () => setIsSearching(true),
            onFinish: () => setIsSearching(false),
        });
    };

    const handleApprove = (id: number) => {
        if (confirm("Confirmer l'approbation de cette demande ?")) {
            router.put(route('dashboard.payment-requests.approve', id));
        }
    };

    const handleReject = (id: number) => {
        const note = adminNote[id] || '';
        if (confirm('Confirmer le rejet de cette demande ?')) {
            router.put(route('dashboard.payment-requests.reject', id), {
                admin_note: note,
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-[#1E3A5F]/10 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#0d2340] shadow-sm">
                        <Clock size={12} className="mr-1" />
                        {t('dashboard_ui.common.pending')}
                    </span>
                );
            case 'active':
            case 'completed':
                return (
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-emerald-800 shadow-sm">
                        <CheckCircle size={12} className="mr-1" />
                        {t('dashboard_ui.common.approved')}
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-red-800 shadow-sm">
                        <XCircle size={12} className="mr-1" />
                        {t('dashboard_ui.common.cancelled')}
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-rose-800 shadow-sm">
                        <AlertCircle size={12} className="mr-1" />
                        {t('dashboard_ui.common.failed')}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-gray-800 shadow-sm">
                        <AlertCircle size={12} className="mr-1" />
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

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pb-12">
                {/* Header Section */}
                <div className="dashboard-section-header sticky top-0 z-10 border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-xl">
                    <div className="px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <BackButton />

                            <div className="w-full flex-1 text-center sm:w-auto sm:text-left">
                                <h1 className="dashboard-page-title text-2xl font-bold sm:text-3xl">
                                    {t('dashboard_ui.transactions.title')}
                                </h1>
                                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                                    {t('dashboard_ui.transactions.description')}
                                </p>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="mt-4">
                            <div className="relative mx-auto w-full sm:mx-0 sm:max-w-md">
                                <Search
                                    size={20}
                                    className={`absolute top-1/2 left-3 -translate-y-1/2 transition-colors ${isSearching ? 'animate-pulse text-[#1E3A5F]' : 'text-[#C9A84C]'}`}
                                />
                                <input
                                    type="text"
                                    placeholder={t(
                                        'dashboard_ui.transactions.search_placeholder',
                                    )}
                                    className={`w-full rounded-xl border border-slate-200 bg-white/80 py-3 pr-10 pl-10 text-sm shadow-sm backdrop-blur-sm transition-all focus:border-slate-200 focus:ring-2 focus:ring-slate-200 focus:outline-none ${isSearching ? 'opacity-70' : ''}`}
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-[#1E3A5F] transition-colors hover:bg-slate-100 hover:text-[#1E3A5F]"
                                        aria-label="Effacer"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                )}
                                {isSearching && (
                                    <Loader2
                                        size={18}
                                        className="absolute top-1/2 right-10 -translate-y-1/2 animate-spin text-[#C9A84C]"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="transform rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:shadow-xl">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#A8882E] shadow-lg shadow-sm">
                                    <CreditCard
                                        size={24}
                                        className="text-white"
                                    />
                                </div>
                                <div className="flex items-center rounded-lg bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-600">
                                    <TrendingUp size={16} className="mr-1" />
                                    {t('dashboard_ui.common.total')}
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {paymentRequests?.meta?.total || 0}
                            </div>
                            <div className="text-sm text-slate-600">
                                {t('dashboard_ui.transactions.total')}
                            </div>
                        </div>

                        <div className="transform rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:shadow-xl">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#A8882E] shadow-lg shadow-sm">
                                    <Clock size={24} className="text-white" />
                                </div>
                                <div className="flex items-center rounded-lg bg-slate-50 px-2 py-1 text-sm font-medium text-[#1E3A5F]">
                                    <Clock size={16} className="mr-1" />
                                    {t('dashboard_ui.common.pending')}
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {paymentRequests?.data?.filter(
                                    (p: any) => p.status === 'pending',
                                ).length || 0}
                            </div>
                            <div className="text-sm text-slate-600">
                                {t(
                                    'dashboard_ui.properties.pending_validation',
                                )}
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
                                <div className="flex items-center rounded-lg bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-600">
                                    <CheckCircle size={16} className="mr-1" />
                                    {t('dashboard_ui.transactions.approved')}
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {paymentRequests?.data?.filter(
                                    (p: any) => p.status === 'completed',
                                ).length || 0}
                            </div>
                            <div className="text-sm text-slate-600">
                                {t('dashboard_ui.transactions.successful')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-sm transition-opacity duration-300"
                        style={{ opacity: isSearching ? 0.6 : 1 }}
                    >
                        {/* Empty State */}
                        {paymentRequests?.data?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#1E3A5F]/10">
                                    <CreditCard
                                        size={32}
                                        className="text-[#C9A84C]"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {t('dashboard_ui.transactions.empty')}
                                </h3>
                                <p className="mt-1 max-w-sm text-slate-500">
                                    {searchQuery
                                        ? t(
                                              'dashboard_ui.transactions.empty_search',
                                          )
                                        : t(
                                              'dashboard_ui.transactions.empty_description',
                                          )}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                {/* Desktop Table */}
                                <table className="hidden w-full md:table">
                                    <thead className="border-b border-slate-200 bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                {t(
                                                    'dashboard_ui.transactions.id',
                                                )}
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                {t(
                                                    'dashboard_ui.transactions.plan',
                                                )}
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                {t(
                                                    'dashboard_ui.transactions.amount',
                                                )}
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                {t(
                                                    'dashboard_ui.transactions.method',
                                                )}
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                {t(
                                                    'dashboard_ui.common.status',
                                                )}
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                {t(
                                                    'dashboard_ui.transactions.date',
                                                )}
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                {t(
                                                    'dashboard_ui.common.actions',
                                                )}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {paymentRequests?.data?.map(
                                            (pay: any, index: number) => (
                                                <tr
                                                    key={pay.id}
                                                    className="dashboard-data-row group transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-700">
                                                        #{pay.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-slate-900">
                                                                {pay.plan
                                                                    ?.name ||
                                                                    t(
                                                                        'dashboard_ui.transactions.without_plan',
                                                                    )}
                                                            </span>
                                                            <span className="text-xs text-slate-500">
                                                                {pay.type ===
                                                                'switch'
                                                                    ? t(
                                                                          'dashboard_ui.transactions.change',
                                                                      )
                                                                    : t(
                                                                          'dashboard_ui.transactions.new',
                                                                      )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-slate-900">
                                                        {pay.plan?.price
                                                            ? `${pay.plan.price} $`
                                                            : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">
                                                        {pay.payment_method ??
                                                            t(
                                                                'dashboard_ui.transactions.manual',
                                                            )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(
                                                            pay.status,
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">
                                                        {formatDate(
                                                            pay.created_at,
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        {isAdmin ? (
                                                            <div className="dashboard-row-actions flex items-center justify-end gap-2 rounded-xl p-1 md:pointer-events-none md:translate-x-2 md:opacity-0 md:group-focus-within:pointer-events-auto md:group-focus-within:translate-x-0 md:group-focus-within:opacity-100 md:group-hover:pointer-events-auto md:group-hover:translate-x-0 md:group-hover:opacity-100">
                                                                {pay.status ===
                                                                'pending' ? (
                                                                    <>
                                                                        <button
                                                                            className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-100 hover:text-emerald-800"
                                                                            onClick={() =>
                                                                                handleApprove(
                                                                                    pay.id,
                                                                                )
                                                                            }
                                                                            title={t(
                                                                                'dashboard_ui.transactions.approve',
                                                                            )}
                                                                            aria-label={`Valider la transaction ${pay.id}`}
                                                                        >
                                                                            <CheckCircle
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            {t(
                                                                                'dashboard_ui.transactions.approve',
                                                                            )}
                                                                        </button>
                                                                        <button
                                                                            className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-800"
                                                                            onClick={() =>
                                                                                handleReject(
                                                                                    pay.id,
                                                                                )
                                                                            }
                                                                            title={t(
                                                                                'dashboard_ui.transactions.reject',
                                                                            )}
                                                                            aria-label={`Rejeter la transaction ${pay.id}`}
                                                                        >
                                                                            <XCircle
                                                                                size={
                                                                                    18
                                                                                }
                                                                            />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-xs text-slate-400 italic">
                                                                        {[
                                                                            'active',
                                                                            'completed',
                                                                        ].includes(
                                                                            pay.status,
                                                                        )
                                                                            ? t(
                                                                                  'dashboard_ui.common.approved',
                                                                              )
                                                                            : t(
                                                                                  'dashboard_ui.common.completed',
                                                                              )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-slate-400 italic">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>

                                {/* Mobile Cards */}
                                <div className="md:hidden">
                                    {paymentRequests?.data?.map((pay: any) => (
                                        <div
                                            key={pay.id}
                                            className="last:border--0 border-b border-slate-200 p-4 transition-colors hover:bg-slate-50"
                                        >
                                            <div className="mb-3 flex items-start justify-between">
                                                <div>
                                                    <span className="mb-1 block font-mono text-xs text-slate-500">
                                                        #{pay.id}
                                                    </span>
                                                    <h3 className="text-base font-bold text-slate-900">
                                                        {pay.plan?.name ||
                                                            t(
                                                                'dashboard_ui.transactions.without_plan',
                                                            )}
                                                    </h3>
                                                </div>
                                                {getStatusBadge(pay.status)}
                                            </div>

                                            <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="block text-xs text-slate-400">
                                                        {t(
                                                            'dashboard_ui.transactions.amount',
                                                        )}
                                                    </span>
                                                    <span className="font-medium text-slate-800">
                                                        {pay.plan?.price
                                                            ? `${pay.plan.price} $`
                                                            : '-'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-slate-400">
                                                        {t(
                                                            'dashboard_ui.transactions.date',
                                                        )}
                                                    </span>
                                                    <span className="font-medium text-slate-800">
                                                        {formatDate(
                                                            pay.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="block text-xs text-slate-400">
                                                        {t(
                                                            'dashboard_ui.transactions.method_reference',
                                                        )}
                                                    </span>
                                                    <span className="font-medium text-slate-800">
                                                        {pay.payment_method ??
                                                            t(
                                                                'dashboard_ui.transactions.manual',
                                                            )}{' '}
                                                        {pay.payment_reference
                                                            ? `(${pay.payment_reference})`
                                                            : ''}
                                                    </span>
                                                </div>
                                            </div>

                                            {isAdmin &&
                                                pay.status === 'pending' && (
                                                    <div className="flex gap-3 border-t border-dashed border-slate-200 pt-3">
                                                        <button
                                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                                                            onClick={() =>
                                                                handleApprove(
                                                                    pay.id,
                                                                )
                                                            }
                                                        >
                                                            <CheckCircle
                                                                size={16}
                                                            />{' '}
                                                            {t(
                                                                'dashboard_ui.transactions.approve',
                                                            )}
                                                        </button>
                                                        <button
                                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                                                            onClick={() =>
                                                                handleReject(
                                                                    pay.id,
                                                                )
                                                            }
                                                        >
                                                            <XCircle
                                                                size={16}
                                                            />{' '}
                                                            {t(
                                                                'dashboard_ui.transactions.reject',
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {paymentRequests?.data && paymentRequests.data.length > 0 && (
                    <div className="px-4 py-6 sm:px-6 lg:px-8">
                        <nav
                            className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"
                            aria-label="Pagination des transactions"
                        >
                            <div className="text-center text-sm font-medium text-slate-600 sm:text-left">
                                {t('dashboard_ui.transactions.displaying', {
                                    from:
                                        (paymentRequests?.meta as any)?.from ??
                                        (paymentRequests as any)?.from ??
                                        0,
                                    to:
                                        (paymentRequests?.meta as any)?.to ??
                                        (paymentRequests as any)?.to ??
                                        0,
                                    total:
                                        paymentRequests?.meta?.total ??
                                        (paymentRequests as any)?.total ??
                                        0,
                                })}
                            </div>

                            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
                                {paymentRequests?.links?.map(
                                    (link: any, index: number) => {
                                        const isPrevious = index === 0;
                                        const isNext =
                                            index ===
                                            paymentRequests.links.length - 1;
                                        const isEdge = isPrevious || isNext;

                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-all duration-200 ${
                                                    link.active
                                                        ? 'border-[#CF8E19] bg-[#CF8E19] text-[#292625] shadow-md'
                                                        : 'border-slate-200 bg-white text-slate-700 hover:border-[#CF8E19] hover:bg-[#CF8E19]/10 hover:text-[#292625]'
                                                } ${!link.url ? 'cursor-not-allowed opacity-40' : ''} ${!isEdge && !link.active ? 'hidden sm:inline-flex' : ''}`}
                                                disabled={!link.url}
                                                onClick={() => goTo(link.url)}
                                                aria-current={
                                                    link.active
                                                        ? 'page'
                                                        : undefined
                                                }
                                                aria-label={
                                                    isPrevious
                                                        ? t(
                                                              'dashboard_ui.common.previous_page',
                                                          )
                                                        : isNext
                                                          ? t(
                                                                'dashboard_ui.common.next_page',
                                                            )
                                                          : `Page ${link.label}`
                                                }
                                            >
                                                {isPrevious ? (
                                                    <>
                                                        <ChevronLeft
                                                            size={17}
                                                            aria-hidden="true"
                                                        />
                                                        <span className="ml-1 hidden lg:inline">
                                                            {t(
                                                                'dashboard_ui.common.previous',
                                                            )}
                                                        </span>
                                                    </>
                                                ) : isNext ? (
                                                    <>
                                                        <span className="mr-1 hidden lg:inline">
                                                            {t(
                                                                'dashboard_ui.common.next',
                                                            )}
                                                        </span>
                                                        <ChevronRight
                                                            size={17}
                                                            aria-hidden="true"
                                                        />
                                                    </>
                                                ) : (
                                                    link.label
                                                )}
                                            </button>
                                        );
                                    },
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </Dashboard>
    );
}
