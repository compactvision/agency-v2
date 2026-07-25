import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    ChevronLeft,
    ChevronRight,
    Home,
    MapPin,
    Search,
    Sparkles,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper/types';
import { route } from 'ziggy-js';

type Municipality = {
    id: number;
    name: string;
    image?: string;
    image_url?: string | null;
    properties?: number;
};

export default function LocationProperty({
    municipalities,
}: {
    municipalities: Municipality[];
}) {
    const { t, i18n } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<SwiperInstance | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    // Trier les municipalités par nombre de propriétés par défaut
    const sortedMunicipalities = [...(municipalities ?? [])].sort(
        (a, b) => (b.properties ?? 0) - (a.properties ?? 0),
    );

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
            className="relative overflow-hidden bg-[#F8F7F4] py-20 transition-colors lg:py-28 dark:bg-[#292625]"
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
                            <span className="h-px w-8 bg-[#CF8E19]" />
                            {t(
                                'location_property_subtitle',
                                'Explorer par ville',
                            )}
                        </span>
                        <h2 className="section-title mt-2">
                            {i18n.language === 'fr' ? (
                                <>
                                    Propriétés par{' '}
                                    <span className="text-[#CF8E19]">
                                        Localisation
                                    </span>
                                </>
                            ) : (
                                <>
                                    Properties by{' '}
                                    <span className="text-[#CF8E19]">
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
                            type="button"
                            onClick={() => swiperRef.current?.slidePrev()}
                            aria-label={t(
                                'previous_locations',
                                'Localisations précédentes',
                            )}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:border-[#413D3C] hover:bg-[#413D3C] hover:text-white dark:bg-[#353130] dark:text-[#EEEFE6] dark:hover:border-[#CF8E19] dark:hover:bg-[#CF8E19] dark:hover:text-[#292625]"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => swiperRef.current?.slideNext()}
                            aria-label={t(
                                'next_locations',
                                'Localisations suivantes',
                            )}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:border-[#413D3C] hover:bg-[#413D3C] hover:text-white dark:bg-[#353130] dark:text-[#EEEFE6] dark:hover:border-[#CF8E19] dark:hover:bg-[#CF8E19] dark:hover:text-[#292625]"
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
                        modules={[A11y, Autoplay, Navigation, Pagination]}
                        spaceBetween={24}
                        slidesPerView={4}
                        loop={(municipalities?.length || 0) > 4}
                        autoplay={
                            reducedMotion
                                ? false
                                : {
                                      delay: 5000,
                                      disableOnInteraction: true,
                                      pauseOnMouseEnter: true,
                                  }
                        }
                        a11y={{
                            enabled: true,
                            containerMessage: t(
                                'locations_carousel',
                                'Carrousel des localisations',
                            ),
                        }}
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
                        {sortedMunicipalities.map((municipality) => (
                            <SwiperSlide key={municipality.id}>
                                <Link
                                    href={route('properties', {
                                        municipality_id: municipality.id,
                                    })}
                                    className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    aria-label={`${t('explore_properties', 'Explorer les propriétés à')} ${municipality.name}`}
                                >
                                    <div className="relative h-72 w-full overflow-hidden">
                                        {municipality.image_url ||
                                        municipality.image ? (
                                            <img
                                                src={
                                                    municipality.image_url ??
                                                    `/storage/${municipality.image}`
                                                }
                                                alt={municipality.name}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div
                                                className="absolute inset-0 overflow-hidden bg-[#292625]"
                                                aria-hidden="true"
                                            >
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(207,142,25,0.42),transparent_30%),radial-gradient(circle_at_82%_68%,rgba(238,239,230,0.13),transparent_34%)] transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_85%)] [background-size:28px_28px] opacity-[0.12]" />

                                                <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-[58%] items-center justify-center">
                                                    <span className="absolute h-44 w-44 rounded-full border border-[#CF8E19]/20 motion-safe:animate-[ping_3.5s_ease-out_infinite]" />
                                                    <span className="absolute h-28 w-28 rounded-full border border-white/15 motion-safe:animate-[ping_3.5s_ease-out_1s_infinite]" />
                                                    <span className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-white shadow-2xl shadow-[#CF8E19]/20 backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-3 group-hover:bg-[#CF8E19]">
                                                        <Building2 className="h-11 w-11 stroke-[1.4]" />
                                                        <Sparkles className="absolute -top-2 -right-3 h-6 w-6 text-[#E0A43A] motion-safe:animate-pulse" />
                                                    </span>
                                                </div>

                                                <div className="absolute right-6 bottom-16 left-6 flex items-end justify-center gap-1.5 opacity-25">
                                                    {[
                                                        32, 48, 38, 64, 44, 56,
                                                        30,
                                                    ].map((height, index) => (
                                                        <span
                                                            key={`${municipality.id}-${height}-${index}`}
                                                            className="w-5 rounded-t-sm border border-white/40 bg-white/20 transition-all duration-500 group-hover:bg-[#CF8E19]/50"
                                                            style={{
                                                                height,
                                                                transitionDelay: `${index * 35}ms`,
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#292625]/85 via-[#292625]/25 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

                                        {/* Badge propriétés */}
                                        <div className="absolute top-4 right-4">
                                            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-md">
                                                <Home className="h-3.5 w-3.5 text-white" />
                                                <span className="text-xs font-bold text-white">
                                                    {municipality.properties ??
                                                        0}{' '}
                                                    {t(
                                                        'properties_short',
                                                        'biens',
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Contenu */}
                                        <div className="absolute bottom-0 left-0 w-full p-6">
                                            <div className="mb-2 flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CF8E19] text-[#292625]">
                                                    <MapPin className="h-4 w-4 text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white">
                                                    {municipality.name}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm font-medium text-[#E0A43A] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                                                {t(
                                                    'explore_properties',
                                                    'Explorer',
                                                )}
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <p className="sr-only" aria-live="polite">
                        {t('slide_position', 'Élément')} {activeIndex + 1}{' '}
                        {t('of', 'sur')} {sortedMunicipalities.length}
                    </p>
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
