import { router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LucideSearch, LucideMapPin, LucideHome, LucideDollarSign, LucideBed, LucideBath, LucideChevronDown, LucideX, LucideFilter, LucideSparkles } from 'lucide-react';

export default function Hero() {
    const [opened, setOpened] = useState(false);
    const [activeTab, setActiveTab] = useState('sale');
    const [isAnimating, setIsAnimating] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [hoveredAmenity, setHoveredAmenity] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
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

    const {
        municipalities,
        types,
        amenities: allAmenities,
    } = usePage().props as unknown as {
        municipalities: { id: number; name: string }[];
        types: string[];
        amenities: { id: number; name: string }[];
    };

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

    const toggleMenu = () => setOpened(!opened);

    const handleAmenityToggle = (id: number) => {
        setAmenities((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
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
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Image de fond avec overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-800/60 to-slate-900/80 z-10"></div>
                    <img 
                        src="assets/images/thumbs/banner-10-bg.jpg" 
                        alt="Background" 
                        className="w-full h-full object-cover"
                    />
                    {/* Effet de lumière animé */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-amber-500/5 to-transparent transform -skew-x-12 animate-pulse"></div>
                </div>

                {/* Particules flottantes pour l'effet visuel */}
                <div className="absolute inset-0 z-10 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-amber-400/20 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${15 + Math.random() * 10}s`
                            }}
                        ></div>
                    ))}
                </div>

                <div className="container mx-auto px-4 relative z-20 py-4">
                    {/* Contenu principal */}
                    <div className={`text-center mb-20 transition-all duration-1000 transform ${
                        isAnimating ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
                    }`}>
                        <div className="inline-block">
                            <h6 className="inline-block px-4 py-2 bg-amber-500/20 backdrop-blur-sm text-amber-400 rounded-full text-sm font-semibold mb-6 border border-amber-500/30">
                                <span className="flex items-center gap-2">
                                    <LucideSparkles className="w-4 h-4" />
                                    {t('hero_subtitle')}
                                </span>
                            </h6>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
                            {t('hero_title')}
                        </h1>
                        
                        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
                            {t('hero_paragraph')}
                        </p>
                    </div>

                    {/* Formulaire de recherche */}
                    <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-300 transform ${
                        isAnimating ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
                    }`}>
                        {/* Onglets Sale/Rent */}
                        <div className="flex justify-center mb-8">
                            <div className="inline-flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
                                <button
                                    className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                                        activeTab === 'sale'
                                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg'
                                            : 'text-white/70 hover:text-white'
                                    }`}
                                    onClick={() => handleTypeChange('sale')}
                                >
                                    {t('sale')}
                                </button>
                                <button
                                    className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
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
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {/* Champ Quartier */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <LucideMapPin className="w-4 h-4 text-amber-500" />
                                        {t('quarter')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder={t('quarter_placeholder')}
                                            value={quarter}
                                            onChange={(e) => setQuarter(e.target.value)}
                                            className={`w-full px-4 py-3 pr-10 rounded-lg border transition-all duration-300 ${
                                                searchFocused && quarter === ''
                                                    ? 'border-amber-400 ring-2 ring-amber-400/20'
                                                    : 'border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                                            } focus:outline-none`}
                                            onFocus={() => setSearchFocused(true)}
                                            onBlur={() => setSearchFocused(false)}
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <LucideMapPin className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Champ Localisation */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <LucideHome className="w-4 h-4 text-amber-500" />
                                        {t('location')}
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={municipalityId}
                                            onChange={(e) => setMunicipalityId(e.target.value)}
                                            className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none appearance-none transition-all duration-300"
                                        >
                                            <option value="">Sélectionner</option>
                                            {municipalities.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <LucideChevronDown className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Champ Prix Min */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <LucideDollarSign className="w-4 h-4 text-amber-500" />
                                        {t('price_min')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder={t('price_min')}
                                            value={priceMin}
                                            onChange={(e) => setPriceMin(e.target.value)}
                                            className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all duration-300"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <LucideDollarSign className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Champ Prix Max */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <LucideDollarSign className="w-4 h-4 text-amber-500" />
                                        {t('price_max')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceMax}
                                            onChange={(e) => setPriceMax(e.target.value)}
                                            className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all duration-300"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <LucideDollarSign className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Boutons de recherche et filtres avancés */}
                            <div className="flex items-center justify-between">
                                {/* Bouton Filtres avancés */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={toggleMenu}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                                            opened
                                                ? 'bg-amber-500 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <LucideFilter className="w-5 h-5" />
                                        {t('advance')}
                                        <LucideChevronDown className={`w-4 h-4 transition-transform duration-300 ${opened ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>

                                {/* Bouton de recherche */}
                                <button
                                    onClick={handleSearch}
                                    className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-amber-500/25"
                                >
                                    <LucideSearch className="w-5 h-5" />
                                    {t('search')}
                                </button>
                            </div>
                        </div>
                    </div>
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

            {/* Dropdown des filtres avancés - RENDU AU NIVEAU RACINE */}
            {opened && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    {/* Overlay - SANS onClick pour ne pas fermer au clic */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    
                    {/* Contenu du dropdown - CORRECTION */}
                    <div 
                        className="relative bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        onClick={handleDropdownClick}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <LucideFilter className="w-5 h-5 text-amber-500" />
                                    {t('advance')}
                                </h3>
                                <button
                                    onClick={toggleMenu}
                                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                                >
                                    <LucideX className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Équipements */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('amenities.amenities')}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {allAmenities.map((a) => (
                                        <div
                                            key={a.id}
                                            className={`relative cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
                                                amenities.includes(a.id)
                                                    ? 'border-amber-400 bg-amber-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            } ${hoveredAmenity === a.id ? 'shadow-md' : ''}`}
                                            onMouseEnter={() => setHoveredAmenity(a.id)}
                                            onMouseLeave={() => setHoveredAmenity(null)}
                                            onClick={() => handleAmenityToggle(a.id)}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    id={`amenity-${a.id}`}
                                                    onChange={() => handleAmenityToggle(a.id)}
                                                    checked={amenities.includes(a.id)}
                                                />
                                                <div
                                                    className={`w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                                                        amenities.includes(a.id)
                                                            ? 'bg-amber-500 border-amber-500'
                                                            : 'border-gray-300'
                                                    }`}
                                                >
                                                    {amenities.includes(a.id) && (
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <label
                                                    htmlFor={`amenity-${a.id}`}
                                                    className="text-sm text-gray-700 cursor-pointer flex-1"
                                                >
                                                    {a.name}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Champs additionnels */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('type')}</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none appearance-none transition-all duration-300"
                                    >
                                        <option value="">-- Sélectionner --</option>
                                        {types.map((t, index) => (
                                            <option key={index} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Chambres */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <LucideBed className="w-4 h-4 text-amber-500" />
                                        {t('bedrooms')}
                                    </label>
                                    <input
                                        type="number"
                                        value={bedrooms}
                                        onChange={(e) => setBedrooms(e.target.value)}
                                        placeholder="ex: 2"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all duration-300"
                                    />
                                </div>

                                {/* Salles de bain */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <LucideBath className="w-4 h-4 text-amber-500" />
                                        {t('bathrooms')}
                                    </label>
                                    <input
                                        type="number"
                                        value={bathrooms}
                                        onChange={(e) => setBathrooms(e.target.value)}
                                        placeholder="ex: 1"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={toggleMenu}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => {
                                        handleSearch();
                                        toggleMenu();
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all duration-300"
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