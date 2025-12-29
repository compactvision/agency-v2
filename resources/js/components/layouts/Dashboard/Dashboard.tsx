import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    BellRing,
    Building,
    ChevronDown,
    CreditCard,
    Home,
    LogOut,
    Mail,
    Menu,
    User,
    Users,
} from 'lucide-react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, Toaster } from 'sonner';
import Sidebar from './Sidebar';

declare function route(name: string, params?: any): string;

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
    created_at: string;
}

interface Notification {
    id: string;
    type: string;
    data: {
        title: string;
        message: string;
        action_url?: string;
    };
    read_at: string | null;
    created_at: string;
}

interface PageProps {
    auth: {
        user: User;
    };
    recentNotifications?: Notification[];
    flash?: {
        message?: string;
        error?: string;
        info?: string;
    };
}

const Dashboard = ({ children }: { children: ReactNode }) => {
    const { t } = useTranslation();
    const { auth, recentNotifications, flash } = usePage<PageProps>().props;
    const { user } = auth;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Public Header Links
    const publicLinks = [
        { label: t('home'), path: 'home', icon: Home },
        { label: t('properties'), path: 'properties', icon: Building },
        { label: t('about'), path: 'about', icon: Users },
        { label: t('pricing'), path: 'tarifs', icon: CreditCard },
        { label: t('contact'), path: 'contact', icon: Mail },
    ];

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleScroll = useCallback(() => {
        setIsScrolled(window.scrollY > 10);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);
    const toggleProfileMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsProfileMenuOpen((prev) => !prev);
        setIsNotificationsOpen(false);
    };
    const toggleNotifications = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsNotificationsOpen((prev) => !prev);
        setIsProfileMenuOpen(false);
    };

    const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        router.post(
            route('dashboard.notifications.mark-read', id),
            {},
            { preserveScroll: true },
        );
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const unreadCount =
        recentNotifications?.filter((n) => !n.read_at).length || 0;

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isProfileMenuOpen &&
                !(event.target as Element).closest('.profile-menu')
            )
                setIsProfileMenuOpen(false);
            if (
                isNotificationsOpen &&
                !(event.target as Element).closest('.notifications-menu')
            )
                setIsNotificationsOpen(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isProfileMenuOpen, isNotificationsOpen]);

    useEffect(() => {
        if (flash?.message) toast.success(flash.message);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <div className="relative flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Background Pattern */}
            <div className="bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'\>%3Cg fill=\'none\' fill-rule=\'evenodd\'\>%3Cg fill=\'%23D6A643\' fill-opacity=\'0.05\'\>%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none absolute inset-0 opacity-30"></div>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() =>
                    !isMobile && setIsSidebarCollapsed(!isSidebarCollapsed)
                }
            />

            <div
                className={`flex flex-1 flex-col transition-all duration-500 ease-in-out ${
                    isMobile
                        ? 'ml-0'
                        : isSidebarCollapsed
                          ? 'lg:ml-20'
                          : 'lg:ml-72'
                } relative z-10`}
            >
                {/* Header */}
                <header
                    className={`sticky top-0 z-20 border-b border-amber-200/20 bg-white/80 backdrop-blur-xl transition-all duration-300 ${isScrolled ? 'py-2 shadow-md' : 'py-4'} `}
                >
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between gap-4">
                            {/* Mobile Toggle & Logo Placeholder */}
                            <div className="flex items-center lg:hidden">
                                <button
                                    onClick={toggleSidebar}
                                    className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-amber-100/50"
                                >
                                    <Menu size={24} />
                                </button>
                            </div>

                            {/* Public Navigation Links (Desktop) */}
                            <nav className="hidden items-center space-x-1 xl:flex">
                                {publicLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        href={route(link.path)}
                                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-amber-50 hover:text-amber-600"
                                    >
                                        <link.icon
                                            size={16}
                                            className="text-amber-500/70"
                                        />
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Right Actions */}
                            <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
                                {/* Notifications */}
                                <div className="notifications-menu relative">
                                    <button
                                        onClick={toggleNotifications}
                                        className="group relative rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 transition-all hover:border-amber-400 hover:text-amber-600"
                                    >
                                        <Bell
                                            size={20}
                                            className="transition-transform group-hover:rotate-12"
                                        />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-lg ring-4 ring-white">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {isNotificationsOpen && (
                                        <div className="absolute right-0 mt-3 w-80 animate-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 fade-in slide-in-from-top-2 sm:w-96">
                                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
                                                <h3 className="flex items-center gap-2 font-bold text-slate-800">
                                                    <BellRing
                                                        size={18}
                                                        className="text-amber-500"
                                                    />
                                                    {t('notifications')}
                                                </h3>
                                                {unreadCount > 0 && (
                                                    <button
                                                        onClick={() =>
                                                            router.post(
                                                                route(
                                                                    'dashboard.notifications.mark-all-read',
                                                                ),
                                                            )
                                                        }
                                                        className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                                                    >
                                                        {t('mark_all_as_read')}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="max-h-[400px] overflow-y-auto">
                                                {recentNotifications &&
                                                recentNotifications.length >
                                                    0 ? (
                                                    recentNotifications.map(
                                                        (notif) => (
                                                            <div
                                                                key={notif.id}
                                                                className={`group cursor-pointer border-b border-slate-50 p-4 transition-colors hover:bg-slate-50 ${!notif.read_at ? 'bg-amber-50/30' : ''}`}
                                                                onClick={() =>
                                                                    notif.data
                                                                        .action_url &&
                                                                    router.visit(
                                                                        notif
                                                                            .data
                                                                            .action_url,
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex gap-3">
                                                                    <div
                                                                        className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${!notif.read_at ? 'bg-amber-500' : 'bg-slate-300'}`}
                                                                    />
                                                                    <div className="flex-1">
                                                                        <div className="mb-1 flex items-start justify-between">
                                                                            <h4 className="text-sm font-bold text-slate-800">
                                                                                {
                                                                                    notif
                                                                                        .data
                                                                                        .title
                                                                                }
                                                                            </h4>
                                                                            <span className="text-[10px] font-medium text-slate-400">
                                                                                {new Date(
                                                                                    notif.created_at,
                                                                                ).toLocaleDateString()}
                                                                            </span>
                                                                        </div>
                                                                        <p className="mb-2 text-xs leading-relaxed text-slate-600">
                                                                            {
                                                                                notif
                                                                                    .data
                                                                                    .message
                                                                            }
                                                                        </p>
                                                                        {!notif.read_at && (
                                                                            <button
                                                                                onClick={(
                                                                                    e,
                                                                                ) =>
                                                                                    handleMarkAsRead(
                                                                                        notif.id,
                                                                                        e,
                                                                                    )
                                                                                }
                                                                                className="text-[10px] font-bold tracking-wider text-amber-600 uppercase hover:text-amber-700"
                                                                            >
                                                                                {t(
                                                                                    'mark_as_read',
                                                                                )}
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )
                                                ) : (
                                                    <div className="px-6 py-12 text-center">
                                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                                            <Bell
                                                                className="text-slate-300"
                                                                size={32}
                                                            />
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-500">
                                                            {t(
                                                                'no_notifications_yet',
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <Link
                                                href={route(
                                                    'dashboard.notifications',
                                                )}
                                                className="block border-t border-slate-100 p-3 text-center text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-amber-600"
                                            >
                                                {t('view_all_notifications')}
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* User Profile Submenu */}
                                <div className="profile-menu relative">
                                    <button
                                        onClick={toggleProfileMenu}
                                        className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 pl-3 transition-all hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/5"
                                    >
                                        <div className="hidden text-right sm:block">
                                            <p className="line-clamp-1 text-xs font-bold text-slate-800">
                                                {user.name}
                                            </p>
                                            <p className="text-[10px] font-medium text-slate-400">
                                                Tableau de bord
                                            </p>
                                        </div>
                                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 font-bold text-white shadow-lg ring-2 shadow-amber-500/20 ring-white">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                user.name
                                                    .charAt(0)
                                                    .toUpperCase()
                                            )}
                                        </div>
                                        <ChevronDown
                                            size={14}
                                            className={`text-slate-400 transition-transform group-hover:text-amber-500 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {isProfileMenuOpen && (
                                        <div className="scale-in-95 absolute right-0 mt-3 w-64 origin-top-right animate-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 fade-in">
                                            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 p-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 font-bold text-amber-600">
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-bold text-slate-800">
                                                        {user.name}
                                                    </p>
                                                    <p className="truncate text-[10px] text-slate-500">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                <Link
                                                    href={route('home')}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-amber-50 hover:text-amber-600"
                                                >
                                                    <Home size={18} />
                                                    {t('home')}
                                                </Link>
                                                {/* <Link
                                                    href={route(
                                                        'dashboard.profile',
                                                    )}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-amber-50 hover:text-amber-600"
                                                >
                                                    <User size={18} />
                                                    Profil
                                                </Link> */}
                                                <div className="my-2 h-px bg-slate-100" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                                                >
                                                    <LogOut size={18} />
                                                    {t('logout')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-[1600px]">{children}</div>
                </main>
            </div>

            <Toaster richColors position="top-right" />
        </div>
    );
};

export default Dashboard;
