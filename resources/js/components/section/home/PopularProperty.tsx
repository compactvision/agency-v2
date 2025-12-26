import PopularPropertyCard from '@/components/ui/PopularPropertyCard';
import { useAds } from '@/hooks/useAds';
import {
    ArrowRight,
    Car,
    Home,
    MapPin,
    Shield,
    ShoppingBag,
    TrendingUp,
    Waves,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';

export default function PopularProperty({
    favorites,
}: {
    favorites: number[];
}) {
    const { t } = useTranslation();
    const [selectedAmenity, setSelectedAmenity] = useState('Piscine');
    const [randomProperty, setRandomProperty] = useState<any>(null);
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const { ads, loading: isLoading } = useAds();
    const properties = ads?.data || [];

    const amenityTabs = [
        {
            name: 'Piscine',
            label: t('amenities.swimming_pool'),
            icon: Waves,
            color: 'from-blue-400 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            name: 'Sécurité 24h/24',
            label: t('amenities.security_24_24'),
            icon: Shield,
            color: 'from-green-400 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
        },
        {
            name: 'Parking',
            label: t('amenities.parking'),
            icon: Car,
            color: 'from-purple-400 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
        },
        {
            name: 'Supermarché',
            label: t('amenities.supermarket'),
            icon: ShoppingBag,
            color: 'from-amber-400 to-amber-600',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600',
        },
    ];

    // Animation au scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.1 },
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    // Animation de chargement lors du changement d'équipement
    useEffect(() => {
        if (!isLoading && properties.length > 0) {
            const matching = properties.filter((property: any) =>
                property.amenities.some((a: any) => a.name === selectedAmenity),
            );

            if (matching.length > 0) {
                const random =
                    matching[Math.floor(Math.random() * matching.length)];
                setRandomProperty(random);
            } else {
                setRandomProperty(null);
            }
        }
    }, [selectedAmenity, properties, isLoading]);

    // Fake property si aucune trouvée
    const propertyToShow = randomProperty ?? {
        id: 'na',
        title: t('no_property_available') || 'Aucune propriété disponible',
        price: 'N/A',
        surface: 'N/A',
        description:
            t('no_property_description') ||
            'Aucune propriété ne correspond à cet équipement. Essayez de sélectionner un autre équipement.',
        amenities: [],
        images: [{ url: 'assets/images/thumbs/apartment-10-bg-shape.jpg' }],
        location: { name: 'N/A' },
        bedrooms: 'N/A',
        bathrooms: 'N/A',
        area: 'N/A',
        isFake: true,
    };

    // Statistiques pour l'en-tête
    const stats = {
        total: properties.length,
        featured: properties.filter((p: any) => p.featured).length,
        averagePrice:
            properties.length > 0
                ? Math.round(
                      properties.reduce(
                          (sum: number, p: any) => sum + p.price,
                          0,
                      ) / properties.length,
                  )
                : 0,
    };

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20 lg:py-32"
        >
            {/* Formes décoratives de fond */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl filter"></div>
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl filter"></div>
                <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-300/5 blur-3xl filter"></div>
            </div>

            {/* Image de fond décorative */}
            <div className="pointer-events-none absolute inset-0 opacity-5">
                <img
                    src="assets/images/thumbs/apartment-10-bg-shape.jpg"
                    alt="Background shape"
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4">
                {/* En-tête avec animation */}
                <div
                    className={`mb-16 transform text-center transition-all duration-1000 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-600">
                        <TrendingUp className="h-4 w-4" />
                        {t('popular_properties') || 'Propriétés Populaires'}
                    </div>

                    <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
                        {t('find_by_amenity') || 'Trouvez par équipement'}
                    </h2>

                    <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600">
                        {t('amenity_description') ||
                            'Découvrez des propriétés exceptionnelles avec les équipements qui correspondent à votre style de vie.'}
                    </p>

                    {/* Statistiques */}
                    <div className="mb-12 flex justify-center gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">
                                {stats.total}
                            </div>
                            <div className="text-sm text-gray-500">
                                {t('total_properties') ||
                                    'Total des propriétés'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">
                                {stats.featured}
                            </div>
                            <div className="text-sm text-gray-500">
                                {t('featured_properties') ||
                                    'Propriétés vedettes'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">
                                {stats.averagePrice.toLocaleString()}$
                            </div>
                            <div className="text-sm text-gray-500">
                                {t('average_price') || 'Prix moyen'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs d'équipements avec design moderne */}
                <div
                    className={`mx-auto mb-12 max-w-4xl transform transition-all delay-300 duration-1000 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                            {amenityTabs.map((tab, index) => {
                                const Icon = tab.icon;
                                const isActive = selectedAmenity === tab.name;

                                return (
                                    <button
                                        key={tab.name}
                                        onClick={() =>
                                            setSelectedAmenity(tab.name)
                                        }
                                        className={`relative rounded-xl px-4 py-4 font-medium transition-all duration-300 ${
                                            isActive
                                                ? 'bg-gradient-to-r ' +
                                                  tab.color +
                                                  ' scale-105 transform text-white shadow-lg'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                                    isActive
                                                        ? 'bg-white/20'
                                                        : tab.bgColor +
                                                          ' ' +
                                                          tab.textColor
                                                }`}
                                            >
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <span className="text-sm font-medium">
                                                {tab.label}
                                            </span>
                                        </div>

                                        {/* Indicateur actif */}
                                        {isActive && (
                                            <div className="absolute -bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 transform rounded-full bg-white"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Contenu principal avec animation de chargement */}
                <div
                    className={`transform transition-all delay-500 duration-1000 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="relative">
                                <div className="h-20 w-20 rounded-full border-4 border-amber-200"></div>
                                <div className="absolute top-0 left-0 h-20 w-20 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-10 w-10 animate-pulse rounded-full bg-gradient-to-r from-amber-400 to-amber-500"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Badge "À louer" */}
                            <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 transform">
                                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-2 font-semibold text-white shadow-lg">
                                    <Home className="h-4 w-4" />
                                    {t('for_rent') || 'À louer'}
                                </div>
                            </div>

                            {/* Carte de propriété */}
                            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                                <PopularPropertyCard
                                    property={propertyToShow}
                                    favorites={favorites}
                                />
                            </div>

                            {/* Effet de brillance */}
                            <div className="animate-shine absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white to-transparent"></div>
                        </div>
                    )}
                </div>

                {/* Bouton CTA */}
                <div
                    className={`mt-16 transform text-center transition-all delay-700 duration-1000 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gray-100 px-6 py-3">
                        <MapPin className="h-5 w-5 text-gray-600" />
                        <span className="text-sm text-gray-600">
                            {t('properties_near_you') ||
                                'Propriétés près de chez vous'}
                        </span>
                    </div>

                    <a
                        href={route('properties')}
                        className="group inline-flex transform items-center gap-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-gray-800 hover:to-gray-700 hover:shadow-xl"
                    >
                        <span>
                            {t('view_all_properties') ||
                                'Voir toutes les propriétés'}
                        </span>
                        <ArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                        <div className="absolute inset-0 rounded-xl bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                    </a>
                </div>
            </div>

            {/* Particules flottantes pour l'effet visuel */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="animate-float absolute h-2 w-2 rounded-full bg-amber-400/10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${15 + Math.random() * 10}s`,
                        }}
                    ></div>
                ))}
            </div>

            {/* Styles personnalisés pour les animations */}
            <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                    }
                    25% {
                        transform: translateY(-20px) translateX(10px);
                    }
                    50% {
                        transform: translateY(10px) translateX(-10px);
                    }
                    75% {
                        transform: translateY(-10px) translateX(20px);
                    }
                }
                
                @keyframes shine {
                    0% {
                        transform: translateX(-100%) skewX(-12deg);
                    }
                    100% {
                        transform: translateX(200%) skewX(-12deg);
                    }
                }
                
                .animate-float {
                    animation: float 20s infinite ease-in-out;
                }
                
                .animate-shine {
                    animation: shine 3s infinite ease-in-out;
                    animation-delay: 2s;
                }
            `}</style>
        </section>
    );
}
