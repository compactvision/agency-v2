import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    LucideArrowRight,
    LucideBuilding,
    LucideDollarSign,
    LucideGlobe2,
    LucideHome,
    LucideInfo,
    LucideLogOut,
    LucidePhone,
    LucidePlus,
    LucideUser,
    LucideX,
} from 'lucide-react';
import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
import BrandLogo from '../../brand-logo';
import { HeaderContext } from '../../partials/Header';
import ThemeToggle from '../../theme-toggle';

export default function MobileMenu() {
    const { t, i18n } = useTranslation();
    const context = useContext(HeaderContext);
    if (!context) {
        throw new Error(
            'MobileMenu must be used within a HeaderContext.Provider',
        );
    }
    const { active, toggleActive, toggleSellerPopup, menuButtonRef } = context;
    const menuRef = useRef<HTMLDivElement>(null);
    const wasOpenRef = useRef(false);
    const user = usePage<SharedData>().props.auth?.user;
    const { url } = usePage<SharedData>();

    const isActive = (path: string) =>
        url === path || url.startsWith(path + '/');

    const userRoles = (
        (user?.roles ?? []) as Array<string | { name: string }>
    ).map((role) => (typeof role === 'string' ? role : role.name));
    const isBuyer = userRoles.includes('buyer');
    const isSeller =
        userRoles.includes('seller') ||
        userRoles.includes('agency') ||
        userRoles.includes('admin');

    useEffect(() => {
        if (active) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [active]);

    useEffect(() => {
        if (!active) {
            if (wasOpenRef.current) menuButtonRef.current?.focus();
            wasOpenRef.current = false;
            return;
        }

        wasOpenRef.current = true;
        const menu = menuRef.current;
        const focusable = menu?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        focusable?.[0]?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                toggleActive();
                return;
            }
            if (event.key !== 'Tab' || !focusable?.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [active, menuButtonRef, toggleActive]);

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            confirm(
                t('confirm_logout') ||
                    'Êtes-vous sûr de vouloir vous déconnecter ?',
            )
        ) {
            router.post(
                route('logout'),
                {},
                {
                    onStart: () => toggleActive(),
                },
            );
        }
    };

    const currentLanguage = (
        i18n.resolvedLanguage ??
        i18n.language ??
        'fr'
    ).split('-')[0];

    const changeLanguage = async (lng: string) => {
        i18n.changeLanguage(lng);
        try {
            await axios.post('/language', { language: lng });
        } catch (error) {
            console.error('Error updating language:', error);
        }
    };

    return (
        <>
            {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
            <div
                aria-hidden="true"
                className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    active
                        ? 'visible opacity-100'
                        : 'pointer-events-none invisible opacity-0'
                }`}
                onClick={toggleActive}
            ></div>

            {/* Menu Mobile */}
            <div
                id="mobile-navigation"
                ref={menuRef}
                role="dialog"
                aria-modal="true"
                aria-label={t('main_menu', 'Menu principal')}
                aria-hidden={!active}
                inert={!active ? true : undefined}
                className={`fixed top-0 left-0 z-[70] flex h-[100dvh] w-[88vw] max-w-[22rem] flex-col overflow-hidden rounded-r-3xl bg-[#EEEFE6] text-[#413D3C] shadow-[20px_0_60px_rgba(65,61,60,0.28)] transition-transform duration-300 ease-out lg:hidden dark:bg-[#292625] dark:text-[#EEEFE6] ${
                    active ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header du Menu */}
                <div className="relative z-10 flex min-h-[4.75rem] items-center justify-between gap-3 overflow-hidden bg-gradient-to-br from-[#292625] via-[#353130] to-[#413D3C] px-4 py-3 sm:px-5">
                    <div className="pointer-events-none absolute -top-16 -left-12 h-36 w-36 rounded-full border border-white/10" />
                    <div className="pointer-events-none absolute -right-8 -bottom-16 h-32 w-32 rounded-full bg-[#CF8E19]/15 blur-2xl" />

                    {/* Logo */}
                    <Link
                        href={route('home')}
                        className="relative min-w-0 rounded-xl px-1 py-1 transition-transform duration-300 hover:scale-[1.02]"
                        onClick={toggleActive}
                    >
                        <BrandLogo
                            variant="on-dark"
                            imageClassName="h-9 max-w-[9.5rem] sm:h-10 sm:max-w-[10.5rem]"
                        />
                    </Link>

                    {/* Bouton de fermeture */}
                    <button
                        onClick={toggleActive}
                        className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:rotate-3 hover:border-white/30 hover:bg-white/20"
                        aria-label={t('close_menu')}
                    >
                        <LucideX className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                    </button>

                    <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#CF8E19] to-transparent opacity-80" />
                </div>

                {/* Tout le contenu tient dans la hauteur disponible, sans scroll */}
                <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-3 px-4 py-3 sm:px-5 [@media(max-height:700px)]:gap-2 [@media(max-height:700px)]:py-2">
                    {/* Navigation Menu */}
                    <nav className="flex flex-col gap-1.5 [@media(max-height:700px)]:gap-1">
                        {[
                            {
                                path: 'home',
                                label: t('home'),
                                icon: LucideHome,
                            },
                            {
                                path: 'properties',
                                label: t('property'),
                                icon: LucideBuilding,
                            },
                            {
                                path: 'about',
                                label: t('about'),
                                icon: LucideInfo,
                            },
                            {
                                path: 'tarifs',
                                label: t('pricing'),
                                icon: LucideDollarSign,
                            },
                            {
                                path: 'contact',
                                label: t('contact'),
                                icon: LucidePhone,
                            },
                        ].map((item, index) => {
                            const Icon = item.icon;
                            const itemIsActive = isActive(
                                '/' + (item.path === 'home' ? '' : item.path),
                            );

                            return (
                                <Link
                                    key={index}
                                    href={route(item.path)}
                                    onClick={toggleActive}
                                    aria-current={
                                        itemIsActive ? 'page' : undefined
                                    }
                                    className={`group flex min-h-12 items-center gap-3 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-300 [@media(max-height:700px)]:min-h-11 ${
                                        itemIsActive
                                            ? 'border-[#413D3C] bg-[#413D3C] text-white shadow-md shadow-[#413D3C]/15 dark:border-[#CF8E19] dark:bg-[#CF8E19] dark:text-[#292625]'
                                            : 'border-transparent text-[#5D5755] hover:border-[#CF8E19]/30 hover:bg-white/70 hover:text-[#413D3C] hover:shadow-sm dark:text-[#EEEFE6]/70 dark:hover:bg-white/5 dark:hover:text-white'
                                    }`}
                                >
                                    <span
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                                            itemIsActive
                                                ? 'bg-[#CF8E19] text-[#292625] shadow-sm dark:bg-[#292625] dark:text-[#CF8E19]'
                                                : 'bg-white/70 text-[#413D3C] shadow-sm ring-1 ring-[#413D3C]/10 group-hover:bg-[#CF8E19]/10 group-hover:text-[#A96F0B] dark:bg-white/5 dark:text-[#EEEFE6] dark:ring-white/10'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span className="min-w-0 truncate">
                                        {item.label}
                                    </span>
                                    <span
                                        className={`ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all ${
                                            itemIsActive
                                                ? 'bg-white/10 text-[#E0A43A]'
                                                : 'text-gray-300 group-hover:translate-x-0.5 group-hover:text-[#CF8E19]'
                                        }`}
                                    >
                                        <LucideArrowRight className="h-3.5 w-3.5" />
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto space-y-2 border-t border-gray-100 pt-3 [@media(max-height:700px)]:pt-2">
                        {/* Compte utilisateur compact */}
                        {user ? (
                            <div className="flex gap-2">
                                <Link
                                    href={
                                        isBuyer
                                            ? route('profile')
                                            : route('dashboard')
                                    }
                                    onClick={toggleActive}
                                    className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-gray-100 bg-gray-50/90 p-2 transition-colors hover:bg-gray-100"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#413D3C] text-sm font-bold text-white dark:bg-[#CF8E19] dark:text-[#292625]">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-gray-900">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-[11px] text-gray-500">
                                            {isBuyer
                                                ? t('my_profile')
                                                : t('dashboard')}
                                        </p>
                                    </div>
                                    <LucideArrowRight className="ml-auto h-4 w-4 shrink-0 text-gray-400" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    aria-label={t('logout')}
                                    title={t('logout')}
                                    className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600 transition-all hover:bg-red-100"
                                >
                                    <LucideLogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href={route('login')}
                                onClick={toggleActive}
                                className="flex min-h-12 items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/90 px-3 py-2 text-gray-700 transition-all hover:bg-gray-100"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#413D3C]/10 dark:bg-white/10">
                                    <LucideUser className="h-4 w-4 text-[#413D3C] dark:text-[#EEEFE6]" />
                                </div>
                                <span className="text-sm font-semibold">
                                    {t('login_register')}
                                </span>
                                <LucideArrowRight className="ml-auto h-4 w-4 text-gray-400" />
                            </Link>
                        )}

                        {/* Action principale */}
                        {user ? (
                            isBuyer ? (
                                <button
                                    onClick={() => {
                                        toggleActive();
                                        toggleSellerPopup();
                                    }}
                                    className="flex min-h-12 w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[#CF8E19] to-[#A96F0B] px-4 py-2 text-sm font-semibold text-[#292625] shadow-lg shadow-[#CF8E19]/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                                >
                                    <span className="flex items-center gap-2">
                                        <LucidePlus className="h-5 w-5" />
                                        {t('become_seller')}
                                    </span>
                                    <LucideArrowRight className="h-4 w-4" />
                                </button>
                            ) : isSeller ? (
                                <Link
                                    href={route('dashboard.properties.create')}
                                    onClick={toggleActive}
                                    className="flex min-h-12 w-full items-center justify-between rounded-2xl bg-[#413D3C] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#413D3C]/15 transition-all hover:-translate-y-0.5 hover:bg-[#292625] dark:bg-[#CF8E19] dark:text-[#292625]"
                                >
                                    <span className="flex items-center gap-2">
                                        <LucidePlus className="h-5 w-5" />
                                        {t('add_listing')}
                                    </span>
                                    <LucideArrowRight className="h-4 w-4" />
                                </Link>
                            ) : null
                        ) : (
                            <Link
                                href={route('register')}
                                onClick={() => {
                                    localStorage.setItem(
                                        'afterLoginBecomeSeller',
                                        '1',
                                    );
                                    toggleActive();
                                }}
                                className="flex min-h-12 w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[#CF8E19] to-[#A96F0B] px-4 py-2 text-sm font-semibold text-[#292625] shadow-lg shadow-[#CF8E19]/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                <span className="flex items-center gap-2">
                                    <LucidePlus className="h-5 w-5" />
                                    {t('become_seller')}
                                </span>
                                <LucideArrowRight className="h-4 w-4" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Pied compact */}
                <div className="relative z-10 border-t border-[#413D3C]/10 bg-[#E6E5DB]/90 px-4 py-3 backdrop-blur-sm sm:px-5 dark:border-white/10 dark:bg-[#353130]/95">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#6B6562] dark:text-[#EEEFE6]/70">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/70 text-[#413D3C] shadow-sm dark:bg-white/10 dark:text-[#EEEFE6]">
                                <LucideGlobe2 className="h-4 w-4" />
                            </span>
                            {t('language')}
                        </div>
                        <div className="flex items-center gap-1">
                            <ThemeToggle className="h-9 min-h-9 w-9 px-0 text-[#413D3C] dark:text-[#EEEFE6]" />
                            <div className="flex rounded-xl border border-[#413D3C]/15 bg-white/70 p-1 shadow-sm dark:border-white/15 dark:bg-white/5">
                                {[
                                    { code: 'fr', label: 'FR' },
                                    { code: 'en', label: 'EN' },
                                ].map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() =>
                                            changeLanguage(lang.code)
                                        }
                                        aria-pressed={
                                            currentLanguage === lang.code
                                        }
                                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                            currentLanguage === lang.code
                                                ? 'bg-[#413D3C] text-white shadow-sm dark:bg-[#CF8E19] dark:text-[#292625]'
                                                : 'text-[#7A7471] hover:text-[#413D3C] dark:text-[#EEEFE6]/55 dark:hover:text-white'
                                        }`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="mt-2 truncate text-center text-[9px] font-semibold tracking-wider text-gray-400 uppercase [@media(max-height:650px)]:hidden">
                        © {new Date().getFullYear()} The Agency.{' '}
                        {t('all_rights_reserved')}
                    </p>
                </div>
            </div>
        </>
    );
}
