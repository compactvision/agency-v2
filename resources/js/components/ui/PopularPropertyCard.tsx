import { Link, router, usePage } from '@inertiajs/react';
import { Star, MapPin, Maximize2, Bath, Bed, Car, Heart, ArrowRight, Home, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function PopularPropertyCard({ property, favorites }: { property: any, favorites: number[] }) {
    const user = usePage().props.auth?.user;
    const { t } = useTranslation();
    const [isFavorite, setIsFavorite] = useState(favorites.includes(property.id));
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const formatPrice = (price: number) => {
        return price.toLocaleString("fr-FR", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    const toggleFavorite = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (property.isFake) return;
        
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

    // Calculer si la propriété est nouvelle
    const isNewProperty = () => {
        if (property.isFake) return false;
        const createdDate = new Date(property.created_at);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays < 30;
    };

    // Caractéristiques avec icônes
    const features = [
        {
            icon: Maximize2,
            label: t("square_fit"),
            value: property.surface || 'N/A',
            color: 'text-blue-500'
        },
        {
            icon: Bath,
            label: t("bathroom"),
            value: property.bathrooms || 'N/A',
            color: 'text-green-500'
        },
        {
            icon: Bed,
            label: t("bedroom"),
            value: property.bedrooms || 'N/A',
            color: 'text-purple-500'
        },
        {
            icon: Car,
            label: t("parking_area"),
            value: property.parking ?? 'N/A',
            color: 'text-amber-500'
        }
    ];

    return (
        <div className="group relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            {/* Section Image */}
            <div className="relative h-80 overflow-hidden">
                {/* Image avec effet de parallaxe */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Badge de statut */}
                {!property.isFake && isNewProperty() && (
                    <div className="absolute top-6 left-6 z-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white text-sm font-semibold rounded-full shadow-lg">
                            <Sparkles className="w-4 h-4" />
                            {t('new') || 'Nouveau'}
                        </div>
                    </div>
                )}
                
                {/* Badge favori */}
                <button
                    onClick={(e) => toggleFavorite(e, property.id)}
                    className={`absolute top-6 right-6 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                        property.isFake 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : isFavorite 
                                ? 'bg-red-500 text-white shadow-lg scale-110' 
                                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white hover:scale-110'
                    }`}
                    title={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
                    disabled={property.isFake}
                >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                
                {/* Image principale */}
                <img
                    src={property.images?.[0]?.url || 'assets/images/thumbs/apartment-10-bg-shape.jpg'}
                    alt={property.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                    onLoad={() => setImageLoaded(true)}
                />
                
                {/* Overlay de chargement */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                )}
                
                {/* Icône centrale au survol */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                        <Home className="w-10 h-10 text-amber-500" />
                    </div>
                </div>
            </div>

            {/* Section Contenu */}
            <div className="p-8">
                {/* En-tête avec titre et localisation */}
                <div className="mb-6">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                                {property.title}
                            </h3>
                            <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-2 text-amber-500" />
                                <span className="text-sm">{property.location?.name || t('location_not_specified')}</span>
                            </div>
                        </div>
                        
                        {/* Badge de popularité */}
                        {!property.isFake && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 rounded-full">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-xs font-semibold">{t('popular')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Caractéristiques avec design moderne */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300 group/item"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-300">
                                        <Icon className={`w-5 h-5 ${feature.color}`} />
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium">{feature.label}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{feature.value}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Section prix et actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <span className="text-sm text-gray-500 font-medium">{t("price")}:</span>
                            <div className="text-3xl font-bold text-gray-900">
                                {formatPrice(property.price)}
                            </div>
                        </div>
                        
                        {/* Informations supplémentaires */}
                        {!property.isFake && property.created_at && (
                            <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(property.created_at).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex items-center gap-3">
                        {/* Bouton favori pour mobile */}
                        <button
                            onClick={(e) => toggleFavorite(e, property.id)}
                            className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                property.isFake 
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                    : isFavorite 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                            }`}
                            title={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
                            disabled={property.isFake}
                        >
                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                        
                        {/* Bouton principal */}
                        <Link
                            href={route('property.show', property.id)}
                            className={`group/btn inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-amber-500/25 ${
                                property.isFake ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={(e) => property.isFake && e.preventDefault()}
                        >
                            <span>{t("view_details") || "Voir les détails"}</span>
                            <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                            <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                        </Link>
                    </div>
                </div>

                {/* Message pour les propriétés factices */}
                {property.isFake && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-700 text-center">
                            {property.description || t('no_property_available')}
                        </p>
                    </div>
                )}
            </div>

            {/* Effet de brillance au survol */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
        </div>
    );
}