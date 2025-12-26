import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from 'react';
import { 
    CheckCircle, 
    Home, 
    Building, 
    Shield, 
    Globe, 
    TrendingUp, 
    ArrowRight,
    Users,
    Star,
    Award,
    Sparkles
} from 'lucide-react';

export default function AboutStart() {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState<number | null>(null);
    const [statsAnimated, setStatsAnimated] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const features = [
        {
            title: t("feature_1", "Dream Property Solutions"),
            icon: Home,
            color: "from-blue-400 to-blue-600"
        },
        {
            title: t("feature_2", "Prestige Property Management"),
            icon: Building,
            color: "from-purple-400 to-purple-600"
        },
        {
            title: t("feature_3", "Secure Property Partners"),
            icon: Shield,
            color: "from-green-400 to-green-600"
        },
        {
            title: t("feature_4", "Global Real Estate Investments"),
            icon: Globe,
            color: "from-amber-400 to-amber-600"
        }
    ];

    const stats = [
        { number: "10k+", label: t("complete_projects", "Complete projects") },
        { number: "98%", label: t("satisfaction_rate", "Satisfaction Rate") },
        { number: "500+", label: t("expert_agents", "Expert Agents") },
        { number: "15+", label: t("years_experience", "Years Experience") }
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

    return (
        <section ref={sectionRef} className="relative py-20 lg:py-32 bg-white overflow-hidden">
            {/* Formes décoratives de fond */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/10 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-300/10 rounded-full filter blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/5 rounded-full filter blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Section Image avec statistiques */}
                    <div className={`order-2 lg:order-1 transition-all duration-1000 transform ${
                        visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                    }`}>
                        <div className="relative">
                            {/* Image principale */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img 
                                    src="/assets/images/thumbs/property-7.png" 
                                    alt="Property showcase" 
                                    className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-105"
                                />
                                
                                {/* Overlay dégradé */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Badge de confiance */}
                                <div className="absolute top-6 left-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                                        <Award className="w-5 h-5 text-amber-500" />
                                        <span className="text-sm font-semibold text-gray-800">
                                            {t('trusted_expert', 'Expert de confiance')}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Statistiques superposées */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="grid grid-cols-2 gap-4">
                                        {stats.slice(0, 4).map((stat, index) => (
                                            <div key={index} className="text-center">
                                                <div className={`text-3xl lg:text-4xl font-bold text-white mb-1 transition-all duration-1000 ${
                                                    statsAnimated 
                                                        ? 'opacity-100 translate-y-0' 
                                                        : 'opacity-0 translate-y-4'
                                                }`}
                                                    style={{ transitionDelay: `${index * 150}ms` }}
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
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000 rounded-2xl pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Section Contenu */}
                    <div className={`order-1 lg:order-2 transition-all duration-1000 delay-300 transform ${
                        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                    }`}>
                        {/* En-tête */}
                        <div className="mb-8">
                            <div className="inline-block">
                                <span className="text-sm font-medium text-amber-600 tracking-wider uppercase">
                                    {t("about_us", "About Us")}
                                </span>
                            </div>
                            <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                {t(
                                    "unlocking_new_home",
                                    "Unlocking Door to Your New Home"
                                )}
                            </h2>
                            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                                {t(
                                    "real_estate_intro",
                                    "Real estate is a lucrative industry involving buying, selling, and renting properties. It encompasses residential, commercial, and industrial sectors. Real estate agents play a crucial role in facilitating transactions and guiding clients."
                                )}
                            </p>
                        </div>

                        {/* Liste des fonctionnalités */}
                        <div className="space-y-4 mb-8">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className={`flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                                            activeFeature === index ? 'bg-amber-50/30 border-amber-200' : ''
                                        }`}
                                        onMouseEnter={() => setActiveFeature(index)}
                                        onMouseLeave={() => setActiveFeature(null)}
                                    >
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-md transform transition-transform duration-300 ${
                                            activeFeature === index ? 'scale-110' : ''
                                        }`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {feature.title}
                                            </h3>
                                            {/* Barre de progression animée */}
                                            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full bg-gradient-to-r ${feature.color} transition-all duration-1000 ease-out ${
                                                        statsAnimated 
                                                            ? 'w-full' 
                                                            : 'w-0'
                                                    }`}
                                                    style={{ transitionDelay: `${index * 200 + 500}ms` }}
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
                <div className={`lg:hidden mt-16 transition-all duration-1000 delay-700 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                                <div className={`text-2xl font-bold text-gray-900 mb-1 transition-all duration-1000 ${
                                    statsAnimated 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-4'
                                }`}
                                    style={{ transitionDelay: `${index * 150}ms` }}
                                >
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Forme décorative du bas */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
        </section>
    );
}