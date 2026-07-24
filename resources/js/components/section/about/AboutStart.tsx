import { Award, Building, Globe, Home, Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AboutStart() {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState<number | null>(null);
    const [statsAnimated, setStatsAnimated] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const features = [
        {
            title: t('feature_1', 'Dream Property Solutions'),
            icon: Home,
            color: 'from-blue-400 to-blue-600',
        },
        {
            title: t('feature_2', 'Prestige Property Management'),
            icon: Building,
            color: 'from-purple-400 to-purple-600',
        },
        {
            title: t('feature_3', 'Secure Property Partners'),
            icon: Shield,
            color: 'from-green-400 to-green-600',
        },
        {
            title: t('feature_4', 'Global Real Estate Investments'),
            icon: Globe,
            color: 'from-amber-400 to-amber-600',
        },
    ];

    const stats = [
        { number: '10k+', label: t('complete_projects', 'Complete projects') },
        { number: '98%', label: t('satisfaction_rate', 'Satisfaction Rate') },
        { number: '500+', label: t('expert_agents', 'Expert Agents') },
        { number: '15+', label: t('years_experience', 'Years Experience') },
    ];

    // Animation au scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    // Animation des statistiques après un court délai
                    setTimeout(() => setStatsAnimated(true), 500);
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
            className="relative overflow-hidden bg-white py-20 lg:py-32 dark:bg-[#353130]"
        >
            {/* Formes décoratives de fond */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl filter"></div>
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl filter"></div>
                <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-300/5 blur-3xl filter"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    {/* Section Image avec statistiques */}
                    <div
                        className={`order-2 transform transition-all duration-1000 lg:order-1 ${
                            visible
                                ? 'translate-x-0 opacity-100'
                                : '-translate-x-10 opacity-0'
                        }`}
                    >
                        <div className="relative">
                            {/* Image principale */}
                            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                    src="/assets/images/thumbs/property-7.png"
                                    alt="Property showcase"
                                    className="h-auto w-full transform object-cover transition-transform duration-700 hover:scale-105"
                                />

                                {/* Overlay dégradé */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100"></div>

                                {/* Badge de confiance */}
                                <div className="absolute top-6 left-6">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm">
                                        <Award className="h-5 w-5 text-amber-500" />
                                        <span className="text-sm font-semibold text-gray-800">
                                            {t(
                                                'trusted_expert',
                                                'Expert de confiance',
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Statistiques superposées */}
                                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        {stats
                                            .slice(0, 4)
                                            .map((stat, index) => (
                                                <div
                                                    key={index}
                                                    className="text-center"
                                                >
                                                    <div
                                                        className={`mb-1 text-3xl font-bold text-white transition-all duration-1000 lg:text-4xl ${
                                                            statsAnimated
                                                                ? 'translate-y-0 opacity-100'
                                                                : 'translate-y-4 opacity-0'
                                                        }`}
                                                        style={{
                                                            transitionDelay: `${index * 150}ms`,
                                                        }}
                                                    >
                                                        {stat.number}
                                                    </div>
                                                    <div className="text-xs text-white/80">
                                                        {stat.label}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            {/* Effet de brillance */}
                            <div className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 transform rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent transition-transform duration-1000 hover:translate-x-full"></div>
                        </div>
                    </div>

                    {/* Section Contenu */}
                    <div
                        className={`order-1 transform transition-all delay-300 duration-1000 lg:order-2 ${
                            visible
                                ? 'translate-x-0 opacity-100'
                                : 'translate-x-10 opacity-0'
                        }`}
                    >
                        {/* En-tête */}
                        <div className="mb-8">
                            <div className="inline-block">
                                <span className="text-sm font-medium tracking-wider text-amber-600 uppercase">
                                    {t('about_us', 'About Us')}
                                </span>
                            </div>
                            <h2 className="mt-4 text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:text-6xl dark:text-[#EEEFE6]">
                                {t(
                                    'unlocking_new_home',
                                    'Unlocking Door to Your New Home',
                                )}
                            </h2>
                            <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-[#EEEFE6]/70">
                                {t(
                                    'real_estate_intro',
                                    'Real estate is a lucrative industry involving buying, selling, and renting properties. It encompasses residential, commercial, and industrial sectors. Real estate agents play a crucial role in facilitating transactions and guiding clients.',
                                )}
                            </p>
                        </div>

                        {/* Liste des fonctionnalités */}
                        <div className="mb-8 space-y-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className={`flex transform cursor-pointer items-start gap-4 rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#CF8E19]/40 hover:bg-[#CF8E19]/5 dark:border-white/10 ${
                                            activeFeature === index
                                                ? 'border-[#CF8E19]/40 bg-[#CF8E19]/5'
                                                : ''
                                        }`}
                                        onMouseEnter={() =>
                                            setActiveFeature(index)
                                        }
                                        onMouseLeave={() =>
                                            setActiveFeature(null)
                                        }
                                    >
                                        <div
                                            className={`h-12 w-12 rounded-lg bg-gradient-to-r ${feature.color} flex transform items-center justify-center text-white shadow-md transition-transform duration-300 ${
                                                activeFeature === index
                                                    ? 'scale-110'
                                                    : ''
                                            }`}
                                        >
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-[#EEEFE6]">
                                                {feature.title}
                                            </h3>
                                            {/* Barre de progression animée */}
                                            <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${feature.color} transition-all duration-1000 ease-out ${
                                                        statsAnimated
                                                            ? 'w-full'
                                                            : 'w-0'
                                                    }`}
                                                    style={{
                                                        transitionDelay: `${index * 200 + 500}ms`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bouton CTA */}
                    </div>
                </div>

                {/* Section statistiques additionnelles (mobile) */}
                <div
                    className={`mt-16 transform transition-all delay-700 duration-1000 lg:hidden ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="rounded-xl bg-gray-50 p-4 text-center dark:border dark:border-white/10 dark:bg-[#292625]"
                            >
                                <div
                                    className={`mb-1 text-2xl font-bold text-gray-900 transition-all duration-1000 dark:text-[#EEEFE6] ${
                                        statsAnimated
                                            ? 'translate-y-0 opacity-100'
                                            : 'translate-y-4 opacity-0'
                                    }`}
                                    style={{
                                        transitionDelay: `${index * 150}ms`,
                                    }}
                                >
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-[#EEEFE6]/65">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Forme décorative du bas */}
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-gray-50 to-transparent dark:from-[#292625]"></div>
        </section>
    );
}
