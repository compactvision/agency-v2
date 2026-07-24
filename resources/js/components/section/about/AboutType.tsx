import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Building,
    CheckCircle,
    Home,
    Key,
    Shield,
    Star,
    Target,
    TrendingUp,
    Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';

export default function AboutType() {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [activeType, setActiveType] = useState<number | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    const propertyTypes = [
        {
            title: t('property_type_1_title', 'Prestige Management'),
            desc: t(
                'property_type_1_desc',
                'Gestion de biens prestigieux pour maximiser leur valeur et leur visibilité.',
            ),
            icon: Building,
            color: 'from-[#413D3C] to-[#5D5755]',
            features: ['Service Premium', 'Marketing Avancé', 'Support 24/7'],
        },
        {
            title: t('property_type_2_title', 'Prime Investments'),
            desc: t(
                'property_type_2_desc',
                "Opportunités d'investissement immobilier haut de gamme et sécurisées.",
            ),
            icon: TrendingUp,
            color: 'from-[#CF8E19] to-[#A96F0B]',
            features: [
                'Rendement Élevé',
                'Analyse de Marché',
                'Accès Exclusif',
            ],
        },
        {
            title: t('property_type_3_title', 'SmartHouse Agency'),
            desc: t(
                'property_type_3_desc',
                "Accompagnement intelligent pour l'achat et la vente de propriétés.",
            ),
            icon: Home,
            color: 'from-[#5D5755] to-[#292625]',
            features: [
                'Technologie IA',
                'Visites Virtuelles',
                'Conseil Personnalisé',
            ],
        },
        {
            title: t('property_type_4_title', 'Reliable Rentals'),
            desc: t(
                'property_type_4_desc',
                'Locations fiables et gestion locative pour propriétaires et locataires.',
            ),
            icon: Shield,
            color: 'from-[#CF8E19] to-[#E0A43A]',
            features: [
                'Vérification Locataires',
                'Maintenance Rapide',
                'Paiements Sécurisés',
            ],
        },
        {
            title: t('property_type_5_title', 'Golden Key Properties'),
            desc: t(
                'property_type_5_desc',
                'Accès à des propriétés exclusives avec un service sur-mesure.',
            ),
            icon: Key,
            color: 'from-[#413D3C] to-[#CF8E19]',
            features: [
                'Biens Exclusifs',
                'Service Conciergerie',
                'Visites Privées',
            ],
        },
        {
            title: t('property_type_6_title', 'Swift Home Sales'),
            desc: t(
                'property_type_6_desc',
                'Vente rapide et efficace de vos biens grâce à notre réseau et expertise.',
            ),
            icon: Zap,
            color: 'from-[#A96F0B] to-[#CF8E19]',
            features: [
                'Vente Rapide',
                'Évaluation Précise',
                'Suivi Personnalisé',
            ],
        },
    ];

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

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20 lg:py-32 dark:bg-[#292625] dark:bg-none"
        >
            {/* Formes décoratives de fond */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl filter"></div>
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl filter"></div>
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
                        <span className="text-sm font-medium tracking-wider text-amber-600 uppercase">
                            {t('property_type_subtitle', 'Types de Propriétés')}
                        </span>
                    </div>
                    <h2 className="mt-4 text-4xl leading-tight font-bold text-[#413D3C] md:text-5xl lg:text-6xl dark:text-[#EEEFE6]">
                        {t(
                            'property_type_title',
                            "Investir dans l'immobilier n'a jamais été aussi simple",
                        )}
                    </h2>
                    <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-[#EEEFE6]/70">
                        {t(
                            'property_type_description',
                            "Découvrez nos différentes solutions immobilières adaptées à tous vos besoins, de l'investissement à la résidence principale.",
                        )}
                    </p>
                </div>

                {/* Grille de types de propriétés */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {propertyTypes.map((type, index) => {
                        const Icon = type.icon;
                        return (
                            <div
                                key={index}
                                className={`group relative transform overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-[#CF8E19]/40 hover:shadow-2xl dark:border-white/10 dark:bg-[#353130] ${
                                    visible
                                        ? 'translate-y-0 opacity-100'
                                        : 'translate-y-10 opacity-0'
                                }`}
                                style={{
                                    transitionDelay: `${index * 100}ms`,
                                }}
                                onMouseEnter={() => setActiveType(index)}
                                onMouseLeave={() => setActiveType(null)}
                            >
                                {/* Icône avec fond animé */}
                                <div className="relative p-6 pb-0">
                                    <div
                                        className={`mx-auto mb-6 h-16 w-16 rounded-xl bg-gradient-to-r ${type.color} flex transform items-center justify-center text-white shadow-lg transition-all duration-300 ${
                                            activeType === index
                                                ? 'scale-110 rotate-6'
                                                : 'scale-100 rotate-0'
                                        }`}
                                    >
                                        <Icon className="h-8 w-8" />

                                        {/* Effet de brillance */}
                                        <div className="absolute inset-0 rounded-xl bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
                                    </div>

                                    {/* Badge de popularité */}
                                    {index === 0 && (
                                        <div className="absolute top-6 right-6">
                                            <div className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                                <Star className="h-3 w-3 fill-current" />
                                                {t('popular', 'Populaire')}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Contenu */}
                                <div className="px-6 pb-6">
                                    <h3
                                        className={`mb-3 text-xl font-bold text-gray-900 transition-colors duration-300 dark:text-[#EEEFE6] ${
                                            activeType === index
                                                ? 'bg-gradient-to-r bg-clip-text text-transparent ' +
                                                  type.color
                                                : ''
                                        }`}
                                    >
                                        {type.title}
                                    </h3>

                                    <p className="mb-6 leading-relaxed text-gray-600 dark:text-[#EEEFE6]/70">
                                        {type.desc}
                                    </p>

                                    {/* Liste des fonctionnalités */}
                                    <ul className="mb-6 space-y-3">
                                        {type.features.map(
                                            (feature, featureIndex) => (
                                                <li
                                                    key={featureIndex}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div
                                                        className={`h-6 w-6 rounded-full bg-gradient-to-r ${type.color} flex scale-0 transform items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                                                    >
                                                        <CheckCircle className="h-3 w-3 text-white" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-[#EEEFE6]/75">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Section CTA */}
                <div
                    className={`mt-20 transform text-center transition-all delay-500 duration-1000 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#CF8E19]/10 px-6 py-3 dark:border dark:border-[#CF8E19]/20">
                        <Target className="h-5 w-5 text-[#CF8E19]" />
                        <span className="font-medium text-[#A96F0B] dark:text-[#E0A43A]">
                            {t(
                                'find_perfect_match',
                                'Trouvez la solution parfaite pour vous',
                            )}
                        </span>
                    </div>

                    <Link
                        href={route('properties')}
                        className="group inline-flex transform items-center gap-3 rounded-xl bg-gradient-to-r from-[#CF8E19] to-[#A96F0B] px-8 py-4 font-semibold text-[#292625] transition-all duration-300 hover:scale-105 hover:from-[#E0A43A] hover:to-[#CF8E19] hover:shadow-xl hover:shadow-[#CF8E19]/25"
                    >
                        <span>
                            {t('view_all_types', 'Voir tous les types')}
                        </span>
                        <ArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                        <div className="absolute inset-0 rounded-xl bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
                    </Link>
                </div>
            </div>

            {/* Forme décorative du bas */}
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-gray-50 to-transparent dark:from-[#353130]"></div>

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
    );
}
