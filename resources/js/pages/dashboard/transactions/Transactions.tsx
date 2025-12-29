import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    CreditCard,
    Loader2,
    Search,
    TrendingUp,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
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
    const {
        auth,
        paymentRequests = {
            data: [],
            meta: { current_page: 1, last_page: 1, total: 0 },
            links: [],
        },
        filters,
    } = usePage<PageProps>().props;

    const isAdmin =
        !!auth?.user?.roles?.some?.((r: any) =>
            ['admin', 'super-admin'].includes(r?.name?.toLowerCase()),
        ) ||
        !!auth?.roles?.some?.((r: string) =>
            ['admin', 'super-admin'].includes(r?.toLowerCase()),
        );

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
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-amber-800 shadow-sm">
                        <Clock size={12} className="mr-1" />
                        En attente
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-emerald-800 shadow-sm">
                        <CheckCircle size={12} className="mr-1" />
                        Validé
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-red-800 shadow-sm">
                        <XCircle size={12} className="mr-1" />
                        Annulé
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
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20 pb-12">
                {/* Header Section */}
                <div className="sticky top-0 z-1 border-b border-amber-200/30 bg-white/80 shadow-lg shadow-amber-500/5 backdrop-blur-xl">
                    <div className="px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <BackButton />

                            <div className="w-full flex-1 text-center sm:w-auto sm:text-left">
                                <h1 className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                                    Transactions
                                </h1>
                                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                                    Gérez vos transactions et leurs informations
                                </p>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="mt-4">
                            <div className="relative mx-auto w-full sm:mx-0 sm:max-w-md">
                                <Search
                                    size={20}
                                    className={`absolute top-1/2 left-3 -translate-y-1/2 transition-colors ${isSearching ? 'animate-pulse text-amber-300' : 'text-amber-500'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Rechercher une transaction..."
                                    className={`w-full rounded-xl border border-amber-200/50 bg-white/80 py-3 pr-10 pl-10 text-sm shadow-sm backdrop-blur-sm transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none ${isSearching ? 'opacity-70' : ''}`}
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-amber-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
                                        aria-label="Effacer"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                )}
                                {isSearching && (
                                    <Loader2
                                        size={18}
                                        className="absolute top-1/2 right-10 -translate-y-1/2 animate-spin text-amber-500"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="transform rounded-2xl border border-amber-200/30 bg-white p-5 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
                                    <CreditCard
                                        size={24}
                                        className="text-white"
                                    />
                                </div>
                                <div className="flex items-center rounded-lg bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-600">
                                    <TrendingUp size={16} className="mr-1" />
                                    Total
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {paymentRequests?.meta?.total || 0}
                            </div>
                            <div className="text-sm text-slate-600">
                                Transactions totales
                            </div>
                        </div>

                        <div className="transform rounded-2xl border border-amber-200/30 bg-white p-5 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
                                    <Clock size={24} className="text-white" />
                                </div>
                                <div className="flex items-center rounded-lg bg-amber-50 px-2 py-1 text-sm font-medium text-amber-600">
                                    <Clock size={16} className="mr-1" />
                                    En attente
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {paymentRequests?.data?.filter(
                                    (p) => p.status === 'pending',
                                ).length || 0}
                            </div>
                            <div className="text-sm text-slate-600">
                                En validation
                            </div>
                        </div>

                        <div className="transform rounded-2xl border border-amber-200/30 bg-white p-5 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
                                    <CheckCircle
                                        size={24}
                                        className="text-white"
                                    />
                                </div>
                                <div className="flex items-center rounded-lg bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-600">
                                    <CheckCircle size={16} className="mr-1" />
                                    Validées
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {paymentRequests?.data?.filter(
                                    (p) => p.status === 'completed',
                                ).length || 0}
                            </div>
                            <div className="text-sm text-slate-600">
                                Transactions réussies
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div
                        className="overflow-hidden rounded-2xl border border-amber-200/30 bg-white shadow-lg shadow-amber-500/10 transition-opacity duration-300"
                        style={{ opacity: isSearching ? 0.6 : 1 }}
                    >
                        {/* Empty State */}
                        {paymentRequests?.data?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                                    <CreditCard
                                        size={32}
                                        className="text-amber-500"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Aucune transaction trouvée
                                </h3>
                                <p className="mt-1 max-w-sm text-slate-500">
                                    {searchQuery
                                        ? 'Aucun résultat ne correspond à votre recherche.'
                                        : "Il n'y a aucune transaction pour le moment."}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                {/* Desktop Table */}
                                <table className="hidden w-full md:table">
                                    <thead className="border-b border-amber-100 bg-amber-50/30">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                #ID
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                Plan
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                Montant
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                Méthode
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                Statut
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-amber-200/30">
                                        {paymentRequests?.data?.map(
                                            (pay, index) => (
                                                <tr
                                                    key={pay.id}
                                                    className="group transition-colors hover:bg-amber-50/40"
                                                >
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-700">
                                                        #{pay.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-slate-900">
                                                                {pay.plan
                                                                    ?.name ||
                                                                    'Sans plan'}
                                                            </span>
                                                            <span className="text-xs text-slate-500">
                                                                {pay.type ===
                                                                'switch'
                                                                    ? 'Changement'
                                                                    : 'Nouveau'}
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
                                                            'Manuel'}
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
                                                            <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity group-hover:opacity-100 sm:opacity-0">
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
                                                                            title="Valider la demande"
                                                                        >
                                                                            <CheckCircle
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            Valider
                                                                        </button>
                                                                        <button
                                                                            className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-800"
                                                                            onClick={() =>
                                                                                handleReject(
                                                                                    pay.id,
                                                                                )
                                                                            }
                                                                            title="Rejeter"
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
                                                                        {pay.status ===
                                                                        'completed'
                                                                            ? 'Validé'
                                                                            : 'Annulé'}
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
                                    {paymentRequests?.data?.map((pay) => (
                                        <div
                                            key={pay.id}
                                            className="last:border--0 border-b border-amber-100 p-4 transition-colors hover:bg-amber-50/30"
                                        >
                                            <div className="mb-3 flex items-start justify-between">
                                                <div>
                                                    <span className="mb-1 block font-mono text-xs text-slate-500">
                                                        #{pay.id}
                                                    </span>
                                                    <h3 className="text-base font-bold text-slate-900">
                                                        {pay.plan?.name ||
                                                            'Sans plan'}
                                                    </h3>
                                                </div>
                                                {getStatusBadge(pay.status)}
                                            </div>

                                            <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="block text-xs text-slate-400">
                                                        Montant
                                                    </span>
                                                    <span className="font-medium text-slate-800">
                                                        {pay.plan?.price
                                                            ? `${pay.plan.price} $`
                                                            : '-'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-slate-400">
                                                        Date
                                                    </span>
                                                    <span className="font-medium text-slate-800">
                                                        {formatDate(
                                                            pay.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="block text-xs text-slate-400">
                                                        Méthode & Réf.
                                                    </span>
                                                    <span className="font-medium text-slate-800">
                                                        {pay.payment_method ??
                                                            'Manuel'}{' '}
                                                        {pay.payment_reference
                                                            ? `(${pay.payment_reference})`
                                                            : ''}
                                                    </span>
                                                </div>
                                            </div>

                                            {isAdmin &&
                                                pay.status === 'pending' && (
                                                    <div className="flex gap-3 border-t border-dashed border-amber-200 pt-3">
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
                                                            Valider
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
                                                            Rejeter
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
                        <div className="flex flex-col-reverse items-center justify-between gap-4 rounded-xl border border-amber-100 bg-white/50 p-4 backdrop-blur-sm sm:flex-row">
                            <div className="order-2 text-sm font-medium text-slate-600 sm:order-1">
                                Affichage de{' '}
                                <span className="text-amber-700">
                                    {paymentRequests?.meta?.from ??
                                        (paymentRequests as any)?.from ??
                                        0}
                                </span>{' '}
                                à{' '}
                                <span className="text-amber-700">
                                    {paymentRequests?.meta?.to ??
                                        (paymentRequests as any)?.to ??
                                        0}
                                </span>{' '}
                                sur{' '}
                                <span className="text-amber-700">
                                    {paymentRequests?.meta?.total ??
                                        (paymentRequests as any)?.total ??
                                        0}
                                </span>
                            </div>

                            {/* Scrollable Container for Mobile */}
                            <div className="order-1 w-full sm:order-2 sm:w-auto">
                                <div className="hide-scrollbar flex items-center justify-start gap-2 overflow-x-auto px-1 pb-2 sm:justify-center sm:pb-0">
                                    {paymentRequests?.links?.map(
                                        (link, index) => (
                                            <button
                                                key={index}
                                                className={`flex-shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                                    link.active
                                                        ? 'scale-105 transform border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/30'
                                                        : 'border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50 grayscale' : ''}`}
                                                disabled={!link.url}
                                                onClick={() => goTo(link.url)}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Dashboard>
    );
}
