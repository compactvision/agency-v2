import { Link } from '@inertiajs/react';
import {
    LucideArrowRight,
    LucideAward,
    LucideGlobe,
    LucideHome,
    LucideMessageSquare,
    LucideSearch,
    LucideShield,
    LucideSmartphone,
    LucideTrendingUp,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';

export default function About() {
    const { t, i18n } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState<number | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Animation au scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
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

    const features = [
        {
            icon: LucideHome,
            title:
                i18n.language === 'en'
                    ? 'Easy Property Management'
                    : 'Gestion Simplifiée',
            description:
                i18n.language === 'en'
                    ? 'Post and manage your property listings with our intuitive dashboard'
                    : 'Publiez et gérez vos annonces immobilières via notre tableau de bord intuitif',
            color: 'from-blue-400 to-blue-600',
        },
        {
            icon: LucideSearch,
            title:
                i18n.language === 'en'
                    ? 'Advanced Search'
                    : 'Recherche Avancée',
            description:
                i18n.language === 'en'
                    ? 'Find your dream property with powerful filters and location-based search'
                    : 'Trouvez la propriété de vos rêves avec des filtres puissants et une recherche géolocalisée',
            color: 'from-purple-400 to-purple-600',
        },
        {
            icon: LucideShield,
            title:
                i18n.language === 'en'
                    ? 'Verified Listings'
                    : 'Annonces Vérifiées',
            description:
                i18n.language === 'en'
                    ? 'All listings are verified for authenticity and accuracy'
                    : 'Toutes les annonces sont vérifiées pour leur authenticité et leur précision',
            color: 'from-green-400 to-green-600',
        },
        {
            icon: LucideMessageSquare,
            title:
                i18n.language === 'en'
                    ? 'Direct Messaging'
                    : 'Messagerie Directe',
            description:
                i18n.language === 'en'
                    ? 'Connect directly with buyers and sellers through our secure messaging system'
                    : 'Communiquez directement avec les acheteurs et vendeurs via notre système de messagerie sécurisé',
            color: 'from-amber-400 to-amber-600',
        },
        {
            icon: LucideSmartphone,
            title:
                i18n.language === 'en' ? 'Responsive Design' : 'Design Réactif',
            description:
                i18n.language === 'en'
                    ? 'Access our platform seamlessly on any device, anywhere'
                    : "Accédez à notre plateforme sans effort sur n'importe quel appareil, n'importe où",
            color: 'from-rose-400 to-rose-600',
        },
        {
            icon: LucideGlobe,
            title:
                i18n.language === 'en'
                    ? 'Multilingual Support'
                    : 'Support Multilingue',
            description:
                i18n.language === 'en'
                    ? 'Available in French and English for a global audience'
                    : 'Disponible en français et anglais pour un public mondial',
            color: 'from-indigo-400 to-indigo-600',
        },
    ];

    const stats = [
        {
            number: '10K+',
            label:
                i18n.language === 'en'
                    ? 'Properties Listed'
                    : 'Propriétés Listées',
        },
        {
            number: '5K+',
            label:
                i18n.language === 'en' ? 'Happy Clients' : 'Clients Satisfaits',
        },
        {
            number: '98%',
            label:
                i18n.language === 'en'
                    ? 'Satisfaction Rate'
                    : 'Taux de Satisfaction',
        },
        {
            number: '24/7',
            label:
                i18n.language === 'en'
                    ? 'Support Available'
                    : 'Support Disponible',
        },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20 lg:py-32"
        >
            {/* Formes décoratives de fond */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl filter"></div>
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl filter"></div>
                <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-300/10 blur-3xl filter"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    {/* Section Image avec effets avancés */}
                    <div
                        className={`relative transform transition-all duration-1000 ${
                            isVisible
                                ? 'translate-x-0 opacity-100'
                                : '-translate-x-10 opacity-0'
                        }`}
                    >
                        <div className="group relative">
                            {/* Image principale avec effet de parallaxe */}
                            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                    src="assets/images/thumbs/about-10-thumb2.jpg"
                                    alt="About us"
                                    className="h-[500px] w-full transform object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay dégradé */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                                {/* Effet de brillance au survol */}
                                <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
                            </div>

                            {/* Badge flottant */}
                            <div className="absolute -top-6 -right-6 rotate-3 transform rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 text-white shadow-xl transition-transform duration-300 hover:rotate-0">
                                <div className="flex items-center gap-2">
                                    <LucideAward className="h-5 w-5" />
                                    <span className="font-bold">
                                        {i18n.language === 'en'
                                            ? 'Since 2020'
                                            : 'Depuis 2020'}
                                    </span>
                                </div>
                            </div>

                            {/* Points décoratifs */}
                            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-amber-400/20 blur-xl"></div>
                            <div className="absolute top-1/4 -left-8 h-16 w-16 rounded-full bg-blue-400/20 blur-xl"></div>
                        </div>
                    </div>

                    {/* Section Contenu avec animations */}
                    <div
                        className={`transform space-y-8 transition-all delay-300 duration-1000 ${
                            isVisible
                                ? 'translate-x-0 opacity-100'
                                : 'translate-x-10 opacity-0'
                        }`}
                    >
                        {/* En-tête avec animation */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                                <LucideTrendingUp className="h-4 w-4" />
                                {t('about_subtitle')}
                            </div>

                            <h2 className="text-4xl leading-tight font-bold text-gray-900 lg:text-5xl xl:text-6xl">
                                {i18n.language === 'en' ? (
                                    <>
                                        We're{' '}
                                        <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                                            dedicated
                                        </span>{' '}
                                        to finding your ideal{' '}
                                        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                                            property
                                        </span>
                                        .
                                    </>
                                ) : (
                                    <>
                                        Nous nous{' '}
                                        <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                                            engageons
                                        </span>{' '}
                                        à trouver votre{' '}
                                        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                                            propriété
                                        </span>{' '}
                                        idéale.
                                    </>
                                )}
                            </h2>
                        </div>

                        {/* Grille de fonctionnalités avec design moderne */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className={`group relative transform cursor-pointer rounded-xl border border-gray-100 bg-white/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl ${
                                            activeFeature === index
                                                ? 'shadow-lg ring-2 ring-amber-400'
                                                : ''
                                        }`}
                                        onMouseEnter={() =>
                                            setActiveFeature(index)
                                        }
                                        onMouseLeave={() =>
                                            setActiveFeature(null)
                                        }
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                    >
                                        {/* Fond animé */}
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                                        ></div>

                                        <div className="relative flex items-start gap-4">
                                            <div
                                                className={`h-12 w-12 rounded-lg bg-gradient-to-r ${feature.color} flex transform items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                                            >
                                                <Icon className="h-6 w-6" />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="mb-1 font-semibold text-gray-900 transition-colors duration-300 group-hover:text-amber-600">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-sm leading-relaxed text-gray-600">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Indicateur de sélection */}
                                        <div
                                            className={`absolute top-4 right-4 h-2 w-2 transform rounded-full bg-amber-400 transition-all duration-300 ${
                                                activeFeature === index
                                                    ? 'scale-100 opacity-100'
                                                    : 'scale-0 opacity-0'
                                            }`}
                                        ></div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bouton CTA amélioré - Affiché uniquement sur la home page */}
                        {window.location.pathname === '/' && (
                            <div className="pt-4">
                                <Link
                                    href={route('about')}
                                    className="group inline-flex transform items-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700 hover:shadow-xl hover:shadow-amber-500/25"
                                >
                                    <span>{t('about_more')}</span>
                                    <LucideArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                                    <div className="absolute inset-0 rounded-xl bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section statistiques avec animation */}
                <div
                    className={`mt-20 grid transform grid-cols-2 gap-8 transition-all delay-500 duration-1000 md:grid-cols-4 ${
                        isVisible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group text-center"
                            style={{
                                animationDelay: `${index * 150}ms`,
                            }}
                        >
                            <div className="relative inline-block">
                                <div className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-4xl font-bold text-transparent transition-transform duration-300 group-hover:scale-110 lg:text-5xl">
                                    {stat.number}
                                </div>
                                <div className="absolute -bottom-2 left-1/2 h-1 w-16 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            </div>
                            <p className="mt-3 text-sm font-medium text-gray-600">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image de fond décorative */}
            <div className="pointer-events-none absolute right-0 bottom-0 h-1/2 w-1/3 opacity-10">
                <img
                    src="assets/images/thumbs/about-10-thumb1.jpg"
                    alt="Background shape"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Styles personnalisés pour les animations */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
            `}</style>
        </section>
    );
}
