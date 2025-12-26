import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { 
    MapPin, 
    Home, 
    ArrowRight, 
    TrendingUp, 
    Star, 
    Building,
    Search,
    ChevronLeft,
    ChevronRight,
    Filter
} from 'lucide-react';

export default function LocationProperty({ municipalities }: { municipalities: any }) {
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
    const totalProperties = municipalities.reduce((sum: number, m: any) => sum + m.properties, 0);

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
                <div className={`text-center mb-16 transition-all duration-1000 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="inline-block">
                        <span className="text-sm font-medium text-amber-400 tracking-wider uppercase">
                            {t('location_property_subtitle')}
                        </span>
                    </div>
                    <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        {i18n.language === 'fr' ? (
                            <>
                                Découvrir la maison de vos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">rêves</span>
                            </>
                        ) : (
                            <>
                                Discover your dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">house</span>
                            </>
                        )}
                    </h2>
                    <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        {t('location_property_paragraph')}
                    </p>

                    {/* Filtres et statistiques */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
                        {/* Sélecteur de tri */}
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
                            <Filter className="w-4 h-4 text-gray-300" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-white border-none focus:outline-none cursor-pointer"
                            >
                                <option value="name" className="bg-slate-800">{t('sort_by_name') || 'Trier par nom'}</option>
                                <option value="properties" className="bg-slate-800">{t('sort_by_properties') || 'Trier par propriétés'}</option>
                            </select>
                        </div>

                        {/* Statistique totale */}
                        <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-amber-500/30">
                            <Home className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-400 font-semibold">
                                {totalProperties} {t('total_properties') || 'propriétés au total'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Carrousel avec design moderne */}
                <div className={`relative transition-all duration-1000 delay-300 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <Swiper
                        ref={swiperRef}
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={30}
                        slidesPerView={3}
                        loop={true}
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
                        {sortedMunicipalities.map((municipality: any, index: number) => (
                            <SwiperSlide key={municipality.id}>
                                <div
                                    className={`relative group cursor-pointer transition-all duration-700 transform ${
                                        activeIndex === index 
                                            ? 'scale-105 z-10' 
                                            : 'scale-95 opacity-70'
                                    }`}
                                    onMouseEnter={() => setHoveredSlide(municipality.id)}
                                    onMouseLeave={() => setHoveredSlide(null)}
                                    onClick={() => handleSearch(municipality.id)}
                                >
                                    {/* Carte de localisation */}
                                    <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-amber-400/50 transition-all duration-500">
                                        {/* Image avec overlay */}
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                src={`/storage/${municipality.image}`}
                                                alt={municipality.name}
                                                loading="lazy"
                                            />
                                            
                                            {/* Overlay dégradé */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                            
                                            {/* Badge du nombre de propriétés - TRÈS VISIBLE */}
                                            <div className="absolute top-4 right-4 z-20">
                                                <div className="bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                                    <Home className="w-4 h-4" />
                                                    <span className="font-bold text-lg">{municipality.properties}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Badge de popularité */}
                                            {municipality.featured && (
                                                <div className="absolute top-4 left-4 z-20">
                                                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        {t('popular') || 'Populaire'}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Icône centrale au survol */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                                                    <MapPin className="w-10 h-10 text-amber-500" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contenu avec le nombre de propriétés en évidence */}
                                        <div className="p-6 text-center">
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">
                                                {municipality.name}
                                            </h3>
                                            
                                            {/* Nombre de propriétés MIS EN AVANT */}
                                            <div className="mb-4">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
                                                    <Building className="w-5 h-5 text-amber-400" />
                                                    <span className="text-amber-400 font-semibold text-lg">
                                                        {municipality.properties}
                                                    </span>
                                                    <span className="text-amber-300 text-sm">
                                                        {t('properties_available') || 'propriétés disponibles'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Bouton d'action */}
                                            <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-amber-500/25">
                                                <span>{t('explore_properties') || 'Explorer'}</span>
                                                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                                            </button>
                                        </div>

                                        {/* Effet de brillance */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none rounded-2xl"></div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation personnalisée */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={goPrev}
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        {/* Pagination personnalisée */}
                        <div className="flex items-center gap-2">
                            {sortedMunicipalities.map((_: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => swiperRef.current?.slideTo(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        activeIndex === index 
                                            ? 'w-8 bg-amber-400' 
                                            : 'bg-white/30 hover:bg-white/50'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                        
                        <button
                            onClick={goNext}
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Bouton CTA global */}
                <div className={`text-center mt-16 transition-all duration-1000 delay-700 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <a
                        href={route('properties')}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                        <Search className="w-5 h-5" />
                        <span>{t('view_all_locations') || 'Voir toutes les localisations'}</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                        <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </a>
                </div>
            </div>

            {/* Particules flottantes */}
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

            {/* Styles personnalisés */}
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