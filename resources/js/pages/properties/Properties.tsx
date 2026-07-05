import App from '@/components/layouts/Home/App';
import Pagination from '@/components/pagination/home/Pagination';
import Breadcumb from '@/components/ui/Breadcumb';
import NewsLetter from '@/components/ui/NewsLetter';
import PropertyCard from '@/components/ui/PropertyCard';
import { useAds } from '@/hooks/useAds';
import { useLocations } from '@/hooks/useLocations';
import { Head, usePage } from '@inertiajs/react';
import {
    Bath,
    Bed,
    ChevronDown,
    Grid,
    Home,
    List,
    MapPin,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Ziggy injected globally
declare var route: any;

function PropertySkeleton({ isListView }: { isListView: boolean }) {
    if (isListView) {
        return (
            <div className="card-premium flex overflow-hidden">
                <div className="skeleton h-48 w-64 shrink-0" />
                <div className="flex-1 space-y-3 p-6">
                    <div className="skeleton h-5 w-3/4 rounded" />
                    <div className="skeleton h-4 w-1/2 rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-2/3 rounded" />
                </div>
            </div>
        );
    }
    return (
        <div className="card-premium overflow-hidden">
            <div className="skeleton h-52 w-full" />
            <div className="space-y-3 p-5">
                <div className="skeleton h-5 w-2/3 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="flex gap-3 pt-1">
                    <div className="skeleton h-3.5 w-16 rounded" />
                    <div className="skeleton h-3.5 w-16 rounded" />
                    <div className="skeleton h-3.5 w-16 rounded" />
                </div>
                <div className="skeleton h-9 w-full rounded-xl pt-2" />
            </div>
        </div>
    );
}

export default function Properties() {
    const { props } = usePage();
    const filtersProp = (props.filters || {}) as any;
    const { t } = useTranslation();

    // Filtres
    const [search, setSearch] = useState(filtersProp.search ?? '');
    const [saleType, setSaleType] = useState(filtersProp.sale_type ?? '');
    const [type, setType] = useState(filtersProp.type ?? '');
    const [municipalityId, setMunicipalityId] = useState(
        filtersProp.municipality_id ?? '',
    );
    const [priceMin, setPriceMin] = useState(filtersProp.price_min ?? '');
    const [priceMax, setPriceMax] = useState(filtersProp.price_max ?? '');
    const [bedrooms, setBedrooms] = useState(filtersProp.bedrooms ?? '');
    const [bathrooms, setBathrooms] = useState(filtersProp.bathrooms ?? '');
    const [amenities, setAmenities] = useState<number[]>(
        filtersProp.amenities ?? [],
    );
    const [sort, setSort] = useState(filtersProp.sort ?? 'newest');
    const [viewMode, setViewMode] = useState('grid');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(handler);
    }, [search]);

    const { municipalities: fetchedMunicipalities } = useLocations();
    const municipalities =
        fetchedMunicipalities.length > 0
            ? fetchedMunicipalities
            : ((props.municipalities || []) as any[]);

    const currentFilters = {
        search: debouncedSearch,
        sale_type: saleType,
        type,
        municipality_id: municipalityId,
        price_min: priceMin,
        price_max: priceMax,
        bedrooms,
        bathrooms,
        amenities,
        sort,
    };

    const { ads: properties, loading } = useAds(currentFilters);
    const allAmenities = (props.allAmenities || []) as any[];
    const favorites = (props.favorites || []) as any[];
    const types = (props.types || [
        'apartment',
        'house',
        'land',
        'commercial',
    ]) as string[];
    const saleTypes = (props.saleTypes || ['rent', 'sale']) as string[];

    const handleAmenityToggle = (id: number) => {
        setAmenities((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
        );
    };

    const activeFilterCount =
        [
            saleType,
            type,
            municipalityId,
            priceMin,
            priceMax,
            bedrooms,
            bathrooms,
        ].filter(Boolean).length +
        amenities.length +
        (debouncedSearch ? 1 : 0);

    const resetFilters = () => {
        setSearch('');
        setSaleType('');
        setType('');
        setMunicipalityId('');
        setPriceMin('');
        setPriceMax('');
        setBedrooms('');
        setBathrooms('');
        setAmenities([]);
        setSort('newest');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <App>
            <Head title={t('property') || 'Propriétés'} />
            <Breadcumb title={t('property')} homeLink={route('home')} />

            <div className="min-h-screen bg-[#F8F7F4] pb-20">
                <div className="mx-auto max-w-7xl px-4 pt-10">
                    {/* ── Barre de filtres principale ── */}
                    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        {/* Ligne principale */}
                        <div className="flex flex-wrap items-center gap-0 divide-x divide-gray-100">
                            {/* Recherche */}
                            <div className="relative min-w-[180px] flex-1">
                                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={
                                        t('search_properties') ||
                                        'Rechercher...'
                                    }
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full border-0 bg-transparent py-4 pr-4 pl-11 text-sm text-gray-800 placeholder-gray-400 outline-none"
                                />
                            </div>

                            {/* Type de transaction */}
                            <div className="relative min-w-[160px]">
                                <Home className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#C9A84C]" />
                                <select
                                    value={saleType}
                                    onChange={(e) =>
                                        setSaleType(e.target.value)
                                    }
                                    className="w-full appearance-none border-0 bg-transparent py-4 pr-8 pl-11 text-sm text-gray-700 outline-none focus:text-gray-900"
                                >
                                    <option value="">{t('status')}</option>
                                    {saleTypes.map((st) => (
                                        <option key={st} value={st}>
                                            {st.charAt(0).toUpperCase() +
                                                st.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                            </div>

                            {/* Localisation */}
                            <div className="relative min-w-[160px]">
                                <MapPin className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#C9A84C]" />
                                <select
                                    value={municipalityId}
                                    onChange={(e) =>
                                        setMunicipalityId(e.target.value)
                                    }
                                    className="w-full appearance-none border-0 bg-transparent py-4 pr-8 pl-11 text-sm text-gray-700 outline-none"
                                >
                                    <option value="">{t('location')}</option>
                                    {municipalities.map((m: any) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                            </div>

                            {/* Bouton filtres avancés */}
                            <button
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                className={`flex items-center gap-2.5 px-6 py-4 text-sm font-semibold transition-colors duration-200 ${
                                    filtersOpen || activeFilterCount > 0
                                        ? 'bg-[#1E3A5F] text-white'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                {t('advanced_filter') || 'Filtres'}
                                {activeFilterCount > 0 && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C9A84C] px-1.5 text-xs font-bold text-white">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Filtres avancés dépliables */}
                        <div
                            className={`overflow-hidden transition-all duration-400 ${filtersOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="border-t border-gray-100 p-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {/* Type de bien */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                            {t('type')}
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={type}
                                                onChange={(e) =>
                                                    setType(e.target.value)
                                                }
                                                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 pr-8 text-sm text-gray-700 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                            >
                                                <option value="">Tous</option>
                                                {types.map((tp) => (
                                                    <option key={tp} value={tp}>
                                                        {tp
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            tp.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Prix min */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                            {t('price_min') || 'Prix min'}
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="$ Minimum"
                                            value={priceMin}
                                            onChange={(e) =>
                                                setPriceMin(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                        />
                                    </div>

                                    {/* Prix max */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                            {t('price_max') || 'Prix max'}
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="$ Maximum"
                                            value={priceMax}
                                            onChange={(e) =>
                                                setPriceMax(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                        />
                                    </div>

                                    {/* Chambres + Bains */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                                <Bed className="h-3 w-3" />
                                                {t('bedrooms')}
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Nb"
                                                value={bedrooms}
                                                onChange={(e) =>
                                                    setBedrooms(e.target.value)
                                                }
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                                <Bath className="h-3 w-3" />
                                                {t('bathrooms')}
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Nb"
                                                value={bathrooms}
                                                onChange={(e) =>
                                                    setBathrooms(e.target.value)
                                                }
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Équipements */}
                                {allAmenities.length > 0 && (
                                    <div className="mt-5">
                                        <label className="mb-3 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                            {t('amenities') || 'Équipements'}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {allAmenities.map((a: any) => (
                                                <button
                                                    key={a.id}
                                                    type="button"
                                                    onClick={() =>
                                                        handleAmenityToggle(
                                                            a.id,
                                                        )
                                                    }
                                                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                                                        amenities.includes(a.id)
                                                            ? 'border-[#1E3A5F] bg-[#1E3A5F] text-white'
                                                            : 'border-gray-200 bg-white text-gray-600 hover:border-[#1E3A5F]/40 hover:text-[#1E3A5F]'
                                                    }`}
                                                >
                                                    {a.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                                    <button
                                        onClick={resetFilters}
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                    >
                                        <X className="h-4 w-4" />
                                        Réinitialiser
                                    </button>
                                    <button
                                        onClick={() => setFiltersOpen(false)}
                                        className="rounded-xl bg-[#1E3A5F] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#152C47]"
                                    >
                                        Appliquer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Barre de résultats ── */}
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#1E3A5F] border-t-transparent" />
                                    Chargement...
                                </span>
                            ) : (
                                <>
                                    <span className="font-bold text-gray-900">
                                        {properties?.total ?? 0}
                                    </span>{' '}
                                    résultat
                                    {(properties?.total ?? 0) !== 1 ? 's' : ''}
                                    {debouncedSearch && (
                                        <>
                                            {' '}
                                            pour{' '}
                                            <span className="font-semibold text-[#1E3A5F]">
                                                "{debouncedSearch}"
                                            </span>
                                        </>
                                    )}
                                </>
                            )}
                        </p>

                        <div className="flex items-center gap-3">
                            {/* Tri */}
                            <div className="relative">
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="appearance-none rounded-xl border border-gray-200 bg-white py-2 pr-8 pl-3 text-sm font-medium text-gray-700 shadow-sm focus:border-[#1E3A5F] focus:outline-none"
                                >
                                    <option value="newest">
                                        {t('newest') || 'Plus récents'}
                                    </option>
                                    <option value="low_price">
                                        {t('low_price') || 'Prix croissant'}
                                    </option>
                                    <option value="high_price">
                                        {t('high_price') || 'Prix décroissant'}
                                    </option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                            </div>

                            {/* Vue grille/liste */}
                            <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`rounded-lg p-2 transition-all duration-200 ${viewMode === 'grid' ? 'bg-[#1E3A5F] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    title={t('grid_view')}
                                >
                                    <Grid size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`rounded-lg p-2 transition-all duration-200 ${viewMode === 'list' ? 'bg-[#1E3A5F] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    title={t('list_view')}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Grille de propriétés ── */}
                    <div
                        className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                    >
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <PropertySkeleton
                                    key={i}
                                    isListView={viewMode === 'list'}
                                />
                            ))
                        ) : Array.isArray(properties?.data) &&
                          properties.data.length > 0 ? (
                            properties.data.map((property: any) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                    favorites={favorites}
                                    isListView={viewMode === 'list'}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                                    <Home size={32} className="text-gray-300" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-gray-800">
                                    {t('no_properties_found')}
                                </h3>
                                <p className="mb-5 text-sm text-gray-500">
                                    {t('try_different_filters') ||
                                        'Modifiez vos filtres pour trouver des biens.'}
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="btn-navy inline-flex"
                                >
                                    Réinitialiser les filtres
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Pagination ── */}
                    {!loading && properties?.links && (
                        <div className="mt-10">
                            <Pagination links={properties.links} />
                        </div>
                    )}
                </div>
            </div>

            <NewsLetter />
        </App>
    );
}
