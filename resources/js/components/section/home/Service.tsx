import { Link } from '@inertiajs/react';
import {
    LucideArrowRight,
    LucideBuilding,
    LucideHome,
    LucideZap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

    const services = [
        {
            id: 1,
            number: '01',
            icon: LucideHome,
            image: 'assets/images/thumbs/service-10-thumb1.png',
            title: t('single_family_home'),
            description:
                i18n.language === 'fr'
                    ? 'Avec un très large choix de maisons à vendre disponibles sur le site web, DRC Agency peut vous aider à trouver celle que vous appellerez votre chez-vous.'
                    : "With a wide selection of homes for sale available on our website, DRC Agency can help you find one you'll call home.",
        },
        {
            id: 2,
            number: '02',
            icon: LucideBuilding,
            image: 'assets/images/thumbs/service-10-thumb2.png',
            title: t('duplex_houses'),
            description:
                i18n.language === 'fr'
                    ? 'Un grand nombre de maisons en duplex sont disponibles à la vente sur le site web. DRC Agency peut vous aider à trouver celle que vous voudrez appeler votre chez-vous.'
                    : "A large number of duplex homes are available for sale on our website. DRC Agency can help you find one you'll want to call home.",
        },
        {
            id: 3,
            number: '03',
            icon: LucideZap,
            image: 'assets/images/thumbs/service-10-thumb3.png',
            title: t('modern_home'),
            description:
                i18n.language === 'fr'
                    ? 'Un large éventail de maisons modernes est disponible sur notre plateforme. DRC Agency vous aide à trouver celle qui correspond à votre style de vie.'
                    : 'A wide range of modern homes is available on our platform. DRC Agency helps you find one that matches your lifestyle.',
        },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative z-10 overflow-hidden bg-gray-100 py-20 lg:py-32"
        >
            {/* Forme de fond décorative */}
            <div className="pointer-events-none absolute inset-0">
                <img
                    src="assets/images/shapes/service-10-bg-shape.png"
                    alt="Background shape"
                    className="absolute inset-0 h-full w-full object-cover opacity-5"
                />
            </div>

            <div className="relative z-20 container mx-auto px-4">
                {/* En-tête de section */}
                <div
                    className={`mb-16 transform text-center transition-all duration-1000 ${
                        isVisible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    <div className="inline-block">
                        <span className="text-sm font-medium tracking-wider text-amber-600 uppercase">
                            {t('properties_by_type')}
                        </span>
                    </div>
                    <h2 className="mt-4 text-4xl font-bold text-gray-900 md:text-5xl">
                        {i18n.language === 'fr' ? (
                            <>
                                Découvrez votre maison de{' '}
                                <span className="text-amber-600">rêves</span>
                            </>
                        ) : (
                            <>
                                Discover your dream{' '}
                                <span className="text-amber-600">house</span>
                            </>
                        )}
                    </h2>
                </div>

                {/* Grille de services */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={service.id}
                                className={`group relative transform transition-all duration-700 ${
                                    isVisible
                                        ? 'translate-y-0 opacity-100'
                                        : 'translate-y-10 opacity-0'
                                }`}
                                style={{
                                    transitionDelay: `${index * 150}ms`,
                                }}
                                onMouseEnter={() => setHoveredCard(service.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="relative overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg transition-all duration-500 hover:border-amber-200 hover:shadow-2xl">
                                    {/* Numéro de service */}
                                    <div className="absolute top-6 left-6 z-10">
                                        <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 transition-colors duration-300 group-hover:bg-amber-100">
                                            <span className="text-xl font-bold text-amber-600">
                                                {service.number}
                                            </span>
                                            {/* Effet de brillance */}
                                            <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-amber-200 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
                                        </div>
                                    </div>

                                    {/* Image */}
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Overlay au survol */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                                        {/* Icône flottante au survol */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                            <div className="flex h-16 w-16 scale-0 transform items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-transform delay-100 duration-500 group-hover:scale-100">
                                                <Icon className="h-8 w-8 text-amber-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contenu */}
                                    <div className="p-8 text-center">
                                        <h3 className="mb-4 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-amber-600">
                                            <Link
                                                href="#"
                                                className="hover:underline"
                                            >
                                                {service.title}
                                            </Link>
                                        </h3>

                                        <p className="mb-6 leading-relaxed text-gray-600">
                                            {service.description}
                                        </p>

                                        {/* Bouton "En savoir plus" qui apparaît au survol */}
                                        <div className="overflow-hidden">
                                            <Link
                                                href="#"
                                                className={`inline-flex transform items-center gap-2 font-medium text-amber-600 transition-all duration-300 ${
                                                    hoveredCard === service.id
                                                        ? 'translate-y-0 opacity-100'
                                                        : 'translate-y-2 opacity-0'
                                                }`}
                                            >
                                                {i18n.language === 'fr'
                                                    ? 'En savoir plus'
                                                    : 'Learn more'}
                                                <LucideArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Effet de bordure animée */}
                                    <div className="pointer-events-none absolute inset-0 scale-105 transform rounded-lg border-2 border-amber-400 opacity-0 transition-all duration-500 group-hover:opacity-100"></div>
                                </div>

                                {/* Ombre portée améliorée au survol */}
                                <div className="absolute right-4 -bottom-2 left-4 h-4 scale-0 transform rounded-full bg-amber-400/10 blur-xl transition-transform duration-500 group-hover:scale-100"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Bouton CTA global */}
                <div
                    className={`mt-16 transform text-center transition-all delay-500 duration-1000 ${
                        isVisible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    <Link
                        href={route('properties')}
                        className="inline-flex transform items-center gap-3 rounded-lg bg-amber-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-500/25"
                    >
                        {i18n.language === 'fr'
                            ? 'Voir toutes les propriétés'
                            : 'View all properties'}
                        <LucideArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>

            {/* Formes décoratives supplémentaires */}
            <div className="absolute top-20 left-10 h-20 w-20 rounded-full bg-amber-400/10 blur-2xl"></div>
            <div className="absolute right-10 bottom-20 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl"></div>
        </section>
    );
}
