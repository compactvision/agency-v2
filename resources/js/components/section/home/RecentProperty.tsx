import PropertyCardHome from '@/components/ui/PropertyCardHome';
import { useAds } from '@/hooks/useAds';
import { Link } from '@inertiajs/react';
import {
    LucideArrowRight,
    LucideBuilding,
    LucideBuilding2,
    LucideFilter,
    LucideGrid,
    LucideHome,
    LucideList,
    LucideSearch,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';

export default function RecentProperty({ favorites }: { favorites: number[] }) {
    const { t } = useTranslation();
    const [selectedType, setSelectedType] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Initialisation des filtres pour le hook useAds
    const adsFilters = {
        type: selectedType === 'all' ? '' : selectedType,
        search: searchTerm,
        sort: sortBy,
        limit: 6,
    };

    const { ads, loading: isLoading, error } = useAds(adsFilters);
    const properties = ads?.data || [];

    const types = [
        {
            id: 'all',
            label: t('all_types') || 'Tous',
            icon: LucideGrid,
            color: 'from-gray-400 to-gray-600',
        },
        {
            id: 'villa',
            label: t('villa'),
            icon: LucideHome,
            color: 'from-blue-400 to-blue-600',
        },
        {
            id: 'apartment',
            label: t('apartment'),
            icon: LucideBuilding,
            color: 'from-purple-400 to-purple-600',
        },
        {
            id: 'house',
            label: t('house'),
            icon: LucideBuilding2,
            color: 'from-green-400 to-green-600',
        },
    ];

    const sortOptions = [
        { id: 'newest', label: t('newest_first') },
        { id: 'price_low', label: t('price_low_to_high') },
        { id: 'price_high', label: t('price_high_to_low') },
        { id: 'popular', label: t('most_popular') },
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

    const sortedProperties = properties;

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 lg:py-32"
        >
            {/* Formes décoratives de fond */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl filter"></div>
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl filter"></div>
                <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-300/5 blur-3xl filter"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4">
                {/* En-tête avec animation */}
                <div
                    className={`mb-16 grid transform gap-12 transition-all duration-1000 lg:grid-cols-2 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    <div>
                        <div className="inline-block">
                            <span className="text-sm font-medium tracking-wider text-amber-400 uppercase">
                                {t('recent_properties')}
                            </span>
                        </div>
                        <h2 className="mt-4 text-4xl leading-tight font-bold text-white lg:text-5xl xl:text-6xl">
                            {t('find_apartment')}
                        </h2>
                        <p className="mt-6 max-w-lg text-lg text-gray-300">
                            {t('find_apartment_description') ||
                                'Découvrez notre sélection exclusive de propriétés de qualité, soigneusement choisies pour répondre à vos besoins les plus exigeants.'}
                        </p>
                    </div>

                    <div className="flex flex-col justify-center space-y-6">
                        {/* Tabs de types avec design moderne */}
                        <div className="rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-md">
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                                {types.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() =>
                                                setSelectedType(type.id)
                                            }
                                            className={`relative rounded-lg px-4 py-3 font-medium transition-all duration-300 ${
                                                selectedType === type.id
                                                    ? 'text-white'
                                                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            {selectedType === type.id && (
                                                <div
                                                    className={`absolute inset-0 bg-gradient-to-r ${type.color} rounded-lg`}
                                                ></div>
                                            )}
                                            <div className="relative flex items-center justify-center gap-2">
                                                <Icon className="h-5 w-5" />
                                                <span className="hidden md:inline">
                                                    {type.label}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Barre de recherche et filtres */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <LucideSearch className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={
                                        t('search_properties') ||
                                        'Rechercher des propriétés...'
                                    }
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-white/20 bg-white/10 py-3 pr-4 pl-10 text-white placeholder-gray-400 backdrop-blur-md transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-amber-400/50 focus:outline-none"
                                />
                            </div>

                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none rounded-lg border border-white/20 bg-white/10 px-4 py-3 pr-10 text-white backdrop-blur-md transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-amber-400/50 focus:outline-none"
                                >
                                    {sortOptions.map((option: any) => (
                                        <option
                                            key={option.id}
                                            value={option.id}
                                            className="bg-slate-800"
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <LucideFilter className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                            </div>

                            {/* Boutons de vue */}
                            <div className="flex rounded-lg border border-white/20 bg-white/10 p-1 backdrop-blur-md">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`rounded p-2 transition-all duration-300 ${
                                        viewMode === 'grid'
                                            ? 'bg-white/20 text-white'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <LucideGrid className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`rounded p-2 transition-all duration-300 ${
                                        viewMode === 'list'
                                            ? 'bg-white/20 text-white'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <LucideList className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grille de propriétés avec animation de chargement */}
                <div
                    className={`transition-all duration-700 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="relative">
                                <div className="h-16 w-16 rounded-full border-4 border-amber-400/20"></div>
                                <div className="absolute top-0 left-0 h-16 w-16 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-8 w-8 animate-pulse rounded-full bg-gradient-to-r from-amber-400 to-amber-500"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`grid gap-6 ${
                                viewMode === 'grid'
                                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                    : 'grid-cols-1'
                            }`}
                        >
                            {sortedProperties.length > 0 ? (
                                sortedProperties
                                    .slice(0, 6)
                                    .map((property: any, index: number) => (
                                        <div
                                            key={property.id}
                                            className={`transform transition-all duration-700 ${
                                                visible
                                                    ? 'translate-y-0 opacity-100'
                                                    : 'translate-y-10 opacity-0'
                                            }`}
                                            style={{
                                                transitionDelay: `${index * 100}ms`,
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
                                <div className="col-span-full py-20 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                                            <LucideSearch className="h-10 w-10 text-gray-400" />
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold text-white">
                                            {t('no_properties_found')}
                                        </h3>
                                        <p className="max-w-md text-gray-400">
                                            {t('no_properties_description') ||
                                                'Essayez de modifier vos filtres ou votre recherche pour trouver des propriétés correspondantes.'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Bouton CTA avec effet de brillance */}
                <div
                    className={`mt-16 transform text-center transition-all delay-300 duration-1000 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    <Link
                        href={route('properties')}
                        className="group relative inline-flex transform items-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700 hover:shadow-xl hover:shadow-amber-500/25"
                    >
                        <span>{t('find_properties')}</span>
                        <LucideArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                        <div className="absolute inset-0 rounded-xl bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
                        <div className="absolute inset-0 -translate-x-full -skew-x-12 transform rounded-xl bg-gradient-to-r from-transparent via-white to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
                    </Link>
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
                
                .animate-float {
                    animation: float 20s infinite ease-in-out;
                }
            `}</style>
        </section>
    );
}
