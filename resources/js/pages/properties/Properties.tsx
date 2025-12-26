import App from '@/components/layouts/Home/App';
import Pagination from '@/components/pagination/home/Pagination';
import Breadcumb from '@/components/ui/Breadcumb';
import NewsLetter from '@/components/ui/NewsLetter';
import PropertyCard from '@/components/ui/PropertyCard';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, MapPin, Home, DollarSign, Bed, Bath, X, Grid, List, ChevronDown } from 'lucide-react';

export default function Properties() {
    const { properties, allAmenities, favorites } = usePage().props as {
        properties: {
            data: any[];
            links: any[];
            meta: {
                current_page: number;
                last_page: number;
                from: number;
                to: number;
                total: number;
            };
        };
        allAmenities?: any;
        favorites?: any;
    };

    const {
        filters = {},
        municipalities = [],
        types = [],
        saleTypes = [],
    } = usePage().props as Partial<{
        filters: any;
        municipalities: { id: number; name: string }[];
        types: string[];
        saleTypes: string[];
    }>;

    const [opened, setOpened] = useState(false);
    const toggleMenu = () => setOpened(!opened);

    const [search, setSearch] = useState(filters.search ?? '');
    const [saleType, setSaleType] = useState(filters.sale_type ?? '');
    const [type, setType] = useState(filters.type ?? '');
    const [municipalityId, setMunicipalityId] = useState(filters.municipality_id ?? '');
    const [priceMin, setPriceMin] = useState(filters.price_min ?? '');
    const [priceMax, setPriceMax] = useState(filters.price_max ?? '');
    const [bedrooms, setBedrooms] = useState(filters.bedrooms ?? '');
    const [bathrooms, setBathrooms] = useState(filters.bathrooms ?? '');
    const [amenities, setAmenities] = useState<number[]>(filters.amenities ?? []);
    const [sort, setSort] = useState(filters.sort ?? 'newest');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const { t } = useTranslation();

    const handleAmenityToggle = (id: number) => {
        setAmenities((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
    };

    // Création d'une fonction debounce personnalisée pour éviter l'importation de lodash
    const useDebounce = (callback: Function, delay: number) => {
        const debounceRef = useRef<NodeJS.Timeout | null>(null);
        
        const debouncedCallback = (...args: any[]) => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            debounceRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        };
        
        debouncedCallback.cancel = () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
        
        return debouncedCallback;
    };

    const debouncedSearch = useDebounce(
        (params: any) => {
            router.get(route('properties'), params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        },
        500
    );

    useEffect(() => {
        debouncedSearch({
            search,
            sale_type: saleType,
            type,
            municipality_id: municipalityId,
            price_min: priceMin,
            price_max: priceMax,
            bedrooms,
            bathrooms,
            amenities,
            sort,
        });

        return () => debouncedSearch.cancel();
    }, [search, saleType, type, municipalityId, priceMin, priceMax, bedrooms, bathrooms, amenities, sort]);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <App>
            <Head title="Properties" />
            <Breadcumb title={t('property')} homeLink={route('home')} />

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    {/* Filtres principaux */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Filtre par statut */}
                            <div className="relative">
                                <select
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-gray-800"
                                    value={saleType}
                                    onChange={(e) => setSaleType(e.target.value)}
                                >
                                    <option value="">{t('status')}</option>
                                    {saleTypes.map((st) => (
                                        <option key={st} value={st}>
                                            {st.charAt(0).toUpperCase() + st.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Home size={18} className="text-orange-500" />
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <ChevronDown size={18} className="text-gray-400" />
                                </div>
                            </div>

                            {/* Filtre par type */}
                            <div className="relative">
                                <select
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-gray-800"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="">{t('type')}</option>
                                    {types.map((t) => (
                                        <option key={t} value={t}>
                                            {t.charAt(0).toUpperCase() + t.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Filter size={18} className="text-orange-500" />
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <ChevronDown size={18} className="text-gray-400" />
                                </div>
                            </div>

                            {/* Filtre par localisation */}
                            <div className="relative">
                                <select
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-gray-800"
                                    value={municipalityId}
                                    onChange={(e) => setMunicipalityId(e.target.value)}
                                >
                                    <option value="">{t('location')}</option>
                                    {municipalities.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <MapPin size={18} className="text-orange-500" />
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <ChevronDown size={18} className="text-gray-400" />
                                </div>
                            </div>

                            {/* Bouton filtre avancé */}
                            <div className="relative">
                                <button 
                                    className={`w-full pl-10 pr-4 py-3 border ${opened ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 bg-white text-gray-800'} rounded-lg font-medium transition-colors duration-200 flex items-center justify-between`}
                                    onClick={() => toggleMenu()}
                                >
                                    <span>{t('advanced_filter')}</span>
                                    <Filter size={18} />
                                </button>
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Filter size={18} className={opened ? 'text-orange-500' : 'text-gray-400'} />
                                </div>
                            </div>
                        </div>

                        {/* Filtres avancés */}
                        <div className={`overflow-hidden transition-all duration-500 ${opened ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Prix minimum */}
                                <div className="relative">
                                    <input
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800"
                                        type="number"
                                        placeholder={t('min_price')}
                                        value={priceMin}
                                        onChange={(e) => setPriceMin(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <DollarSign size={18} className="text-gray-400" />
                                    </div>
                                </div>

                                {/* Prix maximum */}
                                <div className="relative">
                                    <input
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800"
                                        type="number"
                                        placeholder={t('max_price')}
                                        value={priceMax}
                                        onChange={(e) => setPriceMax(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <DollarSign size={18} className="text-gray-400" />
                                    </div>
                                </div>

                                {/* Nombre de chambres */}
                                <div className="relative">
                                    <input
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800"
                                        type="number"
                                        placeholder={t('bedrooms')}
                                        value={bedrooms}
                                        onChange={(e) => setBedrooms(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Bed size={18} className="text-gray-400" />
                                    </div>
                                </div>

                                {/* Nombre de salles de bain */}
                                <div className="relative">
                                    <input
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800"
                                        type="number"
                                        placeholder={t('bathrooms')}
                                        value={bathrooms}
                                        onChange={(e) => setBathrooms(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Bath size={18} className="text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Recherche par quartier */}
                            <div className="mt-4 relative">
                                <input
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800"
                                    type="text"
                                    placeholder={t('search_quarter')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search size={18} className="text-gray-400" />
                                </div>
                            </div>

                            {/* Équipements */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('amenities')}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {allAmenities && allAmenities.map((a: any) => (
                                        <label key={a.id} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                                id={`amenity-${a.id}`}
                                                onChange={() => handleAmenityToggle(a.id)}
                                                checked={amenities.includes(a.id)}
                                            />
                                            <label htmlFor={`amenity-${a.id}`} className="text-sm text-gray-700">
                                                {a.name}
                                            </label>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Bouton de fermeture */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2"
                                    onClick={() => toggleMenu()}
                                >
                                    <X size={18} />
                                    {t('close')}
                                </button>
                            </div>
                        </div>

                        {/* Barre inférieure des filtres */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-6 border-t border-gray-200">
                            <span className="text-gray-600">
                                {t('showing_results', { from: properties.from, to: properties.to, total: properties.total })}
                            </span>

                            <div className="flex items-center gap-4">
                                {/* Boutons de vue */}
                                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                    <button 
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                                        onClick={() => setViewMode('grid')}
                                        title={t('grid_view')}
                                    >
                                        <Grid size={18} className={viewMode === 'grid' ? 'text-orange-500' : 'text-gray-600'} />
                                    </button>
                                    <button 
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                                        onClick={() => setViewMode('list')}
                                        title={t('list_view')}
                                    >
                                        <List size={18} className={viewMode === 'list' ? 'text-orange-500' : 'text-gray-600'} />
                                    </button>
                                </div>

                                {/* Tri */}
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 text-sm">{t('sort_by')}:</span>
                                    <div className="relative">
                                        <select
                                            className="pl-4 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-gray-800 text-sm"
                                            value={sort || 'newest'}
                                            onChange={(e) => setSort(e.target.value)}
                                        >
                                            <option value="newest">{t('newest')}</option>
                                            <option value="low_price">{t('low_price')}</option>
                                            <option value="high_price">{t('high_price')}</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <ChevronDown size={16} className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Liste des propriétés */}
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                        {Array.isArray(properties.data) && properties.data.length > 0 ? (
                            properties.data.map((property: any) => (
                                <PropertyCard key={property.id} property={property} favorites={favorites} isListView={viewMode === 'list'} />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                    <Home size={24} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('no_properties_found')}</h3>
                                <p className="text-gray-600">{t('try_different_filters')}</p>
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