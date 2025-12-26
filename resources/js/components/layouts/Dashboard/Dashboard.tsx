import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X, Home, Building, Users, FileText, Settings, LogOut, Search, Bell, ChevronDown, User, Mail, Shield, Calendar, TrendingUp, BarChart3, Activity, CreditCard, MapPin, Phone, Globe, Star, Heart, Eye, Edit3, Camera, Package, MessageSquare, Clock, AlertCircle, CheckCircle, Filter, Grid, List, Plus, UserPlus } from 'lucide-react';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, Toaster } from 'sonner';
import Sidebar from './Sidebar';

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
    created_at: string;
}

interface DashboardStats {
    total_properties: number;
    favorite_properties: number;
    total_views: number;
    featured_properties: number;
    recent_views: number;
    new_messages: number;
    pending_requests: number;
}

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    created_at: string;
    read: boolean;
}

interface PageProps {
    auth: {
        user: User;
    };
    stats?: DashboardStats;
    notifications?: Notification[];
    flash?: {
        message?: string;
        error?: string;
        info?: string;
    };
}

const Dashboard = ({ children }: { children: ReactNode }) => {
    const { t } = useTranslation();
    const { auth, stats, notifications, flash } = usePage<PageProps>().props;
    const { user } = auth;
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLink, setActiveLink] = useState('overview');
    const [isScrolled, setIsScrolled] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    
    const containerRef = useRef<HTMLDivElement>(null);

    // Navigation items configuration
    const navigationItems = [
        { 
            id: 'overview', 
            label: t('overview'), 
            path: 'dashboard.index',
            icon: Home 
        },
        { 
            id: 'properties', 
            label: t('properties'), 
            path: 'dashboard.properties.index',
            icon: Building 
        },
        { 
            id: 'users', 
            label: t('users'), 
            path: 'dashboard.users.index',
            icon: Users 
        },
        { 
            id: 'settings', 
            label: t('settings'), 
            path: 'dashboard.settings',
            icon: Settings 
        },
    ];

    // Quick actions configuration
    const quickActions = [
        {
            id: 'new-property',
            label: t('new_property'),
            path: 'properties.create',
            icon: Plus,
            color: 'from-amber-400 to-amber-600'
        },
        {
            id: 'new-user',
            label: t('new_user'),
            path: 'users.create',
            icon: UserPlus,
            color: 'from-emerald-400 to-emerald-600'
        },
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

    // Handle scroll effect with throttling
    const handleScroll = useCallback(() => {
        const scrollY = window.scrollY;
        setIsScrolled(scrollY > 10);
    }, []);

    // Toggle sidebar
    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen((prev) => !prev);
    }, []);

    // Close sidebar
    const closeSidebar = useCallback(() => {
        setIsSidebarOpen(false);
    }, []);

    // Toggle sidebar collapse
    const toggleSidebarCollapse = useCallback(() => {
        if (!isMobile) {
            setIsSidebarCollapsed((prev) => !prev);
        }
    }, [isMobile]);

    // Toggle profile menu
    const toggleProfileMenu = useCallback(() => {
        setIsProfileMenuOpen((prev) => !prev);
        setIsNotificationsOpen(false);
    }, []);

    // Toggle notifications
    const toggleNotifications = useCallback(() => {
        setIsNotificationsOpen((prev) => !prev);
        setIsProfileMenuOpen(false);
    }, []);

    // Toggle search
    const toggleSearch = useCallback(() => {
        setIsSearchOpen((prev) => !prev);
    }, []);

    // Handle navigation click
    const handleNavClick = useCallback(
        (itemId, path, event) => {
            event.preventDefault();
            setActiveLink(itemId);
            
            // Navigate to the specified route
            router.visit(route(path));
        },
        []
    );

    // Handle profile menu click
    const handleProfileMenuClick = useCallback(
        (target, event) => {
            event.stopPropagation();
            setIsProfileMenuOpen(false);

            if (target === 'logout') {
                router.post(route('logout'));
                return;
            }

            router.visit(route(`dashboard.${target}`));
        },
        []
    );

    // Handle search
    const handleSearch = useCallback((e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.visit(route('search', { q: searchQuery }));
            setSearchQuery('');
            setIsSearchOpen(false);
        }
    }, [searchQuery]);

    // Handle escape key
    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === 'Escape') {
                setIsSidebarOpen(false);
                setIsProfileMenuOpen(false);
                setIsNotificationsOpen(false);
                setIsSearchOpen(false);
            }
        },
        []
    );

    // Handle click outside
    const handleClickOutside = useCallback(
        (event) => {
            if (isProfileMenuOpen && !event.target.closest('.profile-menu')) {
                setIsProfileMenuOpen(false);
            }
            if (isNotificationsOpen && !event.target.closest('.notifications-menu')) {
                setIsNotificationsOpen(false);
            }
            if (isSearchOpen && !event.target.closest('.search-container')) {
                setIsSearchOpen(false);
            }
        },
        [isProfileMenuOpen, isNotificationsOpen, isSearchOpen]
    );

    // Effects
    useEffect(() => {
        let ticking = false;

        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        return () => window.removeEventListener('scroll', throttledScroll);
    }, [handleScroll]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [handleKeyDown, handleClickOutside]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024 && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
            // Auto-collapse sidebar on mobile
            if (window.innerWidth < 768 && !isSidebarCollapsed) {
                setIsSidebarCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen, isSidebarCollapsed]);

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen]);

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.info) {
            toast.info(flash.info);
        }
    }, [flash]);

    useEffect(() => {
        if (notifications) {
            const unreadCount = notifications.filter(n => !n.read).length;
            setUnreadNotifications(unreadCount);
        }
    }, [notifications]);

    return (
        <div className="min-h-screen bg-white flex relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D6A643' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
            
            {/* Sidebar */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={closeSidebar}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={toggleSidebarCollapse}
            />
            
            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${
                isMobile ? 'ml-0' : isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
            } relative z-10`}>
                {/* Header - Responsive Parfait */}
                <header className={`
                    bg-white/80 backdrop-blur-xl shadow-lg shadow-amber-500/5 z-10 transition-all duration-500 
                    ${isScrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-4 lg:py-5'} 
                    sticky top-0 border-b border-amber-200/30
                    before:absolute before:inset-0 before:bg-gradient-to-r before:from-amber-400/5 before:via-transparent before:to-amber-400/5 before:pointer-events-none
                `}>
                    <div className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 relative">
                        <div className="flex items-center justify-between">
                            {/* Left side */}
                            <div className="flex items-center">
                                {/* Mobile menu toggle */}
                                <button
                                    onClick={toggleSidebar}
                                    className="p-2 sm:p-3 rounded-xl text-slate-600 hover:text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 lg:hidden transition-all duration-300 transform hover:scale-105"
                                    aria-label="Toggle sidebar"
                                >
                                    <Menu size={20} className="sm:w-6 sm:h-6" />
                                </button>
                                
                                {/* Logo */}
                                {/* <Link href="/" className="flex items-center ml-2 sm:ml-4 lg:ml-0 group">
                                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text group-hover:from-amber-600 group-hover:to-amber-700 transition-all duration-300">
                                        Agency
                                    </span>
                                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 ml-1 group-hover:text-slate-800 transition-colors duration-300">
                                        DRC
                                    </span>
                                </Link> */}
                            </div>

                            {/* Center - Desktop Navigation */}
                            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                                {navigationItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.id}
                                            href={route(item.path)}
                                            className={`
                                                px-2 lg:px-4 py-2 lg:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center
                                                ${activeLink === item.id
                                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30 transform scale-105'
                                                    : 'text-slate-600 hover:text-amber-700 hover:bg-amber-100/50'
                                                }
                                            `}
                                            onClick={(e) => handleNavClick(item.id, item.path, e)}
                                        >
                                            <Icon size={16} className="inline-block w-4 lg:w-5 mr-1 lg:mr-2" />
                                            <span className="hidden sm:inline">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Right side */}
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                {/* Search */}
                                <div className="relative">
                                    <button
                                        onClick={toggleSearch}
                                        className="p-2 sm:p-3 rounded-xl text-slate-600 hover:text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-all duration-300 transform hover:scale-105"
                                        aria-label="Search"
                                    >
                                        <Search size={18} className="sm:w-5 sm:h-5" />
                                    </button>
                                    
                                    {/* Search dropdown */}
                                    {isSearchOpen && (
                                        <div className="absolute right-0 mt-2 sm:mt-3 w-72 sm:w-96 bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl shadow-amber-500/10 border border-amber-200/50 p-3 sm:p-4 z-20">
                                            <form onSubmit={handleSearch}>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        placeholder={t('search_placeholder')}
                                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-9 sm:pl-12 border border-amber-200/50 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 bg-white/80 backdrop-blur-sm text-sm"
                                                        autoFocus
                                                    />
                                                    <Search className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>

                                {/* Notifications */}
                                <div className="relative">
                                    <button
                                        onClick={toggleNotifications}
                                        className="p-2 sm:p-3 rounded-xl text-slate-600 hover:text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 relative transition-all duration-300 transform hover:scale-105"
                                        aria-label="Notifications"
                                    >
                                        <Bell size={18} className="sm:w-5 sm:h-5" />
                                        {unreadNotifications > 0 && (
                                            <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
                                        )}
                                    </button>
                                    
                                    {/* Notifications dropdown */}
                                    {isNotificationsOpen && (
                                        <div className="absolute right-0 mt-2 sm:mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl shadow-amber-500/10 border border-amber-200/50 z-20">
                                            <div className="p-3 sm:p-4 border-b border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-transparent">
                                                <h3 className="font-bold text-slate-900 text-base sm:text-lg">{t('notifications')}</h3>
                                            </div>
                                            <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                                                {notifications && notifications.length > 0 ? (
                                                    notifications.slice(0, 5).map((notification) => (
                                                        <div key={notification.id} className="p-3 sm:p-4 border-b border-amber-100/30 last:border-b-0 hover:bg-amber-50/30 transition-colors duration-200">
                                                            <div className="flex items-start">
                                                                <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mt-1.5 mr-3 ${
                                                                    notification.type === 'success' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                                                                    notification.type === 'error' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                                                                    notification.type === 'warning' ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                                                                    'bg-gradient-to-r from-blue-400 to-blue-600'
                                                                } shadow-lg`}></div>
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                                                                    <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-6 sm:p-8 text-center text-slate-500">
                                                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-amber-100/50 flex items-center justify-center">
                                                            <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
                                                        </div>
                                                        <p className="text-sm font-medium">{t('no_notifications')}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-2 sm:p-3 text-center bg-gradient-to-b from-transparent to-amber-50/30">
                                                <Link
                                                    href={route('dashboard.notifications')}
                                                    className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors duration-200"
                                                >
                                                    {t('view_all')}
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Profile menu */}
                                <div className="relative">
                                    <button
                                        onClick={toggleProfileMenu}
                                        className="p-2 sm:p-3 rounded-xl text-slate-600 hover:text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-all duration-300 transform hover:scale-105"
                                        aria-label="Profile menu"
                                    >
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-amber-400/50"
                                            />
                                        ) : (
                                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                                <span className="text-white font-bold text-xs sm:text-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                    
                                    {/* Profile dropdown */}
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 sm:mt-3 w-56 sm:w-64 bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl shadow-amber-500/10 border border-amber-200/50 z-20 profile-menu">
                                            <div className="p-3 sm:p-4 border-b border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-transparent">
                                                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                                                <p className="text-xs text-slate-600 truncate">{user.email}</p>
                                            </div>
                                            <ul className="py-2">
                                                <li>
                                                    <button
                                                        onClick={(e) => handleProfileMenuClick('profile', e)}
                                                        className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium text-slate-700 hover:bg-amber-100/50 hover:text-amber-700 flex items-center transition-all duration-200"
                                                    >
                                                        <User size={16} className="mr-3" />
                                                        {t('profile')}
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={(e) => handleProfileMenuClick('settings', e)}
                                                        className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium text-slate-700 hover:bg-amber-100/50 hover:text-amber-700 flex items-center transition-all duration-200"
                                                    >
                                                        <Settings size={16} className="mr-3" />
                                                        {t('settings')}
                                                    </button>
                                                </li>
                                                <li className="border-t border-amber-200/50 mt-2 pt-2">
                                                    <button
                                                        onClick={(e) => handleProfileMenuClick('logout', e)}
                                                        className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium text-red-600 hover:bg-red-50/50 flex items-center transition-all duration-200"
                                                    >
                                                        <LogOut size={16} className="mr-3" />
                                                        {t('logout')}
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content - Responsive Parfait */}
                <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
                    <div className="w-full max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Toast Container */}
            <Toaster richColors position="top-right" />
        </div>
    );
};

export default Dashboard;