import { Link } from '@inertiajs/react';
import {
    LucideArrowRight,
    LucideBuilding,
    LucideCheckCircle,
    LucideGlobe,
    LucideHome,
    LucideMessageSquare,
    LucideSearch,
    LucideShield,
    LucideSmartphone,
    LucideTrendingUp,
    LucideZap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';

const stats = [
    { value: '15+', labelKey: 'listed_properties', icon: LucideHome },
    { value: '8', labelKey: 'sales_completed', icon: LucideTrendingUp },
    {
        value: '98%',
        labelKey: 'client_satisfaction',
        icon: LucideCheckCircle,
    },
    { value: '24/7', labelKey: 'support_available', icon: LucideZap },
];

const features = [
    {
        icon: LucideSearch,
        titleKey: 'advanced_search',
        descriptionKey: 'advanced_search_description',
        color: '#413D3C',
    },
    {
        icon: LucideShield,
        titleKey: 'verified_listings',
        descriptionKey: 'verified_listings_description',
        color: '#2A4F7C',
    },
    {
        icon: LucideMessageSquare,
        titleKey: 'direct_contact',
        descriptionKey: 'direct_contact_description',
        color: '#CF8E19',
    },
    {
        icon: LucideSmartphone,
        titleKey: 'mobile_experience',
        descriptionKey: 'mobile_experience_description',
        color: '#413D3C',
    },
    {
        icon: LucideGlobe,
        titleKey: 'multilingual_support',
        descriptionKey: 'multilingual_support_description',
        color: '#2A4F7C',
    },
    {
        icon: LucideBuilding,
        titleKey: 'all_property_types',
        descriptionKey: 'all_property_types_description',
        color: '#CF8E19',
    },
];

const services = [
    {
        number: '01',
        icon: LucideHome,
        titleKey: 'individual_houses',
        descriptionKey: 'individual_houses_description',
        image: 'assets/images/thumbs/service-10-thumb1.png',
    },
    {
        number: '02',
        icon: LucideBuilding,
        titleKey: 'apartments_duplex',
        descriptionKey: 'apartments_duplex_description',
        image: 'assets/images/thumbs/service-10-thumb2.png',
    },
    {
        number: '03',
        icon: LucideZap,
        titleKey: 'modern_properties',
        descriptionKey: 'modern_properties_description',
        image: 'assets/images/thumbs/service-10-thumb3.png',
    },
];

function useIntersection(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setVisible(true);
            },
            { threshold },
        );
        if (ref.current) obs.observe(ref.current);
        return () => {
            if (ref.current) obs.unobserve(ref.current);
        };
    }, [threshold]);
    return { ref, visible };
}

