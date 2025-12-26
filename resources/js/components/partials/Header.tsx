import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    LucideArrowRight,
    LucideGlobe,
    LucideMenu,
    LucidePhoneCall,
    LucidePlus,
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
    const [isScrolled, setIsScrolled] = useState(false);
    const { t, i18n } = useTranslation();

    const changeLanguage = async (lng: string) => {
        i18n.changeLanguage(lng);
        try {
            await axios.post('/language', { language: lng });
        } catch (error) {
            console.error('Error updating language:', error);
        }
    };

    const toggleActive = () => {
        setActive(!active);
    };

    const { url } = usePage();
    const isPropertiesActive = url.startsWith('/properties');
    const isActive = (path: string) =>
        url === path || url.startsWith(path + '/');
    const user = usePage().props.auth?.user;

    const userRoles =
        user?.roles?.map((r: any) => (typeof r === 'string' ? r : r.name)) ??
        [];
    const isBuyer = userRoles.includes('buyer');
    const isSeller =
        userRoles.includes('seller') ||
        userRoles.includes('agency') ||
        userRoles.includes('admin');
    const isAdmin = userRoles.includes('admin');

    const toggleSellerPopup = () => setSellerPopup(!sellerPopup);

    useEffect(() => {
        if (active) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [active]);

    useEffect(() => {
        const openPopup = () => setSellerPopup(true);

        window.addEventListener('openSellerPopup', openPopup);

        if (isBuyer && localStorage.getItem('afterLoginBecomeSeller')) {
            setSellerPopup(true);
            localStorage.removeItem('afterLoginBecomeSeller');
        }

        return () => {
            window.removeEventListener('openSellerPopup', openPopup);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { appSettings } = usePage().props as { appSettings: any };

    const numero = appSettings?.numero ?? '+1 800 123 456 789';
    const email = appSettings?.email ?? 'your_protect@mail.com';
    const facebook = appSettings?.facebook ?? '#';
    const twitter = appSettings?.twitter ?? '#';
    const linkedin = appSettings?.linkedin ?? '#';
    const instagram = appSettings?.instagram ?? '#';

    return (
        <HeaderContext.Provider
            value={{ active, toggleActive, toggleSellerPopup }}
        >
            {/* Side Overlay with blur effect */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-md transition-all duration-500 ease-out ${
                    active
                        ? 'visible opacity-100'
                        : 'pointer-events-none invisible opacity-0'
                }`}
                onClick={toggleActive}
            ></div>

            <MobileMenu />

            {/* Top Bar */}
            <header
                className={`relative z-20 hidden border-b border-slate-700/30 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 lg:block ${
                    isScrolled ? 'shadow-lg shadow-slate-900/50' : ''
                }`}
            >
                <div className="container-fluid">
                    <div className="flex items-center justify-between px-8 py-3 xl:px-12 2xl:px-16">
                        {/* Left side - Contact Info */}
                        <div className="flex items-center space-x-8">
                            <div className="group flex items-center">
                                <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 transition-all duration-300 group-hover:bg-amber-500/20">
                                    <LucidePhoneCall className="h-4.5 w-4.5 text-amber-400" />
                                </div>
                                <a
                                    href={`tel:${numero}`}
                                    className="text-sm font-medium tracking-wide text-slate-300 transition-colors duration-300 hover:text-amber-400"
                                >
                                    {numero}
                                </a>
                            </div>

                            <div className="h-5 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>

                            <div className="group flex items-center">
                                <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 transition-all duration-300 group-hover:bg-amber-500/20">
                                    <svg
                                        className="h-4.5 w-4.5 text-amber-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <a
                                    href={`mailto:${email}`}
                                    className="text-sm font-medium tracking-wide text-slate-300 transition-colors duration-300 hover:text-amber-400"
                                >
                                    {email}
                                </a>
                            </div>
                        </div>

                        {/* Right side - User, Language, Social */}
                        <div className="flex items-center space-x-6">
                            {/* User Account */}
                            <div className="group flex items-center">
                                <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-700/40 transition-all duration-300 group-hover:bg-slate-600/50">
                                    <svg
                                        className="h-4.5 w-4.5 text-slate-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                {user ? (
                                    isBuyer ? (
                                        <Link
                                            href={route('profile')}
                                            className="text-sm font-medium tracking-wide text-slate-300 transition-all duration-300 hover:text-amber-400"
                                        >
                                            {user.name}
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('dashboard.index')}
                                            className="text-sm font-medium tracking-wide text-slate-300 transition-all duration-300 hover:text-amber-400"
                                        >
                                            {user.name}
                                        </Link>
                                    )
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium tracking-wide text-slate-300 transition-all duration-300 hover:text-amber-400"
                                    >
                                        {t('login_register')}
                                    </Link>
                                )}
                            </div>

                            {/* Language Selector */}
                            <div className="group relative">
                                <div className="flex cursor-pointer items-center space-x-2 rounded-xl border border-slate-600/30 bg-slate-700/30 px-4 py-2.5 transition-all duration-300 hover:border-slate-600/50 hover:bg-slate-700/50">
                                    <img
                                        src={
                                            i18n.language === 'en'
                                                ? '/assets/images/icons/en.svg'
                                                : '/assets/images/icons/fr.svg'
                                        }
                                        alt="Language"
                                        className="h-5 w-5 rounded-full object-cover ring-2 ring-slate-600/50"
                                    />
                                    <select
                                        onChange={(e) =>
                                            changeLanguage(e.target.value)
                                        }
                                        className="cursor-pointer appearance-none bg-transparent text-sm font-medium text-slate-300 focus:outline-none"
                                        value={i18n.language}
                                    >
                                        <option
                                            value="en"
                                            className="bg-slate-800"
                                        >
                                            English
                                        </option>
                                        <option
                                            value="fr"
                                            className="bg-slate-800"
                                        >
                                            Français
                                        </option>
                                    </select>
                                    <LucideGlobe className="h-4 w-4 text-slate-400" />
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center space-x-3 border-l border-slate-600/50 pl-6">
                                {[
                                    { icon: 'facebook-f', href: facebook },
                                    { icon: 'twitter', href: twitter },
                                    { icon: 'linkedin-in', href: linkedin },
                                    { icon: 'instagram', href: instagram },
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="flex h-9 w-9 transform items-center justify-center rounded-xl border border-slate-600/30 bg-slate-700/30 text-slate-400 transition-all duration-300 hover:scale-110 hover:rotate-3 hover:border-amber-500 hover:bg-amber-500 hover:text-slate-900"
                                        aria-label={`Social media link ${index + 1}`}
                                    >
                                        <i
                                            className={`fab fa-${social.icon} text-sm`}
                                        ></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Header */}
            <header
                className={`sticky top-0 z-30 transition-all duration-500 ${
                    isScrolled
                        ? 'border-b border-slate-700/30 bg-slate-900/95 shadow-2xl shadow-slate-900/50 backdrop-blur-xl'
                        : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'
                }`}
            >
                <div className="container-fluid">
                    <nav className="flex items-center justify-between px-8 py-4 xl:px-12 2xl:px-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link
                                href={route('home')}
                                className="group flex items-center"
                            >
                                <img
                                    src="assets/images/logo/white-logo.png"
                                    alt="Logo"
                                    className="h-11 w-auto drop-shadow-lg filter transition-all duration-300 group-hover:scale-105"
                                />
                            </Link>
                        </div>

                        {/* Navigation Menu */}
                        <div className="hidden items-center space-x-1 lg:flex">
                            {[
                                { path: 'home', label: t('home') },
                                { path: 'properties', label: t('property') },
                                { path: 'about', label: t('about') },
                                { path: 'tarifs', label: t('pricing') },
                                { path: 'contact', label: t('contact') },
                            ].map((item, index) => (
                                <Link
                                    key={index}
                                    href={route(item.path)}
                                    className={`relative mx-1 rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 ${
                                        isActive(
                                            '/' +
                                                (item.path === 'home'
                                                    ? ''
                                                    : item.path),
                                        )
                                            ? 'border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-amber-600/10 text-amber-400'
                                            : 'text-slate-300 hover:bg-slate-700/20 hover:text-amber-400'
                                    }`}
                                >
                                    {item.label}
                                    {isActive(
                                        '/' +
                                            (item.path === 'home'
                                                ? ''
                                                : item.path),
                                    ) && (
                                        <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 transform rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"></span>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center space-x-4">
                            {/* Call Button - Desktop Only */}
                            <div className="hidden items-center space-x-3 border-l border-slate-600/50 pl-6 xl:flex">
                                <a
                                    href={`tel:${numero}`}
                                    className="group flex items-center space-x-3 rounded-xl border border-slate-600/30 bg-gradient-to-r from-slate-700/30 to-slate-700/20 px-5 py-3 transition-all duration-300 hover:border-amber-500/30 hover:from-amber-500/10 hover:to-amber-600/10"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 transition-all duration-300 group-hover:from-amber-500 group-hover:to-amber-600">
                                        <LucidePhoneCall className="h-5 w-5 text-amber-400 group-hover:text-slate-900" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium tracking-wide text-slate-400">
                                            {t('call_us_now')}
                                        </p>
                                        <p className="text-sm font-semibold text-slate-200">
                                            {numero}
                                        </p>
                                    </div>
                                </a>
                            </div>

                            {/* CTA Button - IMPROVED */}
                            <div className="hidden lg:block">
                                {user ? (
                                    isBuyer ? (
                                        <button
                                            onClick={toggleSellerPopup}
                                            className="group relative inline-flex transform items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-8 py-4 font-bold text-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:from-amber-500 hover:via-amber-600 hover:to-amber-700 hover:shadow-2xl hover:shadow-amber-500/25 focus:ring-4 focus:ring-amber-500/50 focus:outline-none"
                                        >
                                            <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                                            <span className="relative flex items-center space-x-3">
                                                <span className="text-base">
                                                    {t('become_seller')}
                                                </span>
                                                <LucideArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                            </span>
                                            <span className="absolute top-0 left-0 h-full w-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></span>
                                        </button>
                                    ) : isSeller ? (
                                        <Link
                                            href={route(
                                                'dashboard.properties.create',
                                            )}
                                            className="group relative inline-flex transform items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 px-8 py-4 font-bold text-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:from-emerald-500 hover:via-emerald-600 hover:to-emerald-700 hover:shadow-2xl hover:shadow-emerald-500/25 focus:ring-4 focus:ring-emerald-500/50 focus:outline-none"
                                        >
                                            <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                                            <span className="relative flex items-center space-x-3">
                                                <LucidePlus className="h-5 w-5" />
                                                <span className="text-base">
                                                    {t('add_listing')}
                                                </span>
                                            </span>
                                            <span className="absolute top-0 left-0 h-full w-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></span>
                                        </Link>
                                    ) : null
                                ) : (
                                    <Link
                                        href={route('register')}
                                        onClick={() =>
                                            localStorage.setItem(
                                                'afterLoginBecomeSeller',
                                                '1',
                                            )
                                        }
                                        className="group relative inline-flex transform items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-8 py-4 font-bold text-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:from-amber-500 hover:via-amber-600 hover:to-amber-700 hover:shadow-2xl hover:shadow-amber-500/25 focus:ring-4 focus:ring-amber-500/50 focus:outline-none"
                                    >
                                        <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                                        <span className="relative flex items-center space-x-3">
                                            <span className="text-base">
                                                {t('become_seller')}
                                            </span>
                                            <LucideArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                        </span>
                                        <span className="absolute top-0 left-0 h-full w-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></span>
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={toggleActive}
                                type="button"
                                className="rounded-xl p-3 text-slate-300 transition-all duration-300 hover:bg-slate-700/30 hover:text-amber-400 lg:hidden"
                                aria-label="Toggle mobile menu"
                            >
                                <LucideMenu className="h-6 w-6" />
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Seller Popup */}
            {sellerPopup && (
                <SellerPopup
                    onClose={toggleSellerPopup}
                    user={user}
                    active={sellerPopup}
                />
            )}
        </HeaderContext.Provider>
    );
}
