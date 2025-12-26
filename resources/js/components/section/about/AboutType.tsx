import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from 'react';
import { Link } from "@inertiajs/react";
import { 
    Building, 
    TrendingUp, 
    Home, 
    Key, 
    Shield, 
    Globe, 
    Users, 
    Clock, 
    Star,
    ArrowRight,
    CheckCircle,
    Sparkles,
    Zap,
    Award,
    Target
} from 'lucide-react';
import { route } from "ziggy-js";

export default function AboutType() {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [activeType, setActiveType] = useState<number | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    const propertyTypes = [
        {
            title: t("property_type_1_title", "Prestige Management"),
            desc: t("property_type_1_desc", "Gestion de biens prestigieux pour maximiser leur valeur et leur visibilité."),
            icon: Building,
            color: "from-blue-400 to-blue-600",
            features: ["Service Premium", "Marketing Avancé", "Support 24/7"]
        },
        {
            title: t("property_type_2_title", "Prime Investments"),
            desc: t("property_type_2_desc", "Opportunités d'investissement immobilier haut de gamme et sécurisées."),
            icon: TrendingUp,
            color: "from-purple-400 to-purple-600",
            features: ["Rendement Élevé", "Analyse de Marché", "Accès Exclusif"]
        },
        {
            title: t("property_type_3_title", "SmartHouse Agency"),
            desc: t("property_type_3_desc", "Accompagnement intelligent pour l'achat et la vente de propriétés."),
            icon: Home,
            color: "from-green-400 to-green-600",
            features: ["Technologie IA", "Visites Virtuelles", "Conseil Personnalisé"]
        },
        {
            title: t("property_type_4_title", "Reliable Rentals"),
            desc: t("property_type_4_desc", "Locations fiables et gestion locative pour propriétaires et locataires."),
            icon: Shield,
            color: "from-amber-400 to-amber-600",
            features: ["Vérification Locataires", "Maintenance Rapide", "Paiements Sécurisés"]
        },
        {
            title: t("property_type_5_title", "Golden Key Properties"),
            desc: t("property_type_5_desc", "Accès à des propriétés exclusives avec un service sur-mesure."),
            icon: Key,
            color: "from-red-400 to-red-600",
            features: ["Biens Exclusifs", "Service Conciergerie", "Visites Privées"]
        },
        {
            title: t("property_type_6_title", "Swift Home Sales"),
            desc: t("property_type_6_desc", "Vente rapide et efficace de vos biens grâce à notre réseau et expertise."),
            icon: Zap,
            color: "from-indigo-400 to-indigo-600",
            features: ["Vente Rapide", "Évaluation Précise", "Suivi Personnalisé"]
        }
    ];

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

    return (
        <section ref={sectionRef} className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
            {/* Formes décoratives de fond */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/10 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-300/10 rounded-full filter blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/5 rounded-full filter blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* En-tête avec animation */}
                <div className={`text-center mb-16 transition-all duration-1000 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="inline-block">
                        <span className="text-sm font-medium text-amber-600 tracking-wider uppercase">
                            {t("property_type_subtitle", "Types de Propriétés")}
                        </span>
                    </div>
                    <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                        {t("property_type_title", "Investir dans l'immobilier n'a jamais été aussi simple")}
                    </h2>
                    <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {t("property_type_description", "Découvrez nos différentes solutions immobilières adaptées à tous vos besoins, de l'investissement à la résidence principale.")}
                    </p>
                </div>

                {/* Grille de types de propriétés */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {propertyTypes.map((type, index) => {
                        const Icon = type.icon;
                        return (
                            <div
                                key={index}
                                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 hover:border-transparent ${
                                    visible 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-10'
                                }`}
                                style={{
                                    transitionDelay: `${index * 100}ms`
                                }}
                                onMouseEnter={() => setActiveType(index)}
                                onMouseLeave={() => setActiveType(null)}
                            >
                                {/* Icône avec fond animé */}
                                <div className="relative p-6 pb-0">
                                    <div className={`w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-r ${type.color} flex items-center justify-center text-white shadow-lg transform transition-all duration-300 ${
                                        activeType === index ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                                    }`}>
                                        <Icon className="w-8 h-8" />
                                        
                                        {/* Effet de brillance */}
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                                    </div>
                                    
                                    {/* Badge de popularité */}
                                    {index === 0 && (
                                        <div className="absolute top-6 right-6">
                                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-lg">
                                                <Star className="w-3 h-3 fill-current" />
                                                {t("popular", "Populaire")}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Contenu */}
                                <div className="px-6 pb-6">
                                    <h3 className={`text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 ${
                                        activeType === index ? 'text-transparent bg-clip-text bg-gradient-to-r ' + type.color : ''
                                    }`}>
                                        {type.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {type.desc}
                                    </p>

                                    {/* Liste des fonctionnalités */}
                                    <ul className="space-y-3 mb-6">
                                        {type.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center transform scale-0 group-hover:scale-110 transition-transform duration-300`}>
                                                    <CheckCircle className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Section CTA */}
                <div className={`mt-20 text-center transition-all duration-1000 delay-500 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 rounded-full mb-6">
                        <Target className="w-5 h-5 text-amber-600" />
                        <span className="text-amber-800 font-medium">
                            {t("find_perfect_match", "Trouvez la solution parfaite pour vous")}
                        </span>
                    </div>
                    
                    <Link
                        href={route('properties')}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-amber-500/25"
                    >
                        <span>{t("view_all_types", "Voir tous les types")}</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                        <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </Link>
                </div>
            </div>

            {/* Forme décorative du bas */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>

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