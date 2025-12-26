import { Amenity, useAmenities } from '@/hooks/useAmenities';
import { Category, useCategories } from '@/hooks/useCategories';
import { useLocations } from '@/hooks/useLocations';
import { router } from '@inertiajs/react';
import {
    LucideBath,
    LucideBed,
    LucideChevronDown,
    LucideDollarSign,
    LucideFilter,
    LucideHome,
    LucideMapPin,
    LucideSearch,
    LucideSparkles,
    LucideX,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';

export default function Hero() {
    const [opened, setOpened] = useState(false);
    const [activeTab, setActiveTab] = useState('sale');
    const [isAnimating, setIsAnimating] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [hoveredAmenity, setHoveredAmenity] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const municipalityDropdownRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    const [quarter, setQuarter] = useState('');
    const [municipalityId, setMunicipalityId] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [type, setType] = useState('');
    const [sale_type, setSaleType] = useState('sale');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [amenities, setAmenities] = useState<number[]>([]);

    const [isMunicipalityDropdownOpen, setIsMunicipalityDropdownOpen] =
        useState(false);
    const [municipalitySearch, setMunicipalitySearch] = useState('');

    const { municipalities } = useLocations();
    const { amenities: allAmenities } = useAmenities();
    const { categories } = useCategories();

    const safeMunicipalities = municipalities || [];
    const safeAllAmenities = allAmenities || [];
    const safeCategories = categories || [];

    const filteredMunicipalities = safeMunicipalities.filter((m) =>
        m.name.toLowerCase().includes(municipalitySearch.toLowerCase()),
    );

    // Détecter si on est sur mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Animation au chargement
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Gérer le scroll du body quand le dropdown est ouvert
    useEffect(() => {
        if (opened && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [opened, isMobile]);

    // Fermer le dropdown de municipalité au clic extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                municipalityDropdownRef.current &&
                !municipalityDropdownRef.current.contains(event.target as Node)
            ) {
                setIsMunicipalityDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = () => setOpened(!opened);

    const handleAmenityToggle = (id: number) => {
        setAmenities((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
        );
    };

    const handleTypeChange = (value: string) => {
        setSaleType(value);
        setActiveTab(value);
    };

    const handleSearch = () => {
        const params = {
            search: quarter ?? '',
            municipality_id: municipalityId ?? '',
            price_min: priceMin ?? '',
            price_max: priceMax ?? '',
            type: type ?? '',
            sale_type: sale_type ?? '',
            bedrooms: bedrooms ?? '',
            bathrooms: bathrooms ?? '',
            amenities: amenities.length > 0 ? amenities : [],
        };
        router.get(route('properties'), params, {
            preserveState: true,
        });
    };

    // Empêcher la propagation du clic à l'intérieur du dropdown
    const handleDropdownClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <>
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900">
                {/* Image de fond avec overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-900/80 via-slate-800/60 to-slate-900/80"></div>
                    <img
                        src="assets/images/thumbs/banner-10-bg.jpg"
                        alt="Background"
                        className="h-full w-full object-cover"
                    />
                    {/* Effet de lumière animé */}
                    <div className="absolute top-0 left-0 h-full w-full -skew-x-12 transform animate-pulse bg-gradient-to-r from-transparent via-amber-500/5 to-transparent"></div>
                </div>

                {/* Particules flottantes */}
                <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="animate-float absolute h-2 w-2 rounded-full bg-amber-400/20"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${15 + Math.random() * 10}s`,
                            }}
                        ></div>
                    ))}
                </div>

                <div className="relative z-20 container mx-auto px-4 py-4">
                    {/* Contenu principal */}
                    <div
                        className={`mb-12 transform text-center transition-all duration-1000 md:mb-20 ${
                            isAnimating
                                ? 'translate-y-10 opacity-0'
                                : 'translate-y-0 opacity-100'
                        }`}
                    >
                        <div className="inline-block">
                            <h6 className="mb-6 inline-block rounded-full border border-amber-500/30 bg-amber-500/20 px-4 py-2 text-sm font-semibold text-amber-400 backdrop-blur-sm">
                                <span className="flex items-center gap-2">
                                    <LucideSparkles className="h-4 w-4" />
                                    {t('hero_subtitle')}
                                </span>
                            </h6>
                        </div>

                        <h1 className="mb-6 text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl xl:text-7xl">
                            {t('hero_title')}
                        </h1>

                        <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/80 md:text-xl">
                            {t('hero_paragraph')}
                        </p>
                    </div>

                    {/* Formulaire de recherche */}
                    <div
                        className={`mx-auto max-w-6xl transform transition-all delay-300 duration-1000 ${
                            isAnimating
                                ? 'translate-y-10 opacity-0'
                                : 'translate-y-0 opacity-100'
                        }`}
                    >
                        {/* Onglets Sale/Rent */}
                        <div className="mb-6 flex justify-center">
                            <div className="inline-flex rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md">
                                <button
                                    className={`rounded-full px-6 py-2 font-medium transition-all duration-300 md:px-8 md:py-3 ${
                                        activeTab === 'sale'
                                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg'
                                            : 'text-white/70 hover:text-white'
                                    }`}
                                    onClick={() => handleTypeChange('sale')}
                                >
                                    {t('sale')}
                                </button>
                                <button
                                    className={`rounded-full px-6 py-2 font-medium transition-all duration-300 md:px-8 md:py-3 ${
                                        activeTab === 'rent'
                                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg'
                                            : 'text-white/70 hover:text-white'
                                    }`}
                                    onClick={() => handleTypeChange('rent')}
                                >
                                    {t('rent')}
                                </button>
                            </div>
                        </div>

                        {/* Formulaire principal */}
                        <div className="rounded-2xl border border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-xl md:p-8">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {/* Champ Quartier */}
                                <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
                                    <label className="mb-2 block flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <LucideMapPin className="h-4 w-4 text-amber-500" />
                                        {t('quarter')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder={t(
                                                'quarter_placeholder',
                                            )}
                                            value={quarter}
                                            onChange={(e) =>
                                                setQuarter(e.target.value)
                                            }
                                            className={`w-full rounded-lg border px-4 py-3 pr-10 transition-all duration-300 ${
                                                searchFocused && quarter === ''
                                                    ? 'border-amber-400 ring-2 ring-amber-400/20'
                                                    : 'border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                                            } focus:outline-none`}
                                            onFocus={() =>
                                                setSearchFocused(true)
                                            }
                                            onBlur={() =>
                                                setSearchFocused(false)
                                            }
                                        />
                                        <div className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400">
                                            <LucideMapPin className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Champ Localisation */}
                                <div
                                    className="relative col-span-1 md:col-span-2 lg:col-span-1"
                                    ref={municipalityDropdownRef}
                                >
                                    <label className="mb-2 block flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <LucideHome className="h-4 w-4 text-amber-500" />
                                        {t('location')}
                                    </label>
                                    <div className="relative">
                                        <div
                                            onClick={() =>
                                                setIsMunicipalityDropdownOpen(
                                                    !isMunicipalityDropdownOpen,
                                                )
                                            }
                                            className="w-full cursor-pointer rounded-lg border border-gray-200 px-4 py-3 pr-10 transition-all duration-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20"
                                        >
                                            <span
                                                className={
                                                    municipalityId
                                                        ? 'text-gray-900'
                                                        : 'text-gray-400'
                                                }
                                            >
                                                {municipalityId
                                                    ? safeMunicipalities.find(
                                                          (m) =>
                                                              m.id.toString() ===
                                                              municipalityId,
                                                      )?.name
                                                    : 'Sélectionner'}
                                            </span>
                                        </div>
                                        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400">
                                            <LucideChevronDown
                                                className={`h-5 w-5 transition-transform duration-200 ${isMunicipalityDropdownOpen ? 'rotate-180' : ''}`}
                                            />
                                        </div>

                                        {/* Custom Dropdown Menu */}
                                        {isMunicipalityDropdownOpen && (
                                            <div className="absolute right-0 left-0 z-50 mt-1 max-h-60 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                                                <div className="sticky top-0 border-b border-gray-100 bg-gray-50 p-2">
                                                    <div className="relative">
                                                        <LucideSearch className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Rechercher..."
                                                            value={
                                                                municipalitySearch
                                                            }
                                                            onChange={(e) =>
                                                                setMunicipalitySearch(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-md border border-gray-200 py-1.5 pr-3 pl-8 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                                                            autoFocus
                                                        />
                                                    </div>
                                                </div>
                                                <div className="max-h-48 overflow-y-auto py-1">
                                                    <div
                                                        className="cursor-pointer px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-600"
                                                        onClick={() => {
                                                            setMunicipalityId(
                                                                '',
                                                            );
                                                            setIsMunicipalityDropdownOpen(
                                                                false,
                                                            );
                                                            setMunicipalitySearch(
                                                                '',
                                                            );
                                                        }}
                                                    >
                                                        Toutes les communes
                                                    </div>
                                                    {filteredMunicipalities.length >
                                                    0 ? (
                                                        filteredMunicipalities.map(
                                                            (m) => (
                                                                <div
                                                                    key={m.id}
                                                                    className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-amber-50 hover:text-amber-600 ${m.id.toString() === municipalityId ? 'bg-amber-50 font-semibold text-amber-600' : 'text-gray-700'}`}
                                                                    onClick={() => {
                                                                        setMunicipalityId(
                                                                            m.id.toString(),
                                                                        );
                                                                        setIsMunicipalityDropdownOpen(
                                                                            false,
                                                                        );
                                                                        setMunicipalitySearch(
                                                                            '',
                                                                        );
                                                                    }}
                                                                >
                                                                    {m.name}
                                                                </div>
                                                            ),
                                                        )
                                                    ) : (
                                                        <div className="px-4 py-2 text-center text-sm text-gray-400">
                                                            Aucun résultat
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Prix Min/Max - Caché sur mobile, visible sur desktop */}
                                <div className="hidden lg:block">
                                    <label className="mb-2 block flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <LucideDollarSign className="h-4 w-4 text-amber-500" />
                                        {t('price_min')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder={t('price_min')}
                                            value={priceMin}
                                            onChange={(e) =>
                                                setPriceMin(e.target.value)
                                            }
                                            className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-10 transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none"
                                        />
                                        <div className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400">
                                            <LucideDollarSign className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden lg:block">
                                    <label className="mb-2 block flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <LucideDollarSign className="h-4 w-4 text-amber-500" />
                                        {t('price_max')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceMax}
                                            onChange={(e) =>
                                                setPriceMax(e.target.value)
                                            }
                                            className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-10 transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none"
                                        />
                                        <div className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400">
                                            <LucideDollarSign className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Boutons de recherche et filtres avancés */}
                            <div className="mt-4 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
                                {/* Bouton Filtres avancés */}
                                <div
                                    className="relative w-full md:w-auto"
                                    ref={dropdownRef}
                                >
                                    <button
                                        onClick={toggleMenu}
                                        className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium transition-all duration-300 md:w-auto md:justify-normal md:px-6 md:py-3 ${
                                            opened
                                                ? 'border-amber-500 bg-amber-500 text-white shadow-lg'
                                                : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <LucideFilter className="h-5 w-5" />
                                        {t('advance')}
                                        <LucideChevronDown
                                            className={`h-4 w-4 transition-transform duration-300 ${opened ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                </div>

                                {/* Bouton de recherche */}
                                <button
                                    onClick={handleSearch}
                                    className="flex w-full transform items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:from-amber-500 hover:to-amber-600 hover:shadow-xl hover:shadow-amber-500/25 md:w-auto"
                                >
                                    <LucideSearch className="h-5 w-5" />
                                    {t('search')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

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

            {/* Dropdown des filtres avancés - RENDU AU NIVEAU RACINE */}
            {opened && (
                <div className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/50 backdrop-blur-sm md:items-center md:p-4">
                    {/* Contenu du dropdown - Bottom Sheet sur mobile, Modal centré sur desktop */}
                    <div
                        className={`relative max-h-[90vh] w-full overflow-y-auto bg-white shadow-2xl transition-all duration-300 md:max-w-2xl md:rounded-xl ${
                            isMobile ? 'rounded-t-3xl' : ''
                        }`}
                        onClick={handleDropdownClick}
                    >
                        {/* Barre de préhension pour mobile (Handle) */}
                        {isMobile && (
                            <div className="sticky top-0 z-10 flex justify-center bg-white py-3">
                                <div className="h-1.5 w-12 rounded-full bg-gray-300"></div>
                            </div>
                        )}

                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                                    <LucideFilter className="h-5 w-5 text-amber-500" />
                                    {t('advance')}
                                </h3>
                                <button
                                    onClick={toggleMenu}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 hover:bg-gray-200"
                                >
                                    <LucideX className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Prix - Ajouté ici pour mobile car caché dans le formulaire principal */}
                            <div className="mb-6 grid grid-cols-1 gap-4 md:hidden">
                                <h4 className="col-span-2 mb-2 text-sm font-semibold text-gray-700">
                                    Budget
                                </h4>
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-500 uppercase">
                                        {t('price_min')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceMin}
                                            onChange={(e) =>
                                                setPriceMin(e.target.value)
                                            }
                                            className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                                        />
                                        <div className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400">
                                            <LucideDollarSign className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-500 uppercase">
                                        {t('price_max')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceMax}
                                            onChange={(e) =>
                                                setPriceMax(e.target.value)
                                            }
                                            className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                                        />
                                        <div className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400">
                                            <LucideDollarSign className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2 h-px bg-gray-100"></div>
                            </div>

                            {/* Équipements */}
                            <div className="mb-6">
                                <h4 className="mb-3 text-sm font-semibold text-gray-700">
                                    {t('amenities.amenities')}
                                </h4>
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                    {safeAllAmenities.map((a: Amenity) => (
                                        <div
                                            key={a.id}
                                            className={`relative cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
                                                amenities.includes(a.id)
                                                    ? 'border-amber-400 bg-amber-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            } ${hoveredAmenity === a.id ? 'shadow-md' : ''}`}
                                            onMouseEnter={() =>
                                                setHoveredAmenity(a.id)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredAmenity(null)
                                            }
                                            onClick={() =>
                                                handleAmenityToggle(a.id)
                                            }
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
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
                                                <div
                                                    className={`mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 ${
                                                        amenities.includes(a.id)
                                                            ? 'border-amber-500 bg-amber-500'
                                                            : 'border-gray-300'
                                                    }`}
                                                >
                                                    {amenities.includes(
                                                        a.id,
                                                    ) && (
                                                        <svg
                                                            className="h-3 w-3 text-white"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                <label
                                                    htmlFor={`amenity-${a.id}`}
                                                    className="cursor-pointer text-sm text-gray-700"
                                                >
                                                    {a.name}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Champs additionnels */}
                            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                                {/* Type */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        {t('type')}
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={type}
                                            onChange={(e) =>
                                                setType(e.target.value)
                                            }
                                            className="w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none"
                                        >
                                            <option value="">
                                                -- Sélectionner --
                                            </option>
                                            {safeCategories.map(
                                                (c: Category) => (
                                                    <option
                                                        key={c.id}
                                                        value={c.name}
                                                    >
                                                        {c.name}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400">
                                            <LucideChevronDown className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Chambres */}
                                <div>
                                    <label className="mb-2 block flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <LucideBed className="h-4 w-4 text-amber-500" />
                                        {t('bedrooms')}
                                    </label>
                                    <input
                                        type="number"
                                        value={bedrooms}
                                        onChange={(e) =>
                                            setBedrooms(e.target.value)
                                        }
                                        placeholder="ex: 2"
                                        className="w-full rounded-lg border border-gray-200 px-4 py-3 transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none"
                                    />
                                </div>

                                {/* Salles de bain */}
                                <div>
                                    <label className="mb-2 block flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <LucideBath className="h-4 w-4 text-amber-500" />
                                        {t('bathrooms')}
                                    </label>
                                    <input
                                        type="number"
                                        value={bathrooms}
                                        onChange={(e) =>
                                            setBathrooms(e.target.value)
                                        }
                                        placeholder="ex: 1"
                                        className="w-full rounded-lg border border-gray-200 px-4 py-3 transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Boutons d'action - Sticky en bas sur mobile pour meilleure accessibilité */}
                            <div
                                className={`flex gap-3 ${isMobile ? 'sticky bottom-0 -mx-6 border-t border-gray-100 bg-white px-6 py-4' : ''}`}
                            >
                                <button
                                    onClick={toggleMenu}
                                    className="flex-1 rounded-lg bg-gray-100 px-6 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-200 md:flex-none"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => {
                                        handleSearch();
                                        toggleMenu();
                                    }}
                                    className="flex-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-white transition-all duration-300 hover:from-amber-500 hover:to-amber-600 md:flex-none"
                                >
                                    Appliquer les filtres
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