export default function WhyUs() {
    const { t } = useTranslation();
    const { ref: statsRef, visible: statsVisible } = useIntersection();
    const { ref: featuresRef, visible: featuresVisible } = useIntersection();
    const { ref: servicesRef, visible: servicesVisible } = useIntersection();
    const [hoveredService, setHoveredService] = useState<number | null>(null);

    return (
        <>
            {/* ══ Section 1 : Avantages ══ */}
            <section className="relative overflow-hidden bg-[#F8F7F4] py-20 lg:py-28 dark:bg-[#292625]">
                {/* Blobs décoratifs (statiques) */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#CF8E19]/8 blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-[#413D3C]/8 blur-3xl" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4">
                    <div className="grid items-center gap-16 lg:grid-cols-2">
                        {/* Image */}
                        <div
                            ref={featuresRef}
                            className={`relative transition-all duration-700 ${featuresVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
                        >
                            <div className="group relative overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                    src="assets/images/thumbs/about-10-thumb2.jpg"
                                    alt={t('about_image_alt')}
                                    className="h-[480px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#292625]/35 via-transparent to-transparent" />
                            </div>

                            {/* Badge flottant */}
                            <div className="absolute -top-4 -right-4 rounded-xl bg-[#CF8E19] px-5 py-3 text-[#292625] shadow-xl">
                                <div className="flex items-center gap-2">
                                    <LucideTrendingUp className="h-4 w-4" />
                                    <span className="text-sm font-bold">
                                        {t('since_2020')}
                                    </span>
                                </div>
                            </div>

                            {/* Stats overlay card */}
                            <div className="absolute right-6 -bottom-6 left-6 rounded-xl bg-white/95 p-4 shadow-xl backdrop-blur-sm dark:border dark:border-white/10 dark:bg-[#353130]/95">
                                <div
                                    ref={statsRef}
                                    className="grid grid-cols-4 gap-2"
                                >
                                    {stats.map((stat, i) => {
                                        const Icon = stat.icon;
                                        return (
                                            <div
                                                key={stat.labelKey}
                                                className={`text-center transition-all duration-500 ${statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                                                style={{
                                                    transitionDelay: `${i * 100}ms`,
                                                }}
                                            >
                                                <Icon className="mx-auto mb-1 h-4 w-4 text-[#CF8E19]" />
                                                <div className="text-lg font-extrabold text-[#413D3C] dark:text-[#EEEFE6]">
                                                    {stat.value}
                                                </div>
                                                <div className="text-[10px] leading-tight font-medium text-gray-500">
                                                    {t(stat.labelKey)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Contenu */}
                        <div
                            className={`space-y-8 pt-6 transition-all delay-200 duration-700 ${featuresVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
                        >
                            <div>
                                <span className="section-label">
                                    <span className="h-px w-8 bg-[#CF8E19]" />
                                    {t('about_subtitle')}
                                </span>
                                <h2 className="section-title mt-2">
                                    {t('why_us_heading_prefix')}{' '}
                                    <span className="text-[#CF8E19]">
                                        {t('why_us_heading_accent')}
                                    </span>
                                </h2>
                            </div>

                            {/* Features grid */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {features.map((feat, i) => {
                                    const Icon = feat.icon;
                                    return (
                                        <div
                                            key={i}
                                            className={`group flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                                            style={{
                                                transitionDelay: `${200 + i * 80}ms`,
                                            }}
                                        >
                                            <div
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110"
                                                style={{
                                                    background: feat.color,
                                                }}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="mb-1 text-sm font-bold text-gray-900 transition-colors group-hover:text-[#413D3C] dark:text-[#EEEFE6] dark:group-hover:text-[#CF8E19]">
                                                    {t(feat.titleKey)}
                                                </h3>
                                                <p className="text-xs leading-relaxed text-gray-500">
                                                    {t(feat.descriptionKey)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {window.location.pathname === '/' && (
                                <Link
                                    href={route('about')}
                                    className="btn-navy group inline-flex"
                                >
                                    <span>{t('about_more')}</span>
                                    <LucideArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ Section 2 : Types de biens ══ */}
            <section
                ref={servicesRef}
                className="relative bg-white py-20 lg:py-28 dark:bg-[#353130]"
            >
                <div className="mx-auto max-w-7xl px-4">
                    {/* Header */}
                    <div
                        className={`mb-14 text-center transition-all duration-700 ${servicesVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    >
                        <span className="section-label">
                            <span className="h-px w-8 bg-[#CF8E19]" />
                            {t('properties_by_type')}
                        </span>
                        <h2 className="section-title mt-2">
                            {t('dream_home_heading_prefix')}{' '}
                            <span className="text-[#CF8E19]">
                                {t('dream_home_heading_accent')}
                            </span>
                        </h2>
                    </div>

                    {/* Cards services */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, i) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={service.number}
                                    className={`group relative overflow-hidden rounded-2xl border border-transparent bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl dark:border-white/10 dark:bg-[#292625] ${servicesVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                    style={{ transitionDelay: `${i * 120}ms` }}
                                    onMouseEnter={() => setHoveredService(i)}
                                    onMouseLeave={() => setHoveredService(null)}
                                >
                                    {/* Numéro */}
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm">
                                            <span className="text-sm font-bold text-[#CF8E19]">
                                                {service.number}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Image */}
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={service.image}
                                            alt={t(service.titleKey)}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                        {/* Icon overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm">
                                                <Icon className="h-7 w-7 text-[#413D3C] dark:text-[#EEEFE6]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contenu */}
                                    <div className="p-6">
                                        <h3 className="mb-3 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#413D3C] dark:text-[#EEEFE6] dark:group-hover:text-[#CF8E19]">
                                            {t(service.titleKey)}
                                        </h3>
                                        <p className="mb-4 text-sm leading-relaxed text-gray-500">
                                            {t(service.descriptionKey)}
                                        </p>
                                        <div
                                            className={`flex items-center gap-1.5 text-sm font-semibold text-[#CF8E19] transition-all duration-300 ${hoveredService === i ? 'translate-x-1 opacity-100' : 'opacity-0'}`}
                                        >
                                            {t('learn_more')}
                                            <LucideArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>

                                    {/* Bord gold en bas au hover */}
                                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#413D3C] to-[#CF8E19] transition-all duration-500 group-hover:w-full dark:from-[#EEEFE6]" />
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <div
                        className={`mt-14 text-center transition-all delay-500 duration-700 ${servicesVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                    >
                        <Link
                            href={route('properties')}
                            className="btn-navy group inline-flex"
                        >
                            {t('view_all_properties')}
                            <LucideArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
