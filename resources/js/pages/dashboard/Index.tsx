import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Building, Home, Eye, Heart, Clock, TrendingUp, FileText, CheckCircle, AlertCircle, XCircle, Plus, Filter, MoreVertical, MapPin } from 'lucide-react';

type DashboardMetrics = {
    properties: { total: number; unapproved: number };
    views: { total: number };
    favorites: { total: number };
};

type StatusInput = boolean | 0 | 1 | '0' | '1' | 'approved' | 'pending' | 'rejected' | 'true' | 'false' | null | undefined;

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
    const { properties, logs, metrics } = usePage<DashboardPageProps>().props;

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
        const animateValue = (start: number, end: number, duration: number, callback: (v: number) => void) => {
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + (end - start) * easeOutCubic);

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

                        animateValue(0, statsData.properties, 2000, (val) => setAnimatedStats((prev) => ({ ...prev, properties: val })));
                        animateValue(0, statsData.pending, 1500, (val) => setAnimatedStats((prev) => ({ ...prev, pending: val })));
                        animateValue(0, statsData.views, 2200, (val) => setAnimatedStats((prev) => ({ ...prev, views: val })));
                        animateValue(0, statsData.favorites, 1800, (val) => setAnimatedStats((prev) => ({ ...prev, favorites: val })));
                    }
                });
            },
            { threshold: 0.3 },
        );

        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, [statsData.properties, statsData.pending, statsData.views, statsData.favorites]);

    const formatStatValue = (value: number, key: keyof typeof animatedStats) => {
        if (key === 'properties' || key === 'views') {
            return value >= 1000 ? `${(value / 1000).toFixed(1)}k+` : value.toString();
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

    const normalizeStatus = (s: StatusInput): 'approved' | 'pending' | 'rejected' => {
        if (typeof s === 'boolean') return s ? 'approved' : 'pending';
        if (s === 1 || s === '1' || s === 'true' || s === 'approved') return 'approved';
        if (s === 0 || s === '0' || s === 'false' || s === 'pending') return 'pending';
        if (s === 'rejected') return 'rejected';
        return 'pending';
    };

    const getStatusBadge = (status: StatusInput) => {
        const statusKey = normalizeStatus(status);

        const map = {
            approved: { 
                label: 'Approuvé', 
                className: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200', 
                icon: CheckCircle,
                color: 'text-emerald-600'
            },
            pending: { 
                label: 'En attente', 
                className: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200', 
                icon: Clock,
                color: 'text-amber-600'
            },
            rejected: { 
                label: 'Rejeté', 
                className: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200', 
                icon: XCircle,
                color: 'text-red-600'
            },
        } as const;

        const cfg = map[statusKey];
        const Icon = cfg.icon;

        return (
            <span className={cfg.className} aria-label={cfg.label} title={cfg.label}>
                <Icon size={10} className={`mr-1 ${cfg.color}`} />
                <span className="hidden sm:inline">{cfg.label}</span>
            </span>
        );
    };

    const recentProperties = properties?.slice(0, 6);

    return (
        <Dashboard>
            <div className="w-full h-full space-y-4 sm:space-y-6 lg:space-y-8 px-2 sm:px-4 lg:px-0">
                {/* Stats Section - Responsive Parfait */}
                <section ref={statsRef} className="w-full">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full">
                        {/* Properties Card */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-4 sm:p-6 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                    <Building className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div className="hidden sm:flex items-center text-amber-600 text-xs sm:text-sm font-medium">
                                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    +12%
                                </div>
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                                {formatStatValue(animatedStats.properties, 'properties')}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 font-medium">Propriétés</div>
                        </div>

                        {/* Pending Card */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-4 sm:p-6 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div className="hidden sm:flex items-center text-amber-600 text-xs sm:text-sm font-medium">
                                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    Review
                                </div>
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                                {formatStatValue(animatedStats.pending, 'pending')}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 font-medium">En Attente</div>
                        </div>

                        {/* Views Card */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-4 sm:p-6 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                    <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div className="hidden sm:flex items-center text-emerald-600 text-xs sm:text-sm font-medium">
                                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    +24%
                                </div>
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                                {formatStatValue(animatedStats.views, 'views')}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 font-medium">Vues Totales</div>
                        </div>

                        {/* Favorites Card */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-4 sm:p-6 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div className="hidden sm:flex items-center text-amber-600 text-xs sm:text-sm font-medium">
                                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    +8%
                                </div>
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                                {formatStatValue(animatedStats.favorites, 'favorites')}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 font-medium">Favoris</div>
                        </div>
                    </div>
                </section>

                {/* Content Section - Responsive Parfait */}
                <section className="w-full">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
                        {/* Properties Section */}
                        <div className="xl:col-span-2 w-full">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 mr-2 sm:mr-3">
                                            <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-slate-900">Propriétés Récentes</h3>
                                    </div>
                                    <button 
                                        onClick={() => router.visit(route('dashboard.properties.index'))} 
                                        className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl font-medium hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/30 text-sm"
                                    >
                                        <span className="hidden sm:inline">Voir toutes</span>
                                        <span className="sm:hidden">Tout</span>
                                        <Filter className="w-4 h-4 ml-2" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 w-full">
                                    {recentProperties.length === 0 ? (
                                        <div className="col-span-full text-center py-8 sm:py-12">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-amber-100/50 flex items-center justify-center">
                                                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                                            </div>
                                            <h4 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Aucune propriété</h4>
                                            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">Ajoutez votre première propriété pour commencer</p>
                                            <button className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl font-medium hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/30 text-sm">
                                                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                                Ajouter une propriété
                                            </button>
                                        </div>
                                    ) : (
                                        recentProperties.map((property) => (
                                            <Link
                                                key={property.id}
                                                href={route ? route('property.show', property.id) : `/properties/${property.id}`}
                                                className="block p-3 sm:p-4 bg-gradient-to-r from-amber-50/50 to-white rounded-xl border border-amber-200/30 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1 group w-full"
                                            >
                                                <div className="flex flex-col space-y-2 sm:space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <h4 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-amber-700 transition-colors duration-200 flex-1 pr-2">
                                                            {property.title}
                                                        </h4>
                                                        {getStatusBadge(property.is_approved)}
                                                    </div>
                                                    
                                                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                                                        <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-medium">
                                                            <Building className="w-3 h-3 mr-1" />
                                                            {property.type}
                                                        </span>
                                                        <span className="text-xs sm:text-sm text-slate-600 flex items-center">
                                                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-amber-500" />
                                                            <span className="truncate">{property.location}</span>
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-lg sm:text-xl sm:text-2xl font-bold text-transparent bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text">
                                                            {formatPrice(property.price)}
                                                        </div>
                                                        <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-slate-600">
                                                            <span className="flex items-center">
                                                                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-amber-500" />
                                                                {property.views_count || 0}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-red-500" />
                                                                {property.favorites_count || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="text-xs text-slate-500">
                                                        {formatDate(property.created_at)}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Messages/Logs Section */}
                        <div className="xl:col-span-1 w-full">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-4 sm:p-6">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 mr-2 sm:mr-3">
                                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">Activité Récente</h3>
                                </div>

                                <div className="space-y-3 sm:space-y-4 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
                                    {logs.length === 0 ? (
                                        <div className="text-center py-6 sm:py-8">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 rounded-2xl bg-amber-100/50 flex items-center justify-center">
                                                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
                                            </div>
                                            <p className="text-slate-600 text-sm">Aucune activité récente</p>
                                        </div>
                                    ) : (
                                        logs.slice(0, 8).map((log) => (
                                            <div
                                                key={log.id}
                                                className={`p-3 sm:p-4 rounded-xl border transition-all duration-200 ${
                                                    log.unread 
                                                        ? 'bg-amber-50/50 border-amber-200/50' 
                                                        : 'bg-white border-slate-200/30 hover:border-amber-200/50'
                                                }`}
                                            >
                                                <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-2">
                                                    <span className="font-medium text-slate-900 text-sm">{log.action}</span>
                                                    <span className="text-xs text-slate-500">
                                                        {formatDate(log.created_at)}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-slate-700 mb-2">{log.description}</div>
                                                <div className="flex items-center justify-between">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        log.level === 'info' ? 'bg-blue-100 text-blue-800' :
                                                        log.level === 'warning' ? 'bg-amber-100 text-amber-800' :
                                                        log.level === 'error' ? 'bg-red-100 text-red-800' :
                                                        'bg-slate-100 text-slate-800'
                                                    }`}>
                                                        {log.level}
                                                    </span>
                                                    {log.unread && (
                                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
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