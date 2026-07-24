import { Link } from '@inertiajs/react';
import {
    ChevronRight,
    Home,
    Image as ImageIcon,
    MapPin,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BreadcrumbProps {
    title: string;
    homeLink: string;
    showBackgroundImage?: boolean;
}

export default function Breadcrumb({
    title,
    homeLink,
    showBackgroundImage = true,
}: BreadcrumbProps) {
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
        { name: t(title), href: null, icon: null },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-28 pb-12 dark:bg-none dark:bg-[#292625] sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-24"
        >
            {/* Image de fond décorative - PLUS VISIBLE */}
            {showBackgroundImage && (
                <div className="absolute inset-0 z-0">
                    {!imageError ? (
                        <img
                            src="/assets/images/thumbs/banner-10-bg.jpg"
                            alt=""
                            aria-hidden="true"
                            className="h-full w-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-100 via-red-100 to-purple-100">
                            <ImageIcon className="h-16 w-16 text-gray-300 sm:h-24 sm:w-24" />
                        </div>
                    )}

                    {/* Overlay pour améliorer la lisibilité du texte - RÉDUIT pour plus de visibilité */}
                    <div className="absolute inset-0 bg-white/60 dark:bg-gradient-to-b dark:from-[#292625]/82 dark:via-[#292625]/75 dark:to-[#292625]/92"></div>
                </div>
            )}

            <div className="container relative z-10 mx-auto px-4 sm:px-6">
                <div
                    className={`transform text-center transition-all duration-500 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-4 opacity-0'
                    }`}
                >
                    {/* Icône décorative */}
                    <div className="mb-4 inline-flex h-12 w-12 transform items-center justify-center rounded-xl bg-gradient-to-r from-[#CF8E19] to-[#A96F0B] shadow-lg transition-all duration-500 hover:scale-110 hover:rotate-3 sm:mb-6 sm:h-16 sm:w-16 sm:rounded-2xl">
                        <Home className="h-6 w-6 text-[#292625] sm:h-8 sm:w-8" />
                    </div>

                    {/* Titre principal */}
                    <h1 className="mx-auto mb-5 max-w-4xl px-1 text-3xl leading-tight font-bold break-words text-[#413D3C] dark:text-[#EEEFE6] sm:mb-7 sm:text-4xl md:text-5xl lg:mb-8 lg:text-6xl">
                        <span className="inline-block transition-all duration-500 hover:text-[#CF8E19]">
                            {t(title)}
                        </span>
                    </h1>

                    {/* Fil d'Ariane moderne */}
                    <nav
                        aria-label={t('breadcrumb', "Fil d'Ariane")}
                        className="mx-auto flex w-full max-w-xl items-center gap-1.5 overflow-hidden rounded-xl border border-white/80 bg-white/85 p-1.5 shadow-lg backdrop-blur-sm dark:border-white/15 dark:bg-[#353130]/90 sm:w-fit sm:max-w-full sm:gap-2 sm:rounded-2xl sm:p-2"
                    >
                        {breadcrumbs.map((crumb, index) => {
                            const Icon = crumb.icon;
                            const isLast =
                                index === breadcrumbs.length - 1;

                            return (
                                <React.Fragment key={index}>
                                    {/* Lien ou élément du fil d'Ariane */}
                                    {crumb.href ? (
                                        <Link
                                            href={crumb.href}
                                            className="flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-gray-600 transition-all duration-300 hover:bg-slate-50 hover:text-[#413D3C] dark:text-[#EEEFE6]/75 dark:hover:bg-white/10 dark:hover:text-white sm:rounded-xl sm:px-3"
                                        >
                                            {Icon && (
                                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#413D3C]/10 dark:bg-[#CF8E19]/15 sm:h-5 sm:w-5">
                                                    <Icon className="h-3.5 w-3.5 text-[#413D3C] dark:text-[#CF8E19] sm:h-3 sm:w-3" />
                                                </div>
                                            )}
                                            <span className="hidden text-sm font-medium sm:inline">
                                                {crumb.name}
                                            </span>
                                        </Link>
                                    ) : (
                                        <div
                                            aria-current="page"
                                            className="flex min-w-0 flex-1 items-center gap-1.5 px-1.5 py-2 sm:flex-none sm:gap-2 sm:px-3"
                                        >
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#CF8E19] sm:h-5 sm:w-5">
                                                <MapPin className="h-3 w-3 text-[#292625]" />
                                            </div>
                                            <span className="line-clamp-2 min-w-0 text-left text-xs leading-4 font-semibold break-words text-[#A96F0B] dark:text-[#E0A43A] sm:max-w-md sm:text-sm">
                                                {crumb.name}
                                            </span>

                                            {/* Badge de localisation */}
                                            <div className="ml-1 hidden shrink-0 rounded-full bg-[#413D3C]/10 px-2 py-1 text-xs font-semibold text-[#413D3C] dark:bg-white/10 dark:text-[#EEEFE6] sm:block">
                                                {t('current_location')}
                                            </div>
                                        </div>
                                    )}

                                    {/* Séparateur */}
                                    {!isLast && (
                                        <div className="relative shrink-0">
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
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
