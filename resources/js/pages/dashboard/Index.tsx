import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import { Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Building,
    CheckCircle,
    Clock,
    Eye,
    FileText,
    Filter,
    Heart,
    Home,
    MapPin,
    Plus,
    TrendingUp,
    XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type DashboardMetrics = {
    properties: { total: number; unapproved: number };
    views: { total: number };
    favorites: { total: number };
};

type StatusInput =
    | boolean
    | 0
    | 1
    | '0'
    | '1'
    | 'approved'
    | 'pending'
    | 'rejected'
    | 'true'
    | 'false'
    | null
    | undefined;

type Property = {
    id: number;
    title: string;
    price: number;
    location: string;
    type: string;
    is_approved: StatusInput;
    created_at: string;
    views_count?: number;
    favorites_count?: number;
};

type DashboardPageProps = {
    user: any;
    properties: Property[];
    logs: any[];
    metrics?: DashboardMetrics;
};

export default function DashboardIndex() {
    const {
        properties = [],
        logs = [],
        metrics = {
            properties: { total: 0, unapproved: 0 },
            views: { total: 0 },
            favorites: { total: 0 },
        },
    } = usePage<DashboardPageProps>().props;

    const [animatedStats, setAnimatedStats] = useState({
        properties: 0,
        pending: 0,
        views: 0,
        favorites: 0,
    });

    const statsRef = useRef<HTMLDivElement | null>(null);
    const hasAnimated = useRef(false);

    /* ✅ Sécurise metrics (évite undefined) */
    const statsData = {
        properties: metrics?.properties?.total ?? 0,
        pending: metrics?.properties?.unapproved ?? 0,
        views: metrics?.views?.total ?? 0,
        favorites: metrics?.favorites?.total ?? 0,
    };

    // Animation des statistiques
    useEffect(() => {
        const animateValue = (
            start: number,
            end: number,
            duration: number,
            callback: (v: number) => void,
        ) => {
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(
                    start + (end - start) * easeOutCubic,
                );

                callback(current);

                if (progress < 1) requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true;

                        animateValue(0, statsData.properties, 2000, (val) =>
                            setAnimatedStats((prev) => ({
                                ...prev,
                                properties: val,
                            })),
                        );
                        animateValue(0, statsData.pending, 1500, (val) =>
                            setAnimatedStats((prev) => ({
                                ...prev,
                                pending: val,
                            })),
                        );
                        animateValue(0, statsData.views, 2200, (val) =>
                            setAnimatedStats((prev) => ({
                                ...prev,
                                views: val,
                            })),
                        );
                        animateValue(0, statsData.favorites, 1800, (val) =>
                            setAnimatedStats((prev) => ({
                                ...prev,
                                favorites: val,
                            })),
                        );
                    }
                });
            },
            { threshold: 0.3 },
        );

        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, [
        statsData.properties,
        statsData.pending,
        statsData.views,
        statsData.favorites,
    ]);

    const formatStatValue = (
        value: number,
        key: keyof typeof animatedStats,
    ) => {
        if (key === 'properties' || key === 'views') {
            return value >= 1000
                ? `${(value / 1000).toFixed(1)}k+`
                : value.toString();
        }
        return value.toString().padStart(2, '0');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'short',
        })
            .format(date)
            .toUpperCase();
    };

    const normalizeStatus = (
        s: StatusInput,
    ): 'approved' | 'pending' | 'rejected' => {
        if (typeof s === 'boolean') return s ? 'approved' : 'pending';
        if (s === 1 || s === '1' || s === 'true' || s === 'approved')
            return 'approved';
        if (s === 0 || s === '0' || s === 'false' || s === 'pending')
            return 'pending';
        if (s === 'rejected') return 'rejected';
        return 'pending';
    };

    const getStatusBadge = (status: StatusInput) => {
        const statusKey = normalizeStatus(status);

        const map = {
            approved: {
                label: 'Approuvé',
                className:
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200',
                icon: CheckCircle,
                color: 'text-emerald-600',
            },
            pending: {
                label: 'En attente',
                className:
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200',
                icon: Clock,
                color: 'text-amber-600',
            },
            rejected: {
                label: 'Rejeté',
                className:
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200',
                icon: XCircle,
                color: 'text-red-600',
            },
        } as const;

        const cfg = map[statusKey];
        const Icon = cfg.icon;

        return (
            <span
                className={cfg.className}
                aria-label={cfg.label}
                title={cfg.label}
            >
                <Icon size={10} className={`mr-1 ${cfg.color}`} />
                <span className="hidden sm:inline">{cfg.label}</span>
            </span>
        );
    };

    const recentProperties = (properties || []).slice(0, 6);

    return (
        <Dashboard>
            <div className="h-full w-full space-y-4 px-2 sm:space-y-6 sm:px-4 lg:space-y-8 lg:px-0">
                {/* Stats Section - Responsive Parfait */}
                <section ref={statsRef} className="w-full">
                    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
                        {/* Properties Card */}
                        <div className="transform rounded-xl border border-amber-200/30 bg-white p-4 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20 sm:rounded-2xl sm:p-6">
                            <div className="mb-3 flex items-center justify-between sm:mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 sm:h-12 sm:w-12">
                                    <Building className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                                <div className="hidden items-center text-xs font-medium text-amber-600 sm:flex sm:text-sm">
                                    <TrendingUp className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                    +12%
                                </div>
                            </div>
                            <div className="mb-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                                {formatStatValue(
                                    animatedStats.properties,
                                    'properties',
                                )}
                            </div>
                            <div className="text-xs font-medium text-slate-600 sm:text-sm">
                                Propriétés
                            </div>
                        </div>

                        {/* Pending Card */}
                        <div className="transform rounded-xl border border-amber-200/30 bg-white p-4 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20 sm:rounded-2xl sm:p-6">
                            <div className="mb-3 flex items-center justify-between sm:mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 sm:h-12 sm:w-12">
                                    <Clock className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                                <div className="hidden items-center text-xs font-medium text-amber-600 sm:flex sm:text-sm">
                                    <AlertCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                    Review
                                </div>
                            </div>
                            <div className="mb-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                                {formatStatValue(
                                    animatedStats.pending,
                                    'pending',
                                )}
                            </div>
                            <div className="text-xs font-medium text-slate-600 sm:text-sm">
                                En Attente
                            </div>
                        </div>

                        {/* Views Card */}
                        <div className="transform rounded-xl border border-amber-200/30 bg-white p-4 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20 sm:rounded-2xl sm:p-6">
                            <div className="mb-3 flex items-center justify-between sm:mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 sm:h-12 sm:w-12">
                                    <Eye className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                                <div className="hidden items-center text-xs font-medium text-emerald-600 sm:flex sm:text-sm">
                                    <TrendingUp className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                    +24%
                                </div>
                            </div>
                            <div className="mb-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                                {formatStatValue(animatedStats.views, 'views')}
                            </div>
                            <div className="text-xs font-medium text-slate-600 sm:text-sm">
                                Vues Totales
                            </div>
                        </div>

                        {/* Favorites Card */}
                        <div className="transform rounded-xl border border-amber-200/30 bg-white p-4 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20 sm:rounded-2xl sm:p-6">
                            <div className="mb-3 flex items-center justify-between sm:mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 sm:h-12 sm:w-12">
                                    <Heart className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                                <div className="hidden items-center text-xs font-medium text-amber-600 sm:flex sm:text-sm">
                                    <TrendingUp className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                    +8%
                                </div>
                            </div>
                            <div className="mb-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                                {formatStatValue(
                                    animatedStats.favorites,
                                    'favorites',
                                )}
                            </div>
                            <div className="text-xs font-medium text-slate-600 sm:text-sm">
                                Favoris
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Section - Responsive Parfait */}
                <section className="w-full">
                    <div className="grid w-full grid-cols-1 gap-4 sm:gap-6 lg:gap-8 xl:grid-cols-3">
                        {/* Properties Section */}
                        <div className="w-full xl:col-span-2">
                            <div className="rounded-xl border border-amber-200/30 bg-white p-4 shadow-lg shadow-amber-500/10 sm:rounded-2xl sm:p-6">
                                <div className="mb-4 flex flex-col justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center">
                                    <div className="flex items-center">
                                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 sm:mr-3 sm:h-10 sm:w-10">
                                            <Home className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                                            Propriétés Récentes
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                route(
                                                    'dashboard.properties.index',
                                                ),
                                            )
                                        }
                                        className="flex transform items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700 sm:px-4"
                                    >
                                        <span className="hidden sm:inline">
                                            Voir toutes
                                        </span>
                                        <span className="sm:hidden">Tout</span>
                                        <Filter className="ml-2 h-4 w-4" />
                                    </button>
                                </div>

                                <div className="grid w-full grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
                                    {recentProperties.length === 0 ? (
                                        <div className="col-span-full py-8 text-center sm:py-12">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100/50 sm:h-20 sm:w-20">
                                                <FileText className="h-8 w-8 text-amber-500 sm:h-10 sm:w-10" />
                                            </div>
                                            <h4 className="mb-2 text-base font-semibold text-slate-900 sm:text-lg">
                                                Aucune propriété
                                            </h4>
                                            <p className="mb-4 text-sm text-slate-600 sm:mb-6 sm:text-base">
                                                Ajoutez votre première propriété
                                                pour commencer
                                            </p>
                                            <button className="inline-flex transform items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700 sm:px-6 sm:py-3">
                                                <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                                Ajouter une propriété
                                            </button>
                                        </div>
                                    ) : (
                                        recentProperties.map((property) => (
                                            <Link
                                                key={property.id}
                                                href={
                                                    route
                                                        ? route(
                                                              'property.show',
                                                              property.id,
                                                          )
                                                        : `/properties/${property.id}`
                                                }
                                                className="group block w-full transform rounded-xl border border-amber-200/30 bg-gradient-to-r from-amber-50/50 to-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/20 sm:p-4"
                                            >
                                                <div className="flex flex-col space-y-2 sm:space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <h4 className="flex-1 pr-2 text-base font-semibold text-slate-900 transition-colors duration-200 group-hover:text-amber-700 sm:text-lg">
                                                            {property.title}
                                                        </h4>
                                                        {getStatusBadge(
                                                            property.is_approved,
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                                                        <span className="inline-flex items-center rounded-lg bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 sm:px-3">
                                                            <Building className="mr-1 h-3 w-3" />
                                                            {property.type}
                                                        </span>
                                                        <span className="flex items-center text-xs text-slate-600 sm:text-sm">
                                                            <MapPin className="mr-1 h-3 w-3 text-amber-500 sm:h-4 sm:w-4" />
                                                            <span className="truncate">
                                                                {
                                                                    property.location
                                                                }
                                                            </span>
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-lg font-bold text-transparent sm:text-2xl sm:text-xl">
                                                            {formatPrice(
                                                                property.price,
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-xs text-slate-600 sm:space-x-3 sm:text-sm">
                                                            <span className="flex items-center">
                                                                <Eye className="mr-1 h-3 w-3 text-amber-500 sm:h-4 sm:w-4" />
                                                                {property.views_count ||
                                                                    0}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Heart className="mr-1 h-3 w-3 text-red-500 sm:h-4 sm:w-4" />
                                                                {property.favorites_count ||
                                                                    0}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="text-xs text-slate-500">
                                                        {formatDate(
                                                            property.created_at,
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Messages/Logs Section */}
                        <div className="w-full xl:col-span-1">
                            <div className="rounded-xl border border-amber-200/30 bg-white p-4 shadow-lg shadow-amber-500/10 sm:rounded-2xl sm:p-6">
                                <div className="mb-4 flex items-center sm:mb-6">
                                    <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 sm:mr-3 sm:h-10 sm:w-10">
                                        <FileText className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                                        Activité Récente
                                    </h3>
                                </div>

                                <div className="max-h-64 space-y-3 overflow-y-auto sm:max-h-80 sm:space-y-4 lg:max-h-96">
                                    {logs.length === 0 ? (
                                        <div className="py-6 text-center sm:py-8">
                                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100/50 sm:h-16 sm:w-16">
                                                <FileText className="h-6 w-6 text-amber-500 sm:h-8 sm:w-8" />
                                            </div>
                                            <p className="text-sm text-slate-600">
                                                Aucune activité récente
                                            </p>
                                        </div>
                                    ) : (
                                        logs.slice(0, 8).map((log) => (
                                            <div
                                                key={log.id}
                                                className={`rounded-xl border p-3 transition-all duration-200 sm:p-4 ${
                                                    log.unread
                                                        ? 'border-amber-200/50 bg-amber-50/50'
                                                        : 'border-slate-200/30 bg-white hover:border-amber-200/50'
                                                }`}
                                            >
                                                <div className="mb-2 flex flex-col space-y-1 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                                    <span className="text-sm font-medium text-slate-900">
                                                        {log.action}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {formatDate(
                                                            log.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="mb-2 text-sm text-slate-700">
                                                    {log.description}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                            log.level === 'info'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : log.level ===
                                                                    'warning'
                                                                  ? 'bg-amber-100 text-amber-800'
                                                                  : log.level ===
                                                                      'error'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-slate-100 text-slate-800'
                                                        }`}
                                                    >
                                                        {log.level}
                                                    </span>
                                                    {log.unread && (
                                                        <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Dashboard>
    );
}
