import Pagination from '@/components/pagination/home/Pagination';
import { router } from '@inertiajs/react';
import {
    Bath,
    Bed,
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    Filter,
    Grid,
    Heart,
    Home,
    List,
    Loader2,
    MapPin,
    Search,
    Square,
    Star,
    Trash2,
    TrendingUp,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Property {
    id: number;
    title: string;
    price: number;
    type: string;
    sale_type: string;
    is_published: boolean;
    is_featured: boolean;
    created_at: string;
    views: number;
    images: { url: string }[];
    municipality: { name: string };
    bedrooms?: number;
    bathrooms?: number;
    surface?: number;
    description?: string;
}

interface FavoritePropertiesProps {
    properties?: {
        data: Property[];
        links: { url: string | null; label: string; active: boolean }[];
    } | null;
}

export default function FavoriteProperties({
    properties,
}: FavoritePropertiesProps) {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'date' | 'price' | 'name'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProperty, setSelectedProperty] = useState<number | null>(
        null,
    );
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const toggleFavorite = (id: number) => {
        setSelectedProperty(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedProperty) {
            setIsDeleting(true);
            router.post(
                route('dashboard.properties.favorite', selectedProperty),
                {},
                {
                    onFinish: () => {
                        setIsDeleting(false);
                        setShowDeleteModal(false);
                        setSelectedProperty(null);
                        setShowSuccessMessage(true);
                        setTimeout(() => setShowSuccessMessage(false), 3000);
                    },
                    onError: () => {
                        setIsDeleting(false);
                        setShowDeleteModal(false);
                        setSelectedProperty(null);
                    },
                },
            );
        }
    };

    const safeProperties = properties ?? { data: [], links: [] };

    const sortedAndFilteredProperties = safeProperties.data
        .filter(
            (property) =>
                property.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                property.municipality.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
        )
        .sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'name':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'date':
                default:
                    comparison =
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime();
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleSort = (field: 'date' | 'price' | 'name') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    return (
        <>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="rounded-2xl bg-gradient-to-r from-[#1E3A5F] to-[#0d2340] p-6 text-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold">
                                <Heart size={24} />
                                {t('my_favorite_properties') ||
                                    'Mes propriétés favorites'}
                            </h2>
                            <p className="text-white/90">
                                {safeProperties.data.length}{' '}
                                {t('properties_found') || 'propriétés trouvées'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`rounded-lg p-2 transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                                title="Vue grille"
                            >
                                <Grid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`rounded-lg p-2 transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                                title="Vue liste"
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search
                                size={20}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder={
                                    t('search_properties') ||
                                    'Rechercher des propriétés...'
                                }
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-[#C9A84C]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleSort('date')}
                                className={`flex items-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
                                    sortBy === 'date'
                                        ? 'border-[#C9A84C] bg-slate-50 text-slate-600'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <Calendar size={16} />
                                {t('date') || 'Date'}
                                {sortBy === 'date' && (
                                    <span className="text-xs">
                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => handleSort('price')}
                                className={`flex items-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
                                    sortBy === 'price'
                                        ? 'border-[#C9A84C] bg-slate-50 text-slate-600'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <TrendingUp size={16} />
                                {t('price') || 'Prix'}
                                {sortBy === 'price' && (
                                    <span className="text-xs">
                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => handleSort('name')}
                                className={`flex items-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
                                    sortBy === 'name'
                                        ? 'border-[#C9A84C] bg-slate-50 text-slate-600'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <Filter size={16} />
                                {t('name') || 'Nom'}
                                {sortBy === 'name' && (
                                    <span className="text-xs">
                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {showSuccessMessage && (
                    <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                        <CheckCircle size={20} className="text-green-600" />
                        <div>
                            <p className="font-medium text-green-800">
                                {t('property_removed') ||
                                    'Propriété retirée des favoris'}
                            </p>
                            <p className="text-sm text-green-700">
                                {t('property_removed_description') ||
                                    'La propriété a été retirée de votre liste de favoris avec succès.'}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowSuccessMessage(false)}
                            className="text-green-600 hover:text-green-800"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Properties Grid/List */}
                {sortedAndFilteredProperties.length > 0 ? (
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
                                : 'space-y-4'
                        }
                    >
                        {sortedAndFilteredProperties.map((property) => (
                            <div
                                key={property.id}
                                className={`overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl ${
                                    viewMode === 'grid' ? '' : 'flex gap-6'
                                }`}
                            >
                                {/* Property Image */}
                                <div
                                    className={`relative ${viewMode === 'grid' ? 'h-48' : 'h-32 w-48 flex-shrink-0'}`}
                                >
                                    <img
                                        src={`/storage/${property.images[0]?.url}`}
                                        alt={property.title}
                                        className="h-full w-full object-cover"
                                    />

                                    {/* Status Badges */}
                                    <div className="absolute top-2 left-2 flex gap-2">
                                        {property.is_featured && (
                                            <span className="flex items-center gap-1 rounded-full bg-[#C9A84C] px-2 py-1 text-xs font-semibold text-white">
                                                <Star size={12} />
                                                {t('featured') || 'Vedette'}
                                            </span>
                                        )}
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-semibold text-white ${
                                                property.sale_type === 'rent'
                                                    ? 'bg-blue-500'
                                                    : 'bg-green-500'
                                            }`}
                                        >
                                            {property.sale_type === 'rent'
                                                ? t('rent') || 'Location'
                                                : t('sale') || 'Vente'}
                                        </span>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <a
                                            href={route(
                                                'dashboard.properties.show',
                                                property.id,
                                            )}
                                            className="rounded-full bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-white"
                                            title={
                                                t('view_details') ||
                                                'Voir les détails'
                                            }
                                        >
                                            <Eye
                                                size={16}
                                                className="text-gray-700"
                                            />
                                        </a>
                                        <button
                                            onClick={() =>
                                                toggleFavorite(property.id)
                                            }
                                            className="rounded-full bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-white"
                                            title={
                                                t('remove_from_favorites') ||
                                                'Retirer des favoris'
                                            }
                                        >
                                            <Heart
                                                size={16}
                                                className="fill-red-500 text-red-500"
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Property Content */}
                                <div
                                    className={`p-4 ${viewMode === 'grid' ? '' : 'flex-1'}`}
                                >
                                    <div className="mb-2 flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="mb-1 line-clamp-2 font-bold text-gray-900">
                                                <a
                                                    href={route(
                                                        'dashboard.properties.show',
                                                        property.id,
                                                    )}
                                                    className="transition-colors hover:text-slate-600"
                                                >
                                                    {property.title}
                                                </a>
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin size={14} />
                                                <span>
                                                    {property.municipality.name}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-slate-600">
                                                {formatPrice(property.price)}
                                            </div>
                                            {property.sale_type === 'rent' && (
                                                <div className="text-xs text-gray-500">
                                                    /{t('month') || 'mois'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Property Features */}
                                    <div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
                                        {property.bedrooms && (
                                            <div className="flex items-center gap-1">
                                                <Bed size={14} />
                                                <span>{property.bedrooms}</span>
                                            </div>
                                        )}
                                        {property.bathrooms && (
                                            <div className="flex items-center gap-1">
                                                <Bath size={14} />
                                                <span>
                                                    {property.bathrooms}
                                                </span>
                                            </div>
                                        )}
                                        {property.surface && (
                                            <div className="flex items-center gap-1">
                                                <Square size={14} />
                                                <span>
                                                    {property.surface}m²
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Additional Info */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            <span>
                                                {formatDate(
                                                    property.created_at,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye size={12} />
                                            <span>{property.views}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                            <Heart size={32} className="text-gray-400" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-900">
                            {t('no_favorite_properties') ||
                                'Aucune propriété favorite'}
                        </h3>
                        <p className="mb-6 text-gray-600">
                            {t('no_favorite_properties_description') ||
                                "Vous n'avez pas encore ajouté de propriétés à vos favoris. Commencez à explorer nos annonces pour en ajouter."}
                        </p>
                        <a
                            href={route('properties')}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] px-6 py-3 font-medium text-white transition-colors hover:bg-slate-600"
                        >
                            <Home size={18} />
                            {t('browse_properties') ||
                                'Parcourir les propriétés'}
                        </a>
                    </div>
                )}

                {/* Pagination */}
                {sortedAndFilteredProperties.length > 0 && (
                    <div className="mt-8">
                        <Pagination links={safeProperties.links} />
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">
                                {t('remove_from_favorites') ||
                                    'Retirer des favoris'}
                            </h3>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-600">
                                {t('remove_from_favorites_confirmation') ||
                                    'Êtes-vous sûr de vouloir retirer cette propriété de vos favoris ?'}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                        {t('removing') || 'Retrait...'}
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        {t('remove') || 'Retirer'}
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="flex-1 rounded-xl bg-gray-200 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50"
                            >
                                {t('cancel') || 'Annuler'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
