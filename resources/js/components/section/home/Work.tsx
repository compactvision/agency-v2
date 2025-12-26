import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import { 
    UserPlus, 
    CreditCard, 
    Home, 
    MessageSquare, 
    ArrowRight,
    CheckCircle,
    Play,
    Zap,
    Shield,
    TrendingUp,
    Sparkles
} from "lucide-react";

export default function HowItWorks() {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const steps = [
        {
            number: 1,
            titleKey: "step_1_title",
            defaultTitle: "Créer un compte vendeur",
            descKey: "step_1_desc",
            defaultDesc: "Inscrivez-vous et activez votre profil vendeur.",
            icon: UserPlus,
            color: "from-blue-400 to-blue-600"
        },
        {
            number: 2,
            titleKey: "step_2_title",
            defaultTitle: "Souscrire à un abonnement",
            descKey: "step_2_desc",
            defaultDesc: "Choisissez et payez l'abonnement pour publier.",
            icon: CreditCard,
            color: "from-purple-400 to-purple-600"
        },
        {
            number: 3,
            titleKey: "step_3_title",
            defaultTitle: "Publier votre annonce",
            descKey: "step_3_desc",
            defaultDesc: "Renseignez les informations de votre propriété.",
            icon: Home,
            color: "from-green-400 to-green-600"
        },
        {
            number: 4,
            titleKey: "step_4_title",
            defaultDesc: "Gérez les demandes des clients intéressés.",
            icon: MessageSquare,
            color: "from-amber-400 to-amber-600"
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

    // Animation automatique des étapes
    useEffect(() => {
        if (!visible) return;

        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [visible, steps.length]);

    // Animation de lecture
    const handlePlayAnimation = () => {
        setIsPlaying(true);
        setActiveStep(0);
        
        const interval = setInterval(() => {
            setActiveStep((prev) => {
                if (prev >= steps.length - 1) {
                    setIsPlaying(false);
                    clearInterval(interval);
                    return 0;
                }
                return prev + 1;
            });
        }, 1500);
    };

    return (
        <section ref={sectionRef} className="relative py-20 lg:py-32 bg-white overflow-hidden">
            {/* Formes décoratives de fond (plus subtiles) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-50 rounded-full filter blur-3xl opacity-30"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-50 rounded-full filter blur-3xl opacity-30"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* En-tête avec animation */}
                <div className={`text-center mb-20 transition-all duration-1000 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="inline-block">
                        <span className="text-sm font-medium text-amber-600 tracking-wider uppercase">
                            {t("how_it_works_subtitle", "Processus Simple")}
                        </span>
                    </div>
                    <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                        {t("how_it_works_title", "Comment ça marche ?")}
                    </h2>
                    <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {t("how_it_works_description", "Notre plateforme simplifie le processus de vente de propriétés en seulement quatre étapes faciles.")}
                    </p>
                </div>

                {/* Contenu principal avec animation */}
                <div className={`grid lg:grid-cols-3 gap-12 items-center transition-all duration-1000 delay-300 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    {/* Image de gauche */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative">
                            <img 
                                src="assets/images/thumbs/project-10-thumb1.jpg" 
                                alt="Processus de vente" 
                                className="w-full rounded-2xl shadow-xl"
                            />
                            
                            {/* Badge de confiance */}
                            <div className="absolute top-6 left-6 bg-white rounded-xl px-4 py-2 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-green-500" />
                                    <span className="text-sm font-semibold text-gray-800">
                                        {t("secure_process", "Processus Sécurisé")}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Badge de rapidité */}
                            <div className="absolute bottom-6 left-6 bg-amber-500 text-white rounded-xl px-4 py-2 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    <span className="text-sm font-semibold">
                                        {t("fast_process", "Processus Rapide")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Étapes au centre */}
                    <div className="order-1 lg:order-2">
                        <div className="relative">
                            {/* Bouton de lecture d'animation */}
                            <div className="flex justify-center mb-8">
                                <button
                                    onClick={handlePlayAnimation}
                                    disabled={isPlaying}
                                    className={`group relative inline-flex items-center gap-3 px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                                        isPlaying ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isPlaying ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>{t("animation_playing", "Animation en cours")}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                                            <span>{t("play_animation", "Voir l'animation")}</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Étapes avec design moderne */}
                            <div className="relative space-y-6">
                                {/* Ligne de progression */}
                                <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200 rounded-full"></div>
                                <div 
                                    className="absolute left-8 top-8 w-0.5 bg-amber-500 rounded-full transition-all duration-1000"
                                    style={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
                                ></div>

                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isActive = index <= activeStep;
                                    const isCurrent = index === activeStep;
                                    
                                    return (
                                        <div
                                            key={step.number}
                                            className={`relative flex items-start gap-6 transition-all duration-700 transform ${
                                                visible 
                                                    ? 'opacity-100 translate-x-0' 
                                                    : 'opacity-0 -translate-x-10'
                                            }`}
                                            style={{
                                                transitionDelay: `${index * 150}ms`
                                            }}
                                            onMouseEnter={() => !isPlaying && setActiveStep(index)}
                                        >
                                            {/* Cercle de l'étape */}
                                            <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                isActive 
                                                    ? `bg-gradient-to-r ${step.color} text-white shadow-lg transform scale-110` 
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {isActive ? (
                                                    <CheckCircle className="w-8 h-8" />
                                                ) : (
                                                    <span className="text-xl font-bold">{step.number}</span>
                                                )}
                                                
                                                {/* Animation de pulsation pour l'étape active */}
                                                {isCurrent && (
                                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.color} opacity-30 animate-ping`}></div>
                                                )}
                                            </div>

                                            {/* Contenu de l'étape */}
                                            <div className={`flex-1 bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border ${
                                                isActive 
                                                    ? 'border-amber-200 shadow-amber-100/50' 
                                                    : 'border-gray-100 hover:border-gray-200'
                                            }`}>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-md`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <h3 className={`text-lg font-bold transition-colors duration-300 ${
                                                        isActive 
                                                            ? 'text-transparent bg-clip-text bg-gradient-to-r ' + step.color
                                                            : 'text-gray-800'
                                                    }`}>
                                                        {t(step.titleKey, step.defaultTitle)}
                                                    </h3>
                                                </div>
                                                
                                                <p className="text-gray-600 leading-relaxed">
                                                    {t(step.descKey, step.defaultDesc)}
                                                </p>
                                                
                                                {/* Bouton d'action pour l'étape active */}
                                                {isCurrent && (
                                                    <div className="mt-4 overflow-hidden">
                                                        <button className="inline-flex items-center gap-2 text-amber-600 font-medium text-sm transition-all duration-300 transform translate-y-2 opacity-0 hover:translate-y-0 hover:opacity-100">
                                                            {t("learn_more", "En savoir plus")}
                                                            <ArrowRight className="w-4 h-4 transform hover:translate-x-1 transition-transform duration-300" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Image de droite */}
                    <div className="relative order-3">
                        <div className="relative">
                            <img 
                                src="assets/images/thumbs/project-10-thumb2.jpg" 
                                alt="Résultats de vente" 
                                className="w-full rounded-2xl shadow-xl"
                            />
                            
                            {/* Badge de croissance */}
                            <div className="absolute top-6 right-6 bg-green-500 text-white rounded-xl px-4 py-2 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    <span className="text-sm font-semibold">
                                        {t("growth_rate", "+25% de croissance")}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Badge de satisfaction */}
                            <div className="absolute bottom-6 right-6 bg-white rounded-xl px-4 py-2 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                    <span className="text-sm font-semibold text-gray-800">
                                        {t("satisfaction_rate", "98% de satisfaction")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section CTA */}
                <div className={`text-center mt-20 transition-all duration-1000 delay-700 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 rounded-full mb-6">
                        <CheckCircle className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">
                            {t("ready_to_start", "Prêt à commencer ?")}
                        </span>
                    </div>
                    
                    <a 
                        href={route('register')} 
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                        <span>{t("start_selling", "Commencer à vendre")}</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                </div>
            </div>
        </section>
    );
}