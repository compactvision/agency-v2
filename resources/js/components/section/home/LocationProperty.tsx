import { router } from '@inertiajs/react';
import {
    ArrowRight,
    Building,
    ChevronLeft,
    ChevronRight,
    Filter,
    Home,
    MapPin,
    Search,
    Star,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { route } from 'ziggy-js';

export default function LocationProperty({
    municipalities,
}: {
    municipalities: any;
}) {
    const { t, i18n } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [hoveredSlide, setHoveredSlide] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState('name');
    const swiperRef = useRef<any>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Trier les municipalités selon le critère choisi
    const sortedMunicipalities = [...municipalities].sort((a, b) => {
        switch (sortBy) {
            case 'properties':
                return b.properties - a.properties;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });

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

    // Gestion du changement de slide
    const handleSlideChange = (swiper: any) => {
        setActiveIndex(swiper.realIndex);
    };

    const handleSearch = (id: number) => {
        const params = {
            municipality_id: id,
        };

        router.get(route('properties'), params, {
            preserveState: true,
        });
    };

    // Navigation personnalisée
    const goNext = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    const goPrev = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    // Calculer le total des propriétés
    const totalProperties = municipalities.reduce(
        (sum: number, m: any) => sum + m.properties,
        0,
    );

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
                    className={`mb-16 transform text-center transition-all duration-1000 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    <div className="inline-block">
                        <span className="text-sm font-medium tracking-wider text-amber-400 uppercase">
                            {t('location_property_subtitle')}
                        </span>
                    </div>
                    <h2 className="mt-4 text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl">
                        {i18n.language === 'fr' ? (
                            <>
                                Découvrir la maison de vos{' '}
                                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                                    rêves
                                </span>
                            </>
                        ) : (
                            <>
                                Discover your dream{' '}
                                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                                    house
                                </span>
                            </>
                        )}
                    </h2>
                    <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-300">
                        {t('location_property_paragraph')}
                    </p>

                    {/* Filtres et statistiques */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row">
                        {/* Sélecteur de tri */}
                        <div className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                            <Filter className="h-4 w-4 text-gray-300" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="cursor-pointer border-none bg-transparent text-white focus:outline-none"
                            >
                                <option value="name" className="bg-slate-800">
                                    {t('sort_by_name') || 'Trier par nom'}
                                </option>
                                <option
                                    value="properties"
                                    className="bg-slate-800"
                                >
                                    {t('sort_by_properties') ||
                                        'Trier par propriétés'}
                                </option>
                            </select>
                        </div>

                        {/* Statistique totale */}
                        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/20 px-4 py-2 backdrop-blur-sm">
                            <Home className="h-4 w-4 text-amber-400" />
                            <span className="font-semibold text-amber-400">
                                {totalProperties}{' '}
                                {t('total_properties') || 'propriétés au total'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Carrousel avec design moderne */}
                <div
                    className={`relative transform transition-all delay-300 duration-1000 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    <Swiper
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={30}
                        slidesPerView={3}
                        loop={(municipalities?.length || 0) > 3}
                        centeredSlides={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        onSlideChange={handleSlideChange}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                                spaceBetween: 15,
                                centeredSlides: true,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                                centeredSlides: false,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                                centeredSlides: true,
                            },
                        }}
                        className="location-swiper"
                    >
                        {sortedMunicipalities.map(
                            (municipality: any, index: number) => (
                                <SwiperSlide key={municipality.id}>
                                    <div
                                        className={`group relative transform cursor-pointer transition-all duration-700 ${
                                            activeIndex === index
                                                ? 'z-10 scale-105'
                                                : 'scale-95 opacity-70'
                                        }`}
                                        onMouseEnter={() =>
                                            setHoveredSlide(municipality.id)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredSlide(null)
                                        }
                                        onClick={() =>
                                            handleSearch(municipality.id)
                                        }
                                    >
                                        {/* Carte de localisation */}
                                        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md transition-all duration-500 hover:border-amber-400/50">
                                            {/* Image avec overlay */}
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    src={`/storage/${municipality.image}`}
                                                    alt={municipality.name}
                                                    loading="lazy"
                                                />

                                                {/* Overlay dégradé */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                                                {/* Badge du nombre de propriétés - TRÈS VISIBLE */}
                                                <div className="absolute top-4 right-4 z-20">
                                                    <div className="flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-white shadow-lg">
                                                        <Home className="h-4 w-4" />
                                                        <span className="text-lg font-bold">
                                                            {
                                                                municipality.properties
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Badge de popularité */}
                                                {municipality.featured && (
                                                    <div className="absolute top-4 left-4 z-20">
                                                        <div className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            {t('popular') ||
                                                                'Populaire'}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Icône centrale au survol */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                                    <div className="flex h-20 w-20 scale-0 transform items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-transform delay-100 duration-500 group-hover:scale-100">
                                                        <MapPin className="h-10 w-10 text-amber-500" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contenu avec le nombre de propriétés en évidence */}
                                            <div className="p-6 text-center">
                                                <h3 className="mb-3 text-xl font-bold text-white transition-colors duration-300 group-hover:text-amber-400">
                                                    {municipality.name}
                                                </h3>

                                                {/* Nombre de propriétés MIS EN AVANT */}
                                                <div className="mb-4">
                                                    <div className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/20 px-4 py-2">
                                                        <Building className="h-5 w-5 text-amber-400" />
                                                        <span className="text-lg font-semibold text-amber-400">
                                                            {
                                                                municipality.properties
                                                            }
                                                        </span>
                                                        <span className="text-sm text-amber-300">
                                                            {t(
                                                                'properties_available',
                                                            ) ||
                                                                'propriétés disponibles'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Bouton d'action */}
                                                <button className="inline-flex w-full transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700 hover:shadow-xl hover:shadow-amber-500/25">
                                                    <span>
                                                        {t(
                                                            'explore_properties',
                                                        ) || 'Explorer'}
                                                    </span>
                                                    <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                                                </button>
                                            </div>

                                            {/* Effet de brillance */}
                                            <div className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 transform rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ),
                        )}
                    </Swiper>

                    {/* Navigation personnalisée */}
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                            onClick={goPrev}
                            className="flex h-12 w-12 transform items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        {/* Pagination personnalisée */}
                        <div className="flex items-center gap-2">
                            {sortedMunicipalities.map(
                                (_: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            swiperRef.current?.slideTo(index)
                                        }
                                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                                            activeIndex === index
                                                ? 'w-8 bg-amber-400'
                                                : 'bg-white/30 hover:bg-white/50'
                                        }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    ></button>
                                ),
                            )}
                        </div>

                        <button
                            onClick={goNext}
                            className="flex h-12 w-12 transform items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Bouton CTA global */}
                <div
                    className={`mt-16 transform text-center transition-all delay-700 duration-1000 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    <a
                        href={route('properties')}
                        className="group inline-flex transform items-center gap-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-gray-800 hover:to-gray-900 hover:shadow-xl"
                    >
                        <Search className="h-5 w-5" />
                        <span>
                            {t('view_all_locations') ||
                                'Voir toutes les localisations'}
                        </span>
                        <ArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                        <div className="absolute inset-0 rounded-xl bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                    </a>
                </div>
            </div>

            {/* Particules flottantes */}
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

            {/* Styles personnalisés */}
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
                
                .location-swiper .swiper-slide {
                    transition: all 0.7s ease;
                }
                
                .location-swiper .swiper-slide-active {
                    transform: scale(1.05);
                    z-index: 10;
                }
                
                .location-swiper .swiper-slide-prev,
                .location-swiper .swiper-slide-next {
                    transform: scale(0.95);
                    opacity: 0.7;
                }
            `}</style>
        </section>
    );
}
