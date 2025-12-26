import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { LucideHome, LucideBuilding, LucideZap, LucideArrowRight } from 'lucide-react';

export default function Service() {
    const { t, i18n } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

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

    const services = [
        {
            id: 1,
            number: '01',
            icon: LucideHome,
            image: 'assets/images/thumbs/service-10-thumb1.png',
            title: t('single_family_home'),
            description: i18n.language === 'fr' 
                ? 'Avec un très large choix de maisons à vendre disponibles sur le site web, DRC Agency peut vous aider à trouver celle que vous appellerez votre chez-vous.'
                : 'With a wide selection of homes for sale available on our website, DRC Agency can help you find one you\'ll call home.'
        },
        {
            id: 2,
            number: '02',
            icon: LucideBuilding,
            image: 'assets/images/thumbs/service-10-thumb2.png',
            title: t('duplex_houses'),
            description: i18n.language === 'fr' 
                ? 'Un grand nombre de maisons en duplex sont disponibles à la vente sur le site web. DRC Agency peut vous aider à trouver celle que vous voudrez appeler votre chez-vous.'
                : 'A large number of duplex homes are available for sale on our website. DRC Agency can help you find one you\'ll want to call home.'
        },
        {
            id: 3,
            number: '03',
            icon: LucideZap,
            image: 'assets/images/thumbs/service-10-thumb3.png',
            title: t('modern_home'),
            description: i18n.language === 'fr' 
                ? 'Un large éventail de maisons modernes est disponible sur notre plateforme. DRC Agency vous aide à trouver celle qui correspond à votre style de vie.'
                : 'A wide range of modern homes is available on our platform. DRC Agency helps you find one that matches your lifestyle.'
        }
    ];

    return (
        <section ref={sectionRef} className="relative py-20 lg:py-32 bg-gray-100 z-10 overflow-hidden">
            {/* Forme de fond décorative */}
            <div className="absolute inset-0 pointer-events-none">
                <img 
                    src="assets/images/shapes/service-10-bg-shape.png" 
                    alt="Background shape" 
                    className="absolute inset-0 w-full h-full object-cover opacity-5"
                />
            </div>

            <div className="container mx-auto px-4 relative z-20">
                {/* En-tête de section */}
                <div className={`text-center mb-16 transition-all duration-1000 transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="inline-block">
                        <span className="text-sm font-medium text-amber-600 tracking-wider uppercase">
                            {t('properties_by_type')}
                        </span>
                    </div>
                    <h2 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">
                        {i18n.language === 'fr' ? (
                            <>
                                Découvrez votre maison de <span className="text-amber-600">rêves</span>
                            </>
                        ) : (
                            <>
                                Discover your dream <span className="text-amber-600">house</span>
                            </>
                        )}
                    </h2>
                </div>

                {/* Grille de services */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={service.id}
                                className={`relative group transition-all duration-700 transform ${
                                    isVisible 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-10'
                                }`}
                                style={{
                                    transitionDelay: `${index * 150}ms`
                                }}
                                onMouseEnter={() => setHoveredCard(service.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="relative bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-amber-200">
                                    {/* Numéro de service */}
                                    <div className="absolute top-6 left-6 z-10">
                                        <div className="relative w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors duration-300">
                                            <span className="text-xl font-bold text-amber-600">{service.number}</span>
                                            {/* Effet de brillance */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        </div>
                                    </div>

                                    {/* Image */}
                                    <div className="relative h-64 overflow-hidden">
                                        <img 
                                            src={service.image} 
                                            alt={service.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        
                                        {/* Overlay au survol */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        
                                        {/* Icône flottante au survol */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                                                <Icon className="w-8 h-8 text-amber-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contenu */}
                                    <div className="p-8 text-center">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                                            <Link href="#" className="hover:underline">
                                                {service.title}
                                            </Link>
                                        </h3>
                                        
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            {service.description}
                                        </p>

                                        {/* Bouton "En savoir plus" qui apparaît au survol */}
                                        <div className="overflow-hidden">
                                            <Link 
                                                href="#" 
                                                className={`inline-flex items-center gap-2 text-amber-600 font-medium transition-all duration-300 transform ${
                                                    hoveredCard === service.id 
                                                        ? 'translate-y-0 opacity-100' 
                                                        : 'translate-y-2 opacity-0'
                                                }`}
                                            >
                                                {i18n.language === 'fr' ? 'En savoir plus' : 'Learn more'}
                                                <LucideArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Effet de bordure animée */}
                                    <div className="absolute inset-0 rounded-lg border-2 border-amber-400 transform scale-105 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                                </div>

                                {/* Ombre portée améliorée au survol */}
                                <div className="absolute -bottom-2 left-4 right-4 h-4 bg-amber-400/10 rounded-full blur-xl transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Bouton CTA global */}
                <div className={`text-center mt-16 transition-all duration-1000 delay-500 transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <Link 
                        href={route('properties')} 
                        className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-amber-500/25"
                    >
                        {i18n.language === 'fr' ? 'Voir toutes les propriétés' : 'View all properties'}
                        <LucideArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Formes décoratives supplémentaires */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
        </section>
    );
}