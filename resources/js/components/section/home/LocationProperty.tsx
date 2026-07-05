import { router } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Home,
    MapPin,
    Search,
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
    const swiperRef = useRef<any>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Trier les municipalités par nombre de propriétés par défaut
    const sortedMunicipalities = [...municipalities].sort(
        (a, b) => b.properties - a.properties,
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.1 },
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    const handleSearch = (id: number) => {
        router.get(
            route('properties'),
            { municipality_id: id },
            { preserveState: true },
        );
    };

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[#F8F7F4] py-20 lg:py-28"
        >
            <div className="relative z-10 mx-auto max-w-7xl px-4">
                {/* En-tête */}
                <div
                    className={`mb-16 flex flex-col items-center justify-between gap-6 transition-all duration-700 md:flex-row md:items-end ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-8 opacity-0'
                    }`}
                >
                    <div>
                        <span className="section-label">
                            <span className="h-px w-8 bg-[#C9A84C]" />
                            {t(
                                'location_property_subtitle',
                                'Explorer par ville',
                            )}
                        </span>
                        <h2 className="section-title mt-2">
                            {i18n.language === 'fr' ? (
                                <>
                                    Propriétés par{' '}
                                    <span className="text-[#C9A84C]">
                                        Localisation
                                    </span>
                                </>
                            ) : (
                                <>
                                    Properties by{' '}
                                    <span className="text-[#C9A84C]">
                                        Location
                                    </span>
                                </>
                            )}
                        </h2>
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500">
                            {t(
                                'location_property_paragraph',
                                'Découvrez les meilleures opportunités immobilières dans les villes les plus prisées.',
                            )}
                        </p>
                    </div>

                    {/* Navigation Swiper */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:border-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:border-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Carrousel */}
                <div
                    className={`transition-all delay-200 duration-700 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-8 opacity-0'
                    }`}
                >
                    <Swiper
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={24}
                        slidesPerView={4}
                        loop={(municipalities?.length || 0) > 4}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        onSlideChange={(swiper) =>
                            setActiveIndex(swiper.realIndex)
                        }
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                    >
                        {sortedMunicipalities.map(
                            (municipality: any, index: number) => (
                                <SwiperSlide key={municipality.id}>
                                    <div
                                        onClick={() =>
                                            handleSearch(municipality.id)
                                        }
                                        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <div className="relative h-72 w-full overflow-hidden">
                                            <img
                                                src={`/storage/${municipality.image}`}
                                                alt={municipality.name}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2340]/80 via-[#0d2340]/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

                                            {/* Badge propriétés */}
                                            <div className="absolute top-4 right-4">
                                                <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-md">
                                                    <Home className="h-3.5 w-3.5 text-white" />
                                                    <span className="text-xs font-bold text-white">
                                                        {
                                                            municipality.properties
                                                        }{' '}
                                                        biens
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Contenu */}
                                            <div className="absolute bottom-0 left-0 w-full p-6">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A84C]">
                                                        <MapPin className="h-4 w-4 text-white" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white">
                                                        {municipality.name}
                                                    </h3>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm font-medium text-[#E8C882] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                                                    {t(
                                                        'explore_properties',
                                                        'Explorer',
                                                    )}
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ),
                        )}
                    </Swiper>
                </div>

                {/* CTA */}
                <div
                    className={`mt-14 text-center transition-all delay-300 duration-700 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-6 opacity-0'
                    }`}
                >
                    <a
                        href={route('properties')}
                        className="btn-navy group inline-flex"
                    >
                        <Search className="mr-2 h-4 w-4" />
                        {t('view_all_locations', 'Voir toutes les zones')}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </a>
                </div>
            </div>
        </section>
    );
}
