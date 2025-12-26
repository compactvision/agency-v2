import Pagination from "@/components/pagination/home/Pagination";
import { Link, router } from "@inertiajs/react";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Heart,
    Eye,
    Trash2,
    MapPin,
    Calendar,
    Home,
    Bed,
    Bath,
    Square,
    Star,
    Filter,
    Search,
    Grid,
    List,
    TrendingUp,
    Clock,
    AlertCircle,
    CheckCircle,
    Edit3,
    ExternalLink,
    X,
    Loader2,
} from 'lucide-react';

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
    properties: {
        data: Property[];
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function FavoriteProperties({ properties }: FavoritePropertiesProps) {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'date' | 'price' | 'name'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
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
            router.post(route('dashboard.properties.favorite', selectedProperty), {
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
                }
            });
        }
    };

    const sortedAndFilteredProperties = properties.data
        .filter(property => 
            property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.municipality.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                    comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                <Heart size={24} />
                                {t('my_favorite_properties') || 'Mes propriétés favorites'}
                            </h2>
                            <p className="text-white/90">
                                {properties.data.length} {t('properties_found') || 'propriétés trouvées'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${
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
                                className={`p-2 rounded-lg transition-colors ${
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
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('search_properties') || 'Rechercher des propriétés...'}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleSort('date')}
                                className={`px-4 py-3 rounded-xl border transition-colors flex items-center gap-2 ${
                                    sortBy === 'date' 
                                        ? 'border-orange-500 bg-orange-50 text-orange-600' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <Calendar size={16} />
                                {t('date') || 'Date'}
                                {sortBy === 'date' && (
                                    <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </button>
                            <button
                                onClick={() => handleSort('price')}
                                className={`px-4 py-3 rounded-xl border transition-colors flex items-center gap-2 ${
                                    sortBy === 'price' 
                                        ? 'border-orange-500 bg-orange-50 text-orange-600' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <TrendingUp size={16} />
                                {t('price') || 'Prix'}
                                {sortBy === 'price' && (
                                    <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </button>
                            <button
                                onClick={() => handleSort('name')}
                                className={`px-4 py-3 rounded-xl border transition-colors flex items-center gap-2 ${
                                    sortBy === 'name' 
                                        ? 'border-orange-500 bg-orange-50 text-orange-600' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <Filter size={16} />
                                {t('name') || 'Nom'}
                                {sortBy === 'name' && (
                                    <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {showSuccessMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                        <CheckCircle size={20} className="text-green-600" />
                        <div>
                            <p className="text-green-800 font-medium">{t('property_removed') || 'Propriété retirée des favoris'}</p>
                            <p className="text-green-700 text-sm">{t('property_removed_description') || 'La propriété a été retirée de votre liste de favoris avec succès.'}</p>
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
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                        {sortedAndFilteredProperties.map((property) => (
                            <div
                                key={property.id}
                                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                                    viewMode === 'grid' ? '' : 'flex gap-6'
                                }`}
                            >
                                {/* Property Image */}
                                <div className={`relative ${viewMode === 'grid' ? 'h-48' : 'w-48 h-32 flex-shrink-0'}`}>
                                    <img
                                        src={`/storage/${property.images[0]?.url}`}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                    
                                    {/* Status Badges */}
                                    <div className="absolute top-2 left-2 flex gap-2">
                                        {property.is_featured && (
                                            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                                <Star size={12} />
                                                {t('featured') || 'Vedette'}
                                            </span>
                                        )}
                                        <span className={`px-2 py-1 text-white text-xs font-semibold rounded-full ${
                                            property.sale_type === 'rent' 
                                                ? 'bg-blue-500' 
                                                : 'bg-green-500'
                                        }`}>
                                            {property.sale_type === 'rent' ? t('rent') || 'Location' : t('sale') || 'Vente'}
                                        </span>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <a
                                            href={route('dashboard.properties.show', property.id)}
                                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                                            title={t('view_details') || 'Voir les détails'}
                                        >
                                            <Eye size={16} className="text-gray-700" />
                                        </a>
                                        <button
                                            onClick={() => toggleFavorite(property.id)}
                                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                                            title={t('remove_from_favorites') || 'Retirer des favoris'}
                                        >
                                            <Heart size={16} className="text-red-500 fill-red-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* Property Content */}
                                <div className={`p-4 ${viewMode === 'grid' ? '' : 'flex-1'}`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                                                <a
                                                    href={route('dashboard.properties.show', property.id)}
                                                    className="hover:text-orange-600 transition-colors"
                                                >
                                                    {property.title}
                                                </a>
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin size={14} />
                                                <span>{property.municipality.name}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-orange-600">
                                                {formatPrice(property.price)}
                                            </div>
                                            {property.sale_type === 'rent' && (
                                                <div className="text-xs text-gray-500">/{t('month') || 'mois'}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Property Features */}
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        {property.bedrooms && (
                                            <div className="flex items-center gap-1">
                                                <Bed size={14} />
                                                <span>{property.bedrooms}</span>
                                            </div>
                                        )}
                                        {property.bathrooms && (
                                            <div className="flex items-center gap-1">
                                                <Bath size={14} />
                                                <span>{property.bathrooms}</span>
                                            </div>
                                        )}
                                        {property.surface && (
                                            <div className="flex items-center gap-1">
                                                <Square size={14} />
                                                <span>{property.surface}m²</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Additional Info */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            <span>{formatDate(property.created_at)}</span>
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
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {t('no_favorite_properties') || 'Aucune propriété favorite'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {t('no_favorite_properties_description') || 'Vous n\'avez pas encore ajouté de propriétés à vos favoris. Commencez à explorer nos annonces pour en ajouter.'}
                        </p>
                        <a
                            href={route('properties')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors"
                        >
                            <Home size={18} />
                            {t('browse_properties') || 'Parcourir les propriétés'}
                        </a>
                    </div>
                )}

                {/* Pagination */}
                {sortedAndFilteredProperties.length > 0 && (
                    <div className="mt-8">
                        <Pagination links={properties.links} />
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                {t('remove_from_favorites') || 'Retirer des favoris'}
                            </h3>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-600">
                                {t('remove_from_favorites_confirmation') || 'Êtes-vous sûr de vouloir retirer cette propriété de vos favoris ?'}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
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
                                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50"
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