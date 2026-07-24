import PropertyCardHome from '@/components/ui/PropertyCardHome';
import { type Ad, useAds } from '@/hooks/useAds';
import { Link } from '@inertiajs/react';
import {
    LucideArrowRight,
    LucideBuilding,
    LucideBuilding2,
    LucideGrid,
    LucideHome,
    LucideList,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';

const PROPERTY_TYPES = [
    { id: 'all', label_fr: 'Tous', label_en: 'All', icon: LucideGrid },
    { id: 'villa', label_fr: 'Villas', label_en: 'Villas', icon: LucideHome },
    {
        id: 'apartment',
        label_fr: 'Appartements',
        label_en: 'Apartments',
        icon: LucideBuilding,
    },
    {
        id: 'house',
        label_fr: 'Maisons',
        label_en: 'Houses',
        icon: LucideBuilding2,
    },
];

function PropertySkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/8">
            <div
                className="skeleton h-52 w-full"
                style={{
                    background:
                        'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%)',
                    backgroundSize: '200% 100%',
                }}
            />
            <div className="space-y-3 p-5">
                <div
                    className="skeleton h-5 w-3/4 rounded"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                />
                <div
                    className="skeleton h-4 w-1/2 rounded"
                    style={{ background: 'rgba(255,255,255,0.07)' }}
                />
                <div className="flex gap-4 pt-2">
                    <div
                        className="skeleton h-4 w-16 rounded"
                        style={{ background: 'rgba(255,255,255,0.07)' }}
                    />
                    <div
                        className="skeleton h-4 w-16 rounded"
                        style={{ background: 'rgba(255,255,255,0.07)' }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function RecentProperty({
    favorites,
    initialProperties,
}: {
    favorites: number[];
    initialProperties: Ad[];
}) {
    const { t, i18n } = useTranslation();
    const [selectedType, setSelectedType] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const { ads, loading: isLoading } = useAds(
        {
            type: selectedType === 'all' ? '' : selectedType,
            sort: 'newest',
            limit: 6,
        },
        { data: initialProperties, links: [], meta: null },
    );
    const properties = (ads?.data || []) as Ad[];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.1 },
        );
        const section = sectionRef.current;
        if (section) observer.observe(section);
        return () => {
            if (section) observer.unobserve(section);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[#413D3C] py-20 lg:py-28 dark:bg-[#292625]"
        >
            {/* Blobs décoratifs statiques */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-[#CF8E19]/8 blur-[120px]" />
                <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#292625]/60 blur-[100px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4">
                {/* ── Header ── */}
                <div
                    className={`mb-12 flex flex-col gap-6 transition-all duration-700 lg:flex-row lg:items-end lg:justify-between ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                >
                    <div>
                        <span className="section-label text-[#E0A43A]">
                            <span className="h-px w-8 bg-[#CF8E19]" />
                            {t('recent_properties')}
                        </span>
                        <h2 className="section-title-white mt-2">
                            {t('find_apartment')}
                        </h2>
                        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80">
                            {t('find_apartment_description') ||
                                'Découvrez notre sélection exclusive de propriétés soigneusement choisies.'}
                        </p>
                    </div>

                    {/* Contrôles */}
                    <div className="flex items-center gap-3">
                        {/* Filtre type */}
                        <div
                            className="flex rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur-sm"
                            role="group"
                            aria-label={t(
                                'property_type_filter',
                                'Filtrer par type de bien',
                            )}
                        >
                            {PROPERTY_TYPES.map((tp) => {
                                const Icon = tp.icon;
                                const label =
                                    i18n.language === 'fr'
                                        ? tp.label_fr
                                        : tp.label_en;
                                return (
                                    <button
                                        key={tp.id}
                                        type="button"
                                        onClick={() => setSelectedType(tp.id)}
                                        title={label}
                                        aria-pressed={selectedType === tp.id}
                                        aria-label={label}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                                            selectedType === tp.id
                                                ? 'bg-[#CF8E19] text-[#292625] shadow-sm'
                                                : 'text-white/80 hover:text-white'
                                        }`}
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">
                                            {label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Vue grille / liste */}
                        <div
                            className="flex rounded-xl border border-white/20 bg-white/10 p-1"
                            role="group"
                            aria-label={t('display_mode', "Mode d'affichage")}
                        >
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                aria-label={t('grid_view', 'Vue en grille')}
                                aria-pressed={viewMode === 'grid'}
                                className={`min-h-11 min-w-11 rounded-lg p-2 transition-all duration-200 ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white'}`}
                            >
                                <LucideGrid className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                aria-label={t('list_view', 'Vue en liste')}
                                aria-pressed={viewMode === 'list'}
                                className={`min-h-11 min-w-11 rounded-lg p-2 transition-all duration-200 ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white'}`}
                            >
                                <LucideList className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Grille de biens ── */}
                <div
                    className={`transition-all delay-200 duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    aria-busy={isLoading}
                >
                    {isLoading ? (
                        <div
                            role="status"
                            aria-label={t(
                                'loading_properties',
                                'Chargement des propriétés',
                            )}
                            className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                        >
                            {Array.from({ length: 6 }).map((_, i) => (
                                <PropertySkeleton key={i} />
                            ))}
                        </div>
                    ) : properties.length > 0 ? (
                        <div
                            className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                        >
                            {properties.slice(0, 6).map((property, index) => (
                                <div
                                    key={property.id}
                                    className={`transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                                    style={{
                                        transitionDelay: `${index * 80}ms`,
                                    }}
                                >
                                    <PropertyCardHome
                                        property={property}
                                        favorites={favorites}
                                        viewMode={viewMode}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/8">
                                <LucideHome className="h-8 w-8 text-white/30" />
                            </div>
                            <p className="text-white/50">
                                {t('no_properties_found')}
                            </p>
                        </div>
                    )}
                </div>

                {/* ── CTA ── */}
                <div
                    className={`mt-12 text-center transition-all delay-300 duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                >
                    <Link
                        href={route('properties')}
                        className="group inline-flex items-center gap-2.5 rounded-xl border-2 border-[#CF8E19] px-8 py-3.5 font-semibold text-[#E0A43A] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#CF8E19] hover:text-[#292625] hover:shadow-lg hover:shadow-[#CF8E19]/20"
                    >
                        {t('find_properties')}
                        <LucideArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
