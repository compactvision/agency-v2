import SubscriptionPopup from '@/components/forms/SubscriptionPopup';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    ImageOff,
    Package as PackageIcon,
    Plus,
    Search,
    User,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type Subscription = {
    id: number;
    plan: { name: string; price: string; duration: string };
    user: { name: string; email: string };
    starts_at?: string | null;
    ends_at?: string | null;
    starts_at_formatted?: string | null;
    ends_at_formatted?: string | null;
    is_active: boolean;
};

type Plan = {
    id: number;
    name: string;
    price: string;
    duration: string;
};

type PageProps = {
    subscriptions: {
        data: Subscription[];
        meta: { current_page: number; last_page: number; total: number };
        links: { url: string | null; label: string; active: boolean }[];
    };
    hasActiveSubscription: boolean;
    currentPlan?: { plan_id: number } | null;
    plans: Plan[];
    filters?: { search?: string };
};

export default function Package({
    subscriptions = {
        data: [],
        meta: { current_page: 1, last_page: 1, total: 0 },
        links: [],
    },
    hasActiveSubscription = false,
    currentPlan = null,
    plans = [],
    filters = {},
}: PageProps) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');
    const [isSearching, setIsSearching] = useState(false);

    const openSubscribePopup = () => {
        setIsSubscribing(false);
        setIsPopupOpen(true);
    };
    const openChangeSubscribePopup = () => {
        setIsSubscribing(true);
        setIsPopupOpen(true);
    };
    const closePopup = () => {
        setIsPopupOpen(false);
        setIsSubscribing(false);
    };

    // format fallback si jamais tu envoies l'ISO
    const fmt = (iso?: string | null) =>
        iso
            ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(
                  new Date(iso),
              )
            : '—';

    // Debounce + reload partiel
    useEffect(() => {
        const t = setTimeout(() => {
            router.get(
                route('dashboard.subscriptions.index'),
                { search: searchQuery || undefined },
                {
                    only: ['subscriptions', 'plans', 'filters'],
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

    // Pagination qui conserve le search
    const goTo = (url: string | null) => {
        if (!url) return;
        const u = new URL(url, window.location.origin);
        if (searchQuery) u.searchParams.set('search', searchQuery);
        else u.searchParams.delete('search');
        router.visit(u.toString(), {
            only: ['subscriptions', 'plans', 'filters'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onStart: () => setIsSearching(true),
            onFinish: () => setIsSearching(false),
        });
    };

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6">
                        <BackButton />
                        <div className="mt-4 overflow-hidden rounded-xl border border-amber-200/30 bg-white shadow-sm">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    <div className="mb-6 lg:mb-0">
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Package
                                        </h1>
                                        <p className="mt-1 text-gray-600">
                                            Gérez vos packages et leurs
                                            informations
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="min-w-[120px] rounded-lg bg-amber-50 p-4 text-center">
                                            <span className="block text-2xl font-bold text-amber-600">
                                                {subscriptions.data.length}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                Package
                                            </span>
                                        </div>
                                        <div className="min-w-[120px] rounded-lg bg-emerald-50 p-4 text-center">
                                            <span className="block text-2xl font-bold text-emerald-600">
                                                {
                                                    subscriptions.data.filter(
                                                        (sub) => sub.is_active,
                                                    ).length
                                                }
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                Actives
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className="mb-6">
                        <div className="rounded-xl border border-amber-200/30 bg-white p-4 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div
                                    className={`relative flex-1 ${isSearching ? 'opacity-70' : ''}`}
                                >
                                    <Search
                                        size={20}
                                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un package..."
                                        className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex items-center">
                                    {hasActiveSubscription ? (
                                        <button
                                            className="inline-flex transform items-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-3 font-medium text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700"
                                            onClick={openChangeSubscribePopup}
                                        >
                                            <Plus size={18} className="mr-2" />
                                            <span>Changer le plan</span>
                                        </button>
                                    ) : (
                                        <button
                                            className="inline-flex transform items-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-3 font-medium text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700"
                                            onClick={openSubscribePopup}
                                        >
                                            <Plus size={18} className="mr-2" />
                                            <span>Souscrire à un plan</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-hidden rounded-xl border border-amber-200/30 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            {/* Desktop Table */}
                            <table className="hidden w-full md:table">
                                <thead className="bg-amber-50/30">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                            ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                            Utilisateur
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                            Current Package
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                            Duration
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                            Start
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                            End
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-200/30">
                                    {subscriptions.data.map((sub, index) => (
                                        <tr
                                            key={sub.id}
                                            className="transition-colors hover:bg-amber-50/30"
                                            style={{
                                                animationDelay: `${index * 0.05}s`,
                                            }}
                                        >
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                #{sub.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                                                        <User
                                                            size={16}
                                                            className="text-amber-600"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {sub.user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {sub.user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                                        <PackageIcon
                                                            size={16}
                                                            className="text-blue-600"
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-900">
                                                        {sub.plan.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                {sub.plan.duration}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                <div className="flex items-center">
                                                    <Calendar
                                                        size={16}
                                                        className="mr-2 text-gray-400"
                                                    />
                                                    {sub.starts_at_formatted ??
                                                        fmt(sub.starts_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                <div className="flex items-center">
                                                    <Calendar
                                                        size={16}
                                                        className="mr-2 text-gray-400"
                                                    />
                                                    {sub.ends_at_formatted ??
                                                        fmt(sub.ends_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        sub.is_active
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {sub.is_active ? (
                                                        <>
                                                            <CheckCircle
                                                                size={12}
                                                                className="mr-1"
                                                            />
                                                            Actif
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle
                                                                size={12}
                                                                className="mr-1"
                                                            />
                                                            Inactif
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile Cards */}
                            <div className="md:hidden">
                                {subscriptions.data.map((sub, index) => (
                                    <div
                                        key={sub.id}
                                        className="border-b border-amber-200/30 p-4 last:border-b-0"
                                        style={{
                                            animationDelay: `${index * 0.05}s`,
                                        }}
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex items-center">
                                                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                                                    <User
                                                        size={20}
                                                        className="text-amber-600"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-medium text-gray-900">
                                                        {sub.user.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {sub.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    sub.is_active
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {sub.is_active ? (
                                                    <>
                                                        <CheckCircle
                                                            size={12}
                                                            className="mr-1"
                                                        />
                                                        Actif
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle
                                                            size={12}
                                                            className="mr-1"
                                                        />
                                                        Inactif
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        <div className="mb-3 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">
                                                    Package
                                                </span>
                                                <span className="text-sm text-gray-900">
                                                    {sub.plan.name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">
                                                    Durée
                                                </span>
                                                <span className="text-sm text-gray-900">
                                                    {sub.plan.duration}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">
                                                    Début
                                                </span>
                                                <span className="text-sm text-gray-900">
                                                    {sub.starts_at_formatted ??
                                                        fmt(sub.starts_at)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">
                                                    Fin
                                                </span>
                                                <span className="text-sm text-gray-900">
                                                    {sub.ends_at_formatted ??
                                                        fmt(sub.ends_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {subscriptions.data.length === 0 && (
                                    <div className="py-12 text-center">
                                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-amber-100/50">
                                            <ImageOff
                                                size={32}
                                                className="text-amber-500"
                                            />
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                            Aucun abonnement trouvé
                                        </h3>
                                        <p className="text-gray-600">
                                            Il n'y a pas encore d'abonnement
                                            enregistré.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex flex-col items-center justify-between sm:flex-row">
                        <div className="mb-4 text-sm text-gray-700 sm:mb-0">
                            {/* Affichage de {subscriptions.data.length} sur {subscriptions.meta.total} abonnements */}
                        </div>
                        <div className="flex space-x-1">
                            {subscriptions.links.map((link, index) => (
                                <button
                                    key={index}
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                                        link.active
                                            ? 'bg-amber-500 text-white'
                                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
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

                {isPopupOpen && (
                    <SubscriptionPopup
                        plans={plans}
                        onClose={closePopup}
                        isSubscribing={isSubscribing}
                        currentPlanId={currentPlan?.plan_id ?? undefined}
                    />
                )}
            </div>
        </Dashboard>
    );
}
