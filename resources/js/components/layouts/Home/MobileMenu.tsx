import { Link, usePage } from '@inertiajs/react';
import {
    LucideArrowRight,
    LucideBuilding,
    LucideDollarSign,
    LucideHome,
    LucideInfo,
    LucidePhone,
    LucidePlus,
    LucideUser,
    LucideX,
} from 'lucide-react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
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
    const user = usePage().props.auth?.user;
    const { url } = usePage();

    const isPropertiesActive = url.startsWith('/properties');
    const isActive = (path: string) =>
        url === path || url.startsWith(path + '/');

    const userRoles =
        user?.roles?.map((r: any) => (typeof r === 'string' ? r : r.name)) ??
        [];
    const isBuyer = userRoles.includes('Buyer');
    const isSeller =
        userRoles.includes('Simple_seller') ||
        userRoles.includes('Agency') ||
        userRoles.includes('Admin');

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
                className={`fixed top-0 left-0 z-50 h-full w-80 transform overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
                    active ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Bouton de fermeture */}
                <button
                    onClick={toggleActive}
                    className="group absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-300 hover:bg-gray-900 hover:text-white"
                    aria-label="Fermer le menu"
                >
                    <LucideX className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                </button>

                <div className="p-6 pb-20">
                    {/* Logo */}
                    <Link
                        href={route('home')}
                        className="mb-8 inline-block transition-transform duration-300 hover:scale-105"
                        onClick={toggleActive}
                    >
                        <img
                            src="/assets/images/logo/logo1.svg"
                            alt="Logo"
                            className="h-12 w-auto"
                        />
                    </Link>

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
                                            ? 'border-l-4 border-amber-500 bg-amber-50 font-medium text-amber-600'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-amber-600'
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
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                                            <LucideUser className="h-5 w-5 text-amber-600" />
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
                                        href={route('dashboard.index')}
                                        onClick={toggleActive}
                                        className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 text-gray-700 transition-all duration-300 hover:bg-gray-100"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                                            <LucideUser className="h-5 w-5 text-amber-600" />
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
                                    className="flex w-full transform items-center justify-between rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:from-amber-500 hover:to-amber-600 hover:shadow-lg"
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
                                    className="flex w-full transform items-center justify-between rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:from-emerald-500 hover:to-emerald-600 hover:shadow-lg"
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
                                className="flex w-full transform items-center justify-between rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:from-amber-500 hover:to-amber-600 hover:shadow-lg"
                            >
                                <span className="flex items-center gap-2">
                                    <LucidePlus className="h-5 w-5" />
                                    {t('become_seller')}
                                </span>
                                <LucideArrowRight className="h-4 w-4" />
                            </Link>
                        )}
                    </div>

                    {/* Pied de menu */}
                    <div className="absolute right-0 bottom-0 left-0 border-t border-gray-200 bg-gray-50 p-6">
                        <div className="flex items-center justify-center gap-4">
                            <a
                                href="#"
                                className="text-gray-400 transition-colors duration-300 hover:text-amber-500"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 transition-colors duration-300 hover:text-amber-500"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 transition-colors duration-300 hover:text-amber-500"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 transition-colors duration-300 hover:text-amber-500"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                                </svg>
                            </a>
                        </div>
                        <p className="mt-4 text-center text-xs text-gray-500">
                            © 2023 Votre Entreprise. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
