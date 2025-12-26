// resources/js/Pages/Dashboard/Tarifs.jsx
import TarifPopup from '@/components/forms/TarifPopup';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { router, usePage } from '@inertiajs/react';
import { Building, CheckCircle, Edit3, Plus, Search, Star, Trash2, TrendingUp, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

/**
 * Small internal debounce hook (lightweight)
 */
function useDebounce<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

type Plan = {
    id?: number;
    name: string;
    price: string | number;
    duration: string;
    listing_limit: number | null;
    image_limit: number | null;
    is_featured: boolean;
    highlight_homepage: boolean;
    priority_support: boolean;
    analytics_access: boolean;
    description: string | null;
    features: { name: string }[];
    image?: string | null;
};

type PaginationLink = { url: string | null; label: string; active: boolean };
type Meta = { current_page: number; from: number; to: number; total: number };
type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    meta?: Meta;
};

export default function Tarifs() {
    const page = usePage();
    const props = page.props as unknown as { plans: Paginated<Plan>; filters?: { search?: string } };

    const { plans } = props;
    const [searchQuery, setSearchQuery] = useState(props.filters?.search ?? '');
    const [loading, setLoading] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Modal / form state
    const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Pagination and navigation
    useEffect(() => {
        router.get(
            route('dashboard.plans.index'),
            { search: debouncedSearch, page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['plans', 'filters'],
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const goTo = (url: string | null) => {
        if (!url) return;
        const u = new URL(url, window.location.origin);
        if (searchQuery) u.searchParams.set('search', searchQuery);
        router.visit(u.toString(), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleOpenCreate = () => {
        setCurrentPlan(null);
        setEditMode(false);
        setIsOpen(true);
    };

    const handleOpenEdit = (plan: Plan | null) => {
        setCurrentPlan(plan);
        setEditMode(true);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setCurrentPlan(null);
        setEditMode(false);
    };

    const deletePlan = (id?: number) => {
        if (!id) return;
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tarif ?')) {
            router.delete(route('dashboard.plans.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Tarif supprimé avec succès');
                },
                onError: (err) => {
                    console.error(err);
                    toast.error('Impossible de supprimer ce tarif.');
                },
            });
        }
    };

    // StatCard component (local)
    const StatCard = ({ title, value, type, delay = 0 }: { title: string; value: number | string; type: string; delay?: number }) => {
        const iconMap: Record<string, any> = {
            total: TrendingUp,
            plans: Star,
            active: CheckCircle,
            featured: Star,
        };
        const colorMap: Record<string, string> = {
            total: 'from-blue-400 to-blue-600',
            plans: 'from-emerald-400 to-emerald-600',
            active: 'from-emerald-400 to-emerald-600',
            featured: 'from-amber-400 to-amber-600',
        };

        const Icon = iconMap[type] || TrendingUp;
        const gradient = colorMap[type] || 'from-gray-400 to-gray-600';

        return (
            <article
                className="transform overflow-hidden rounded-2xl border border-amber-200/30 bg-white shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20"
                style={{ animationDelay: `${delay}ms` }}
            >
                <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900">{title}</h4>
                            <p className="text-sm text-gray-500">#{value || 0}</p>
                        </div>
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                            <Icon size={24} className="text-white" />
                        </div>
                    </div>
                    <div className={`h-1 bg-gradient-to-r ${gradient} rounded-full`} />
                </div>
            </article>
        );
    };

    const ChartIcon = ({ type, size = 20 }: { type: string; size?: number }) => {
        const iconMap: Record<string, any> = {
            line: TrendingUp,
            doughnut: Star,
        };
        const Icon = iconMap[type];
        return Icon ? <Icon size={size} className="text-amber-500" /> : null;
    };

    // Memoize counts for readability
    const featuredCount = useMemo(() => plans.data.filter((p) => p.is_featured).length, [plans.data]);
    const standardCount = useMemo(() => plans.data.filter((p) => !p.is_featured).length, [plans.data]);

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <BackButton />
                        <div className="mt-4 overflow-hidden rounded-xl border-amber-200/30 bg-white shadow-sm">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    <div className="mb-6 lg:mb-0">
                                        <h1 className="text-2xl font-bold text-gray-900">Tarifs</h1>
                                        <p className="mt-1 text-gray-600">Gérez vos tarifs et leurs fonctionnalités</p>
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <StatCard title="Total tarifs" value={plans.data.length} type="total" delay={0} />
                                    <StatCard title="Tarifs en vedette" value={featuredCount} type="featured" delay={100} />
                                    <StatCard title="Tarifs standards" value={standardCount} type="plans" delay={200} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mb-6">
                        <div className="rounded-xl border-amber-200/30 bg-white p-4 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="relative flex-1">
                                    <Search size={20} className="absolute top-1/2 left-3 -translate-y-1/2 text-amber-500" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un tarif..."
                                        className={`w-full rounded-lg border border-gray-300 bg-white py-3 pr-10 pl-10 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none ${loading ? 'opacity-70' : ''}`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-amber-400 transition-colors hover:text-amber-600"
                                            aria-label="Effacer"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleOpenCreate}
                                        className="inline-flex transform items-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-3 font-medium text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700"
                                    >
                                        <Plus size={18} className="mr-2" />
                                        <span className="hidden sm:inline">Nouveau tarif</span>
                                        <span className="sm:hidden">Ajouter</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table/Card container */}
                    <div className="overflow-hidden rounded-xl border-amber-200/30 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            {/* Desktop Table */}
                            <table className="hidden w-full md:table">
                                <thead className="bg-amber-50/30">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                            Nom du tarif
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">Prix</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">Durée</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">Populaire</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">Statut</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-200/30">
                                    {plans.data.map((plan, index) => (
                                        <tr
                                            key={plan.id ?? index}
                                            className="transition-colors hover:bg-amber-50/30"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 overflow-hidden rounded-full">
                                                        {plan.is_featured && plan.image ? (
                                                            <img
                                                                src={`/storage/${plan.image}`}
                                                                alt={plan.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600">
                                                                <Star size={16} className="text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900">{plan.name}</h4>
                                                        <p className="text-xs text-gray-500">#{plan.id}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-2xl font-bold text-amber-600">{plan.price}</span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">{plan.duration}</span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                                                    <CheckCircle size={12} />
                                                    <span>Populaire</span>
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800">
                                                    <CheckCircle size={12} />
                                                    <span className="ml-1">Standard</span>
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="rounded-lg p-1 text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-900"
                                                        onClick={() => handleOpenEdit(plan)}
                                                        title="Modifier"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        className="rounded-lg p-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-900"
                                                        onClick={() => deletePlan(plan.id)}
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile Cards */}
                            <div className="md:hidden">
                                {plans.data.map((plan, index) => (
                                    <div
                                        key={plan.id ?? index}
                                        className="border-b border-amber-200/30 p-4 last:border-b-0"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex items-center">
                                                <div className="mr-3 h-12 w-12 overflow-hidden rounded-full">
                                                    {plan.is_featured && plan.image ? (
                                                        <img src={`/storage/${plan.image}`} alt={plan.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600">
                                                            <Star size={16} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-medium text-gray-900">{plan.name}</h3>
                                                    <p className="text-sm text-gray-500">#{plan.id}</p>
                                                </div>
                                            </div>

                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${plan.is_featured ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}
                                            >
                                                {plan.is_featured ? (
                                                    <>
                                                        <CheckCircle size={12} className="mr-1" />
                                                        <span>Populaire</span>
                                                    </>
                                                ) : (
                                                    <span>Standard</span>
                                                )}
                                            </span>
                                        </div>

                                        <div className="mb-3 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Prix</span>
                                                <span className="text-sm text-gray-900">{plan.price}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Durée</span>
                                                <span className="text-sm text-gray-900">{plan.duration}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="rounded-lg p-2 text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-900"
                                                onClick={() => handleOpenEdit(plan)}
                                                title="Modifier"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-900"
                                                onClick={() => deletePlan(plan.id)}
                                                title="Supprimer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {plans.data.length === 0 && (
                                <div className="py-12 text-center">
                                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-amber-100/50">
                                        <Building size={32} className="text-amber-500" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900">Aucun tarif trouvé</h3>
                                    <p className="mb-6 text-gray-600">Commencez par créer votre premier tarif</p>
                                    <button
                                        onClick={handleOpenCreate}
                                        className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 font-medium text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700"
                                    >
                                        <Plus size={20} className="mr-2" />
                                        <span className="hidden sm:inline">Créer un tarif</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex flex-col items-center justify-between sm:flex-row">
                        <div className="mb-4 text-sm text-gray-700 sm:mb-0">
                            {plans.data.length > 0 ? (
                                <>
                                    Affichage de {plans.meta?.from ?? 1} à {plans.meta?.to ?? plans.data.length} sur{' '}
                                    {plans.meta?.total ?? plans.data.length} tarifs
                                </>
                            ) : (
                                'Aucun tarif'
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {plans.links.map((link, index) => (
                                <button
                                    key={index}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        link.active
                                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                            : 'text-gray-600 hover:bg-amber-100 hover:text-amber-700'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={!link.url}
                                    onClick={() => goTo(link.url)}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CORRECTION: Afficher le popup seulement si isOpen est true, avec les bonnes props */}
            {isOpen && (
                <TarifPopup 
                    key={currentPlan?.id ?? 'create'} 
                    plan={currentPlan} 
                    onClose={close} 
                    isEditing={editMode} 
                />
            )}
        </Dashboard>
    );
}