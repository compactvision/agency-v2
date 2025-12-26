import ErrorText from '@/components/ui/ErrorText';
import { useForm } from '@inertiajs/react';
import {
    Award,
    Calendar,
    Camera,
    CheckCircle,
    Clock,
    Edit3,
    FileText,
    Globe,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Send,
    Shield,
    Star,
    User,
    UserCheck,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type User = {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    avatar?: string;
    role?: string;
    created_at?: string;
    bio?: string;
    website?: string;
    social_links?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };
};

export default function UserProfile({ user }: { user: User }) {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [activeTab, setActiveTab] = useState('about');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contact.send'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 5000);
            },
        });
    };

    const handleQuickContact = (field: string, value: string) => {
        setData(field, value);
    };

    const tabs = [
        { id: 'about', label: t('about') || 'À propos', icon: User },
        { id: 'contact', label: t('contact') || 'Contact', icon: Mail },
        { id: 'activity', label: t('activity') || 'Activité', icon: Clock },
    ];

    const socialLinks = [
        {
            name: 'Facebook',
            icon: 'fab fa-facebook-f',
            link: user?.social_links?.facebook,
        },
        {
            name: 'Twitter',
            icon: 'fab fa-twitter',
            link: user?.social_links?.twitter,
        },
        {
            name: 'LinkedIn',
            icon: 'fab fa-linkedin-in',
            link: user?.social_links?.linkedin,
        },
        {
            name: 'Instagram',
            icon: 'fab fa-instagram',
            link: user?.social_links?.instagram,
        },
    ].filter((social) => social.link);

    const recentActivities = [
        {
            icon: <Star size={16} />,
            title: t('added_to_favorites') || 'Ajouté aux favoris',
            description: 'Villa Moderne à Kinshasa',
            time: 'Il y a 2 heures',
            color: 'text-yellow-500',
        },
        {
            icon: <MessageSquare size={16} />,
            title: t('sent_message') || 'Message envoyé',
            description: 'Appartement 3 pièces à Gombe',
            time: 'Il y a 1 jour',
            color: 'text-blue-500',
        },
        {
            icon: <FileText size={16} />,
            title: t('submitted_inquiry') || 'Demande envoyée',
            description: 'Maison à Matete',
            time: 'Il y a 3 jours',
            color: 'text-green-500',
        },
        {
            icon: <UserCheck size={16} />,
            title: t('profile_updated') || 'Profil mis à jour',
            description: 'Informations personnelles',
            time: 'Il y a 1 semaine',
            color: 'text-purple-500',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 p-8 text-white">
                <div className="flex flex-col items-center gap-6 md:flex-row">
                    <div className="relative">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-32 w-32 rounded-full border-4 border-white/30 object-cover"
                            />
                        ) : (
                            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/20">
                                <User size={48} className="text-white" />
                            </div>
                        )}
                        <button className="absolute right-0 bottom-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-orange-600 shadow-lg transition-colors hover:bg-orange-50">
                            <Camera size={18} />
                        </button>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="mb-2 text-3xl font-bold">
                            {user?.name}
                        </h2>
                        <div className="mb-4 flex items-center justify-center gap-2 md:justify-start">
                            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                                {user?.role || 'Acheteur'}
                            </span>
                            {user?.created_at && (
                                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                                    {t('member_since')}{' '}
                                    {new Date(
                                        user.created_at,
                                    ).toLocaleDateString('fr-FR', {
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                            )}
                        </div>

                        {user?.bio && (
                            <p className="mb-4 max-w-2xl text-white/90">
                                {user.bio}
                            </p>
                        )}

                        <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                            {user?.address && (
                                <div className="flex items-center gap-2 text-white/80">
                                    <MapPin size={18} />
                                    <span>{user.address}</span>
                                </div>
                            )}
                            {user?.phone && (
                                <div className="flex items-center gap-2 text-white/80">
                                    <Phone size={18} />
                                    <span>{user.phone}</span>
                                </div>
                            )}
                            {user?.email && (
                                <div className="flex items-center gap-2 text-white/80">
                                    <Mail size={18} />
                                    <span>{user.email}</span>
                                </div>
                            )}
                            {user?.website && (
                                <div className="flex items-center gap-2 text-white/80">
                                    <Globe size={18} />
                                    <a
                                        href={user.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition-colors hover:text-white"
                                    >
                                        {user.website.replace(
                                            /^https?:\/\//,
                                            '',
                                        )}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-white/30"
                    >
                        <Edit3 size={18} />
                        <span>{t('edit_profile') || 'Modifier le profil'}</span>
                    </button>
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                    <div className="mt-6 flex justify-center gap-3 md:justify-start">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
                            >
                                <i className={social.icon}></i>
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabs Navigation */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className="flex border-b border-gray-200">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-1 items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-b-2 border-orange-600 bg-orange-50 text-orange-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <Icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="p-6">
                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                                    <User
                                        size={20}
                                        className="text-orange-600"
                                    />
                                    {t('personal_information') ||
                                        'Informations personnelles'}
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="rounded-xl bg-gray-50 p-4">
                                        <div className="mb-2 flex items-center gap-3">
                                            <Mail
                                                size={18}
                                                className="text-gray-400"
                                            />
                                            <span className="text-sm text-gray-500">
                                                {t('email') || 'Email'}
                                            </span>
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            {user?.email || 'Non renseigné'}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-4">
                                        <div className="mb-2 flex items-center gap-3">
                                            <Phone
                                                size={18}
                                                className="text-gray-400"
                                            />
                                            <span className="text-sm text-gray-500">
                                                {t('phone') || 'Téléphone'}
                                            </span>
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            {user?.phone || 'Non renseigné'}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-4">
                                        <div className="mb-2 flex items-center gap-3">
                                            <MapPin
                                                size={18}
                                                className="text-gray-400"
                                            />
                                            <span className="text-sm text-gray-500">
                                                {t('address') || 'Adresse'}
                                            </span>
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            {user?.address || 'Non renseignée'}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-4">
                                        <div className="mb-2 flex items-center gap-3">
                                            <Award
                                                size={18}
                                                className="text-gray-400"
                                            />
                                            <span className="text-sm text-gray-500">
                                                {t('role') || 'Rôle'}
                                            </span>
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            {user?.role || 'Acheteur'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                                    <Shield
                                        size={20}
                                        className="text-orange-600"
                                    />
                                    {t('account_security') ||
                                        'Sécurité du compte'}
                                </h3>
                                <div className="rounded-xl bg-gray-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {t('email_verification') ||
                                                    "Vérification de l'email"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {t(
                                                    'email_verification_status',
                                                ) ||
                                                    'Statut de vérification de votre email'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                                            <CheckCircle size={14} />
                                            {t('verified') || 'Vérifié'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                                    <Calendar
                                        size={20}
                                        className="text-orange-600"
                                    />
                                    {t('account_activity') ||
                                        'Activité du compte'}
                                </h3>
                                <div className="rounded-xl bg-gray-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {t('member_since') ||
                                                    'Membre depuis'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {t('join_date') ||
                                                    "Date d'inscription"}
                                            </p>
                                        </div>
                                        <div className="font-medium text-gray-900">
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
                                                : 'Non renseigné'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Tab */}
                    {activeTab === 'contact' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                                    <MessageSquare
                                        size={20}
                                        className="text-orange-600"
                                    />
                                    {t('send_message') || 'Envoyer un message'}
                                </h3>
                                <p className="mb-6 text-gray-600">
                                    {t('contact_form_description') ||
                                        'Utilisez ce formulaire pour nous contacter. Nous vous répondrons dans les plus brefs délais.'}
                                </p>
                            </div>

                            {showSuccessMessage && (
                                <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                                    <CheckCircle
                                        size={20}
                                        className="text-green-600"
                                    />
                                    <div>
                                        <p className="font-medium text-green-800">
                                            {t('message_sent') ||
                                                'Message envoyé'}
                                        </p>
                                        <p className="text-sm text-green-700">
                                            {t('message_sent_description') ||
                                                'Votre message a été envoyé avec succès. Nous vous répondrons bientôt.'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setShowSuccessMessage(false)
                                        }
                                        className="ml-auto text-green-600 hover:text-green-800"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            {t('name') || 'Nom'}
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <User
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                id="name"
                                                className="w-full rounded-xl border border-gray-300 py-3 pr-3 pl-10 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                                placeholder={
                                                    t('enter_name') ||
                                                    'Entrez votre nom'
                                                }
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <ErrorText error={errors.name} />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            {t('email') || 'Email'}
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Mail
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                className="w-full rounded-xl border border-gray-300 py-3 pr-3 pl-10 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                                placeholder={
                                                    t('enter_email') ||
                                                    'Entrez votre email'
                                                }
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <ErrorText error={errors.email} />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            {t('phone') || 'Téléphone'}
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Phone
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                type="tel"
                                                id="phone"
                                                className="w-full rounded-xl border border-gray-300 py-3 pr-3 pl-10 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                                placeholder={
                                                    t('enter_phone') ||
                                                    'Entrez votre téléphone'
                                                }
                                                value={data.phone}
                                                onChange={(e) =>
                                                    setData(
                                                        'phone',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <ErrorText error={errors.phone} />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            {t('subject') || 'Sujet'}
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <FileText
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                id="subject"
                                                className="w-full rounded-xl border border-gray-300 py-3 pr-3 pl-10 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                                placeholder={
                                                    t('enter_subject') ||
                                                    'Entrez le sujet'
                                                }
                                                value={data.subject}
                                                onChange={(e) =>
                                                    setData(
                                                        'subject',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <ErrorText error={errors.subject} />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        {t('message') || 'Message'}
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute top-3 left-3">
                                            <MessageSquare
                                                size={18}
                                                className="text-gray-400"
                                            />
                                        </div>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            className="w-full resize-none rounded-xl border border-gray-300 py-3 pr-3 pl-10 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                            placeholder={
                                                t('enter_message') ||
                                                'Entrez votre message'
                                            }
                                            value={data.message}
                                            onChange={(e) =>
                                                setData(
                                                    'message',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <ErrorText error={errors.message} />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        {t('save_info') ||
                                            'Enregistrer mes informations pour la prochaine fois'}
                                    </label>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <svg
                                                    className="mr-2 -ml-1 h-5 w-5 animate-spin text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                {t('sending') ||
                                                    'Envoi en cours'}
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                {t('send_message') ||
                                                    'Envoyer le message'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Activity Tab */}
                    {activeTab === 'activity' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                                    <Clock
                                        size={20}
                                        className="text-orange-600"
                                    />
                                    {t('recent_activity') || 'Activité récente'}
                                </h3>
                                <p className="mb-6 text-gray-600">
                                    {t('activity_description') ||
                                        'Voici vos activités récentes sur la plateforme.'}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {recentActivities.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                                    >
                                        <div
                                            className={`rounded-lg p-2 ${activity.color} bg-white`}
                                        >
                                            {activity.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">
                                                {activity.title}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {activity.description}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
