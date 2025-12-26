import ErrorText from '@/components/ui/ErrorText';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
    User,
    MapPin,
    Phone,
    Mail,
    Edit3,
    Send,
    CheckCircle,
    Calendar,
    Award,
    Camera,
    MessageSquare,
    Star,
    Briefcase,
    Globe,
    Shield,
    Clock,
    Check,
    X,
    Upload,
    FileText,
    Sparkles,
    UserCheck,
} from 'lucide-react';

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
        { name: 'Facebook', icon: 'fab fa-facebook-f', link: user.social_links?.facebook },
        { name: 'Twitter', icon: 'fab fa-twitter', link: user.social_links?.twitter },
        { name: 'LinkedIn', icon: 'fab fa-linkedin-in', link: user.social_links?.linkedin },
        { name: 'Instagram', icon: 'fab fa-instagram', link: user.social_links?.instagram },
    ].filter(social => social.link);

    const recentActivities = [
        {
            icon: <Star size={16} />,
            title: t('added_to_favorites') || 'Ajouté aux favoris',
            description: 'Villa Moderne à Kinshasa',
            time: 'Il y a 2 heures',
            color: 'text-yellow-500'
        },
        {
            icon: <MessageSquare size={16} />,
            title: t('sent_message') || 'Message envoyé',
            description: 'Appartement 3 pièces à Gombe',
            time: 'Il y a 1 jour',
            color: 'text-blue-500'
        },
        {
            icon: <FileText size={16} />,
            title: t('submitted_inquiry') || 'Demande envoyée',
            description: 'Maison à Matete',
            time: 'Il y a 3 jours',
            color: 'text-green-500'
        },
        {
            icon: <UserCheck size={16} />,
            title: t('profile_updated') || 'Profil mis à jour',
            description: 'Informations personnelles',
            time: 'Il y a 1 semaine',
            color: 'text-purple-500'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl p-8 text-white">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white/30"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                                <User size={48} className="text-white" />
                            </div>
                        )}
                        <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-orange-600 hover:bg-orange-50 transition-colors">
                            <Camera size={18} />
                        </button>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                                {user.role || 'Acheteur'}
                            </span>
                            {user.created_at && (
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                                    {t('member_since')} {new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                                </span>
                            )}
                        </div>
                        
                        {user.bio && (
                            <p className="text-white/90 max-w-2xl mb-4">
                                {user.bio}
                            </p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            {user.address && (
                                <div className="flex items-center gap-2 text-white/80">
                                    <MapPin size={18} />
                                    <span>{user.address}</span>
                                </div>
                            )}
                            {user.phone && (
                                <div className="flex items-center gap-2 text-white/80">
                                    <Phone size={18} />
                                    <span>{user.phone}</span>
                                </div>
                            )}
                            {user.email && (
                                <div className="flex items-center gap-2 text-white/80">
                                    <Mail size={18} />
                                    <span>{user.email}</span>
                                </div>
                            )}
                            {user.website && (
                                <div className="flex items-center gap-2 text-white/80">
                                    <Globe size={18} />
                                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                        {user.website.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
                    >
                        <Edit3 size={18} />
                        <span>{t('edit_profile') || 'Modifier le profil'}</span>
                    </button>
                </div>
                
                {/* Social Links */}
                {socialLinks.length > 0 && (
                    <div className="flex gap-3 mt-6 justify-center md:justify-start">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                                <i className={social.icon}></i>
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex border-b border-gray-200">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                                    activeTab === tab.id
                                        ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <User size={20} className="text-orange-600" />
                                    {t('personal_information') || 'Informations personnelles'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Mail size={18} className="text-gray-400" />
                                            <span className="text-sm text-gray-500">{t('email') || 'Email'}</span>
                                        </div>
                                        <p className="font-medium text-gray-900">{user.email || 'Non renseigné'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Phone size={18} className="text-gray-400" />
                                            <span className="text-sm text-gray-500">{t('phone') || 'Téléphone'}</span>
                                        </div>
                                        <p className="font-medium text-gray-900">{user.phone || 'Non renseigné'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <MapPin size={18} className="text-gray-400" />
                                            <span className="text-sm text-gray-500">{t('address') || 'Adresse'}</span>
                                        </div>
                                        <p className="font-medium text-gray-900">{user.address || 'Non renseignée'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Award size={18} className="text-gray-400" />
                                            <span className="text-sm text-gray-500">{t('role') || 'Rôle'}</span>
                                        </div>
                                        <p className="font-medium text-gray-900">{user.role || 'Acheteur'}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Shield size={20} className="text-orange-600" />
                                    {t('account_security') || 'Sécurité du compte'}
                                </h3>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{t('email_verification') || "Vérification de l'email"}</p>
                                            <p className="text-sm text-gray-500">{t('email_verification_status') || "Statut de vérification de votre email"}</p>
                                        </div>
                                        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                                            <CheckCircle size={14} />
                                            {t('verified') || 'Vérifié'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Calendar size={20} className="text-orange-600" />
                                    {t('account_activity') || 'Activité du compte'}
                                </h3>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{t('member_since') || 'Membre depuis'}</p>
                                            <p className="text-sm text-gray-500">{t('join_date') || "Date d'inscription"}</p>
                                        </div>
                                        <div className="text-gray-900 font-medium">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Non renseigné'}
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
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <MessageSquare size={20} className="text-orange-600" />
                                    {t('send_message') || 'Envoyer un message'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {t('contact_form_description') || 'Utilisez ce formulaire pour nous contacter. Nous vous répondrons dans les plus brefs délais.'}
                                </p>
                            </div>

                            {showSuccessMessage && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                                    <CheckCircle size={20} className="text-green-600" />
                                    <div>
                                        <p className="text-green-800 font-medium">{t('message_sent') || 'Message envoyé'}</p>
                                        <p className="text-green-700 text-sm">{t('message_sent_description') || 'Votre message a été envoyé avec succès. Nous vous répondrons bientôt.'}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowSuccessMessage(false)}
                                        className="ml-auto text-green-600 hover:text-green-800"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('name') || 'Nom'}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="name"
                                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder={t('enter_name') || 'Entrez votre nom'}
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                            />
                                        </div>
                                        <ErrorText error={errors.name} />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('email') || 'Email'}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder={t('enter_email') || 'Entrez votre email'}
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                            />
                                        </div>
                                        <ErrorText error={errors.email} />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('phone') || 'Téléphone'}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="tel"
                                                id="phone"
                                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder={t('enter_phone') || 'Entrez votre téléphone'}
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                            />
                                        </div>
                                        <ErrorText error={errors.phone} />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('subject') || 'Sujet'}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FileText size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="subject"
                                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder={t('enter_subject') || 'Entrez le sujet'}
                                                value={data.subject}
                                                onChange={(e) => setData('subject', e.target.value)}
                                            />
                                        </div>
                                        <ErrorText error={errors.subject} />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('message') || 'Message'}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <MessageSquare size={18} className="text-gray-400" />
                                        </div>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                            placeholder={t('enter_message') || 'Entrez votre message'}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                        />
                                    </div>
                                    <ErrorText error={errors.message} />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                        {t('save_info') || 'Enregistrer mes informations pour la prochaine fois'}
                                    </label>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t('sending') || 'Envoi en cours'}
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                {t('send_message') || 'Envoyer le message'}
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
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock size={20} className="text-orange-600" />
                                    {t('recent_activity') || 'Activité récente'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {t('activity_description') || 'Voici vos activités récentes sur la plateforme.'}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className={`p-2 rounded-lg ${activity.color} bg-white`}>
                                            {activity.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                            <p className="text-sm text-gray-600">{activity.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
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