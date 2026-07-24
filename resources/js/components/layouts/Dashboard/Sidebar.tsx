import ProfileProgress from '@/components/ui/ProfileProgress';
import { computeProfileCompletion } from '@/utils/profileCompletion';
import { router, usePage } from '@inertiajs/react';
import {
    Archive,
    BarChart3,
    Building,
    Crown,
    FileText,
    Heart,
    LayoutDashboard,
    LogOut,
    MapPin,
    MessageSquare,
    Package,
    Plus,
    Receipt,
    Settings,
    Shield,
    User,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
import usePermission from '../../../hooks/usePermission';
import BrandLogo from '../../brand-logo';

export default function Sidebar({
    isOpen,
    onClose,
    isCollapsed,
    onToggleCollapse,
}: {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}) {
    const { url, component } = usePage();
    const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
    const { can, hasRole } = usePermission();
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const profileIsComplete =
        computeProfileCompletion(user ?? {}).percent >= 100;
    const { t } = useTranslation();

    // Déterminer l'élément actif basé sur la route actuelle
    useEffect(() => {
        const currentPath = url.startsWith('/') ? url.slice(1) : url;
        const routeName = component || '';

        // Mapping des routes vers les IDs des éléments de menu
        const routeToMenuId = {
            'Dashboard/Index': 'dashboard',
            'Dashboard/Users/Index': 'dashboard/users',
            'Dashboard/Users/Profile': 'profile',
            'Dashboard/Roles/Index': 'dashboard/roles',
            'Dashboard/Properties/Create': 'dashboard/new-property',
            'Dashboard/Properties/Index': 'properties',
            'Dashboard/Properties/Favorites': 'favorites',
            'Dashboard/Municipalities/Index': 'municipalities',
            'Dashboard/Plans/Index': 'plans',
            'Dashboard/Pages/Index': 'pages',
            'Dashboard/Payment-Requests/Index': 'transactions',
            'Dashboard/Chatbot-Logs/Index': 'chatbot',
            'Dashboard/Audit-Logs/Index': 'audit-logs',
            'Dashboard/Settings': 'settings',
            'Dashboard/Categories/Index': 'categories',
            'Dashboard/Amenities/Index': 'amenities',
            'Dashboard/Subscriptions/Index': 'subscription',
            'Dashboard/Analytics/Index': 'stats',
        } as Record<string, string>;

        // Déterminer l'élément actif
        let activeId = 'dashboard';

        if (routeToMenuId[routeName]) {
            activeId = routeToMenuId[routeName];
        } else if (
            currentPath.includes('users') &&
            !currentPath.includes('profile')
        ) {
            activeId = 'dashboard/users';
        } else if (currentPath.includes('profile')) {
            activeId = 'profile';
        } else if (currentPath.includes('roles')) {
            activeId = 'dashboard/roles';
        } else if (
            currentPath.includes('properties/create') ||
            currentPath.includes('new-property')
        ) {
            activeId = 'dashboard/new-property';
        } else if (currentPath.includes('properties/validation')) {
            activeId = 'dashboard/properties/validation';
        } else if (
            currentPath.includes('properties/favorites') ||
            currentPath.includes('favorites')
        ) {
            activeId = 'favorites';
        } else if (currentPath.includes('properties')) {
            activeId = 'properties';
        } else if (currentPath.includes('municipalities')) {
            activeId = 'municipalities';
        } else if (currentPath.includes('plans')) {
            activeId = 'plans';
        } else if (currentPath.includes('pages')) {
            activeId = 'pages';
        } else if (currentPath.includes('payment-requests')) {
            activeId = 'transactions';
        } else if (currentPath.includes('chatbot-logs')) {
            activeId = 'chatbot';
        } else if (currentPath.includes('audit-logs')) {
            activeId = 'audit-logs';
        } else if (currentPath.includes('settings')) {
            activeId = 'settings';
        } else if (currentPath.includes('categories')) {
            activeId = 'categories';
        } else if (currentPath.includes('amenities')) {
            activeId = 'amenities';
        } else if (currentPath.includes('subscription')) {
            activeId = 'subscription';
        } else if (
            currentPath.includes('analytics') ||
            currentPath.includes('stats')
        ) {
            activeId = 'stats';
        }

        setActiveMenuItem(activeId);
    }, [url, component]);

    const menuItems = [
        // SECTION PRINCIPALE
        {
            id: 'dashboard',
            label: t('overview'),
            icon: LayoutDashboard,
            description: t('dashboard'),
            route: 'dashboard',
            section: 'main',
        },
        {
            id: 'properties',
            label: t('properties'),
            icon: Building,
            description: t('manage_properties'),
            route: 'dashboard.properties.index',
            section: 'main',
            roles: ['admin', 'seller', 'agency', 'super-admin'],
            permission: 'property.view',
        },
        {
            id: 'search-properties',
            label: t('search'),
            icon: MapPin,
            description: t('find_properties_description'),
            route: 'properties',
            section: 'main',
            roles: ['buyer'],
        },
        {
            id: 'dashboard/users',
            label: t('users'),
            icon: Users,
            description: t('manage_users'),
            route: 'dashboard.users.index',
            section: 'main',
            roles: ['admin', 'super-admin'],
            permission: 'user.view',
        },
        {
            id: 'dashboard/roles',
            label: t('roles'),
            icon: Shield,
            description: t('manage_roles'),
            route: 'dashboard.roles.index',
            section: 'main',
            roles: ['admin', 'super-admin'],
            permission: 'role.view',
        },

        // PROPRIÉTÉS
        {
            id: 'dashboard/new-property',
            label: t('create_listing'),
            icon: Plus,
            description: t('add_property'),
            route: 'dashboard.properties.create',
            section: t('section_properties'),
            roles: ['admin', 'seller', 'agency', 'super-admin'],
            permission: 'property.create',
        },
        {
            id: 'dashboard/properties/validation',
            label: t('validation'),
            icon: FileText,
            description: t('validate_properties'),
            route: 'dashboard.properties.validation',
            section: t('section_properties'),
            roles: ['admin', 'super-admin'],
            permission: 'property.validate',
        },
        {
            id: 'favorites',
            label: t('my_favorites'),
            icon: Heart,
            description: t('my_favorites'),
            route: 'dashboard.properties.favorites',
            section: t('section_properties'),
            roles: ['admin', 'seller', 'agency', 'buyer', 'super-admin'],
            permission: 'property.favorites.view',
        },

        // ADMINISTRATION
        {
            id: 'municipalities',
            label: t('municipalities'),
            icon: MapPin,
            description: t('manage_municipalities'),
            route: 'dashboard.municipalities.index',
            section: t('section_admin'),
            roles: ['admin', 'super-admin'],
            permission: 'municipality.view',
        },
        {
            id: 'categories',
            label: t('categories'),
            icon: Building,
            description: t('manage_categories'),
            route: 'dashboard.categories.index',
            section: t('section_admin'),
            roles: ['admin', 'super-admin'],
            permission: 'category.view',
        },
        {
            id: 'amenities',
            label: t('amenities.amenities'),
            icon: Package,
            description: t('manage_amenities'),
            route: 'dashboard.amenities.index',
            section: t('section_admin'),
            roles: ['admin', 'super-admin'],
            permission: 'amenity.view',
        },
        {
            id: 'plans',
            label: t('plans'),
            icon: Package,
            description: t('manage_plans'),
            route: 'dashboard.plans.index',
            section: t('section_admin'),
            roles: ['admin', 'super-admin'],
            permission: 'plan.view',
        },
        {
            id: 'pages',
            label: t('pages'),
            icon: FileText,
            description: t('manage_pages'),
            route: 'dashboard.pages.index',
            section: t('section_admin'),
            roles: ['admin', 'super-admin'],
            permission: 'pages.view',
        },
        {
            id: 'transactions',
            label: t('transactions'),
            icon: Receipt,
            description: t('manage_transactions'),
            route: 'dashboard.payment-requests.index',
            section: t('section_admin'),
            roles: ['admin', 'super-admin'],
            permission: 'payment.view',
        },
        {
            id: 'audit-logs',
            label: t('audit_logs'),
            icon: Archive,
            description: t('audit_log_description'),
            route: 'dashboard.audit-logs.index',
            section: t('section_admin'),
            roles: ['admin', 'super-admin'],
            permission: 'audit-log.view',
        },
        {
            id: 'chatbot',
            label: t('chatbot'),
            icon: MessageSquare,
            description: t('chatbot_logs'),
            route: 'dashboard.chatbot-logs.index',
            section: t('section_admin'),
            roles: ['admin', 'super-admin'],
            permission: 'chatbot-log.view',
        },

        // PROFIL
        {
            id: 'profile',
            label: t('my_profile'),
            icon: User,
            description: t('my_profile'),
            route: 'dashboard.users.profile',
            section: t('section_profile'),
        },
        {
            id: 'settings',
            label: t('settings'),
            icon: Settings,
            description: t('settings'),
            route: 'dashboard.settings',
            section: t('section_profile'),
        },
        {
            id: 'subscription',
            label: t('my_package'),
            icon: Crown,
            description: t('my_subscription'),
            route: 'dashboard.subscriptions.index',
            section: t('section_profile'),
            roles: ['admin', 'seller', 'agency', 'super-admin'],
            permission: 'subscription.view',
        },

        // ANALYTICS
        {
            id: 'stats',
            label: t('statistics'),
            icon: BarChart3,
            description: t('detailed_statistics'),
            route: 'dashboard.analytics.index',
            section: t('section_analytics'),
            roles: ['admin', 'seller', 'agency', 'super-admin'],
            permission: 'analytics.statistics.view',
        },

        // LOGOUT
        {
            id: 'logout',
            label: t('log_out'),
            icon: LogOut,
            description: t('logout'),
            section: t('section_profile'),
        },
    ];

    // Filtrer les éléments de menu selon les rôles et les permissions
    const filteredMenuItems = menuItems.filter((item) => {
        // Si c'est un super-admin, il voit tout
        if (hasRole('super-admin')) return true;

        // Si l'item n'a ni rôles ni permissions définis, il est visible par tous (ex: dashboard, profil)
        if (!item.roles && !item.permission) return true;

        // Lorsqu'un rôle et une permission sont définis, les deux sont requis.
        // Cela évite qu'un simple nom de rôle contourne une permission retirée.
        if (item.roles && !hasRole(item.roles)) return false;
        if (item.permission && !can(item.permission)) return false;

        return true;
    });

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const handleMenuClick = (itemId: string, routeName: string) => {
        if (itemId === 'logout') {
            handleLogout();
            return;
        }

        if (itemId !== activeMenuItem) {
            setActiveMenuItem(itemId);
        }

        if (window.innerWidth < 1024) {
            onClose();
        }

        router.visit(route(routeName));
    };

    const groupedMenuItems = filteredMenuItems.reduce(
        (acc, item) => {
            if (!acc[item.section]) acc[item.section] = [];
            (acc[item.section] as any[]).push(item);
            return acc;
        },
        {} as Record<string, any[]>,
    );

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-[#0d2340]/20 backdrop-blur-md transition-all duration-500 ease-in-out lg:hidden ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} `}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`dashboard-sidebar fixed top-0 left-0 z-50 h-screen border-r border-slate-200 bg-white transition-all duration-500 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'} ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col shadow-2xl backdrop-blur-xl lg:shadow-none`}
            >
                {/* Header */}
                <div
                    className={`relative flex h-20 items-center border-b border-slate-100 bg-white ${isCollapsed ? 'justify-center px-2' : 'justify-between px-6'}`}
                >
                    <div
                        className={`flex items-center overflow-hidden ${isCollapsed ? 'justify-center' : 'space-x-4'}`}
                    >
                        <BrandLogo
                            markOnly
                            imageClassName={isCollapsed ? 'h-10' : 'h-12'}
                        />
                        <div
                            className={`transition-all duration-500 ease-in-out ${isCollapsed ? 'hidden' : 'translate-x-0 opacity-100'}`}
                        >
                            <h1 className="text-2xl font-bold text-[#413D3C] dark:text-[#EEEFE6]">
                                The{' '}
                                <span className="text-[#CF8E19]">Agency</span>
                            </h1>
                            <p className="text-xs font-medium text-[#C9A84C]">
                                {t('premium_dashboard')}
                            </p>
                        </div>
                    </div>

                    {/* Toggle Button - Desktop Only */}
                    <button
                        className={`hidden transform items-center justify-center text-slate-400 transition-all duration-300 hover:scale-105 hover:bg-slate-100 hover:text-[#0d2340] focus:ring-2 focus:ring-[#C9A84C] focus:outline-none lg:flex ${
                            isCollapsed
                                ? 'absolute top-1/2 -right-3 z-10 h-7 w-7 -translate-y-1/2 rounded-full border border-slate-200 bg-white shadow-md'
                                : 'h-10 w-10 rounded-xl focus:ring-offset-2'
                        }`}
                        onClick={onToggleCollapse}
                        aria-label={
                            isCollapsed
                                ? t('expand_sidebar')
                                : t('collapse_sidebar')
                        }
                    >
                        <svg
                            className={`h-6 w-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent flex-1 overflow-y-auto py-6">
                    <div
                        className={
                            isCollapsed ? 'space-y-3 px-3' : 'space-y-6 px-6'
                        }
                    >
                        {Object.entries(groupedMenuItems).map(
                            ([section, items]) => (
                                <div
                                    key={section}
                                    className={
                                        isCollapsed ? 'space-y-2' : 'space-y-1'
                                    }
                                >
                                    {/* Section Title */}
                                    {section !== 'main' && (
                                        <h3
                                            className={`mb-2 items-center text-xs font-bold tracking-widest text-slate-400 uppercase transition-all duration-500 ease-in-out ${isCollapsed ? 'hidden' : 'flex'}`}
                                        >
                                            <span className="mr-2 h-4 w-1 rounded-full bg-[#C9A84C]"></span>
                                            {section}
                                        </h3>
                                    )}

                                    {/* Menu Items */}
                                    <div className="space-y-1">
                                        {items.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    className={`dashboard-nav-item group/menu-item relative flex items-center rounded-xl transition-all duration-200 ease-out ${
                                                        isCollapsed
                                                            ? 'mx-auto h-11 w-11 justify-center p-0'
                                                            : 'w-full px-3 py-2.5'
                                                    }`}
                                                    data-collapsed={
                                                        isCollapsed
                                                            ? 'true'
                                                            : 'false'
                                                    }
                                                    data-active={
                                                        activeMenuItem ===
                                                        item.id
                                                            ? 'true'
                                                            : 'false'
                                                    }
                                                    onClick={() =>
                                                        handleMenuClick(
                                                            item.id,
                                                            item.route,
                                                        )
                                                    }
                                                    title={
                                                        isCollapsed
                                                            ? item.label
                                                            : undefined
                                                    }
                                                >
                                                    {/* Icon Container - Amélioré */}
                                                    <div
                                                        className={`dashboard-nav-icon flex flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${isCollapsed ? 'h-9 w-9' : 'mr-3 h-8 w-8'}`}
                                                    >
                                                        <Icon
                                                            size={
                                                                isCollapsed
                                                                    ? 18
                                                                    : 16
                                                            }
                                                            strokeWidth={2}
                                                        />
                                                    </div>

                                                    {/* Text Container */}
                                                    <div
                                                        className={`flex flex-col items-start transition-all duration-500 ease-in-out ${isCollapsed ? 'hidden' : 'opacity-100'}`}
                                                    >
                                                        <span className="text-left text-sm font-semibold">
                                                            {item.label}
                                                        </span>
                                                        {item.description && (
                                                            <span className="dashboard-nav-description mt-0.5 text-left text-xs">
                                                                {
                                                                    item.description
                                                                }
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Active Indicator */}
                                                    {activeMenuItem ===
                                                        item.id &&
                                                        !isCollapsed && (
                                                            <span className="ml-auto h-2 w-2 rounded-full bg-[#C9A84C] shadow-sm"></span>
                                                        )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                {/* Profile Progress Footer */}
                {!isCollapsed && !profileIsComplete && (
                    <div className="border-t border-slate-100 bg-white p-6">
                        <ProfileProgress user={user} />
                    </div>
                )}
            </aside>
        </>
    );
}
