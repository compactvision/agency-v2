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
    { value: '15+', label: 'Biens listés', icon: LucideHome },
    { value: '8', label: 'Ventes conclues', icon: LucideTrendingUp },
    { value: '98%', label: 'Satisfaction client', icon: LucideCheckCircle },
    { value: '24/7', label: 'Support disponible', icon: LucideZap },
];

const features = [
    {
        icon: LucideSearch,
        title: 'Recherche Avancée',
        description:
            'Trouvez la propriété idéale grâce à nos filtres puissants et une recherche géolocalisée.',
        color: '#1E3A5F',
    },
    {
        icon: LucideShield,
        title: 'Annonces Vérifiées',
        description:
            'Toutes les annonces sont vérifiées pour garantir leur authenticité et leur exactitude.',
        color: '#2A4F7C',
    },
    {
        icon: LucideMessageSquare,
        title: 'Contact Direct',
        description:
            'Communiquez directement avec les vendeurs via notre système de messagerie sécurisé.',
        color: '#C9A84C',
    },
    {
        icon: LucideSmartphone,
        title: 'Expérience Mobile',
        description:
            'Consultez nos annonces confortablement depuis votre téléphone, où que vous soyez.',
        color: '#1E3A5F',
    },
    {
        icon: LucideGlobe,
        title: 'Support Multilingue',
        description:
            'Notre plateforme est disponible en français et en anglais pour un accès universel.',
        color: '#2A4F7C',
    },
    {
        icon: LucideBuilding,
        title: 'Tous Types de Biens',
        description:
            'Maisons, appartements, terrains et locaux commerciaux — tout en un seul endroit.',
        color: '#C9A84C',
    },
];

const services = [
    {
        number: '01',
        icon: LucideHome,
        title: 'Maisons Individuelles',
        description:
            'Un vaste choix de maisons à vendre, soigneusement sélectionnées pour répondre à vos attentes.',
        image: 'assets/images/thumbs/service-10-thumb1.png',
    },
    {
        number: '02',
        icon: LucideBuilding,
        title: 'Appartements & Duplex',
        description:
            'Découvrez nos appartements et duplex disponibles à la vente ou à la location dans tout le pays.',
        image: 'assets/images/thumbs/service-10-thumb2.png',
    },
    {
        number: '03',
        icon: LucideZap,
        title: 'Biens Modernes',
        description:
            'Des propriétés contemporaines alliant design, confort et excellence architecturale.',
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
    const { t, i18n } = useTranslation();
    const { ref: statsRef, visible: statsVisible } = useIntersection();
    const { ref: featuresRef, visible: featuresVisible } = useIntersection();
    const { ref: servicesRef, visible: servicesVisible } = useIntersection();
    const [hoveredService, setHoveredService] = useState<number | null>(null);

    return (
        <>
            {/* ══ Section 1 : Avantages ══ */}
            <section className="relative overflow-hidden bg-[#F8F7F4] py-20 lg:py-28">
                {/* Blobs décoratifs (statiques) */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#C9A84C]/8 blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-[#1E3A5F]/8 blur-3xl" />
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
                                    alt="À propos de nous"
                                    className="h-[480px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2340]/30 via-transparent to-transparent" />
                            </div>

                            {/* Badge flottant */}
                            <div className="absolute -top-4 -right-4 rounded-xl bg-[#C9A84C] px-5 py-3 text-white shadow-xl">
                                <div className="flex items-center gap-2">
                                    <LucideTrendingUp className="h-4 w-4" />
                                    <span className="text-sm font-bold">
                                        {i18n.language === 'en'
                                            ? 'Since 2020'
                                            : 'Depuis 2020'}
                                    </span>
                                </div>
                            </div>

                            {/* Stats overlay card */}
                            <div className="absolute right-6 -bottom-6 left-6 rounded-xl bg-white/95 p-4 shadow-xl backdrop-blur-sm">
                                <div
                                    ref={statsRef}
                                    className="grid grid-cols-4 gap-2"
                                >
                                    {stats.map((stat, i) => {
                                        const Icon = stat.icon;
                                        return (
                                            <div
                                                key={stat.label}
                                                className={`text-center transition-all duration-500 ${statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                                                style={{
                                                    transitionDelay: `${i * 100}ms`,
                                                }}
                                            >
                                                <Icon className="mx-auto mb-1 h-4 w-4 text-[#C9A84C]" />
                                                <div className="text-lg font-extrabold text-[#1E3A5F]">
                                                    {stat.value}
                                                </div>
                                                <div className="text-[10px] leading-tight font-medium text-gray-500">
                                                    {stat.label}
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
                                    <span className="h-px w-8 bg-[#C9A84C]" />
                                    {t('about_subtitle')}
                                </span>
                                <h2 className="section-title mt-2">
                                    {i18n.language === 'en' ? (
                                        <>
                                            Dedicated to finding your{' '}
                                            <span className="text-[#C9A84C]">
                                                ideal property
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            Engagés à trouver votre{' '}
                                            <span className="text-[#C9A84C]">
                                                propriété idéale
                                            </span>
                                        </>
                                    )}
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
                                                <h3 className="mb-1 text-sm font-bold text-gray-900 transition-colors group-hover:text-[#1E3A5F]">
                                                    {feat.title}
                                                </h3>
                                                <p className="text-xs leading-relaxed text-gray-500">
                                                    {feat.description}
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
                className="relative bg-white py-20 lg:py-28"
            >
                <div className="mx-auto max-w-7xl px-4">
                    {/* Header */}
                    <div
                        className={`mb-14 text-center transition-all duration-700 ${servicesVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    >
                        <span className="section-label">
                            <span className="h-px w-8 bg-[#C9A84C]" />
                            {t('properties_by_type')}
                        </span>
                        <h2 className="section-title mt-2">
                            {i18n.language === 'fr' ? (
                                <>
                                    Découvrez votre maison de{' '}
                                    <span className="text-[#C9A84C]">
                                        rêves
                                    </span>
                                </>
                            ) : (
                                <>
                                    Discover your{' '}
                                    <span className="text-[#C9A84C]">
                                        dream home
                                    </span>
                                </>
                            )}
                        </h2>
                    </div>

                    {/* Cards services */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, i) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={service.number}
                                    className={`group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${servicesVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                    style={{ transitionDelay: `${i * 120}ms` }}
                                    onMouseEnter={() => setHoveredService(i)}
                                    onMouseLeave={() => setHoveredService(null)}
                                >
                                    {/* Numéro */}
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm">
                                            <span className="text-sm font-bold text-[#C9A84C]">
                                                {service.number}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Image */}
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                        {/* Icon overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm">
                                                <Icon className="h-7 w-7 text-[#1E3A5F]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contenu */}
                                    <div className="p-6">
                                        <h3 className="mb-3 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#1E3A5F]">
                                            {service.title}
                                        </h3>
                                        <p className="mb-4 text-sm leading-relaxed text-gray-500">
                                            {service.description}
                                        </p>
                                        <div
                                            className={`flex items-center gap-1.5 text-sm font-semibold text-[#C9A84C] transition-all duration-300 ${hoveredService === i ? 'translate-x-1 opacity-100' : 'opacity-0'}`}
                                        >
                                            {i18n.language === 'fr'
                                                ? 'En savoir plus'
                                                : 'Learn more'}
                                            <LucideArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>

                                    {/* Bord gold en bas au hover */}
                                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#1E3A5F] to-[#C9A84C] transition-all duration-500 group-hover:w-full" />
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
                            {i18n.language === 'fr'
                                ? 'Voir toutes les propriétés'
                                : 'View all properties'}
                            <LucideArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
