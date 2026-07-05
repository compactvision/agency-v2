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
import { createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
import SellerPopup from '../forms/SellerPopup';
import MobileMenu from '../layouts/Home/MobileMenu';

interface HeaderContextType {
    active: boolean;
    toggleActive: () => void;
    toggleSellerPopup: () => void;
}

export const HeaderContext = createContext<HeaderContextType | undefined>(
    undefined,
);

export default function Header() {
    const [active, setActive] = useState(false);
    const [sellerPopup, setSellerPopup] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { t, i18n } = useTranslation();

    const changeLanguage = async (lng: string) => {
        i18n.changeLanguage(lng);
        try {
            await axios.post('/language', { language: lng });
        } catch (error) {
            console.error('Error updating language:', error);
        }
    };

    const toggleActive = () => setActive(!active);
    const toggleSellerPopup = () => setSellerPopup(!sellerPopup);

    const { url } = usePage<SharedData>();
    const isActive = (path: string) =>
        url === path || url.startsWith(path + '/');
    const user = usePage<SharedData>().props.auth?.user;

    const userRoles =
        user?.roles?.map((r: any) => (typeof r === 'string' ? r : r.name)) ??
        [];
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

    const { settings } = usePage<SharedData>().props as any;
    const numero = settings?.numero ?? '+1 234 567 890';

    return (
        <HeaderContext.Provider
            value={{ active, toggleActive, toggleSellerPopup }}
        >
            {/* Seller Popup */}
            <SellerPopup
                active={sellerPopup}
                onClose={toggleSellerPopup}
                user={user ?? undefined}
            />

            {/* Overlay Mobile */}
            <div
                className={`fixed inset-0 z-40 bg-[#0d2340]/60 backdrop-blur-sm transition-opacity duration-300 ${
                    active
                        ? 'visible opacity-100'
                        : 'pointer-events-none invisible opacity-0'
                }`}
                onClick={toggleActive}
            />

            <MobileMenu />

            {/* Header Principal */}
            <header
                className={`fixed top-0 right-0 left-0 z-50 border-b transition-all duration-300 ${
                    isScrolled
                        ? 'border-gray-100 bg-white/95 py-3 shadow-sm backdrop-blur-md'
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
                                {/* Pour simplifier, on utilise une icône/texte si logo manquant, ou l'image */}
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A84C] text-white shadow-lg`}
                                >
                                    <span className="text-xl font-black">
                                        A
                                    </span>
                                </div>
                                <span
                                    className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-[#1E3A5F]' : 'text-white'}`}
                                >
                                    Agency
                                    <span className="text-[#C9A84C]">.</span>
                                </span>
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
                                        className={`text-sm font-semibold transition-colors duration-200 ${
                                            activeLink
                                                ? 'text-[#C9A84C]'
                                                : isScrolled
                                                  ? 'text-gray-600 hover:text-[#1E3A5F]'
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
                                    onChange={(e) =>
                                        changeLanguage(e.target.value)
                                    }
                                    value={i18n.language}
                                    className={`cursor-pointer appearance-none bg-transparent pr-4 text-sm font-semibold focus:outline-none ${
                                        isScrolled
                                            ? 'text-gray-600'
                                            : 'text-white'
                                    }`}
                                >
                                    <option
                                        value="en"
                                        className="bg-[#0d2340] text-white"
                                    >
                                        EN
                                    </option>
                                    <option
                                        value="fr"
                                        className="bg-[#0d2340] text-white"
                                    >
                                        FR
                                    </option>
                                </select>
                                <ChevronDown
                                    className={`pointer-events-none absolute right-0 h-3 w-3 ${isScrolled ? 'text-gray-400' : 'text-white/60'}`}
                                />
                            </div>

                            <div
                                className={`h-5 w-px ${isScrolled ? 'bg-gray-200' : 'bg-white/20'}`}
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
                                            ? 'text-[#1E3A5F] hover:text-[#C9A84C]'
                                            : 'text-white hover:text-[#C9A84C]'
                                    }`}
                                >
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full ${isScrolled ? 'bg-[#1E3A5F]/10' : 'bg-white/20'}`}
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
                                            ? 'text-gray-600 hover:text-[#1E3A5F]'
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
                                            ? 'bg-[#1E3A5F] text-white hover:bg-[#152C47]'
                                            : 'bg-[#C9A84C] text-white hover:bg-[#A8882E]'
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
                                            ? 'bg-[#1E3A5F] text-white hover:bg-[#152C47]'
                                            : 'bg-[#C9A84C] text-white hover:bg-[#A8882E]'
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
                                onClick={toggleActive}
                                className={`rounded-lg p-2 transition-colors ${
                                    isScrolled
                                        ? 'text-gray-600 hover:bg-gray-100'
                                        : 'text-white hover:bg-white/10'
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
