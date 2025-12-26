import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { LucideMenu, LucidePhoneCall, LucideGlobe, LucideArrowRight, LucidePlus } from 'lucide-react';
import { createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SellerPopup from '../forms/SellerPopup';
import MobileMenu from '../layouts/Home/MobileMenu';

interface HeaderContextType {
    active: boolean;
    toggleActive: () => void;
    toggleSellerPopup: () => void;
}

export const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

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
    const isActive = (path: string) => url === path || url.startsWith(path + '/');
    const user = usePage().props.auth?.user;

    const isBuyer = user?.roles?.includes('Buyer');
    const isSeller = user?.roles?.includes('Simple_seller') || user?.roles?.includes('Agency');
    const isAdmin = user?.roles?.includes('Admin');

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
        <HeaderContext.Provider value={{ active, toggleActive, toggleSellerPopup }}>
            {/* Side Overlay with blur effect */}
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-md z-40 transition-all duration-500 ease-out ${
                    active ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
                onClick={toggleActive}
            ></div>
            
            <MobileMenu />
            
            {/* Top Bar */}
            <header className={`hidden lg:block relative z-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/30 transition-all duration-300 ${
                isScrolled ? 'shadow-lg shadow-slate-900/50' : ''
            }`}>
                <div className="container-fluid">
                    <div className="flex justify-between items-center py-3 px-8 xl:px-12 2xl:px-16">
                        {/* Left side - Contact Info */}
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center group">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center mr-3 group-hover:bg-amber-500/20 transition-all duration-300">
                                    <LucidePhoneCall className="w-4.5 h-4.5 text-amber-400" />
                                </div>
                                <a 
                                    href={`tel:${numero}`} 
                                    className="text-slate-300 text-sm font-medium hover:text-amber-400 transition-colors duration-300 tracking-wide"
                                >
                                    {numero}
                                </a>
                            </div>
                            
                            <div className="w-px h-5 bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
                            
                            <div className="flex items-center group">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center mr-3 group-hover:bg-amber-500/20 transition-all duration-300">
                                    <svg className="w-4.5 h-4.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <a 
                                    href={`mailto:${email}`} 
                                    className="text-slate-300 text-sm font-medium hover:text-amber-400 transition-colors duration-300 tracking-wide"
                                >
                                    {email}
                                </a>
                            </div>
                        </div>

                        {/* Right side - User, Language, Social */}
                        <div className="flex items-center space-x-6">
                            {/* User Account */}
                            <div className="flex items-center group">
                                <div className="w-9 h-9 rounded-xl bg-slate-700/40 flex items-center justify-center mr-3 group-hover:bg-slate-600/50 transition-all duration-300">
                                    <svg className="w-4.5 h-4.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                {user ? (
                                    isBuyer ? (
                                        <Link 
                                            href={route('profile')} 
                                            className="text-slate-300 text-sm font-medium hover:text-amber-400 transition-all duration-300 tracking-wide"
                                        >
                                            {user.name}
                                        </Link>
                                    ) : (
                                        <Link 
                                            href={route('dashboard.index')} 
                                            className="text-slate-300 text-sm font-medium hover:text-amber-400 transition-all duration-300 tracking-wide"
                                        >
                                            {user.name}
                                        </Link>
                                    )
                                ) : (
                                    <Link 
                                        href={route('login')} 
                                        className="text-slate-300 text-sm font-medium hover:text-amber-400 transition-all duration-300 tracking-wide"
                                    >
                                        {t('login_register')}
                                    </Link>
                                )}
                            </div>

                            {/* Language Selector */}
                            <div className="relative group">
                                <div className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer border border-slate-600/30 hover:border-slate-600/50">
                                    <img
                                        src={i18n.language === 'en' ? '/assets/images/icons/en.svg' : '/assets/images/icons/fr.svg'}
                                        alt="Language"
                                        className="w-5 h-5 rounded-full object-cover ring-2 ring-slate-600/50"
                                    />
                                    <select 
                                        onChange={(e) => changeLanguage(e.target.value)} 
                                        className="bg-transparent text-slate-300 text-sm font-medium focus:outline-none cursor-pointer appearance-none"
                                        value={i18n.language}
                                    >
                                        <option value="en" className="bg-slate-800">English</option>
                                        <option value="fr" className="bg-slate-800">Français</option>
                                    </select>
                                    <LucideGlobe className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center space-x-3 pl-6 border-l border-slate-600/50">
                                {[
                                    { icon: 'facebook-f', href: facebook },
                                    { icon: 'twitter', href: twitter },
                                    { icon: 'linkedin-in', href: linkedin },
                                    { icon: 'instagram', href: instagram }
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="w-9 h-9 rounded-xl bg-slate-700/30 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-slate-900 transition-all duration-300 transform hover:scale-110 hover:rotate-3 border border-slate-600/30 hover:border-amber-500"
                                        aria-label={`Social media link ${index + 1}`}
                                    >
                                        <i className={`fab fa-${social.icon} text-sm`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Header */}
            <header className={`sticky top-0 z-30 transition-all duration-500 ${
                isScrolled 
                    ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-slate-900/50 border-b border-slate-700/30' 
                    : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'
            }`}>
                <div className="container-fluid">
                    <nav className="flex justify-between items-center py-4 px-8 xl:px-12 2xl:px-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link 
                                href={route('home')} 
                                className="group flex items-center"
                            >
                                <img 
                                    src="assets/images/logo/white-logo.png" 
                                    alt="Logo" 
                                    className="h-11 w-auto transition-all duration-300 group-hover:scale-105 filter drop-shadow-lg"
                                />
                            </Link>
                        </div>

                        {/* Navigation Menu */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {[
                                { path: 'home', label: t('home') },
                                { path: 'properties', label: t('property') },
                                { path: 'about', label: t('about') },
                                { path: 'tarifs', label: t('pricing') },
                                { path: 'contact', label: t('contact') }
                            ].map((item, index) => (
                                <Link
                                    key={index}
                                    href={route(item.path)}
                                    className={`relative px-6 py-3 text-sm font-medium transition-all duration-300 rounded-xl mx-1 ${
                                        isActive('/' + (item.path === 'home' ? '' : item.path))
                                            ? 'text-amber-400 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20'
                                            : 'text-slate-300 hover:text-amber-400 hover:bg-slate-700/20'
                                    }`}
                                >
                                    {item.label}
                                    {isActive('/' + (item.path === 'home' ? '' : item.path)) && (
                                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"></span>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center space-x-4">
                            {/* Call Button - Desktop Only */}
                            <div className="hidden xl:flex items-center space-x-3 pl-6 border-l border-slate-600/50">
                                <a 
                                    href={`tel:${numero}`}
                                    className="group flex items-center space-x-3 px-5 py-3 rounded-xl bg-gradient-to-r from-slate-700/30 to-slate-700/20 hover:from-amber-500/10 hover:to-amber-600/10 transition-all duration-300 border border-slate-600/30 hover:border-amber-500/30"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-300">
                                        <LucidePhoneCall className="w-5 h-5 text-amber-400 group-hover:text-slate-900" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium tracking-wide">{t('call_us_now')}</p>
                                        <p className="text-sm text-slate-200 font-semibold">{numero}</p>
                                    </div>
                                </a>
                            </div>

                            {/* CTA Button - IMPROVED */}
                            <div className="hidden lg:block">
                                {user ? (
                                    isBuyer ? (
                                        <button 
                                            onClick={toggleSellerPopup}
                                            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-slate-900 transition-all duration-300 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-xl hover:from-amber-500 hover:via-amber-600 hover:to-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-500/50 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-2xl hover:shadow-amber-500/25 overflow-hidden"
                                        >
                                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                            <span className="relative flex items-center space-x-3">
                                                <span className="text-base">{t('become_seller')}</span>
                                                <LucideArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                            </span>
                                            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                                        </button>
                                    ) : isSeller ? (
                                        <Link 
                                            href={route('dashboard.properties.create')}
                                            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-slate-900 transition-all duration-300 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-500 hover:via-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/25 overflow-hidden"
                                        >
                                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                            <span className="relative flex items-center space-x-3">
                                                <LucidePlus className="w-5 h-5" />
                                                <span className="text-base">{t('add_listing')}</span>
                                            </span>
                                            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                                        </Link>
                                    ) : null
                                ) : (
                                    <Link
                                        href={route('register')}
                                        onClick={() => localStorage.setItem('afterLoginBecomeSeller', '1')}
                                        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-slate-900 transition-all duration-300 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-xl hover:from-amber-500 hover:via-amber-600 hover:to-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-500/50 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-2xl hover:shadow-amber-500/25 overflow-hidden"
                                    >
                                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        <span className="relative flex items-center space-x-3">
                                            <span className="text-base">{t('become_seller')}</span>
                                            <LucideArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                        </span>
                                        <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button 
                                onClick={toggleActive} 
                                type="button" 
                                className="lg:hidden p-3 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-700/30 transition-all duration-300"
                                aria-label="Toggle mobile menu"
                            >
                                <LucideMenu className="w-6 h-6" />
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Seller Popup */}
            {sellerPopup && <SellerPopup onClose={toggleSellerPopup} user={user} active={sellerPopup} />}
        </HeaderContext.Provider>
    );
}