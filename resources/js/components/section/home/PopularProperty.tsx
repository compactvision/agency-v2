import PopularPropertyCard from '@/components/ui/PopularPropertyCard';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Waves, 
    Shield, 
    Car, 
    ShoppingBag, 
    Home, 
    MapPin, 
    TrendingUp,
    Star,
    ArrowRight,
    Filter,
    Sparkles
} from 'lucide-react';

export default function PopularProperty({ properties, favorites }: { properties: any, favorites: number[] }) {
    const { t } = useTranslation();
    const [selectedAmenity, setSelectedAmenity] = useState('Piscine');
    const [randomProperty, setRandomProperty] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const amenityTabs = [
        { 
            name: 'Piscine', 
            label: t('amenities.swimming_pool'), 
            icon: Waves,
            color: 'from-blue-400 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        { 
            name: 'Sécurité 24h/24', 
            label: t('amenities.security_24_24'), 
            icon: Shield,
            color: 'from-green-400 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        { 
            name: 'Parking', 
            label: t('amenities.parking'), 
            icon: Car,
            color: 'from-purple-400 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        { 
            name: 'Supermarché', 
            label: t('amenities.supermarket'), 
            icon: ShoppingBag,
            color: 'from-amber-400 to-amber-600',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600'
        }
    ];

    // Animation au scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.1 }
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
        setIsLoading(true);
        const timer = setTimeout(() => {
            const matching = properties.filter((property: any) =>
                property.amenities.some((a: any) => a.name === selectedAmenity)
            );
            
            if (matching.length > 0) {
                const random = matching[Math.floor(Math.random() * matching.length)];
                setRandomProperty(random);
            } else {
                setRandomProperty(null);
            }
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [selectedAmenity, properties]);

    // Fake property si aucune trouvée
    const propertyToShow = randomProperty ?? {
        id: 'na',
        title: t('no_property_available') || 'Aucune propriété disponible',
        price: 'N/A',
        surface: 'N/A',
        description: t('no_property_description') || 'Aucune propriété ne correspond à cet équipement. Essayez de sélectionner un autre équipement.',
        amenities: [],
        images: [{ url: 'assets/images/thumbs/apartment-10-bg-shape.jpg' }],
        location: { name: 'N/A' },
        bedrooms: 'N/A',
        bathrooms: 'N/A',
        area: 'N/A',
        isFake: true
    };

    // Statistiques pour l'en-tête
    const stats = {
        total: properties.length,
        featured: properties.filter((p: any) => p.featured).length,
        averagePrice: properties.length > 0 
            ? Math.round(properties.reduce((sum: number, p: any) => sum + p.price, 0) / properties.length)
            : 0
    };

    return (
        <section ref={sectionRef} className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
            {/* Formes décoratives de fond */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/10 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-300/10 rounded-full filter blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/5 rounded-full filter blur-3xl"></div>
            </div>

            {/* Image de fond décorative */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <img 
                    src="assets/images/thumbs/apartment-10-bg-shape.jpg" 
                    alt="Background shape" 
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* En-tête avec animation */}
                <div className={`text-center mb-16 transition-all duration-1000 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-sm font-semibold mb-6">
                        <TrendingUp className="w-4 h-4" />
                        {t('popular_properties') || 'Propriétés Populaires'}
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                        {t('find_by_amenity') || 'Trouvez par équipement'}
                    </h2>
                    
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                        {t('amenity_description') || 'Découvrez des propriétés exceptionnelles avec les équipements qui correspondent à votre style de vie.'}
                    </p>

                    {/* Statistiques */}
                    <div className="flex justify-center gap-8 mb-12">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-500">{t('total_properties') || 'Total des propriétés'}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{stats.featured}</div>
                            <div className="text-sm text-gray-500">{t('featured_properties') || 'Propriétés vedettes'}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{stats.averagePrice.toLocaleString()}$</div>
                            <div className="text-sm text-gray-500">{t('average_price') || 'Prix moyen'}</div>
                        </div>
                    </div>
                </div>

                {/* Tabs d'équipements avec design moderne */}
                <div className={`max-w-4xl mx-auto mb-12 transition-all duration-1000 delay-300 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="bg-white rounded-2xl shadow-xl p-2 border border-gray-100">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {amenityTabs.map((tab, index) => {
                                const Icon = tab.icon;
                                const isActive = selectedAmenity === tab.name;
                                
                                return (
                                    <button
                                        key={tab.name}
                                        onClick={() => setSelectedAmenity(tab.name)}
                                        className={`relative px-4 py-4 rounded-xl font-medium transition-all duration-300 ${
                                            isActive
                                                ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-lg transform scale-105'
                                                : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                        style={{
                                            animationDelay: `${index * 100}ms`
                                        }}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                isActive 
                                                    ? 'bg-white/20' 
                                                    : tab.bgColor + ' ' + tab.textColor
                                            }`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-sm font-medium">{tab.label}</span>
                                        </div>
                                        
                                        {/* Indicateur actif */}
                                        {isActive && (
                                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Contenu principal avec animation de chargement */}
                <div className={`transition-all duration-1000 delay-500 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-amber-200 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-amber-400 rounded-full animate-spin border-t-transparent"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Badge "À louer" */}
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold rounded-full shadow-lg">
                                    <Home className="w-4 h-4" />
                                    {t('for_rent') || 'À louer'}
                                </div>
                            </div>
                            
                            {/* Carte de propriété */}
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                                <PopularPropertyCard property={propertyToShow} favorites={favorites} />
                            </div>
                            
                            {/* Effet de brillance */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
                        </div>
                    )}
                </div>

                {/* Bouton CTA */}
                <div className={`text-center mt-16 transition-all duration-1000 delay-700 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-full mb-6">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-600">
                            {t('properties_near_you') || 'Propriétés près de chez vous'}
                        </span>
                    </div>
                    
                    <a 
                        href={route('properties')} 
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                        <span>{t('view_all_properties') || 'Voir toutes les propriétés'}</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                        <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </a>
                </div>
            </div>

            {/* Particules flottantes pour l'effet visuel */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-amber-400/10 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${15 + Math.random() * 10}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Styles personnalisés pour les animations */}
            <style jsx>{`
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