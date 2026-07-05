import { Amenity, useAmenities } from '@/hooks/useAmenities';
import { Category, useCategories } from '@/hooks/useCategories';
import { useLocations } from '@/hooks/useLocations';
import { router } from '@inertiajs/react';
import {
    LucideBath,
    LucideBed,
    LucideChevronDown,
    LucideFilter,
    LucideHome,
    LucideMapPin,
    LucideSearch,
    LucideX,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';

export default function Hero() {
    const [opened, setOpened] = useState(false);
    const [activeTab, setActiveTab] = useState('sale');
    const [searchFocused, setSearchFocused] = useState(false);
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

    useEffect(() => {
        if (opened) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [opened]);

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
        router.get(route('properties'), params, { preserveState: true });
    };

    const selectedMunicipalityName = safeMunicipalities.find(
        (m) => m.id.toString() === municipalityId,
    )?.name;

    const activeFilterCount =
        [priceMin, priceMax, bedrooms, bathrooms, type].filter(Boolean).length +
        amenities.length;

    return (
        <>
            {/* ── Hero Section ── */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
                {/* Fond image avec overlay navy */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="assets/images/thumbs/banner-10-bg.jpg"
                        alt="Immobilier premium"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0d2340]/85 via-[#152C47]/75 to-[#0d2340]/90" />
                </div>

                {/* Accent décoratif (statique — pas de Math.random) */}
                <div className="pointer-events-none absolute inset-0 z-10">
                    <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#C9A84C]/8 blur-[120px]" />
                    <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#1E3A5F]/40 blur-[100px]" />
                </div>

                <div className="relative z-20 mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
                    {/* Headline */}
                    <div className="animate-ag-fadeInUp mb-10 text-center">
                        {/* Badge */}
                        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-2 text-xs font-semibold tracking-widest text-[#E8C882] uppercase">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C9A84C]" />
                            {t('hero_subtitle')}
                        </span>

                        <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
                            {t('hero_title')}
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
                            {t('hero_paragraph')}
                        </p>
                    </div>

                    {/* Formulaire de recherche */}
                    <div
                        className="relative z-30 mx-auto max-w-4xl"
                        style={{
                            animation: 'ag-fadeInUp 0.7s ease-out 0.2s both',
                        }}
                    >
                        {/* Tabs Vente / Location */}
                        <div className="mb-5 flex justify-center">
                            <div className="inline-flex gap-1 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md">
                                {[
                                    { key: 'sale', label: t('sale') },
                                    { key: 'rent', label: t('rent') },
                                ].map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => handleTypeChange(key)}
                                        className={`rounded-full px-8 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 ${
                                            activeTab === key
                                                ? 'bg-[#C9A84C] text-white shadow-lg shadow-[#C9A84C]/30'
                                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile */}
                        <div className="block space-y-0 md:hidden">
                            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/20">
                                <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E3A5F]/8">
                                        <LucideMapPin className="h-4 w-4 text-[#C9A84C]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="mb-0.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                            {t('quarter')}
                                        </p>
                                        <input
                                            type="text"
                                            placeholder={t(
                                                'quarter_placeholder',
                                            )}
                                            value={quarter}
                                            onChange={(e) =>
                                                setQuarter(e.target.value)
                                            }
                                            className="w-full border-0 bg-transparent p-0 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
                                        />
                                    </div>
                                </div>
                                <div
                                    className="relative border-b border-gray-100"
                                    ref={municipalityDropdownRef}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsMunicipalityDropdownOpen(
                                                !isMunicipalityDropdownOpen,
                                            )
                                        }
                                        className="flex w-full items-center gap-3 px-4 py-4 text-left"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E3A5F]/8">
                                            <LucideHome className="h-4 w-4 text-[#C9A84C]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="mb-0.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                                {t('location')}
                                            </p>
                                            <span
                                                className={`text-sm font-medium ${selectedMunicipalityName ? 'text-gray-900' : 'text-gray-400'}`}
                                            >
                                                {selectedMunicipalityName ||
                                                    'Sélectionner une commune'}
                                            </span>
                                        </div>
                                        <LucideChevronDown
                                            className={`h-4 w-4 text-gray-400 transition-transform ${isMunicipalityDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {isMunicipalityDropdownOpen && (
                                        <div className="absolute top-full right-0 left-0 z-[200] max-h-56 overflow-y-auto rounded-b-2xl border-t border-gray-100 bg-white shadow-xl">
                                            <div className="sticky top-0 border-b border-gray-100 bg-white p-2">
                                                <div className="relative">
                                                    <LucideSearch className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Rechercher..."
                                                        value={
                                                            municipalitySearch
                                                        }
                                                        onChange={(e) =>
                                                            setMunicipalitySearch(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-lg border border-gray-200 py-2 pr-3 pl-9 text-sm focus:border-[#1E3A5F] focus:outline-none"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                className="cursor-pointer px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-50"
                                                onClick={() => {
                                                    setMunicipalityId('');
                                                    setIsMunicipalityDropdownOpen(
                                                        false,
                                                    );
                                                    setMunicipalitySearch('');
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
                                                            className={`cursor-pointer px-4 py-2.5 text-sm transition-colors hover:bg-[#1E3A5F]/5 ${m.id.toString() === municipalityId ? 'bg-[#1E3A5F]/5 font-semibold text-[#1E3A5F]' : 'text-gray-700'}`}
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
                                                <div className="px-4 py-3 text-center text-sm text-gray-400">
                                                    Aucun résultat
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 p-3">
                                    <button
                                        onClick={toggleMenu}
                                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all ${opened ? 'bg-[#1E3A5F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        <LucideFilter className="h-4 w-4" />
                                        {t('advance')}
                                        {activeFilterCount > 0 && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A84C] text-[10px] font-bold text-white">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleSearch}
                                        className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-[#C9A84C] py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#A8882E]"
                                    >
                                        <LucideSearch className="h-4 w-4" />
                                        {t('search')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Desktop pill */}
                        <div className="relative z-30 hidden md:block">
                            <div className="flex items-center rounded-full bg-white shadow-2xl shadow-black/20">
                                <div className="flex-1 px-6 py-3">
                                    <p className="mb-0.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                        {t('quarter')}
                                    </p>
                                    <input
                                        type="text"
                                        placeholder={t('quarter_placeholder')}
                                        value={quarter}
                                        onChange={(e) =>
                                            setQuarter(e.target.value)
                                        }
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                        className="w-full border-0 bg-transparent p-0 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
                                    />
                                </div>
                                <div className="h-8 w-px bg-gray-200" />
                                <div
                                    className="relative flex-1"
                                    ref={municipalityDropdownRef}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsMunicipalityDropdownOpen(
                                                !isMunicipalityDropdownOpen,
                                            )
                                        }
                                        className="flex w-full items-center justify-between px-6 py-3 text-left"
                                    >
                                        <div>
                                            <p className="mb-0.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                                {t('location')}
                                            </p>
                                            <span
                                                className={`text-sm font-medium ${selectedMunicipalityName ? 'text-gray-900' : 'text-gray-400'}`}
                                            >
                                                {selectedMunicipalityName ||
                                                    'Sélectionner'}
                                            </span>
                                        </div>
                                        <LucideChevronDown
                                            className={`h-4 w-4 text-gray-400 transition-transform ${isMunicipalityDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {isMunicipalityDropdownOpen && (
                                        <div className="absolute top-[calc(100%+8px)] left-0 z-[200] w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                                            <div className="border-b border-gray-100 p-2">
                                                <div className="relative">
                                                    <LucideSearch className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Rechercher..."
                                                        value={
                                                            municipalitySearch
                                                        }
                                                        onChange={(e) =>
                                                            setMunicipalitySearch(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-lg border border-gray-200 py-1.5 pr-3 pl-8 text-sm focus:border-[#1E3A5F] focus:outline-none"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                            <div className="max-h-48 overflow-y-auto">
                                                <div
                                                    className="cursor-pointer px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-50"
                                                    onClick={() => {
                                                        setMunicipalityId('');
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
                                                                className={`cursor-pointer px-4 py-2.5 text-sm transition-colors hover:bg-[#1E3A5F]/5 ${m.id.toString() === municipalityId ? 'bg-[#1E3A5F]/5 font-semibold text-[#1E3A5F]' : 'text-gray-700'}`}
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
                                                    <div className="px-4 py-3 text-center text-sm text-gray-400">
                                                        Aucun résultat
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="h-8 w-px bg-gray-200" />
                                <div className="hidden flex-1 px-6 py-3 lg:block">
                                    <p className="mb-0.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                        {t('price_min')}
                                    </p>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={priceMin}
                                        onChange={(e) =>
                                            setPriceMin(e.target.value)
                                        }
                                        className="w-full border-0 bg-transparent p-0 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
                                    />
                                </div>
                                <div className="hidden h-8 w-px bg-gray-200 lg:block" />
                                <div className="hidden flex-1 px-6 py-3 lg:block">
                                    <p className="mb-0.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                        {t('price_max')}
                                    </p>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={priceMax}
                                        onChange={(e) =>
                                            setPriceMax(e.target.value)
                                        }
                                        className="w-full border-0 bg-transparent p-0 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
                                    />
                                </div>
                                <div className="flex shrink-0 items-center gap-2 p-2">
                                    <button
                                        onClick={toggleMenu}
                                        className={`flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all ${opened ? 'bg-[#1E3A5F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        <LucideFilter className="h-4 w-4" />
                                        <span className="hidden lg:inline">
                                            {t('advance')}
                                        </span>
                                        {activeFilterCount > 0 && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A84C] text-[10px] font-bold text-white">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleSearch}
                                        className="flex items-center gap-2 rounded-full bg-[#C9A84C] px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-[#A8882E]"
                                    >
                                        <LucideSearch className="h-4 w-4" />
                                        <span className="hidden lg:inline">
                                            {t('search')}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats rapides */}
                    <div
                        className="mt-10 flex flex-wrap justify-center gap-6 text-center"
                        style={{
                            animation: 'ag-fadeInUp 0.7s ease-out 0.4s both',
                        }}
                    >
                        {[
                            { value: '15+', label: 'Biens disponibles' },
                            { value: '8', label: 'Ventes réalisées' },
                            { value: '3', label: 'Agents experts' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="flex items-center gap-3"
                            >
                                <div className="text-right">
                                    <div className="text-xl font-bold text-[#E8C882]">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs text-white/50">
                                        {stat.label}
                                    </div>
                                </div>
                                <div className="hidden h-8 w-px bg-white/15 sm:block" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vague décorative bas */}
                <div className="absolute right-0 bottom-0 left-0 z-10">
                    <svg
                        viewBox="0 0 1440 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0 60L1440 60L1440 30C1200 0 960 60 720 30C480 0 240 60 0 30L0 60Z"
                            fill="#F8F7F4"
                        />
                    </svg>
                </div>
            </section>

            {/* ── Modal Filtres Avancés ── */}
            {opened && (
                <div className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center md:p-4">
                    <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl md:max-w-xl md:rounded-2xl">
                        {/* Handle mobile */}
                        <div className="flex justify-center pt-3 pb-1 md:hidden">
                            <div className="h-1 w-10 rounded-full bg-gray-300" />
                        </div>

                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                <LucideFilter className="h-5 w-5 text-[#1E3A5F]" />
                                {t('advance')}
                                {activeFilterCount > 0 && (
                                    <span className="ml-1 rounded-full bg-[#C9A84C] px-2 py-0.5 text-xs font-bold text-white">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </h3>
                            <button
                                onClick={toggleMenu}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
                            >
                                <LucideX className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* Budget (visible sur mobile) */}
                            <div className="md:hidden">
                                <h4 className="mb-3 text-sm font-semibold text-gray-700">
                                    Budget
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs text-gray-500">
                                            {t('price_min')}
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Min $"
                                            value={priceMin}
                                            onChange={(e) =>
                                                setPriceMin(e.target.value)
                                            }
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs text-gray-500">
                                            {t('price_max')}
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Max $"
                                            value={priceMax}
                                            onChange={(e) =>
                                                setPriceMax(e.target.value)
                                            }
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Détails */}
                            <div>
                                <h4 className="mb-3 text-sm font-semibold text-gray-700">
                                    Détails du bien
                                </h4>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {/* Type */}
                                    <div>
                                        <label className="mb-1 block text-xs text-gray-500">
                                            {t('type')}
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={type}
                                                onChange={(e) =>
                                                    setType(e.target.value)
                                                }
                                                className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2.5 pr-8 text-sm focus:border-[#1E3A5F] focus:outline-none"
                                            >
                                                <option value="">
                                                    -- Tous --
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
                                            <LucideChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Chambres */}
                                    <div>
                                        <label className="mb-1 flex items-center gap-1 text-xs text-gray-500">
                                            <LucideBed className="h-3.5 w-3.5" />
                                            {t('bedrooms')}
                                        </label>
                                        <input
                                            type="number"
                                            value={bedrooms}
                                            onChange={(e) =>
                                                setBedrooms(e.target.value)
                                            }
                                            placeholder="ex: 2"
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                        />
                                    </div>

                                    {/* Salles de bain */}
                                    <div>
                                        <label className="mb-1 flex items-center gap-1 text-xs text-gray-500">
                                            <LucideBath className="h-3.5 w-3.5" />
                                            {t('bathrooms')}
                                        </label>
                                        <input
                                            type="number"
                                            value={bathrooms}
                                            onChange={(e) =>
                                                setBathrooms(e.target.value)
                                            }
                                            placeholder="ex: 1"
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Équipements */}
                            {safeAllAmenities.length > 0 && (
                                <div>
                                    <h4 className="mb-3 text-sm font-semibold text-gray-700">
                                        {t('amenities.amenities')}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {safeAllAmenities.map((a: Amenity) => (
                                            <button
                                                key={a.id}
                                                type="button"
                                                onClick={() =>
                                                    handleAmenityToggle(a.id)
                                                }
                                                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                                                    amenities.includes(a.id)
                                                        ? 'border-[#1E3A5F] bg-[#1E3A5F] text-white'
                                                        : 'border-gray-200 text-gray-600 hover:border-[#1E3A5F]/40 hover:text-[#1E3A5F]'
                                                }`}
                                            >
                                                {a.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer sticky */}
                        <div className="sticky bottom-0 flex gap-3 border-t border-gray-100 bg-white px-6 py-4">
                            <button
                                onClick={() => {
                                    setType('');
                                    setBedrooms('');
                                    setBathrooms('');
                                    setAmenities([]);
                                    setPriceMin('');
                                    setPriceMax('');
                                }}
                                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                            >
                                Réinitialiser
                            </button>
                            <button
                                onClick={() => {
                                    handleSearch();
                                    toggleMenu();
                                }}
                                className="flex-1 rounded-xl bg-[#1E3A5F] py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#152C47] hover:shadow-xl"
                            >
                                Appliquer les filtres
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
