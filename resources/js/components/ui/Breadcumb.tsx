import { Link } from '@inertiajs/react';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Home, 
    ChevronRight, 
    MapPin,
    Image as ImageIcon
} from 'lucide-react';

export default function Breadcrumb({ title, homeLink, showBackgroundImage = true }: { title: string, homeLink: string, showBackgroundImage?: boolean }) {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [imageError, setImageError] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Animation au scroll
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    // Fil d'Ariane simple
    const breadcrumbs = [
        { name: t('home'), href: homeLink, icon: Home },
        { name: t(title), href: null, icon: null }
    ];

    return (
        <section ref={sectionRef} className="relative py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
            {/* Image de fond décorative - PLUS VISIBLE */}
            {showBackgroundImage && (
                <div className="absolute inset-0 z-0">
                    {!imageError ? (
                        <img 
                            src="/assets/images/thumbs/banner-10-bg.jpg" 
                            alt="Breadcrumb background" 
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-100 via-red-100 to-purple-100 flex items-center justify-center">
                            <ImageIcon className="w-24 h-24 text-gray-300" />
                        </div>
                    )}
                    
                    {/* Overlay pour améliorer la lisibilité du texte - RÉDUIT pour plus de visibilité */}
                    <div className="absolute inset-0 bg-white/60"></div>
                </div>
            )}

            <div className="container mx-auto px-4 relative z-10">
                <div className={`text-center transition-all duration-500 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                    {/* Icône décorative */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl shadow-lg mb-6 transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                        <Home className="w-8 h-8 text-white" />
                    </div>

                    {/* Titre principal */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                        <span className="inline-block transition-all duration-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-600">
                            {t(title)}
                        </span>
                    </h1>

                    {/* Fil d'Ariane moderne */}
                    <nav className="inline-flex items-center justify-center flex-wrap gap-2 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
                        {breadcrumbs.map((crumb, index) => {
                            const Icon = crumb.icon;
                            const isLast = index === breadcrumbs.length - 1;
                            
                            return (
                                <React.Fragment key={index}>
                                    {/* Lien ou élément du fil d'Ariane */}
                                    {crumb.href ? (
                                        <Link
                                            href={crumb.href}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300"
                                        >
                                            {Icon && (
                                                <div className="w-5 h-5 rounded-lg bg-amber-100 flex items-center justify-center">
                                                    <Icon className="w-3 h-3 text-amber-600" />
                                                </div>
                                            )}
                                            <span className="font-medium text-sm">{crumb.name}</span>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-2 px-4 py-2">
                                            <div className="w-5 h-5 rounded-lg bg-amber-500 flex items-center justify-center">
                                                <MapPin className="w-3 h-3 text-white" />
                                            </div>
                                            <span className="font-medium text-sm text-gray-900 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                                                {crumb.name}
                                            </span>
                                            
                                            {/* Badge de localisation */}
                                            <div className="ml-2 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                                                {t('current_location') || 'Actuel'}
                                            </div>
                                        </div>
                                    )}

                                    {/* Séparateur */}
                                    {!isLast && (
                                        <div className="relative">
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </section>
    );
}