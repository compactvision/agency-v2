import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { usePage } from '@inertiajs/react';
import {
    Activity,
    Award,
    Briefcase,
    Building2,
    Calendar,
    Globe,
    Mail,
    MapPin,
    Phone,
    Shield,
    Star,
    Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Counts = { approved: number; pending: number; total: number };
type UserCounts = {
    approved_properties_count?: number;
    pending_properties_count?: number;
    total_properties_count?: number;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    profile_photo?: string;
    profile_photo_url?: string;
    email?: string;
    phone?: string;
    address?: string;
    company?: string;
    bio?: string;
    roles?: Array<{ name: string }>;
    created_at?: string;
    website?: string;
};

const Profile = () => {
    const { t, i18n } = useTranslation();
    const props = usePage().props as any;
    const user = props.user as UserCounts & { name?: string };
    const counts = props.counts as Counts;

    const approved = counts?.approved ?? user.approved_properties_count ?? 0;
    const pending = counts?.pending ?? user.pending_properties_count ?? 0;
    const total =
        counts?.total ?? user.total_properties_count ?? approved + pending;

    const getInitial = (name?: string) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return t('not_specified');
        return new Date(dateString).toLocaleDateString(
            i18n.resolvedLanguage === 'en' ? 'en-US' : 'fr-FR',
            {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            },
        );
    };

    const stats = [
        {
            label: t('properties'),
            value: total.toString(),
            icon: <Building2 size={20} />,
            color: 'from-slate-100 to-slate-100',
            bgColor: 'bg-slate-50',
            textColor: 'text-[#1E3A5F]',
        },
        {
            label: t('approved'),
            value: approved.toString(),
            icon: <Award size={20} />,
            color: 'from-emerald-400 to-emerald-600',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600',
        },
        {
            label: t('pending'),
            value: pending.toString(),
            icon: <Calendar size={20} />,
            color: 'from-blue-400 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
    ];

    const socialLinks = [
        {
            name: 'Facebook',
            icon: '📘',
            url: user.facebook,
            color: 'bg-blue-600',
        },
        { name: 'Twitter', icon: '🐦', url: user.twitter, color: 'bg-sky-500' },
        {
            name: 'LinkedIn',
            icon: '💼',
            url: user.linkedin,
            color: 'bg-blue-700',
        },
        {
            name: 'Instagram',
            icon: '📸',
            url: user.instagram,
            color: 'bg-pink-600',
        },
    ];

    const achievements = [
        {
            icon: <Star size={16} />,
            label: t('premium_member'),
            color: 'text-[#C9A84C]',
        },
        {
            icon: <Shield size={16} />,
            label: t('verified'),
            color: 'text-emerald-500',
        },
        {
            icon: <Zap size={16} />,
            label: t('active'),
            color: 'text-blue-500',
        },
    ];

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-50">
                <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <BackButton />
                        <div className="mt-6 text-center">
                            <h1 className="dashboard-page-title mb-2 text-4xl font-bold">
                                {t('my_profile')}
                            </h1>
                            <p className="text-lg text-slate-600">
                                {t('profile_welcome')}
                            </p>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 opacity-10"></div>
                        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-sm">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                    }}
                                ></div>
                            </div>

                            <div className="relative p-8">
                                <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
                                    {/* Avatar Section */}
                                    <div className="flex flex-col items-center">
                                        <div className="group relative">
                                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#A8882E] opacity-25 blur transition duration-300 group-hover:opacity-40"></div>
                                            {user?.profile_photo_url ? (
                                                <img
                                                    src={user.profile_photo_url}
                                                    alt={t('profile_photo')}
                                                    className="relative h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl lg:h-40 lg:w-40"
                                                />
                                            ) : (
                                                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#C9A84C] to-[#A8882E] text-4xl font-bold text-white shadow-xl lg:h-40 lg:w-40 lg:text-5xl">
                                                    {getInitial(user.name)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Status Badges */}
                                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                                            {achievements.map(
                                                (achievement, index) => (
                                                    <div
                                                        key={index}
                                                        className={`flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 ${achievement.color} text-sm font-medium`}
                                                    >
                                                        {achievement.icon}
                                                        <span>
                                                            {achievement.label}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 text-center lg:text-left">
                                        <h2 className="mb-2 text-3xl font-bold text-slate-900 lg:text-4xl">
                                            {user?.name || t('user')}
                                        </h2>
                                        <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start">
                                            <div className="rounded-full bg-gradient-to-r from-slate-100 to-slate-100 px-3 py-1 text-sm font-medium text-[#0d2340]">
                                                {user?.roles?.[0]?.name ||
                                                    t('member')}
                                            </div>
                                            <div className="flex items-center text-sm text-slate-500">
                                                <Calendar
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {t('member_since')}{' '}
                                                {formatDate(user?.created_at)}
                                            </div>
                                        </div>

                                        <p className="mb-6 max-w-2xl leading-relaxed text-slate-600">
                                            {user?.bio ||
                                                t('default_profile_bio')}
                                        </p>

                                        {/* Quick Info */}
                                        <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <MapPin
                                                    size={16}
                                                    className="text-[#C9A84C]"
                                                />
                                                <span>
                                                    {user?.address ||
                                                        t('not_specified')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Building2
                                                    size={16}
                                                    className="text-[#C9A84C]"
                                                />
                                                <span>
                                                    {user?.company ||
                                                        t('not_specified')}
                                                </span>
                                            </div>
                                            {user?.website && (
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Globe
                                                        size={16}
                                                        className="text-[#C9A84C]"
                                                    />
                                                    <a
                                                        href={user.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="transition-colors hover:text-[#1E3A5F]"
                                                    >
                                                        {t('website')}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    {stats.map((stat, index) => (
                                        <div
                                            key={index}
                                            className="group relative"
                                        >
                                            <div
                                                className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-10"
                                                style={{
                                                    backgroundImage: `linear-gradient(to right, ${stat.color})`,
                                                }}
                                            ></div>
                                            <div
                                                className={`relative ${stat.bgColor} rounded-2xl border border-slate-200 p-6`}
                                            >
                                                <div
                                                    className={`inline-flex rounded-xl bg-gradient-to-r p-3 ${stat.color} mb-4 text-white shadow-lg`}
                                                >
                                                    {stat.icon}
                                                </div>
                                                <div className="mb-1 text-3xl font-bold text-slate-900">
                                                    {stat.value}
                                                </div>
                                                <div className="font-medium text-slate-600">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Social Section */}
                    <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Contact Information */}
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-xl">
                            <div className="p-6">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#A8882E] text-white">
                                        <Mail size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {t('contact_information')}
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="group flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-colors hover:bg-slate-100">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E3A5F]/10 text-[#1E3A5F] transition-transform group-hover:scale-110">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <div className="mb-1 text-sm text-slate-500">
                                                {t('email')}
                                            </div>
                                            <a
                                                href={`mailto:${user?.email}`}
                                                className="font-medium text-slate-900 transition-colors hover:text-[#1E3A5F]"
                                            >
                                                {user?.email ||
                                                    t('not_specified')}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="group flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-colors hover:bg-slate-100">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E3A5F]/10 text-[#1E3A5F] transition-transform group-hover:scale-110">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <div className="mb-1 text-sm text-slate-500">
                                                {t('phone')}
                                            </div>
                                            <a
                                                href={`tel:${user?.phone}`}
                                                className="font-medium text-slate-900 transition-colors hover:text-[#1E3A5F]"
                                            >
                                                {user?.phone ||
                                                    t('not_specified')}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="group flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-slate-100">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E3A5F]/10 text-[#1E3A5F] transition-transform group-hover:scale-110">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <div className="mb-1 text-sm text-slate-500">
                                                {t('address')}
                                            </div>
                                            <div className="font-medium text-slate-900">
                                                {user?.address ||
                                                    t('not_specified')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-slate-100">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E3A5F]/10 text-[#1E3A5F] transition-transform group-hover:scale-110">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <div className="mb-1 text-sm text-slate-500">
                                                {t('company')}
                                            </div>
                                            <div className="font-medium text-slate-900">
                                                {user?.company ||
                                                    t('not_specified')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Networks */}
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-xl">
                            <div className="p-6">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#A8882E] text-white">
                                        <Globe size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {t('social_networks')}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                                                social.url
                                                    ? 'bg-gradient-to-br from-slate-50 to-slate-100 hover:-translate-y-1 hover:from-slate-100 hover:to-slate-100 hover:shadow-lg hover:shadow-sm'
                                                    : 'cursor-not-allowed bg-slate-50 opacity-60'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center text-center">
                                                <div
                                                    className={`h-14 w-14 rounded-xl ${social.color} mb-3 flex items-center justify-center text-2xl text-white shadow-lg transition-transform group-hover:scale-110`}
                                                >
                                                    {social.icon}
                                                </div>
                                                <div className="font-medium text-slate-900">
                                                    {social.name}
                                                </div>
                                                <div className="mt-1 text-xs text-slate-500">
                                                    {social.url
                                                        ? t('available')
                                                        : t('not_configured')}
                                                </div>
                                            </div>
                                            {social.url && (
                                                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                                                    <div className="h-2 w-2 rounded-full bg-white"></div>
                                                </div>
                                            )}
                                        </a>
                                    ))}
                                </div>

                                {/* Activity Stats */}
                                <div className="mt-6 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-100 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Activity
                                                className="text-[#1E3A5F]"
                                                size={20}
                                            />
                                            <span className="text-sm font-medium text-slate-700">
                                                {t('activity_level')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-2 w-2 rounded-full ${
                                                        level <= 3
                                                            ? 'bg-slate-500'
                                                            : 'bg-slate-200'
                                                    }`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Overview */}
                    {/* <div className="bg-white rounded-3xl shadow-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#A8882E] flex items-center justify-center text-white">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Aperçu des performances</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center text-white">
                    <TrendingUp size={20} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">+24%</div>
                  <div className="text-sm text-slate-600">Croissance mensuelle</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white">
                    <Users size={20} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">1.2k</div>
                  <div className="text-sm text-slate-600">Vues totales</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-slate-100 to-slate-100 rounded-2xl">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#A8882E] flex items-center justify-center text-white">
                    <Heart size={20} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">89</div>
                  <div className="text-sm text-slate-600">Favoris reçus</div>
                </div>
              </div>
            </div>
          </div> */}
                </div>
            </div>
        </Dashboard>
    );
};

export default Profile;
