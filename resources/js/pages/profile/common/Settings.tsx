import { useForm, usePage } from '@inertiajs/react';
import {
    Bell,
    CheckCircle,
    Globe,
    Loader2,
    Lock,
    Mail,
    Save,
    Shield,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChangePassword from './ChangePassword';

interface NewsletterSubscription {
    is_active: boolean;
}

interface User {
    id: number;
    name: string;
    email: string;
    language?: string;
    notifications_enabled?: boolean;
    newsletter_subscription?: NewsletterSubscription;
}

interface PageProps {
    [key: string]: unknown;
    auth: { user: User };
    flash?: { success?: string; error?: string };
}

type SettingsTab = 'password' | 'language' | 'notifications';

/* ────────── Toggle Switch Component ────────── */
function Toggle({
    value,
    onChange,
    disabled = false,
}: {
    value: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(!value)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                value ? 'bg-[#C9A84C]' : 'bg-gray-200'
            }`}
            aria-checked={value}
            role="switch"
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    value ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
        </button>
    );
}

/* ────────── Settings Row Component ────────── */
function PreferenceRow({
    icon,
    iconBg,
    title,
    description,
    children,
}: {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                >
                    {icon}
                </div>
                <div>
                    <p className="font-semibold text-gray-900">{title}</p>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}

export default function Settings() {
    const { t, i18n } = useTranslation();
    const { auth, flash } = usePage<PageProps>().props;
    const { user } = auth;
    const [activeTab, setActiveTab] = useState<SettingsTab>('password');
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, processing } = useForm({
        // Required by ProfileUpdateRequest
        name: user.name ?? '',
        email: user.email ?? '',
        // Preference fields
        language: user.language ?? 'fr',
        notifications_enabled: user.notifications_enabled ?? true,
        newsletter: user.newsletter_subscription?.is_active ?? false,
    });

    // Show success toast when flash message arrives
    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                i18n.changeLanguage(data.language);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 4000);
            },
        });
    };

    const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
        {
            id: 'password',
            label: t('password') || 'Mot de passe',
            icon: <Lock size={16} />,
        },
        {
            id: 'language',
            label: t('language') || 'Langue',
            icon: <Globe size={16} />,
        },
        {
            id: 'notifications',
            label: t('notifications') || 'Notifications',
            icon: <Bell size={16} />,
        },
    ];

    const hasEmail = !!user.email;

    return (
        <div className="space-y-6">
            {/* Success Toast */}
            {showSuccess && (
                <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm">
                    <CheckCircle
                        size={20}
                        className="shrink-0 text-green-500"
                    />
                    <p className="flex-1 text-sm font-medium text-green-800">
                        {flash?.success ||
                            t('save_preferences') ||
                            'Préférences enregistrées avec succès !'}
                    </p>
                    <button
                        onClick={() => setShowSuccess(false)}
                        className="text-green-500 hover:text-green-700"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-1 rounded-2xl bg-gray-100 p-1.5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                                ? 'bg-white text-slate-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* ── Password Tab ── */}
            {activeTab === 'password' && <ChangePassword />}

            {/* ── Language Tab ── */}
            {activeTab === 'language' && (
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        {/* Header */}
                        <div className="border-b border-gray-100 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        {t('language_preferences') ||
                                            'Préférences de langue'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {t('choose_language_description') ||
                                            "Choisissez la langue de l'application."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Language Cards */}
                        <div className="grid grid-cols-2 gap-4 p-6">
                            {[
                                {
                                    code: 'fr',
                                    flag: '🇫🇷',
                                    label: 'Français',
                                    sublabel: 'French',
                                },
                                {
                                    code: 'en',
                                    flag: '🇺🇸',
                                    label: 'English',
                                    sublabel: 'Anglais',
                                },
                            ].map((lang) => (
                                <button
                                    key={lang.code}
                                    type="button"
                                    onClick={() =>
                                        setData('language', lang.code)
                                    }
                                    className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all duration-200 ${
                                        data.language === lang.code
                                            ? 'border-[#C9A84C] bg-slate-50 shadow-md'
                                            : 'border-gray-200 hover:border-slate-200 hover:bg-gray-50'
                                    }`}
                                >
                                    {data.language === lang.code && (
                                        <span className="absolute top-3 right-3">
                                            <CheckCircle
                                                size={18}
                                                className="text-[#C9A84C]"
                                            />
                                        </span>
                                    )}
                                    <span className="text-4xl">
                                        {lang.flag}
                                    </span>
                                    <div className="text-center">
                                        <p
                                            className={`font-semibold ${data.language === lang.code ? 'text-[#0d2340]' : 'text-gray-800'}`}
                                        >
                                            {lang.label}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {lang.sublabel}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-slate-600 py-3 font-semibold text-white shadow-sm transition-all hover:from-slate-600 hover:to-[#0d2340] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        {processing
                            ? t('updating_label') || 'Enregistrement...'
                            : t('save_preferences') ||
                              'Enregistrer les préférences'}
                    </button>
                </form>
            )}

            {/* ── Notifications Tab ── */}
            {activeTab === 'notifications' && (
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        {/* Header */}
                        <div className="border-b border-gray-100 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        {t('notification_settings') ||
                                            'Paramètres de notification'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {t(
                                            'manage_notifications_description',
                                        ) ||
                                            'Gérez vos préférences de notification.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 p-6">
                            {/* Push Notifications */}
                            <PreferenceRow
                                icon={
                                    <Bell size={20} className="text-blue-600" />
                                }
                                iconBg="bg-blue-100"
                                title={
                                    t('push_notifications') ||
                                    'Notifications Push'
                                }
                                description={
                                    t('push_notifications_desc') ||
                                    'Recevez des alertes en temps réel'
                                }
                            >
                                <Toggle
                                    value={data.notifications_enabled}
                                    onChange={(v) =>
                                        setData('notifications_enabled', v)
                                    }
                                    disabled={processing}
                                />
                            </PreferenceRow>

                            {/* Newsletter — only shown if user has email */}
                            {hasEmail && (
                                <PreferenceRow
                                    icon={
                                        <Mail
                                            size={20}
                                            className="text-green-600"
                                        />
                                    }
                                    iconBg="bg-green-100"
                                    title={t('newsletter_sub') || 'Newsletter'}
                                    description={
                                        data.newsletter
                                            ? t('subscribed') ||
                                              'Abonné(e) à la newsletter'
                                            : t('not_subscribed') ||
                                              'Non abonné(e) à la newsletter'
                                    }
                                >
                                    <Toggle
                                        value={data.newsletter}
                                        onChange={(v) =>
                                            setData('newsletter', v)
                                        }
                                        disabled={processing}
                                    />
                                </PreferenceRow>
                            )}
                        </div>
                    </div>

                    {/* Security note */}
                    <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                        <Shield
                            size={16}
                            className="mt-0.5 shrink-0 text-blue-500"
                        />
                        <p className="text-xs text-blue-700">
                            {t('settings_security_info') ||
                                'Vos préférences sont enregistrées de manière sécurisée.'}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-slate-600 py-3 font-semibold text-white shadow-sm transition-all hover:from-slate-600 hover:to-[#0d2340] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        {processing
                            ? t('updating_label') || 'Enregistrement...'
                            : t('save_preferences') || 'Enregistrer'}
                    </button>
                </form>
            )}
        </div>
    );
}
