import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Mail, 
    Send, 
    CheckCircle, 
    AlertCircle, 
    Sparkles, 
    Gift, 
    Bell,
    TrendingUp,
    Users,
    Star,
    ArrowRight,
    Zap,
    Shield,
    Heart
} from 'lucide-react';

export default function NewsLetter() {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [visible, setVisible] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

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

    // Animation de frappe au clavier
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && emailFocused && !isLoading) {
                handleSubmit(e);
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, [email, emailFocused, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            setError(t('email_required') || 'Veuillez entrer votre email');
            return;
        }

        if (!validateEmail(email)) {
            setError(t('email_invalid') || 'Veuillez entrer un email valide');
            return;
        }

        setError('');
        setIsLoading(true);

        // Simuler l'envoi
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setIsSubscribed(true);
            setEmail('');
            setIsLoading(false);

            // Réinitialiser après 3 secondes
            setTimeout(() => {
                setIsSubscribed(false);
            }, 3000);

        } catch (err) {
            setError(t('subscription_error') || 'Une erreur est survenue');
            setIsLoading(false);
        }
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const benefits = [
        {
            icon: Gift,
            title: t('benefit_1') || 'Offres Exclusives',
            desc: t('benefit_1_desc') || 'Accédez aux promotions avant tout le monde'
        },
        {
            icon: TrendingUp,
            title: t('benefit_2') || 'Tendances du Marché',
            desc: t('benefit_2_desc') || 'Soyez informé des dernières tendances immobilières'
        },
        {
            icon: Shield,
            title: t('benefit_3') || 'Sécurité Garantie',
            desc: t('benefit_3_desc') || 'Vos données sont protégées avec nous'
        }
    ];

    const stats = [
        { number: '50K+', label: t('subscribers') || 'Abonnés' },
        { number: '98%', label: t('satisfaction') || 'Satisfaction' },
        { number: '24/7', label: t('support') || 'Support' }
    ];

    return (
        <section ref={sectionRef} className="relative py-20 lg:py-32 bg-gradient-to-br from-amber-50 via-white to-orange-50 overflow-hidden">
            {/* Formes décoratives de fond */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-300/20 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300/20 rounded-full filter blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-300/10 rounded-full filter blur-3xl"></div>
            </div>

            {/* Particules flottantes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-amber-400/20 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${15 + Math.random() * 10}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Section Formulaire */}
                    <div className={`order-2 lg:order-1 transition-all duration-1000 transform ${
                        visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                    }`}>
                        {/* En-tête avec animation */}
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
                                <Bell className="w-4 h-4" />
                                {t('newsletter') || 'Newsletter'}
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                                {i18n.language === 'fr' ? (
                                    <>
                                        Restez <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">connecté</span>
                                    </>
                                ) : (
                                    <>
                                        Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Connected</span>
                                    </>
                                )}
                            </h2>
                            
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {i18n.language === 'fr' 
                                    ? 'Recevez les dernières actualités immobilières et offres exclusives directement dans votre boîte mail.'
                                    : 'Get the latest real estate news and exclusive offers directly in your inbox.'
                                }
                            </p>
                        </div>

                        {/* Formulaire moderne */}
                        <form 
                            ref={formRef}
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            {/* Champ email avec design avancé */}
                            <div className="relative">
                                <div className={`relative transition-all duration-300 ${
                                    emailFocused ? 'transform scale-105' : ''
                                }`}>
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                        <Mail className={`w-5 h-5 transition-colors duration-300 ${
                                            emailFocused ? 'text-amber-500' : 'text-gray-400'
                                        }`} />
                                    </div>
                                    
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setEmailFocused(true)}
                                        onBlur={() => setEmailFocused(false)}
                                        placeholder={t('enter_email') || 'Entrez votre email'}
                                        className={`w-full px-12 py-4 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 transition-all duration-300 ${
                                            error ? 'border-red-400' : 'border-gray-200'
                                        }`}
                                    />
                                    
                                    {/* Icône de validation */}
                                    {email && !error && (
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        </div>
                                    )}
                                    
                                    {error && (
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Message d'erreur */}
                                {error && (
                                    <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}
                            </div>

                            {/* Bouton d'envoi avec états */}
                            <button
                                type="submit"
                                disabled={isLoading || isSubscribed}
                                className={`w-full relative group/btn inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                                    isSubscribed
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700 shadow-lg hover:shadow-amber-500/25'
                                } ${
                                    isLoading || isSubscribed ? 'cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>{t('subscribing') || 'Inscription...'}</span>
                                    </>
                                ) : isSubscribed ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        <span>{t('subscribed') || 'Inscrit !'}</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                                        <span>{i18n.language === 'fr' ? "S'abonner" : 'Subscribe'}</span>
                                    </>
                                )}
                                
                                {/* Effet de brillance */}
                                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                            </button>
                        </form>

                        {/* Avantages */}
                        <div className="mt-8 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {t('why_subscribe') || 'Pourquoi s\'abonner ?'}
                            </h3>
                            
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">
                                                {benefit.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {benefit.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section Image et Statistiques */}
                    <div className={`order-1 lg:order-2 transition-all duration-1000 delay-300 transform ${
                        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                    }`}>
                        {/* Image principale */}
                        <div className="relative mb-8">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img 
                                    src="/assets/images/thumbs/cta-img.png" 
                                    alt="Newsletter illustration" 
                                    className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-105"
                                />
                                
                                {/* Overlay avec message */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                                    <div className="text-white">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                            <span className="text-sm font-semibold">
                                                {t('premium_content') || 'Contenu Premium'}
                                            </span>
                                        </div>
                                        <p className="text-sm opacity-90">
                                            {t('exclusive_benefits') || 'Bénéfices exclusifs pour nos abonnés'}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Badge de confiance */}
                                <div className="absolute top-6 right-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                                        <Shield className="w-4 h-4 text-green-500" />
                                        <span className="text-xs font-semibold text-gray-800">
                                            {t('secure') || 'Sécurisé'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistiques */}
                        <div className="grid grid-cols-3 gap-4">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center p-4 bg-white rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all duration-300"
                                >
                                    <div className="text-2xl font-bold text-amber-600 mb-1">
                                        {stat.number}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Témoignage */}
                        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                                    <Heart className="w-6 h-6 text-red-500 fill-current" />
                                </div>
                                <div>
                                    <blockquote className="text-gray-700 italic text-sm leading-relaxed">
                                        "{t('testimonial') || 'Meilleure décision que j\'ai prise ! J\'ai trouvé ma maison grâce à cette newsletter.'}"
                                    </blockquote>
                                    <div className="mt-2 text-xs text-gray-600">
                                        - {t('happy_subscriber') || 'Abonné satisfait'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badge de confiance en bas */}
                <div className={`text-center mt-12 transition-all duration-1000 delay-500 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-amber-500" />
                            <span className="text-sm font-medium text-gray-700">
                                {t('join_community') || 'Rejoignez notre communauté de'}
                            </span>
                            <span className="text-lg font-bold text-amber-600">
                                50,000+
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                                {t('subscribers') || 'abonnés'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forme décorative du bas */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-50 to-transparent pointer-events-none"></div>

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