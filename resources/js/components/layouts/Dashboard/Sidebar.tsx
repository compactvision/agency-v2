import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import usePermission from '@/hooks/usePermission';
import ProfileProgress from '@/components/ui/ProfileProgress';
import { 
    LayoutDashboard, 
    Building, 
    Users, 
    Shield, 
    Plus, 
    Heart, 
    MapPin, 
    FileText, 
    Receipt, 
    MessageSquare, 
    User, 
    Settings, 
    Crown, 
    BarChart3, 
    LogOut,
    Archive,
    Package} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: { isOpen: boolean; onClose: () => void; isCollapsed: boolean; onToggleCollapse: () => void }) {
    const { url, component } = usePage();
    const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
    const { can } = usePermission();
    const { auth } = usePage().props;
    const user = auth?.user;
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
            'Dashboard/Payment-Requests/Index': 'payment-requests',
            'Dashboard/Chatbot-Logs/Index': 'chatbot-logs',
            'Dashboard/Audit-Logs/Index': 'audit-logs',
            'Dashboard/Settings': 'settings',
            'Dashboard/Subscriptions/Index': 'subscription',
            'Dashboard/Analytics/Index': 'stats',
        };

        // Déterminer l'élément actif
        let activeId = 'dashboard';

        if (routeToMenuId[routeName]) {
            activeId = routeToMenuId[routeName];
        } else if (currentPath.includes('users') && !currentPath.includes('profile')) {
            activeId = 'dashboard/users';
        } else if (currentPath.includes('profile')) {
            activeId = 'profile';
        } else if (currentPath.includes('roles')) {
            activeId = 'dashboard/roles';
        } else if (currentPath.includes('properties/create') || currentPath.includes('new-property')) {
            activeId = 'dashboard/new-property';
        } else if (currentPath.includes('properties/favorites') || currentPath.includes('favorites')) {
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
            activeId = 'payment-requests';
        } else if (currentPath.includes('chatbot-logs')) {
            activeId = 'chatbot-logs';
        } else if (currentPath.includes('audit-logs')) {
            activeId = 'audit-logs';
        } else if (currentPath.includes('settings')) {
            activeId = 'settings';
        } else if (currentPath.includes('subscription')) {
            activeId = 'subscription';
        } else if (currentPath.includes('analytics') || currentPath.includes('stats')) {
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
            description: 'Tableau de bord',
            route: 'dashboard.index',
            section: 'main',
        },
        {
            id: 'properties',
            label: t('properties'),
            icon: Building,
            description: 'Gérer les propriétés',
            route: 'dashboard.properties.index',
            section: 'main',
            permission: 'property.view',
        },
        {
            id: 'dashboard/users',
            label: t('users'),
            icon: Users,
            description: 'Gérer les utilisateurs',
            route: 'dashboard.users.index',
            section: 'main',
            permission: 'user.view',
        },
        {
            id: 'dashboard/roles',
            label: t('roles'),
            icon: Shield,
            description: 'Gérer les rôles',
            route: 'dashboard.roles.index',
            section: 'main',
            permission: 'role.view',
        },

        // PROPRIÉTÉS
        {
            id: 'dashboard/new-property',
            label: t('create_listing'),
            icon: Plus,
            description: 'Ajouter une propriété',
            route: 'dashboard.properties.create',
            section: 'Propriétés',
            permission: 'property.create',
        },
        {
            id: 'favorites',
            label: t('my_favorites'),
            icon: Heart,
            description: 'Mes favoris',
            route: 'dashboard.properties.favorites',
            section: 'Propriétés',
            permission: 'property.favorites.view',
        },

        // ADMINISTRATION
        {
            id: 'municipalities',
            label: t('municipalities'),
            icon: MapPin,
            description: 'Gérer les municipalités',
            route: 'dashboard.municipalities.index',
            section: 'Admin',
            permission: 'municipality.view',
        },
        {
            id: 'plans',
            label: t('plans'),
            icon: Package,
            description: 'Gérer les plans',
            route: 'dashboard.plans.index',
            section: 'Admin',
            permission: 'plan.view',
        },
        {
            id: 'pages',
            label: t('pages'),
            icon: FileText,
            description: 'Gérer les pages',
            route: 'dashboard.pages.index',
            section: 'Admin',
            permission: 'pages.view',
        },
        {
            id: 'transactions',
            label: t('transactions'),
            icon: Receipt,
            description: 'Gérer les transactions',
            route: 'dashboard.payment-requests.index',
            section: 'Admin',
            permission: 'payment.view',
        },
        {
            id: 'audit-logs',
            label: t('audit_logs'),
            icon: Archive,
            description: 'Journaux d\'audit',
            route: 'dashboard.audit-logs.index',
            section: 'Admin',
            permission: 'audit-log.view',
        },
        {
            id: 'chatbot',
            label: t('chatbot'),
            icon: MessageSquare,
            description: 'Journaux du chatbot',
            route: 'dashboard.chatbot-logs.index',
            section: 'Admin',
            permission: 'chatbot-log.view',
        },

        // PROFIL
        {
            id: 'profile',
            label: t('my_profile'),
            icon: User,
            description: 'Mon profil',
            route: 'dashboard.users.profile',
            section: 'Profil',
        },
        {
            id: 'settings',
            label: t('settings'),
            icon: Settings,
            description: 'Paramètres',
            route: 'dashboard.settings',
            section: 'Profil',
        },
        {
            id: 'subscription',
            label: t('my_package'),
            icon: Crown,
            description: 'Mon abonnement',
            route: 'dashboard.subscriptions.index',
            section: 'Profil',
            permission: 'subscription.view',
        },

        // ANALYTICS
        {
            id: 'stats',
            label: 'Statistiques',
            icon: BarChart3,
            description: 'Statistiques détaillées',
            route: 'dashboard.analytics.index',
            section: 'Analytics',
            permission: 'analytics.statistics.view',
        },

        // LOGOUT
        {
            id: 'logout',
            label: t('log_out'),
            icon: LogOut,
            description: 'Se déconnecter',
            section: 'Profil',
        },
    ];

    // Filtrer les éléments de menu selon les permissions
    const filteredMenuItems = menuItems.filter(item => {
        if (!item.permission) return true;
        return can(item.permission);
    });

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const handleMenuClick = (itemId, routeName) => {
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

    const groupedMenuItems = filteredMenuItems.reduce((acc, item) => {
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
    }, {});

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`
                    fixed inset-0 z-40 lg:hidden
                    bg-gradient-to-br from-amber-900/20 to-amber-800/20 backdrop-blur-md
                    transition-all duration-500 ease-in-out
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen
                    bg-gradient-to-b from-amber-50 via-white to-amber-50/30
                    border-r border-amber-200/40
                    transition-all duration-500 ease-in-out
                    ${isCollapsed ? 'w-20' : 'w-72'}
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    shadow-2xl lg:shadow-none
                    flex flex-col
                    backdrop-blur-xl
                    before:absolute before:inset-0 before:bg-gradient-to-br before:from-amber-400/5 before:to-transparent before:pointer-events-none
                `}
            >
                {/* Header */}
                <div className="relative flex items-center justify-between h-20 px-6 border-b border-amber-200/40 bg-white/60 backdrop-blur-sm">
                    <div className="flex items-center space-x-4 overflow-hidden">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-amber-500/25 ring-2 ring-amber-500/20">
                            <LayoutDashboard size={24} />
                        </div>
                        <div className={`
                            transition-all duration-500 ease-in-out
                            ${isCollapsed ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
                        `}>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                                AgencyDRC
                            </h1>
                            <p className="text-xs text-amber-600/70 font-medium">Premium Dashboard</p>
                        </div>
                    </div>
                    
                    {/* Toggle Button - Desktop Only */}
                    <button
                        className="hidden lg:flex items-center justify-center
                            w-10 h-10 rounded-xl
                            text-amber-600/60 hover:text-amber-700 hover:bg-amber-100
                            transition-all duration-300 transform hover:scale-105
                            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        onClick={onToggleCollapse}
                        aria-label={isCollapsed ? 'Développer la barre latérale' : 'Réduire la barre latérale'}
                    >
                        <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent py-6">
                    <div className="px-6 space-y-6">
                        {Object.entries(groupedMenuItems).map(([section, items]) => (
                            <div key={section} className="space-y-1">
                                {/* Section Title */}
                                {section !== 'main' && (
                                    <h3 className={`
                                        text-xs font-bold text-amber-700/80 uppercase tracking-widest
                                        transition-all duration-500 ease-in-out
                                        ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto'}
                                        flex items-center mb-2
                                    `}>
                                        <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full mr-2"></span>
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
                                                className={`
                                                    w-full flex items-center
                                                    px-3 py-2.5 rounded-xl
                                                    transition-all duration-300 ease-in-out
                                                    group/menu-item relative
                                                    ${activeMenuItem === item.id
                                                        ? 'bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-800 shadow-lg shadow-amber-500/20 border border-amber-400/30 transform scale-[1.02]'
                                                        : 'text-slate-700 hover:bg-amber-100/50 hover:text-amber-800 hover:shadow-md hover:shadow-amber-500/10'
                                                    }
                                                    ${isCollapsed ? 'justify-center px-3 py-2.5' : ''}
                                                `}
                                                onClick={() => handleMenuClick(item.id, item.route)}
                                                title={isCollapsed ? item.label : undefined}
                                            >
                                                {/* Icon Container - Amélioré */}
                                                <div className={`
                                                    flex-shrink-0 flex items-center justify-center
                                                    w-8 h-8 rounded-lg
                                                    transition-all duration-300
                                                    ${activeMenuItem === item.id
                                                        ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30'
                                                        : 'bg-amber-100/50 text-amber-600 group-hover/menu-item:bg-amber-200/70 group-hover/menu-item:text-amber-700'
                                                    }
                                                    ${isCollapsed ? 'w-8 h-8' : 'w-8 h-8 mr-3'}
                                                `}>
                                                    <Icon size={16} />
                                                </div>

                                                {/* Text Container */}
                                                <div className={`
                                                    flex flex-col items-start
                                                    transition-all duration-500 ease-in-out
                                                    ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}
                                                `}>
                                                    <span className="font-semibold text-sm text-left">
                                                        {item.label}
                                                    </span>
                                                    {item.description && (
                                                        <span className="text-xs text-slate-500 mt-0.5 text-left">
                                                            {item.description}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Active Indicator */}
                                                {activeMenuItem === item.id && !isCollapsed && (
                                                    <span className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg shadow-amber-500/50 animate-pulse"></span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Profile Progress Footer */}
                {!isCollapsed && (
                    <div className="p-6 border-t border-amber-200/40 bg-gradient-to-b from-white/80 to-amber-50/60 backdrop-blur-sm">
                        <ProfileProgress user={user} />
                    </div>
                )}
            </aside>
        </>
    );
}