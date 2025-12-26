import App from '@/components/layouts/Home/App';
import Pagination from '@/components/pagination/home/Pagination';
import Breadcumb from '@/components/ui/Breadcumb';
import NewsLetter from '@/components/ui/NewsLetter';
import PropertyCard from '@/components/ui/PropertyCard';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Bath,
    Bed,
    ChevronDown,
    DollarSign,
    Filter,
    Grid,
    Home,
    List,
    MapPin,
    Search,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Declare route globally as it is injected by Ziggy/Laravel
declare var route: any;

import { useAds } from '@/hooks/useAds';
import { useLocations } from '@/hooks/useLocations';

export default function Properties() {
    const { props } = usePage();
    const filtersProp = (props.filters || {}) as any;

    // Local state for filters
    const [search, setSearch] = useState(filtersProp.search ?? '');
    const [saleType, setSaleType] = useState(filtersProp.sale_type ?? '');
    const [type, setType] = useState(filtersProp.type ?? '');
    const [municipalityId, setMunicipalityId] = useState(filtersProp.municipality_id ?? '');
    const [priceMin, setPriceMin] = useState(filtersProp.price_min ?? '');
    const [priceMax, setPriceMax] = useState(filtersProp.price_max ?? '');
    const [bedrooms, setBedrooms] = useState(filtersProp.bedrooms ?? '');
    const [bathrooms, setBathrooms] = useState(filtersProp.bathrooms ?? '');
    const [amenities, setAmenities] = useState<number[]>(filtersProp.amenities ?? []);
    const [sort, setSort] = useState(filtersProp.sort ?? 'newest');
    const [viewMode, setViewMode] = useState('grid');
    const { t } = useTranslation();

    const [opened, setOpened] = useState(false);
    const toggleMenu = () => setOpened(!opened);

    // Debounce search for API calls
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    // Locations hook
    const { municipalities: fetchedMunicipalities } = useLocations();
    const municipalities = fetchedMunicipalities.length > 0 
        ? fetchedMunicipalities 
        : ((props.municipalities || []) as any[]);

    // Prepare filters for useAds
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
        sort
    };

    // Data fetching hook
    const { ads: properties, loading } = useAds(currentFilters);

    // Static props (fallbacks)
    const allAmenities = (props.allAmenities || []) as any[];
    const favorites = (props.favorites || []) as any[];
    const types = (props.types || ['apartment', 'house', 'land', 'commercial']) as string[];
    const saleTypes = (props.saleTypes || ['rent', 'sale']) as string[];

    const handleSearchChange = (val: string) => {
        setSearch(val);
    };

    const handleAmenityToggle = (id: number) => {
        setAmenities((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <App>
            <Head title="Properties" />
            <Breadcumb title={t('property')} homeLink={route('home')} />

            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    {/* Filtres principaux */}
                    <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {/* Filtre par statut */}
                            <div className="relative">
                                <select
                                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-3 pr-4 pl-10 text-gray-800 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                    value={saleType}
                                    onChange={(e) =>
                                        setSaleType(e.target.value)
                                    }
                                >
                                    <option value="">{t('status')}</option>
                                    {saleTypes.map((st) => (
                                        <option key={st} value={st}>
                                            {st.charAt(0).toUpperCase() +
                                                st.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Home
                                        size={18}
                                        className="text-orange-500"
                                    />
                                </div>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <ChevronDown
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Filtre par type */}
                            <div className="relative">
                                <select
                                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-3 pr-4 pl-10 text-gray-800 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="">{t('type')}</option>
                                    {types.map((t) => (
                                        <option key={t} value={t}>
                                            {t.charAt(0).toUpperCase() +
                                                t.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Filter
                                        size={18}
                                        className="text-orange-500"
                                    />
                                </div>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <ChevronDown
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Filtre par localisation */}
                            <div className="relative">
                                <select
                                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-3 pr-4 pl-10 text-gray-800 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                    value={municipalityId}
                                    onChange={(e) =>
                                        setMunicipalityId(e.target.value)
                                    }
                                >
                                    <option value="">{t('location')}</option>
                                    {municipalities.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MapPin
                                        size={18}
                                        className="text-orange-500"
                                    />
                                </div>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <ChevronDown
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Bouton filtre avancé */}
                            <div className="relative">
                                <button
                                    className={`w-full border py-3 pr-4 pl-10 ${opened ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 bg-white text-gray-800'} flex items-center justify-between rounded-lg font-medium transition-colors duration-200`}
                                    onClick={() => toggleMenu()}
                                >
                                    <span>{t('advanced_filter')}</span>
                                    <Filter size={18} />
                                </button>
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Filter
                                        size={18}
                                        className={
                                            opened
                                                ? 'text-orange-500'
                                                : 'text-gray-400'
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Filtres avancés */}
                        <div
                            className={`overflow-hidden transition-all duration-500 ${opened ? 'mt-6 max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {/* Prix minimum */}
                                <div className="relative">
                                    <input
                                        className="w-full rounded-lg border border-gray-200 bg-white py-3 pr-4 pl-10 text-gray-800 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                        type="number"
                                        placeholder={t('min_price')}
                                        value={priceMin}
                                        onChange={(e) =>
                                            setPriceMin(e.target.value)
                                        }
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <DollarSign
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Prix maximum */}
                                <div className="relative">
                                    <input
                                        className="w-full rounded-lg border border-gray-200 bg-white py-3 pr-4 pl-10 text-gray-800 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                        type="number"
                                        placeholder={t('max_price')}
                                        value={priceMax}
                                        onChange={(e) =>
                                            setPriceMax(e.target.value)
                                        }
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <DollarSign
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Nombre de chambres */}
                                <div className="relative">
                                    <input
                                        className="w-full rounded-lg border border-gray-200 bg-white py-3 pr-4 pl-10 text-gray-800 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                        type="number"
                                        placeholder={t('bedrooms')}
                                        value={bedrooms}
                                        onChange={(e) =>
                                            setBedrooms(e.target.value)
                                        }
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Bed
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Nombre de salles de bain */}
                                <div className="relative">
                                    <input
                                        className="w-full rounded-lg border border-gray-200 bg-white py-3 pr-4 pl-10 text-gray-800 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                        type="number"
                                        placeholder={t('bathrooms')}
                                        value={bathrooms}
                                        onChange={(e) =>
                                            setBathrooms(e.target.value)
                                        }
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Bath
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Recherche par quartier */}
                            <div className="relative mt-4">
                                <input
                                    className="w-full rounded-lg border border-gray-200 bg-white py-3 pr-4 pl-10 text-gray-800 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                    type="text"
                                    placeholder={t('search_quarter')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Search
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Équipements */}
                            <div className="mt-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                                    {t('amenities')}
                                </h3>
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                                    {allAmenities &&
                                        allAmenities.map((a: any) => (
                                            <label
                                                key={a.id}
                                                className="flex cursor-pointer items-center space-x-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                                    id={`amenity-${a.id}`}
                                                    onChange={() =>
                                                        handleAmenityToggle(
                                                            a.id,
                                                        )
                                                    }
                                                    checked={amenities.includes(
                                                        a.id,
                                                    )}
                                                />
                                                <label
                                                    htmlFor={`amenity-${a.id}`}
                                                    className="text-sm text-gray-700"
                                                >
                                                    {a.name}
                                                </label>
                                            </label>
                                        ))}
                                </div>
                            </div>

                            {/* Bouton de fermeture */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    className="flex items-center gap-2 rounded-lg bg-gray-200 px-6 py-2 text-gray-800 transition-colors duration-200 hover:bg-gray-300"
                                    onClick={() => toggleMenu()}
                                >
                                    <X size={18} />
                                    {t('close')}
                                </button>
                            </div>
                        </div>

                        {/* Barre inférieure des filtres */}
                        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center">
                            <span className="text-gray-600">
                                {t('showing_results', {
                                    from: properties.from,
                                    to: properties.to,
                                    total: properties.total,
                                })}
                            </span>

                            <div className="flex items-center gap-4">
                                {/* Boutons de vue */}
                                <div className="flex items-center rounded-lg bg-gray-100 p-1">
                                    <button
                                        className={`rounded p-2 ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                                        onClick={() => setViewMode('grid')}
                                        title={t('grid_view')}
                                    >
                                        <Grid
                                            size={18}
                                            className={
                                                viewMode === 'grid'
                                                    ? 'text-orange-500'
                                                    : 'text-gray-600'
                                            }
                                        />
                                    </button>
                                    <button
                                        className={`rounded p-2 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                                        onClick={() => setViewMode('list')}
                                        title={t('list_view')}
                                    >
                                        <List
                                            size={18}
                                            className={
                                                viewMode === 'list'
                                                    ? 'text-orange-500'
                                                    : 'text-gray-600'
                                            }
                                        />
                                    </button>
                                </div>

                                {/* Tri */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        {t('sort_by')}:
                                    </span>
                                    <div className="relative">
                                        <select
                                            className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pr-8 pl-4 text-sm text-gray-800 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                            value={sort || 'newest'}
                                            onChange={(e) =>
                                                setSort(e.target.value)
                                            }
                                        >
                                            <option value="newest">
                                                {t('newest')}
                                            </option>
                                            <option value="low_price">
                                                {t('low_price')}
                                            </option>
                                            <option value="high_price">
                                                {t('high_price')}
                                            </option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronDown
                                                size={16}
                                                className="text-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Liste des propriétés */}
                    <div
                        className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                    >
                        {Array.isArray(properties.data) &&
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
                            <div className="col-span-full py-12 text-center">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <Home size={24} className="text-gray-400" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                                    {t('no_properties_found')}
                                </h3>
                                <p className="text-gray-600">
                                    {t('try_different_filters')}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-12">
                        <Pagination links={properties.links} />
                    </div>
                </div>
            </section>

            <NewsLetter />
        </App>
    );
}
