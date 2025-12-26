import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BarChart3,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    Edit3,
    Eye,
    Filter,
    Heart,
    Home,
    ImageOff,
    MapPin,
    MoreVertical,
    Plus,
    Search,
    Trash2,
    TrendingUp,
    XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';

type PropertyImage = { url: string };
type Property = {
    id: number;
    title: string;
    type: string;
    price: number;
    is_published: boolean;
    is_approved: boolean;
    status?: string;
    images?: PropertyImage[];
    views_count?: number;
    created_at?: string;
    location?: string;
    description?: string;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

export default function Properties() {
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Refs pour les dropdowns
    const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const {
        auth = { user: { roles: [] } },
        properties = { data: [], links: [], meta: { total: 0 } },
        favorites = 0,
        filters = {},
    } = usePage().props as any;

    // Valeur initiale de recherche avec debounce
    useEffect(() => {
        if (filters?.search != null) {
            setSearchQuery(filters.search);
        }
    }, [filters]);

    // Gestion du dropdown avec clic extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownOpen !== null) {
                const currentDropdownRef = dropdownRefs.current[dropdownOpen];
                if (
                    currentDropdownRef &&
                    !currentDropdownRef.contains(event.target as Node)
                ) {
                    setDropdownOpen(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    // Recherche avec debounce optimisé
    const debouncedSearch = useCallback(
        (query: string) => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            searchTimeoutRef.current = setTimeout(() => {
                router.get(
                    route('dashboard.properties.index'),
                    {
                        search: query,
                        page: 1,
                        sort_by: sortBy,
                        sort_order: sortOrder,
                    },
                    {
                        preserveState: true,
                        replace: true,
                        preserveScroll: true,
                        only: ['properties', 'filters'],
                    },
                );
            }, 350);
        },
        [sortBy, sortOrder],
    );

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    const toggleApproval = (id: number) => {
        router.patch(
            route('dashboard.properties.approve', id),
            {},
            { preserveScroll: true },
        );
    };

    const handleViewProperty = (property: Property) => {
        router.visit(route('dashboard.properties.show', property.id));
    };

    const deleteProperty = (id: number) => {
        if (confirm('Voulez-vous vraiment supprimer cette propriété ?')) {
            router.delete(route('dashboard.properties.destroy', id), {
                preserveScroll: true,
            });
        }
        setDropdownOpen(null);
    };

    const handleEditProperty = (property: Property) => {
        router.visit(route('dashboard.properties.edit', property.id));
        setDropdownOpen(null);
    };

    const handleViewStatistics = (property: Property) => {
        router.visit(route('dashboard.analytics.property', property.id));
        setDropdownOpen(null);
    };

    const toggleDropdown = (propertyId: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        e?.preventDefault();
        setDropdownOpen(dropdownOpen === propertyId ? null : propertyId);
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
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
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatusBadge = (property: Property) => {
        switch (property.status) {
            case 'pending_validation':
                return (
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                        <Clock size={10} className="mr-1" />
                        En attente
                    </span>
                );

            case 'draft':
                return (
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                        <Edit3 size={10} className="mr-1" />
                        Brouillon
                    </span>
                );

            case 'published':
                return (
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                        <CheckCircle size={10} className="mr-1" />
                        Publié
                    </span>
                );

            case 'rejected':
                return (
                    <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        <AlertCircle size={10} className="mr-1" />
                        Rejeté
                    </span>
                );

            case 'archived':
                return (
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
                        <ImageOff size={10} className="mr-1" />
                        Archivé
                    </span>
                );

            default:
                // Fallback for unknown status or empty
                return null;
        }
    };

    const isAdmin = auth?.user?.roles?.includes('Admin') ?? false;

    // Méta pagination
    const meta = (properties as any)?.meta ?? properties;
    const from = meta?.from ?? 0;
    const to = meta?.to ?? (properties?.data?.length || 0);
    const total = meta?.total ?? (properties?.data?.length || 0);
    const links: PaginationLink[] = (meta?.links ?? properties?.links) || [];

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                {/* Header Section */}
                <div className="sticky top-0 z-1 border-b border-amber-200/30 bg-white/80 shadow-lg shadow-amber-500/5 backdrop-blur-xl">
                    <div className="px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <BackButton />

                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                                    Propriétés
                                </h1>
                                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                                    Gérez vos propriétés et suivez leurs
                                    performances
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* View Mode Toggle */}
                                <div className="hidden items-center rounded-xl bg-amber-100/50 p-1 sm:flex">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`rounded-lg p-2 transition-colors ${
                                            viewMode === 'grid'
                                                ? 'bg-amber-500 text-white'
                                                : 'text-amber-600 hover:bg-amber-200'
                                        }`}
                                        title="Vue grille"
                                    >
                                        <Filter size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`rounded-lg p-2 transition-colors ${
                                            viewMode === 'list'
                                                ? 'bg-amber-500 text-white'
                                                : 'text-amber-600 hover:bg-amber-200'
                                        }`}
                                        title="Vue liste"
                                    >
                                        <BarChart3 size={16} />
                                    </button>
                                </div>

                                {/* Create Button */}
                                <Link
                                    href={route('dashboard.properties.create')}
                                    className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-2.5 font-medium text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700"
                                >
                                    <Plus size={18} className="mr-2" />
                                    <span className="hidden sm:inline">
                                        Nouvelle propriété
                                    </span>
                                    <span className="sm:hidden">Ajouter</span>
                                </Link>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                            <div className="relative flex-1">
                                <Search
                                    size={20}
                                    className="absolute top-1/2 left-3 -translate-y-1/2 text-amber-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Rechercher par titre, type, localisation..."
                                    className="w-full rounded-xl border border-amber-200/50 bg-white/80 py-3 pr-4 pl-10 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-amber-400 transition-colors hover:text-amber-600"
                                        aria-label="Effacer"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative">
                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [field, order] =
                                            e.target.value.split('-');
                                        setSortBy(field);
                                        setSortOrder(order);
                                    }}
                                    className="cursor-pointer appearance-none rounded-xl border border-amber-200/50 bg-white px-4 py-3 pr-10 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                >
                                    <option value="created_at-desc">
                                        Plus récentes
                                    </option>
                                    <option value="created_at-asc">
                                        Plus anciennes
                                    </option>
                                    <option value="price-asc">
                                        Prix croissant
                                    </option>
                                    <option value="price-desc">
                                        Prix décroissant
                                    </option>
                                    <option value="title-asc">Titre A-Z</option>
                                    <option value="title-desc">
                                        Titre Z-A
                                    </option>
                                </select>
                                <TrendingUp
                                    size={16}
                                    className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-amber-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-2xl border border-amber-200/30 bg-white p-4 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
                                    <Building
                                        size={20}
                                        className="text-white"
                                    />
                                </div>
                                <div className="flex items-center text-sm font-medium text-emerald-600">
                                    <TrendingUp size={16} className="mr-1" />
                                    +12%
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {total}
                            </div>
                            <div className="text-sm text-slate-600">
                                Total propriétés
                            </div>
                        </div>

                        <div className="rounded-2xl border border-amber-200/30 bg-white p-4 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
                                    <CheckCircle
                                        size={20}
                                        className="text-white"
                                    />
                                </div>
                                <div className="flex items-center text-sm font-medium text-amber-600">
                                    <Clock size={16} className="mr-1" />
                                    En attente
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {
                                    (properties?.data || []).filter(
                                        (p: any) => !p.is_approved,
                                    ).length
                                }
                            </div>
                            <div className="text-sm text-slate-600">
                                En validation
                            </div>
                        </div>

                        <div className="rounded-2xl border border-amber-200/30 bg-white p-4 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/30">
                                    <Eye size={20} className="text-white" />
                                </div>
                                <div className="flex items-center text-sm font-medium text-emerald-600">
                                    <TrendingUp size={16} className="mr-1" />
                                    +24%
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {(properties?.data || [])
                                    .reduce(
                                        (sum: number, p: any) =>
                                            sum + (p.views_count || 0),
                                        0,
                                    )
                                    .toLocaleString()}
                            </div>
                            <div className="text-sm text-slate-600">
                                Vues totales
                            </div>
                        </div>

                        <div className="rounded-2xl border border-amber-200/30 bg-white p-4 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/30">
                                    <Heart size={20} className="text-white" />
                                </div>
                                <div className="flex items-center text-sm font-medium text-amber-600">
                                    <TrendingUp size={16} className="mr-1" />
                                    +8%
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {favorites}
                            </div>
                            <div className="text-sm text-slate-600">
                                Favoris
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    {viewMode === 'grid' ? (
                        /* Grid View */
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {(properties?.data || []).length === 0 ? (
                                <div className="col-span-full py-16 text-center">
                                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-amber-100/50">
                                        <Home
                                            size={32}
                                            className="text-amber-500"
                                        />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-slate-900">
                                        Aucune propriété
                                    </h3>
                                    <p className="mb-6 text-slate-600">
                                        Commencez par ajouter votre première
                                        propriété
                                    </p>
                                    <Link
                                        href={route(
                                            'dashboard.properties.create',
                                        )}
                                        className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 font-medium text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700"
                                    >
                                        <Plus size={20} className="mr-2" />
                                        Créer une propriété
                                    </Link>
                                </div>
                            ) : (
                                (properties?.data || []).map(
                                    (property: any, index: number) => (
                                        <div
                                            key={property.id}
                                            className="group relative transform overflow-hidden rounded-2xl border border-amber-200/30 bg-white shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20"
                                            style={{
                                                animationDelay: `${index * 0.1}s`,
                                            }}
                                        >
                                            {/* Image */}
                                            <div className="relative h-48 overflow-hidden">
                                                {property.images &&
                                                property.images.length > 0 ? (
                                                    <img
                                                        src={`/storage/${property.images[0].path}`}
                                                        alt={property.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
                                                        <ImageOff
                                                            size={32}
                                                            className="text-amber-400"
                                                        />
                                                    </div>
                                                )}

                                                {/* Status Badge */}
                                                <div className="absolute top-3 right-3">
                                                    {getStatusBadge(property)}
                                                </div>

                                                {/* Price Badge */}
                                                <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-2 py-1 backdrop-blur-sm">
                                                    <span className="text-sm font-bold text-amber-600">
                                                        {formatPrice(
                                                            property.price,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4">
                                                <h3 className="mb-2 font-semibold text-slate-900 transition-colors group-hover:text-amber-700">
                                                    {property.title}
                                                </h3>

                                                <div className="mb-3 flex items-center gap-4 text-sm text-slate-600">
                                                    <span className="flex items-center">
                                                        <MapPin
                                                            size={14}
                                                            className="mr-1 text-amber-500"
                                                        />
                                                        {property.location ||
                                                            'Non spécifié'}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Building
                                                            size={14}
                                                            className="mr-1 text-amber-500"
                                                        />
                                                        {property.type}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <span className="flex items-center text-slate-500">
                                                            <Eye
                                                                size={14}
                                                                className="mr-1"
                                                            />
                                                            {property.views_count ||
                                                                0}
                                                        </span>
                                                        <span className="flex items-center text-slate-500">
                                                            <Calendar
                                                                size={14}
                                                                className="mr-1"
                                                            />
                                                            {formatDate(
                                                                property.created_at ||
                                                                    '',
                                                            )}
                                                        </span>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleViewProperty(
                                                                    property,
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-amber-600 transition-colors hover:bg-amber-100"
                                                            title="Voir détails"
                                                        >
                                                            <Eye size={16} />
                                                        </button>

                                                        <div
                                                            className="relative"
                                                            ref={(
                                                                el: HTMLDivElement | null,
                                                            ) => {
                                                                dropdownRefs.current[
                                                                    property.id
                                                                ] = el;
                                                            }}
                                                        >
                                                            <button
                                                                onClick={(e) =>
                                                                    toggleDropdown(
                                                                        property.id,
                                                                        e,
                                                                    )
                                                                }
                                                                className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
                                                                title="Plus d'options"
                                                            >
                                                                <MoreVertical
                                                                    size={16}
                                                                />
                                                            </button>

                                                            {dropdownOpen ===
                                                                property.id && (
                                                                <div className="absolute right-0 bottom-full z-[100] mb-2 w-48 overflow-hidden rounded-xl border border-amber-200/50 bg-white shadow-2xl shadow-amber-500/20">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleEditProperty(
                                                                                property,
                                                                            )
                                                                        }
                                                                        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-amber-50"
                                                                    >
                                                                        <Edit3
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                        <span>
                                                                            Modifier
                                                                        </span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleViewStatistics(
                                                                                property,
                                                                            )
                                                                        }
                                                                        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-amber-50"
                                                                    >
                                                                        <BarChart3
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                        <span>
                                                                            Statistiques
                                                                        </span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            deleteProperty(
                                                                                property.id,
                                                                            )
                                                                        }
                                                                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-red-600 transition-colors hover:bg-red-50"
                                                                    >
                                                                        <Trash2
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                        <span>
                                                                            Supprimer
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                )
                            )}
                        </div>
                    ) : (
                        /* List View */
                        <div className="overflow-hidden rounded-2xl border border-amber-200/30 bg-white shadow-lg shadow-amber-500/10">
                            {(properties?.data || []).length === 0 ? (
                                <div className="py-16 text-center">
                                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-amber-100/50">
                                        <Home
                                            size={32}
                                            className="text-amber-500"
                                        />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-slate-900">
                                        Aucune propriété
                                    </h3>
                                    <p className="mb-6 text-slate-600">
                                        Commencez par ajouter votre première
                                        propriété
                                    </p>
                                    <Link
                                        href={route(
                                            'dashboard.properties.create',
                                        )}
                                        className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 font-medium text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700"
                                    >
                                        <Plus size={20} className="mr-2" />
                                        Créer une propriété
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-amber-50/30">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-700 uppercase">
                                                    Image
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-700 uppercase">
                                                    Propriété
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-700 uppercase">
                                                    Statut
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-700 uppercase">
                                                    Prix
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-700 uppercase">
                                                    Vues
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-700 uppercase">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-amber-200/30">
                                            {(properties?.data || []).map(
                                                (
                                                    property: any,
                                                    index: number,
                                                ) => (
                                                    <tr
                                                        key={property.id}
                                                        className="transition-colors hover:bg-amber-50/30"
                                                        style={{
                                                            animationDelay: `${index * 0.05}s`,
                                                        }}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="h-16 w-16 overflow-hidden rounded-lg">
                                                                {property.images &&
                                                                property.images
                                                                    .length >
                                                                    0 ? (
                                                                    <img
                                                                        src={`/storage/${property.images[0].path}`}
                                                                        alt={
                                                                            property.title
                                                                        }
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
                                                                        <ImageOff
                                                                            size={
                                                                                20
                                                                            }
                                                                            className="text-amber-400"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <div className="font-medium text-slate-900">
                                                                    {
                                                                        property.title
                                                                    }
                                                                </div>
                                                                <div className="mt-1 flex items-center gap-3 text-sm text-slate-600">
                                                                    <span className="flex items-center">
                                                                        <MapPin
                                                                            size={
                                                                                12
                                                                            }
                                                                            className="mr-1 text-amber-500"
                                                                        />
                                                                        {property.location ||
                                                                            'Non spécifié'}
                                                                    </span>
                                                                    <span className="flex items-center">
                                                                        <Building
                                                                            size={
                                                                                12
                                                                            }
                                                                            className="mr-1 text-amber-500"
                                                                        />
                                                                        {
                                                                            property.type
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {getStatusBadge(
                                                                property,
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-semibold text-amber-600">
                                                                {formatPrice(
                                                                    property.price,
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600">
                                                            {property.views_count ||
                                                                0}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleViewProperty(
                                                                            property,
                                                                        )
                                                                    }
                                                                    className="rounded-lg p-2 text-amber-600 transition-colors hover:bg-amber-100"
                                                                    title="Voir détails"
                                                                >
                                                                    <Eye
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>

                                                                <div
                                                                    className="relative"
                                                                    ref={(
                                                                        el,
                                                                    ) => {
                                                                        dropdownRefs.current[
                                                                            property.id
                                                                        ] = el;
                                                                    }}
                                                                >
                                                                    <button
                                                                        onClick={(
                                                                            e,
                                                                        ) =>
                                                                            toggleDropdown(
                                                                                property.id,
                                                                                e,
                                                                            )
                                                                        }
                                                                        className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
                                                                        title="Plus d'options"
                                                                    >
                                                                        <MoreVertical
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    </button>

                                                                    {dropdownOpen ===
                                                                        property.id && (
                                                                        <div className="absolute top-full right-0 z-[100] mt-1 w-48 overflow-hidden rounded-xl border border-amber-200/50 bg-white shadow-2xl shadow-amber-500/20">
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleEditProperty(
                                                                                        property,
                                                                                    )
                                                                                }
                                                                                className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-amber-50"
                                                                            >
                                                                                <Edit3
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                                <span>
                                                                                    Modifier
                                                                                </span>
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleViewStatistics(
                                                                                        property,
                                                                                    )
                                                                                }
                                                                                className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-amber-50"
                                                                            >
                                                                                <BarChart3
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                                <span>
                                                                                    Statistiques
                                                                                </span>
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    deleteProperty(
                                                                                        property.id,
                                                                                    )
                                                                                }
                                                                                className="flex w-full items-center gap-2 px-4 py-3 text-left text-red-600 transition-colors hover:bg-red-50"
                                                                            >
                                                                                <Trash2
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                                <span>
                                                                                    Supprimer
                                                                                </span>
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="text-sm text-slate-600">
                            {total > 0 ? (
                                <>
                                    Affichage de {from + 1} à {to} sur {total}{' '}
                                    propriétés
                                </>
                            ) : (
                                'Aucune propriété'
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ?? '#'}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        link.active
                                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                            : 'text-slate-600 hover:bg-amber-100 hover:text-amber-700'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    preserveScroll
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
