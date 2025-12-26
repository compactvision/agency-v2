import PropertyDetailsPopup from '@/components/forms/PropertyDetailsPopup';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { Link, router, usePage } from '@inertiajs/react';
import { 
    BarChart3, 
    Edit3, 
    Eye, 
    ImageOff, 
    MoreVertical, 
    Plus, 
    Search, 
    Trash2, 
    Home,
    Filter,
    MapPin,
    Calendar,
    DollarSign,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    TrendingUp,
    TrendingDown,
    Building,
    Heart
} from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

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
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    // Refs pour les dropdowns
    const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const searchTimeoutRef = useRef<NodeJS.Timeout>();

    const { auth, properties, favorites, filters } = usePage().props as {
        auth: { user: { roles: string[] } };
        properties: {
            data: Property[];
            links: PaginationLink[];
            meta?: { from: number; to: number; total: number; links: PaginationLink[] };
        };
        favorites: number[];
        filters?: { search?: string; per_page?: number };
    };

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
                if (currentDropdownRef && !currentDropdownRef.contains(event.target as Node)) {
                    setDropdownOpen(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    // Recherche avec debounce optimisé
    const debouncedSearch = useCallback((query: string) => {
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
                    sort_order: sortOrder
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                    only: ['properties', 'filters'],
                }
            );
        }, 350);
    }, [sortBy, sortOrder]);

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    const toggleApproval = (id: number) => {
        router.patch(route('dashboard.properties.approve', id), {}, { preserveScroll: true });
        handleClosePopup();
    };

    const handleViewProperty = (property: Property) => {
        setSelectedProperty(property);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedProperty(null);
    };

    const deleteProperty = (id: number) => {
        if (confirm('Voulez-vous vraiment supprimer cette propriété ?')) {
            router.delete(route('dashboard.properties.destroy', id), { preserveScroll: true });
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
            currency: 'XOF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (property: Property) => {
        if (!property.is_approved) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                    <Clock size={10} className="mr-1" />
                    En attente
                </span>
            );
        }
        
        if (!property.is_published) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    <AlertCircle size={10} className="mr-1" />
                    Brouillon
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle size={10} className="mr-1" />
                Publié
            </span>
        );
    };

    const isAdmin = auth.user.roles.includes('Admin');

    // Méta pagination
    const meta = (properties as any).meta ?? properties;
    const from = meta.from ?? 0;
    const to = meta.to ?? properties.data.length;
    const total = meta.total ?? properties.data.length;
    const links: PaginationLink[] = (meta.links ?? properties.links) || [];

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
                                    Propriétés
                                </h1>
                                <p className="text-sm sm:text-base text-slate-600 mt-1">
                                    Gérez vos propriétés et suivez leurs performances
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* View Mode Toggle */}
                                <div className="hidden sm:flex items-center bg-amber-100/50 rounded-xl p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-colors ${
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
                                        className={`p-2 rounded-lg transition-colors ${
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
                                    className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl font-medium hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/30"
                                >
                                    <Plus size={18} className="mr-2" />
                                    <span className="hidden sm:inline">Nouvelle propriété</span>
                                    <span className="sm:hidden">Ajouter</span>
                                </Link>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par titre, type, localisation..."
                                    className="w-full pl-10 pr-4 py-3 border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')} 
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600 transition-colors"
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
                                        const [field, order] = e.target.value.split('-');
                                        setSortBy(field);
                                        setSortOrder(order);
                                    }}
                                    className="appearance-none bg-white border border-amber-200/50 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-pointer"
                                >
                                    <option value="created_at-desc">Plus récentes</option>
                                    <option value="created_at-asc">Plus anciennes</option>
                                    <option value="price-asc">Prix croissant</option>
                                    <option value="price-desc">Prix décroissant</option>
                                    <option value="title-asc">Titre A-Z</option>
                                    <option value="title-desc">Titre Z-A</option>
                                </select>
                                <TrendingUp size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-4 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                    <Building size={20} className="text-white" />
                                </div>
                                <div className="flex items-center text-emerald-600 text-sm font-medium">
                                    <TrendingUp size={16} className="mr-1" />
                                    +12%
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">{total}</div>
                            <div className="text-sm text-slate-600">Total propriétés</div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-4 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <CheckCircle size={20} className="text-white" />
                                </div>
                                <div className="flex items-center text-amber-600 text-sm font-medium">
                                    <Clock size={16} className="mr-1" />
                                    En attente
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {properties.data.filter(p => !p.is_approved).length}
                            </div>
                            <div className="text-sm text-slate-600">En validation</div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-4 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <Eye size={20} className="text-white" />
                                </div>
                                <div className="flex items-center text-emerald-600 text-sm font-medium">
                                    <TrendingUp size={16} className="mr-1" />
                                    +24%
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {properties.data.reduce((sum, p) => sum + (p.views_count || 0), 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-slate-600">Vues totales</div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-4 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                                    <Heart size={20} className="text-white" />
                                </div>
                                <div className="flex items-center text-amber-600 text-sm font-medium">
                                    <TrendingUp size={16} className="mr-1" />
                                    +8%
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">{favorites}</div>
                            <div className="text-sm text-slate-600">Favoris</div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    {viewMode === 'grid' ? (
                        /* Grid View */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {properties.data.length === 0 ? (
                                <div className="col-span-full text-center py-16">
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-amber-100/50 flex items-center justify-center">
                                        <Home size={32} className="text-amber-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucune propriété</h3>
                                    <p className="text-slate-600 mb-6">Commencez par ajouter votre première propriété</p>
                                    <Link 
                                        href={route('dashboard.properties.create')}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl font-medium hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/30"
                                    >
                                        <Plus size={20} className="mr-2" />
                                        Créer une propriété
                                    </Link>
                                </div>
                            ) : (
                                properties.data.map((property, index) => (
                                    <div 
                                        key={property.id} 
                                        className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1 group relative"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            {property.images?.[0]?.url ? (
                                                <img 
                                                    src={`/storage/${property.images[0].url}`} 
                                                    alt={property.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                                    <ImageOff size={32} className="text-amber-400" />
                                                </div>
                                            )}
                                            
                                            {/* Status Badge */}
                                            <div className="absolute top-3 right-3">
                                                {getStatusBadge(property)}
                                            </div>

                                            {/* Price Badge */}
                                            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                                                <span className="text-sm font-bold text-amber-600">
                                                    {formatPrice(property.price)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">
                                                {property.title}
                                            </h3>
                                            
                                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                                                <span className="flex items-center">
                                                    <MapPin size={14} className="mr-1 text-amber-500" />
                                                    {property.location || 'Non spécifié'}
                                                </span>
                                                <span className="flex items-center">
                                                    <Building size={14} className="mr-1 text-amber-500" />
                                                    {property.type}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-sm">
                                                    <span className="flex items-center text-slate-500">
                                                        <Eye size={14} className="mr-1" />
                                                        {property.views_count || 0}
                                                    </span>
                                                    <span className="flex items-center text-slate-500">
                                                        <Calendar size={14} className="mr-1" />
                                                        {formatDate(property.created_at || '')}
                                                    </span>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewProperty(property)}
                                                        className="p-2 rounded-lg text-amber-600 hover:bg-amber-100 transition-colors"
                                                        title="Voir détails"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    
                                                    <div className="relative" ref={(el) => dropdownRefs.current[property.id] = el}>
                                                        <button
                                                            onClick={(e) => toggleDropdown(property.id, e)}
                                                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                                                            title="Plus d'options"
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>
                                                        
                                                        {dropdownOpen === property.id && (
                                                            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-2xl shadow-amber-500/20 border border-amber-200/50 z-[100] overflow-hidden">
                                                                <button
                                                                    onClick={() => handleEditProperty(property)}
                                                                    className="w-full text-left px-4 py-3 hover:bg-amber-50 transition-colors flex items-center gap-2"
                                                                >
                                                                    <Edit3 size={16} />
                                                                    <span>Modifier</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleViewStatistics(property)}
                                                                    className="w-full text-left px-4 py-3 hover:bg-amber-50 transition-colors flex items-center gap-2"
                                                                >
                                                                    <BarChart3 size={16} />
                                                                    <span>Statistiques</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteProperty(property.id)}
                                                                    className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600"
                                                                >
                                                                    <Trash2 size={16} />
                                                                    <span>Supprimer</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        /* List View */
                        <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden">
                            {properties.data.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-amber-100/50 flex items-center justify-center">
                                        <Home size={32} className="text-amber-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucune propriété</h3>
                                    <p className="text-slate-600 mb-6">Commencez par ajouter votre première propriété</p>
                                    <Link 
                                        href={route('dashboard.properties.create')}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl font-medium hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/30"
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
                                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Image</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Propriété</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Statut</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Prix</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Vues</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-amber-200/30">
                                            {properties.data.map((property, index) => (
                                                <tr 
                                                    key={property.id} 
                                                    className="hover:bg-amber-50/30 transition-colors"
                                                    style={{ animationDelay: `${index * 0.05}s` }}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                                                            {property.images?.[0]?.url ? (
                                                                <img 
                                                                    src={`/storage/${property.images[0].url}`} 
                                                                    alt={property.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                                                    <ImageOff size={20} className="text-amber-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="font-medium text-slate-900">{property.title}</div>
                                                            <div className="text-sm text-slate-600 flex items-center gap-3 mt-1">
                                                                <span className="flex items-center">
                                                                    <MapPin size={12} className="mr-1 text-amber-500" />
                                                                    {property.location || 'Non spécifié'}
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <Building size={12} className="mr-1 text-amber-500" />
                                                                    {property.type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(property)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-semibold text-amber-600">
                                                            {formatPrice(property.price)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">
                                                        {property.views_count || 0}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleViewProperty(property)}
                                                                className="p-2 rounded-lg text-amber-600 hover:bg-amber-100 transition-colors"
                                                                title="Voir détails"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                            
                                                            <div className="relative" ref={(el) => dropdownRefs.current[property.id] = el}>
                                                                <button
                                                                    onClick={(e) => toggleDropdown(property.id, e)}
                                                                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                                                                    title="Plus d'options"
                                                                >
                                                                    <MoreVertical size={16} />
                                                                </button>
                                                                
                                                                {dropdownOpen === property.id && (
                                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-2xl shadow-amber-500/20 border border-amber-200/50 z-[100] overflow-hidden">
                                                                        <button
                                                                            onClick={() => handleEditProperty(property)}
                                                                            className="w-full text-left px-4 py-3 hover:bg-amber-50 transition-colors flex items-center gap-2"
                                                                        >
                                                                            <Edit3 size={16} />
                                                                            <span>Modifier</span>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleViewStatistics(property)}
                                                                            className="w-full text-left px-4 py-3 hover:bg-amber-50 transition-colors flex items-center gap-2"
                                                                        >
                                                                            <BarChart3 size={16} />
                                                                            <span>Statistiques</span>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => deleteProperty(property.id)}
                                                                            className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                            <span>Supprimer</span>
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-slate-600">
                            {total > 0 ? (
                                <>
                                    Affichage de {from + 1} à {to} sur {total} propriétés
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
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        link.active 
                                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                                            : 'text-slate-600 hover:bg-amber-100 hover:text-amber-700'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <PropertyDetailsPopup 
                    isOpen={isPopupOpen} 
                    onClose={handleClosePopup} 
                    property={selectedProperty} 
                    toggleApproval={toggleApproval} 
                />
            </div>
        </Dashboard>
    );
}