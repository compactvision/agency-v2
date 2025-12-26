import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import NewsLetter from '@/components/ui/NewsLetter';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Activity,
    Building,
    Calendar,
    Camera,
    CheckCircle,
    Edit3,
    Eye,
    FileText,
    Heart,
    Home,
    Lock,
    LogOut,
    Mail,
    MapPin,
    Phone,
    Settings,
    Shield,
    Star,
    TrendingUp,
    User,
    Users,
    XCircle,
    Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { route } from 'ziggy-js';
import AccountDetails from './common/AccountDetails';
import ChangePassword from './common/ChangePassword';
import FavoriteProperties from './common/FavoriteProperties';
import UserProfile from './common/UserProfile';

interface User {
    id: number;
    name: string;
    email: string;
    phone: number;
    email_verified_at?: string;
    profile_photo?: string;
    role?: string;
    created_at: string;
}

interface Property {
    id: number;
    title: string;
    price: number;
    type: string;
    sale_type: string;
    is_published: boolean;
    is_featured: boolean;
    created_at: string;
    views: number;
    images: { url: string }[];
    municipality: { name: string };
}

interface DashboardStats {
    total_properties: number;
    favorite_properties: number;
    total_views: number;
    featured_properties: number;
}

interface PageProps {
    auth: {
        user: User;
    };
    properties: {
        data: Property[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    stats?: DashboardStats;
    flash?: {
        success?: string;
        error?: string;
    };
}

type TabType =
    | 'home'
    | 'profile'
    | 'address'
    | 'accountDetails'
    | 'favoriteProperties'
    | 'changePassword';

const VALID_TABS: TabType[] = [
    'home',
    'profile',
    'address',
    'accountDetails',
    'favoriteProperties',
    'changePassword',
];

export default function Profile() {
    const { auth, properties, stats, flash } = usePage<PageProps>().props;
    const { user } = auth;
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('home');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Récupération du tab actif depuis l'URL avec validation
    useEffect(() => {
        const hash = window.location.hash.replace('#', '') as TabType;
        if (hash && VALID_TABS.includes(hash)) {
            setActiveTab(hash);
        } else if (hash && !VALID_TABS.includes(hash)) {
            // Si le hash n'est pas valide, rediriger vers home
            window.history.replaceState(null, '', '#home');
            setActiveTab('home');
        }
    }, []);

    const handleTabChange = (tab: TabType) => {
        if (VALID_TABS.includes(tab)) {
            setActiveTab(tab);
            window.history.pushState(null, '', `#${tab}`);
            setShowMobileMenu(false);
        }
    };

    const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            confirm(
                t('confirm_logout') ||
                    'Êtes-vous sûr de vouloir vous déconnecter ?',
            )
        ) {
            setIsLoggingOut(true);
            try {
                router.post(
                    route('logout'),
                    {},
                    {
                        onFinish: () => setIsLoggingOut(false),
                        onError: () => setIsLoggingOut(false),
                    },
                );
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
                setIsLoggingOut(false);
            }
        }
    };

    // Statistiques avec valeurs par défaut et validation
    const dashboardStats = {
        total_properties: Math.max(0, stats?.total_properties || 0),
        favorite_properties: Math.max(
            0,
            stats?.favorite_properties || properties?.data?.length || 0,
        ),
        total_views: Math.max(0, stats?.total_views || 0),
        featured_properties: Math.max(0, stats?.featured_properties || 0),
    };

    const menuItems = [
        {
            id: 'home' as TabType,
            label: t('dashboard') || 'Tableau de bord',
            icon: Home,
            count: null,
        },
        {
            id: 'profile' as TabType,
            label: t('profile') || 'Profil',
            icon: User,
            count: null,
        },
        {
            id: 'accountDetails' as TabType,
            label: t('account_details') || 'Détails du compte',
            icon: Settings,
            count: null,
        },
        {
            id: 'favoriteProperties' as TabType,
            label: t('favorite_properties') || 'Propriétés favorites',
            icon: Heart,
            count: dashboardStats.favorite_properties,
        },
        {
            id: 'changePassword' as TabType,
            label: t('change_password') || 'Changer le mot de passe',
            icon: Lock,
            count: null,
        },
    ];

