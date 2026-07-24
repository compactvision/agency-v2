import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    ChevronDown,
    LucideGlobe,
    LucideMenu,
    LucidePlus,
    LucideUser,
} from 'lucide-react';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
import BrandLogo from '../brand-logo';
import SellerPopup from '../forms/SellerPopup';
import MobileMenu from '../layouts/Home/MobileMenu';
import ThemeToggle from '../theme-toggle';

interface HeaderContextType {
    active: boolean;
    toggleActive: () => void;
    toggleSellerPopup: () => void;
    menuButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export const HeaderContext = createContext<HeaderContextType | undefined>(
    undefined,
);

export default function Header() {
    const [active, setActive] = useState(false);
    const [sellerPopup, setSellerPopup] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const { t, i18n } = useTranslation();

    const changeLanguage = async (lng: string) => {
        i18n.changeLanguage(lng);
        try {
            await axios.post('/language', { language: lng });
        } catch (error) {
            console.error('Error updating language:', error);
        }
    };

    const toggleActive = useCallback(
        () => setActive((current) => !current),
        [],
    );
    const toggleSellerPopup = useCallback(
        () => setSellerPopup((current) => !current),
        [],
    );

    const { url } = usePage<SharedData>();
    const isActive = (path: string) =>
        url === path || url.startsWith(path + '/');
    const user = usePage<SharedData>().props.auth?.user;

    const userRoles = (
        (user?.roles ?? []) as Array<string | { name: string }>
    ).map((role) => (typeof role === 'string' ? role : role.name));
    const isBuyer = userRoles.includes('buyer');
    const isSeller =
        userRoles.includes('seller') ||
        userRoles.includes('agency') ||
        userRoles.includes('admin');

    useEffect(() => {
        if (active) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [active]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHomePage = url === '/' || url === '/home' || url === '';
    const isScrolled = scrolled || !isHomePage;

    return (
        <HeaderContext.Provider
            value={{
                active,
                toggleActive,
                toggleSellerPopup,
                menuButtonRef,
            }}
        >
            {/* Seller Popup */}
            <SellerPopup
                active={sellerPopup}
                onClose={toggleSellerPopup}
                user={user ?? undefined}
            />

            <MobileMenu />

            {/* Header Principal */}
            <header
                className={`fixed top-0 right-0 left-0 z-50 border-b transition-all duration-300 ${
                    isScrolled
                        ? 'border-[#413D3C]/10 bg-[#EEEFE6]/95 py-3 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#292625]/95'
                        : 'border-white/10 bg-transparent py-5'
                }`}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex shrink-0 items-center">
                            <Link
                                href={route('home')}
                                className="group flex items-center gap-2"
                            >
                                <BrandLogo
                                    variant={isScrolled ? 'auto' : 'on-dark'}
                                    imageClassName="h-10 max-w-[10.5rem] drop-shadow-sm lg:h-11 lg:max-w-[12rem]"
                                />
                            </Link>
                        </div>

                        {/* Liens de navigation (Desktop) */}
                        <div className="hidden md:flex md:items-center md:space-x-8 lg:space-x-10">
                            {[
                                { path: 'home', label: t('home') },
                                { path: 'properties', label: t('property') },
                                { path: 'about', label: t('about') },
                                { path: 'contact', label: t('contact') },
                            ].map((item) => {
                                const activeLink = isActive(
                                    '/' +
                                        (item.path === 'home' ? '' : item.path),
                                );
                                return (
                                    <Link
                                        key={item.path}
                                        href={route(item.path)}
                                        aria-current={
                                            activeLink ? 'page' : undefined
                                        }
                                        className={`text-sm font-semibold transition-colors duration-200 ${
                                            activeLink
                                                ? 'text-[#CF8E19]'
                                                : isScrolled
                                                  ? 'text-[#5D5755] hover:text-[#413D3C] dark:text-[#EEEFE6]/70 dark:hover:text-white'
                                                  : 'text-white/80 hover:text-white'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Actions (Desktop) */}
                        <div className="hidden md:flex md:items-center md:space-x-6">
                            {/* Sélecteur de langue */}
                            <div className="group relative flex cursor-pointer items-center gap-1">
                                <LucideGlobe
                                    className={`h-4 w-4 ${isScrolled ? 'text-gray-400' : 'text-white/60'}`}
                                />
                                <select
                                    aria-label={t('language', 'Langue du site')}
                                    onChange={(e) =>
                                        changeLanguage(e.target.value)
                                    }
                                    value={i18n.language}
                                    className={`cursor-pointer appearance-none bg-transparent pr-4 text-sm font-semibold focus:outline-none ${
                                        isScrolled
                                            ? 'text-[#5D5755] dark:text-[#EEEFE6]'
                                            : 'text-white'
                                    }`}
                                >
                                    <option
                                        value="en"
                                        className="bg-[#413D3C] text-white"
                                    >
                                        EN
                                    </option>
                                    <option
                                        value="fr"
                                        className="bg-[#413D3C] text-white"
                                    >
                                        FR
                                    </option>
                                </select>
                                <ChevronDown
                                    className={`pointer-events-none absolute right-0 h-3 w-3 ${isScrolled ? 'text-gray-400' : 'text-white/60'}`}
                                />
                            </div>

                            <ThemeToggle
                                className={
                                    isScrolled
                                        ? 'border-[#413D3C]/15 text-[#413D3C] hover:bg-[#413D3C]/5 dark:text-[#EEEFE6] dark:hover:bg-white/10'
                                        : 'border-white/15 text-white hover:bg-white/10'
                                }
                            />

                            <div
                                className={`h-5 w-px ${isScrolled ? 'bg-[#413D3C]/15 dark:bg-white/15' : 'bg-white/20'}`}
                            />

                            {/* User Account / Auth */}
                            {user ? (
                                <Link
                                    href={
                                        isBuyer
                                            ? route('profile')
                                            : route('dashboard')
                                    }
                                    className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                                        isScrolled
                                            ? 'text-[#413D3C] hover:text-[#CF8E19] dark:text-[#EEEFE6]'
                                            : 'text-white hover:text-[#CF8E19]'
                                    }`}
                                >
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full ${isScrolled ? 'bg-[#413D3C]/10 dark:bg-white/10' : 'bg-white/20'}`}
                                    >
                                        <LucideUser className="h-4 w-4" />
                                    </div>
                                    <span>{user.name.split(' ')[0]}</span>
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className={`text-sm font-semibold transition-colors ${
                                        isScrolled
                                            ? 'text-[#5D5755] hover:text-[#413D3C] dark:text-[#EEEFE6]/70 dark:hover:text-white'
                                            : 'text-white/80 hover:text-white'
                                    }`}
                                >
                                    {t('login')}
                                </Link>
                            )}

                            {/* CTA */}
                            {user && !isSeller ? (
                                <button
                                    onClick={toggleSellerPopup}
                                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                                        isScrolled
                                            ? 'bg-[#413D3C] text-white hover:bg-[#292625] dark:bg-[#CF8E19] dark:text-[#292625] dark:hover:bg-[#E0A43A]'
                                            : 'bg-[#CF8E19] text-[#292625] hover:bg-[#E0A43A]'
                                    }`}
                                >
                                    {t('become_seller', 'Devenir vendeur')}
                                </button>
                            ) : (
                                <Link
                                    href={
                                        !user
                                            ? route('register')
                                            : route(
                                                  'dashboard.properties.create',
                                              )
                                    }
                                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                                        isScrolled
                                            ? 'bg-[#413D3C] text-white hover:bg-[#292625] dark:bg-[#CF8E19] dark:text-[#292625] dark:hover:bg-[#E0A43A]'
                                            : 'bg-[#CF8E19] text-[#292625] hover:bg-[#E0A43A]'
                                    }`}
                                >
                                    {user ? (
                                        <LucidePlus className="h-4 w-4" />
                                    ) : null}
                                    {user
                                        ? t('add_listing')
                                        : t(
                                              'become_seller',
                                              'Publier une annonce',
                                          )}
                                </Link>
                            )}
                        </div>

                        {/* Hamburger Mobile */}
                        <div className="flex items-center md:hidden">
                            <button
                                ref={menuButtonRef}
                                onClick={toggleActive}
                                type="button"
                                aria-label={t(
                                    'open_menu',
                                    'Ouvrir le menu principal',
                                )}
                                aria-expanded={active}
                                aria-controls="mobile-navigation"
                                className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 ${
                                    isScrolled
                                        ? 'border-[#413D3C]/15 bg-[#EEEFE6] text-[#413D3C] shadow-sm hover:bg-white dark:border-white/15 dark:bg-[#353130] dark:text-[#EEEFE6]'
                                        : 'border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
                                }`}
                            >
                                <LucideMenu className="h-6 w-6" />
                            </button>
                        </div>
                    </nav>
                </div>
            </header>
        </HeaderContext.Provider>
    );
}
