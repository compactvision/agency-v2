import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { LucideArrowRight, LucideHome, LucideSearch, LucideShield, LucideMessageSquare, LucideSmartphone, LucideGlobe, LucideTrendingUp, LucideAward } from 'lucide-react';

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

    const features = [
        {
            icon: LucideHome,
            title: i18n.language === 'en' ? 'Easy Property Management' : 'Gestion Simplifiée',
            description: i18n.language === 'en' 
                ? 'Post and manage your property listings with our intuitive dashboard' 
                : 'Publiez et gérez vos annonces immobilières via notre tableau de bord intuitif',
            color: 'from-blue-400 to-blue-600'
        },
        {
            icon: LucideSearch,
            title: i18n.language === 'en' ? 'Advanced Search' : 'Recherche Avancée',
            description: i18n.language === 'en' 
                ? 'Find your dream property with powerful filters and location-based search' 
                : 'Trouvez la propriété de vos rêves avec des filtres puissants et une recherche géolocalisée',
            color: 'from-purple-400 to-purple-600'
        },
        {
            icon: LucideShield,
            title: i18n.language === 'en' ? 'Verified Listings' : 'Annonces Vérifiées',
            description: i18n.language === 'en' 
                ? 'All listings are verified for authenticity and accuracy' 
                : 'Toutes les annonces sont vérifiées pour leur authenticité et leur précision',
            color: 'from-green-400 to-green-600'
        },
        {
            icon: LucideMessageSquare,
            title: i18n.language === 'en' ? 'Direct Messaging' : 'Messagerie Directe',
            description: i18n.language === 'en' 
                ? 'Connect directly with buyers and sellers through our secure messaging system' 
                : 'Communiquez directement avec les acheteurs et vendeurs via notre système de messagerie sécurisé',
            color: 'from-amber-400 to-amber-600'
        },
        {
            icon: LucideSmartphone,
            title: i18n.language === 'en' ? 'Responsive Design' : 'Design Réactif',
            description: i18n.language === 'en' 
                ? 'Access our platform seamlessly on any device, anywhere' 
                : 'Accédez à notre plateforme sans effort sur n\'importe quel appareil, n\'importe où',
            color: 'from-rose-400 to-rose-600'
        },
        {
            icon: LucideGlobe,
            title: i18n.language === 'en' ? 'Multilingual Support' : 'Support Multilingue',
            description: i18n.language === 'en' 
                ? 'Available in French and English for a global audience' 
                : 'Disponible en français et anglais pour un public mondial',
            color: 'from-indigo-400 to-indigo-600'
        }
    ];

    const stats = [
        { number: '10K+', label: i18n.language === 'en' ? 'Properties Listed' : 'Propriétés Listées' },
        { number: '5K+', label: i18n.language === 'en' ? 'Happy Clients' : 'Clients Satisfaits' },
        { number: '98%', label: i18n.language === 'en' ? 'Satisfaction Rate' : 'Taux de Satisfaction' },
        { number: '24/7', label: i18n.language === 'en' ? 'Support Available' : 'Support Disponible' }
    ];

    return (
        <section ref={sectionRef} className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
            {/* Formes décoratives de fond */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-300/20 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/20 rounded-full filter blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/10 rounded-full filter blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Section Image avec effets avancés */}
                    <div className={`relative transition-all duration-1000 transform ${
                        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                    }`}>
                        <div className="relative group">
                            {/* Image principale avec effet de parallaxe */}
                            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                <img 
                                    src="assets/images/thumbs/about-10-thumb2.jpg" 
                                    alt="About us" 
                                    className="w-full h-[500px] object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                                
                                {/* Overlay dégradé */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Effet de brillance au survol */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </div>
                            
                            {/* Badge flottant */}
                            <div className="absolute -top-6 -right-6 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-3 rounded-full shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                <div className="flex items-center gap-2">
                                    <LucideAward className="w-5 h-5" />
                                    <span className="font-bold">{i18n.language === 'en' ? 'Since 2020' : 'Depuis 2020'}</span>
                                </div>
                            </div>
                            
                            {/* Points décoratifs */}
                            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-amber-400/20 rounded-full blur-xl"></div>
                            <div className="absolute top-1/4 -left-8 w-16 h-16 bg-blue-400/20 rounded-full blur-xl"></div>
                        </div>
                    </div>

                    {/* Section Contenu avec animations */}
                    <div className={`space-y-8 transition-all duration-1000 delay-300 transform ${
                        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                    }`}>
                        {/* En-tête avec animation */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                                <LucideTrendingUp className="w-4 h-4" />
                                {t('about_subtitle')}
                            </div>
                            
                            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                                {i18n.language === 'en' ? (
                                    <>
                                        We're <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">dedicated</span> to finding your ideal <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">property</span>.
                                    </>
                                ) : (
                                    <>
                                        Nous nous <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">engageons</span> à trouver votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">propriété</span> idéale.
                                    </>
                                )}
                            </h2>
                        </div>

                        {/* Grille de fonctionnalités avec design moderne */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className={`group relative p-6 rounded-xl border border-gray-100 bg-white/50 backdrop-blur-sm hover:shadow-xl hover:border-transparent transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                                            activeFeature === index ? 'ring-2 ring-amber-400 shadow-lg' : ''
                                        }`}
                                        onMouseEnter={() => setActiveFeature(index)}
                                        onMouseLeave={() => setActiveFeature(null)}
                                        style={{
                                            animationDelay: `${index * 100}ms`
                                        }}
                                    >
                                        {/* Fond animé */}
                                        <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
                                        
                                        <div className="relative flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors duration-300">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Indicateur de sélection */}
                                        <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-400 transform transition-all duration-300 ${
                                            activeFeature === index ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                                        }`}></div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bouton CTA amélioré */}
                        <div className="pt-4">
                            <Link 
                                href={route('about')} 
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-amber-500/25"
                            >
                                <span>{t('about_more')}</span>
                                <LucideArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Section statistiques avec animation */}
                <div className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-500 transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    {stats.map((stat, index) => (
                        <div 
                            key={index}
                            className="text-center group"
                            style={{
                                animationDelay: `${index * 150}ms`
                            }}
                        >
                            <div className="relative inline-block">
                                <div className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 group-hover:scale-110 transition-transform duration-300">
                                    {stat.number}
                                </div>
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <p className="mt-3 text-sm text-gray-600 font-medium">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image de fond décorative */}
            <div className="absolute bottom-0 right-0 w-1/3 h-1/2 opacity-10 pointer-events-none">
                <img 
                    src="assets/images/thumbs/about-10-thumb1.jpg" 
                    alt="Background shape" 
                    className="w-full h-full object-cover"
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