    const statCards = [
        {
            title: t('total_properties') || 'Total des propriétés',
            value: dashboardStats.total_properties,
            icon: Building,
            color: 'from-blue-500 to-blue-600',
            bgLight: 'bg-blue-50',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            change: '+12%',
            changeType: 'increase',
        },
        {
            title: t('favorite_properties') || 'Propriétés favorites',
            value: dashboardStats.favorite_properties,
            icon: Heart,
            color: 'from-red-500 to-red-600',
            bgLight: 'bg-red-50',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            change: '+5%',
            changeType: 'increase',
        },
        {
            title: t('total_views') || 'Vues totales',
            value: dashboardStats.total_views.toLocaleString('fr-FR'),
            icon: Eye,
            color: 'from-green-500 to-green-600',
            bgLight: 'bg-green-50',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            change: '+18%',
            changeType: 'increase',
        },
        {
            title: t('featured_properties') || 'Propriétés en vedette',
            value: dashboardStats.featured_properties,
            icon: Star,
            color: 'from-purple-500 to-purple-600',
            bgLight: 'bg-purple-50',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            change: '+2%',
            changeType: 'increase',
        },
    ];

    const recentActivities = [
        {
            icon: Heart,
            title: t('added_to_favorites') || 'Ajouté aux favoris',
            description: 'Villa Moderne à Kinshasa',
            time: 'Il y a 2 heures',
            color: 'text-red-500',
        },
        {
            icon: Eye,
            title: t('viewed_property') || 'Propriété consultée',
            description: 'Appartement 3 pièces à Gombe',
            time: 'Il y a 5 heures',
            color: 'text-blue-500',
        },
        {
            icon: MapPin,
            title: t('searched_location') || 'Localisation recherchée',
            description: 'Propriétés à Limete',
            time: 'Hier',
            color: 'text-green-500',
        },
        {
            icon: FileText,
            title: t('submitted_inquiry') || 'Demande envoyée',
            description: 'Maison à Matete',
            time: 'Il y a 2 jours',
            color: 'text-purple-500',
        },
    ];

