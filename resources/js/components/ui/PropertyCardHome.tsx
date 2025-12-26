import { Link, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Star, Heart, MapPin, Bath, Bed, Maximize2, ArrowRight, Camera, Tag, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function PropertyCardHome({ 
    property, 
    favorites, 
    viewMode = 'grid' 
}: { 
    property: any, 
    favorites: number[], 
    viewMode?: 'grid' | 'list' 
}) {
    const { t } = useTranslation();
    const user = usePage().props.auth?.user;
    const [isFavorite, setIsFavorite] = useState(favorites.includes(property.id));
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const formatPrice = (price: number) => {
        return price.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    const toggleFavorite = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        
        setIsFavorite(!isFavorite);
        router.post(route('dashboard.properties.favorite', id), {}, {
            preserveScroll: !!user,
            onSuccess: () => {
                // Animation de succès
            },
            onError: () => {
                setIsFavorite(isFavorite); // Rétablir l'état en cas d'erreur
            }
        });
    };

    // Calculer si la propriété est nouvelle (moins de 30 jours)
    const isNewProperty = () => {
        const createdDate = new Date(property.created_at);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays < 30;
    };

    // Déterminer le statut de la propriété
    const getStatusBadge = () => {
        if (property.featured) {
            return { text: t('featured'), color: 'from-amber-400 to-amber-600' };
        }
        if (isNewProperty()) {
            return { text: t('new'), color: 'from-green-400 to-green-600' };
        }
        if (property.discount) {
            return { text: `${property.discount}% ${t('off')}`, color: 'from-red-400 to-red-600' };
        }
        return null;
    };

    const statusBadge = getStatusBadge();

    return (
        <div className={`group relative ${
            viewMode === 'list' 
                ? 'flex flex-col md:flex-row gap-6 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1' 
                : 'bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1'
        }`}>
            {/* Section Image */}
            <div className={`relative ${viewMode === 'list' ? 'md:w-1/3' : ''}`}>
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'h-full' : 'h-64'}`}>
                    {/* Image avec effet de parallaxe */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${viewMode === 'list' ? 'from-black/60 via-transparent to-transparent' : 'from-black/50 via-transparent to-transparent'} z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Badge de statut */}
                    {statusBadge && (
                        <div className={`absolute top-4 left-4 z-20 px-3 py-1 bg-gradient-to-r ${statusBadge.color} text-white text-xs font-semibold rounded-full shadow-lg`}>
                            {statusBadge.text}
                        </div>
                    )}
                    
                    {/* Badge favori */}
                    <button
                        onClick={(e) => toggleFavorite(e, property.id)}
                        className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                            isFavorite 
                                ? 'bg-red-500 text-white shadow-lg' 
                                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white'
                        } ${isHovered ? 'scale-110' : 'scale-100'}`}
                        title={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    
                    {/* Badge d'images */}
                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                        <Camera className="w-3 h-3" />
                        <span>{property.images?.length || 1}</span>
                    </div>
                    
                    {/* Image principale */}
                    <img
                        src={`/storage/${property.images?.[0]?.url || 'placeholder.jpg'}`}
                        alt={property.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                        onLoad={() => setImageLoaded(true)}
                    />
                    
                    {/* Overlay de chargement */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                    )}
                </div>
            </div>

            {/* Section Contenu */}
            <div className={`flex-1 p-6 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                {/* En-tête avec titre et prix */}
                <div className={`${viewMode === 'list' ? 'mb-4' : 'mb-3'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
                            <Link href={route('property.show', property.id)} className="hover:underline">
                                {property.title}
                            </Link>
                        </h3>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-amber-600">
                                {formatPrice(property.price)}
                            </span>
                            {property.rental && (
                                <span className="text-sm text-gray-500 block">
                                    /{t('month')}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Localisation */}
                    <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="w-4 h-4 mr-1 text-amber-500" />
                        <span className="text-sm">{property.location || t('location_not_specified')}</span>
                    </div>
                </div>

                {/* Caractéristiques */}
                <div className={`flex flex-wrap gap-4 mb-4 ${viewMode === 'list' ? 'mb-6' : 'mb-4'}`}>
                    <div className="flex items-center gap-1 text-gray-700">
                        <Bed className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium">{property.bedrooms || 0}</span>
                        <span className="text-xs text-gray-500">{t('bedroom')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                        <Bath className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium">{property.bathrooms || 0}</span>
                        <span className="text-xs text-gray-500">{t('bathroom')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                        <Maximize2 className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium">{property.surface || 0}</span>
                        <span className="text-xs text-gray-500">m²</span>
                    </div>
                </div>

                {/* Description courte */}
                {viewMode === 'list' && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {property.description || t('no_description_available')}
                    </p>
                )}

                {/* Informations supplémentaires */}
                <div className={`flex items-center justify-between ${viewMode === 'list' ? 'mb-4' : 'mb-4'}`}>
                    <div className="flex items-center gap-2">
                        {property.rating && (
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={i < Math.floor(property.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                    />
                                ))}
                                <span className="text-xs text-gray-600 ml-1">({property.reviews || 0})</span>
                            </div>
                        )}
                    </div>
                    
                    {property.created_at && (
                        <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(property.created_at).toLocaleDateString()}
                        </div>
                    )}
                </div>

                {/* Tags */}
                {property.tags && property.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {property.tags.slice(0, 3).map((tag: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Bouton d'action */}
                <div className="flex justify-between items-center">
                    <Link
                        href={route('property.show', property.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-medium rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                            viewMode === 'list' ? 'w-auto' : 'w-full justify-center'
                        }`}
                    >
                        <span>{t('view_details')}</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                    
                    {viewMode === 'grid' && (
                        <button
                            onClick={(e) => toggleFavorite(e, property.id)}
                            className={`p-2 rounded-full transition-all duration-300 ${
                                isFavorite 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                            }`}
                            title={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
                        >
                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                    )}
                </div>
            </div>

            {/* Effet de brillance au survol */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
        </div>
    );
}