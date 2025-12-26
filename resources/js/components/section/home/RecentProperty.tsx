import PropertyCardHome from '@/components/ui/PropertyCardHome';
import { Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LucideHome, LucideBuilding, LucideBuilding2, LucideMapPin, LucideGrid, LucideList, LucideArrowRight, LucideFilter, LucideSearch } from 'lucide-react';

export default function RecentProperty({ properties, favorites }: { properties: any; favorites: number[] }) {
    const { t } = useTranslation();
    const [selectedType, setSelectedType] = useState('villa');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const types = [
        { id: 'villa', label: t('villa'), icon: LucideHome, color: 'from-blue-400 to-blue-600' },
        { id: 'apartment', label: t('apartment'), icon: LucideBuilding, color: 'from-purple-400 to-purple-600' },
        { id: 'house', label: t('house'), icon: LucideBuilding2, color: 'from-green-400 to-green-600' },
        { id: 'studio', label: t('studio'), icon: LucideMapPin, color: 'from-amber-400 to-amber-600' }
    ];

    const sortOptions = [
        { id: 'newest', label: t('newest_first') },
        { id: 'price_low', label: t('price_low_to_high') },
        { id: 'price_high', label: t('price_high_to_low') },
        { id: 'popular', label: t('most_popular') }
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

    // Animation de chargement lors du changement de type
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [selectedType]);

    const filteredProperties = selectedType === 'all' 
        ? properties 
        : properties.filter((property: any) => property.type === selectedType);

    const searchedProperties = searchTerm 
        ? filteredProperties.filter((property: any) => 
            property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.location.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : filteredProperties;

    const sortedProperties = [...searchedProperties].sort((a: any, b: any) => {
        switch (sortBy) {
            case 'price_low':
                return a.price - b.price;
            case 'price_high':
                return b.price - a.price;
            case 'popular':
                return b.views - a.views;
            case 'newest':
            default:
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });

    return (
        <section ref={sectionRef} className="relative py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            {/* Formes décoratives de fond */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-300/10 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/10 rounded-full filter blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/5 rounded-full filter blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* En-tête avec animation */}
                <div className={`grid lg:grid-cols-2 gap-12 mb-16 transition-all duration-1000 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div>
                        <div className="inline-block">
                            <span className="text-sm font-medium text-amber-400 tracking-wider uppercase">
                                {t('recent_properties')}
                            </span>
                        </div>
                        <h2 className="mt-4 text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                            {t('find_apartment')}
                        </h2>
                        <p className="mt-6 text-lg text-gray-300 max-w-lg">
                            {t('find_apartment_description') || 'Découvrez notre sélection exclusive de propriétés de qualité, soigneusement choisies pour répondre à vos besoins les plus exigeants.'}
                        </p>
                    </div>

                    <div className="flex flex-col justify-center space-y-6">
                        {/* Tabs de types avec design moderne */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {types.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => setSelectedType(type.id)}
                                            className={`relative px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                                                selectedType === type.id
                                                    ? 'text-white'
                                                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            {selectedType === type.id && (
                                                <div className={`absolute inset-0 bg-gradient-to-r ${type.color} rounded-lg`}></div>
                                            )}
                                            <div className="relative flex items-center justify-center gap-2">
                                                <Icon className="w-5 h-5" />
                                                <span className="hidden md:inline">{type.label}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Barre de recherche et filtres */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={t('search_properties') || 'Rechercher des propriétés...'}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all duration-300"
                                />
                            </div>
                            
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all duration-300"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.id} value={option.id} className="bg-slate-800">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <LucideFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Boutons de vue */}
                            <div className="flex bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition-all duration-300 ${
                                        viewMode === 'grid' 
                                            ? 'bg-white/20 text-white' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <LucideGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded transition-all duration-300 ${
                                        viewMode === 'list' 
                                            ? 'bg-white/20 text-white' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <LucideList className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grille de propriétés avec animation de chargement */}
                <div className={`transition-all duration-700 ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-amber-400/20 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-amber-400 rounded-full animate-spin border-t-transparent"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`grid gap-6 ${
                            viewMode === 'grid' 
                                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                                : 'grid-cols-1'
                        }`}>
                            {sortedProperties.length > 0 ? (
                                sortedProperties.slice(0, 6).map((property: any, index) => (
                                    <div
                                        key={property.id}
                                        className={`transform transition-all duration-700 ${
                                            visible 
                                                ? 'opacity-100 translate-y-0' 
                                                : 'opacity-0 translate-y-10'
                                        }`}
                                        style={{
                                            transitionDelay: `${index * 100}ms`
                                        }}
                                    >
                                        <PropertyCardHome 
                                            property={property} 
                                            favorites={favorites}
                                            viewMode={viewMode}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20">
                                    <div className="inline-flex flex-col items-center">
                                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4">
                                            <LucideSearch className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t('no_properties_found')}
                                        </h3>
                                        <p className="text-gray-400 max-w-md">
                                            {t('no_properties_description') || 'Essayez de modifier vos filtres ou votre recherche pour trouver des propriétés correspondantes.'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Bouton CTA avec effet de brillance */}
                <div className={`text-center mt-16 transition-all duration-1000 delay-300 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <Link 
                        href={route('properties')} 
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-amber-500/25"
                    >
                        <span>{t('find_properties')}</span>
                        <LucideArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                        <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </Link>
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
                
                .animate-float {
                    animation: float 20s infinite ease-in-out;
                }
            `}</style>
        </section>
    );
}