    const quickActions = [
        {
            title: t('search_properties') || 'Rechercher des propriétés',
            description: t('browse_listings') || 'Parcourir nos annonces',
            icon: Building,
            color: 'from-blue-500 to-blue-600',
            action: () => router.visit(route('properties.index')),
        },
        {
            title: t('edit_profile') || 'Modifier le profil',
            description:
                t('update_personal_info') || 'Mettre à jour vos informations',
            icon: Edit3,
            color: 'from-purple-500 to-purple-600',
            action: () => handleTabChange('profile'),
        },
        {
            title: t('view_favorites') || 'Voir les favoris',
            description:
                t('manage_saved_properties') ||
                'Gérer vos propriétés enregistrées',
            icon: Heart,
            color: 'from-red-500 to-red-600',
            action: () => handleTabChange('favoriteProperties'),
        },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="space-y-6">
                        {/* Welcome Section */}
                        <div className="rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 p-8 text-white">
                            <div className="flex flex-col items-center justify-between md:flex-row">
                                <div>
                                    <h2 className="mb-2 text-3xl font-bold">
                                        {t('welcome_back') || 'Bienvenue'},{' '}
                                        {user?.name}!
                                    </h2>
                                    <p className="max-w-xl text-white/90">
                                        {t('dashboard_description') ||
                                            'Depuis votre tableau de bord, vous pouvez gérer vos propriétés favorites, modifier vos informations personnelles et suivre vos activités.'}
                                    </p>
                                </div>
                                <div className="mt-6 md:mt-0">
                                    <div className="rounded-2xl bg-white/20 p-6 text-center backdrop-blur-sm">
                                        <div className="mb-1 text-4xl font-bold">
                                            {user?.role || 'Acheteur'}
                                        </div>
                                        <div className="text-sm text-white/80">
                                            {t('status') || 'Statut'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {statCards.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={index}
                                        className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
                                    >
                                        <div className="p-6">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div
                                                    className={`rounded-xl p-3 ${stat.iconBg}`}
                                                >
                                                    <Icon
                                                        size={24}
                                                        className={
                                                            stat.iconColor
                                                        }
                                                    />
                                                </div>
                                                <div
                                                    className={`flex items-center text-sm font-medium ${
                                                        stat.changeType ===
                                                        'increase'
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    <TrendingUp
                                                        size={16}
                                                        className="mr-1"
                                                    />
                                                    {stat.change}
                                                </div>
                                            </div>
                                            <div className="mb-1 text-3xl font-bold text-gray-900">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {stat.title}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Quick Actions */}
                            <div className="lg:col-span-2">
                                <div className="rounded-2xl bg-white p-6 shadow-lg">
                                    <h3 className="mb-6 flex items-center text-xl font-bold text-gray-900">
                                        <Zap
                                            size={20}
                                            className="mr-2 text-orange-500"
                                        />
                                        {t('quick_actions') ||
                                            'Actions rapides'}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        {quickActions.map((action, index) => {
                                            const Icon = action.icon;
                                            return (
                                                <div
                                                    key={index}
                                                    className="group cursor-pointer rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                                                    onClick={action.action}
                                                >
                                                    <div
                                                        className={`h-12 w-12 rounded-lg bg-gradient-to-r ${action.color} mb-3 flex items-center justify-center transition-transform group-hover:scale-110`}
                                                    >
                                                        <Icon
                                                            size={20}
                                                            className="text-white"
                                                        />
                                                    </div>
                                                    <h4 className="mb-1 font-semibold text-gray-900">
                                                        {action.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {action.description}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activities */}
                            <div className="lg:col-span-1">
                                <div className="rounded-2xl bg-white p-6 shadow-lg">
                                    <h3 className="mb-6 flex items-center text-xl font-bold text-gray-900">
                                        <Activity
                                            size={20}
                                            className="mr-2 text-orange-500"
                                        />
                                        {t('recent_activities') ||
                                            'Activités récentes'}
                                    </h3>
                                    <div className="space-y-4">
                                        {recentActivities.map(
                                            (activity, index) => {
                                                const Icon = activity.icon;
                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <div
                                                            className={`rounded-lg bg-gray-100 p-2 ${activity.color}`}
                                                        >
                                                            <Icon size={16} />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="text-sm font-medium text-gray-900">
                                                                {activity.title}
                                                            </h4>
                                                            <p className="truncate text-xs text-gray-600">
                                                                {
                                                                    activity.description
                                                                }
                                                            </p>
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {activity.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="rounded-2xl bg-white p-6 shadow-lg">
                            <h3 className="mb-6 flex items-center text-xl font-bold text-gray-900">
                                <Users
                                    size={20}
                                    className="mr-2 text-orange-500"
                                />
                                {t('account_info') || 'Informations du compte'}
                            </h3>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Mail
                                            size={18}
                                            className="text-gray-400"
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                {t('email') || 'Email'}
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone
                                            size={18}
                                            className="text-gray-400"
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                {t('phone') || 'Téléphone'}
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {user?.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar
                                            size={18}
                                            className="text-gray-400"
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                {t('member_since') ||
                                                    'Membre depuis'}
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {user?.created_at
                                                    ? new Date(
                                                          user.created_at,
                                                      ).toLocaleDateString(
                                                          'fr-FR',
                                                          {
                                                              year: 'numeric',
                                                              month: 'long',
                                                              day: 'numeric',
                                                          },
                                                      )
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Shield
                                            size={18}
                                            className="text-gray-400"
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                {t('email_verified') ||
                                                    'Email vérifié'}
                                            </p>
                                            <p className="font-medium">
                                                {user?.email_verified_at ? (
                                                    <span className="flex items-center text-green-600">
                                                        <CheckCircle
                                                            size={16}
                                                            className="mr-1"
                                                        />
                                                        {t('verified') ||
                                                            'Vérifié'}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-yellow-600">
                                                        <XCircle
                                                            size={16}
                                                            className="mr-1"
                                                        />
                                                        {t('not_verified') ||
                                                            'Non vérifié'}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'profile':
                return <UserProfile user={user} />;
            case 'accountDetails':
                return <AccountDetails />;
            case 'favoriteProperties':
                return <FavoriteProperties properties={properties} />;
            case 'changePassword':
                return <ChangePassword />;
            default:
                return null;
        }
    };

    return (
        <App>
            <Head title="Mon profil" />
            <Breadcumb
                title={t('my_profile') || 'Mon profil'}
                homeLink={route('home')}
            />

            <section className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Messages flash */}
                    {flash?.success && (
                        <div className="mb-6 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4">
                            <div className="flex items-center">
                                <CheckCircle
                                    size={20}
                                    className="mr-3 text-green-600"
                                />
                                <p className="text-green-800">
                                    {flash.success}
                                </p>
                            </div>
                            <button className="text-green-600 hover:text-green-800">
                                <XCircle size={20} />
                            </button>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
                            <div className="flex items-center">
                                <XCircle
                                    size={20}
                                    className="mr-3 text-red-600"
                                />
                                <p className="text-red-800">{flash.error}</p>
                            </div>
                            <button className="text-red-600 hover:text-red-800">
                                <XCircle size={20} />
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col gap-6 lg:flex-row">
                        {/* Sidebar */}
                        <div className="w-full lg:w-1/4">
                            <div className="sticky top-6 overflow-hidden rounded-2xl bg-white shadow-lg">
                                {/* User Profile Card */}
                                <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-6 text-white">
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-4">
                                            {user?.profile_photo ? (
                                                <img
                                                    src={user.profile_photo}
                                                    alt={user.name}
                                                    className="h-24 w-24 rounded-full border-4 border-white/30 object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20">
                                                    <User
                                                        size={40}
                                                        className="text-white"
                                                    />
                                                </div>
                                            )}
                                            <button className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
                                                <Camera
                                                    size={16}
                                                    className="text-orange-600"
                                                />
                                            </button>
                                        </div>
                                        <h3 className="text-center text-xl font-bold">
                                            {user?.name}
                                        </h3>
                                        <p className="text-center text-white/80">
                                            {user?.email}
                                        </p>
                                        <div className="mt-4 rounded-full bg-white/20 px-3 py-1 text-center text-sm">
                                            {user?.role || 'Acheteur'}
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Menu */}
                                <nav className="p-4">
                                    <ul className="space-y-2">
                                        {menuItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <li key={item.id}>
                                                    <button
                                                        onClick={() =>
                                                            handleTabChange(
                                                                item.id,
                                                            )
                                                        }
                                                        className={`flex w-full items-center justify-between rounded-xl p-3 transition-colors ${
                                                            activeTab ===
                                                            item.id
                                                                ? 'bg-orange-50 text-orange-600'
                                                                : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        <div className="flex items-center">
                                                            <Icon
                                                                size={18}
                                                                className="mr-3"
                                                            />
                                                            <span>
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                        {item.count !==
                                                            null && (
                                                            <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700">
                                                                {item.count}
                                                            </span>
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    <hr className="my-4 border-gray-200" />

                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="flex w-full items-center justify-between rounded-xl p-3 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                                    >
                                        <div className="flex items-center">
                                            <LogOut
                                                size={18}
                                                className="mr-3"
                                            />
                                            <span>
                                                {isLoggingOut
                                                    ? t('logging_out') ||
                                                      'Déconnexion...'
                                                    : t('logout') ||
                                                      'Déconnexion'}
                                            </span>
                                        </div>
                                        {isLoggingOut && (
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                                        )}
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="w-full lg:w-3/4">
                            <div className="rounded-2xl bg-white p-6 shadow-lg">
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile Menu Toggle */}
            <div className="fixed right-6 bottom-6 z-50 lg:hidden">
                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg"
                >
                    {showMobileMenu ? (
                        <XCircle size={24} />
                    ) : (
                        <User size={24} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="fixed inset-0 z-40 flex items-end bg-black/50 lg:hidden">
                    <div className="animate-slide-up w-full rounded-t-3xl bg-white p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">
                                {t('menu') || 'Menu'}
                            </h3>
                            <button
                                onClick={() => setShowMobileMenu(false)}
                                className="rounded-lg p-2 hover:bg-gray-100"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <li key={item.id}>
                                        <button
                                            onClick={() =>
                                                handleTabChange(item.id)
                                            }
                                            className={`flex w-full items-center justify-between rounded-xl p-3 transition-colors ${
                                                activeTab === item.id
                                                    ? 'bg-orange-50 text-orange-600'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <Icon
                                                    size={18}
                                                    className="mr-3"
                                                />
                                                <span>{item.label}</span>
                                            </div>
                                            {item.count !== null && (
                                                <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700">
                                                    {item.count}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        <hr className="my-4 border-gray-200" />
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex w-full items-center justify-between rounded-xl p-3 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                        >
                            <div className="flex items-center">
                                <LogOut size={18} className="mr-3" />
                                <span>
                                    {isLoggingOut
                                        ? t('logging_out') || 'Déconnexion...'
                                        : t('logout') || 'Déconnexion'}
                                </span>
                            </div>
                            {isLoggingOut && (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                            )}
                        </button>
                    </div>
                </div>
            )}

            <NewsLetter />
        </App>
    );
}
