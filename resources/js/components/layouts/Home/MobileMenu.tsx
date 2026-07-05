import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    LucideArrowRight,
    LucideBuilding,
    LucideDollarSign,
    LucideHome,
    LucideInfo,
    LucideLogOut,
    LucidePhone,
    LucidePlus,
    LucideUser,
    LucideX,
} from 'lucide-react';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
import { HeaderContext } from '../../partials/Header';

export default function MobileMenu() {
    const { t } = useTranslation();
    const context = useContext(HeaderContext);
    if (!context) {
        throw new Error(
            'MobileMenu must be used within a HeaderContext.Provider',
        );
    }
    const { active, toggleActive, toggleSellerPopup } = context;
    const user = usePage<SharedData>().props.auth?.user;
    const { url } = usePage<SharedData>();

    const isPropertiesActive = url.startsWith('/properties');
    const isActive = (path: string) =>
        url === path || url.startsWith(path + '/');

    const userRoles =
        user?.roles?.map((r: any) => (typeof r === 'string' ? r : r.name)) ??
        [];
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

    const { i18n } = useTranslation();

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
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    active
                        ? 'visible opacity-100'
                        : 'pointer-events-none invisible opacity-0'
                }`}
                onClick={toggleActive}
            ></div>

            {/* Menu Mobile */}
            <div
                className={`fixed top-0 left-0 z-50 flex h-full w-[85vw] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
                    active ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header du Menu */}
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    {/* Logo */}
                    <Link
                        href={route('home')}
                        className="inline-block transition-transform duration-300 hover:scale-105"
                        onClick={toggleActive}
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9A84C] text-white shadow-md">
                                <span className="text-lg font-black">A</span>
                            </div>
                            <span className="text-lg font-bold tracking-tight text-[#1E3A5F]">
                                Agency<span className="text-[#C9A84C]">.</span>
                            </span>
                        </div>
                    </Link>

                    {/* Bouton de fermeture */}
                    <button
                        onClick={toggleActive}
                        className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-all duration-300 hover:bg-red-50 hover:text-red-500"
                        aria-label="Fermer le menu"
                    >
                        <LucideX className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                    </button>
                </div>

                {/* Contenu Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* Navigation Menu */}
                    <nav className="space-y-1">
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
                            const active = isActive(
                                '/' + (item.path === 'home' ? '' : item.path),
                            );

                            return (
                                <Link
                                    key={index}
                                    href={route(item.path)}
                                    onClick={toggleActive}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-300 ${
                                        active
                                            ? 'border-l-4 border-[#C9A84C] bg-[#C9A84C]/10 font-medium text-[#1E3A5F]'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#C9A84C]'
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Section Utilisateur */}
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        {user ? (
                            <div className="space-y-3">
                                {isBuyer ? (
                                    <Link
                                        href={route('profile')}
                                        onClick={toggleActive}
                                        className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 text-gray-700 transition-all duration-300 hover:bg-gray-100"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E3A5F]/10">
                                            <LucideUser className="h-5 w-5 text-[#1E3A5F]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Mon profil
                                            </p>
                                        </div>
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('dashboard')}
                                        onClick={toggleActive}
                                        className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 text-gray-700 transition-all duration-300 hover:bg-gray-100"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E3A5F]/10">
                                            <LucideUser className="h-5 w-5 text-[#1E3A5F]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Tableau de bord
                                            </p>
                                        </div>
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-lg bg-red-50 px-4 py-3 text-red-600 transition-all duration-300 hover:bg-red-100"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                        <LucideLogOut className="h-5 w-5 text-red-600" />
                                    </div>
                                    <span className="font-medium">
                                        {t('logout') || 'Déconnexion'}
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href={route('login')}
                                onClick={toggleActive}
                                className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 text-gray-700 transition-all duration-300 hover:bg-gray-100"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                    <LucideUser className="h-5 w-5 text-gray-600" />
                                </div>
                                <span className="font-medium">
                                    {t('login_register')}
                                </span>
                            </Link>
                        )}
                    </div>

                    {/* Section Actions */}
                    <div className="mt-6 space-y-3">
                        {user ? (
                            isBuyer ? (
                                <button
                                    onClick={() => {
                                        toggleActive();
                                        toggleSellerPopup();
                                    }}
                                    className="flex w-full transform items-center justify-between rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#A8882E] px-4 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
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
                                    className="flex w-full transform items-center justify-between rounded-lg bg-[#1E3A5F] px-4 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#152C47] hover:shadow-lg"
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
                                className="flex w-full transform items-center justify-between rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#A8882E] px-4 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
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

                {/* Pied de menu (Maintenu en bas) */}
                <div className="mt-auto border-t border-gray-100 bg-gray-50 p-6">
                    {/* Language Selector */}
                    <div className="mb-6 flex items-center justify-center gap-4">
                        {[
                            {
                                code: 'fr',
                                label: 'FR',
                                flag: '/assets/images/icons/fr.svg',
                            },
                            {
                                code: 'en',
                                label: 'EN',
                                flag: '/assets/images/icons/en.svg',
                            },
                        ].map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`flex items-center gap-2 rounded-xl border px-4 py-2 transition-all duration-300 ${
                                    i18n.language === lang.code
                                        ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C] shadow-sm'
                                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                            >
                                <img
                                    src={lang.flag}
                                    alt={lang.label}
                                    className="h-4 w-4 rounded-full object-cover"
                                />
                                <span className="text-xs font-semibold">
                                    {lang.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-6">
                        {/* Réseaux sociaux */}
                        <a href="#" className="text-gray-400 hover:text-[#C9A84C]">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-[#C9A84C]">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-[#C9A84C]">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                            </svg>
                        </a>
                    </div>
                    <p className="mt-4 text-center text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                        © 2024 Agency. Tous droits réservés.
                    </p>
                </div>
            </div>
        </>
    );
}
