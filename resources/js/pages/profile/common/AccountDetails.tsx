import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    User,
    MapPin,
    Phone,
    Mail,
    Save,
    AlertCircle,
    CheckCircle,
    X,
    Shield,
    Info,
    Edit3,
    Loader2,
    RefreshCw,
    Eye,
    EyeOff,
    UserCheck,
    Globe,
    Calendar,
    Award,
    Zap,
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    email_verified_at?: string;
}

interface PageProps {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

interface FormData {
    name: string;
    email: string;
    phone: string;
}

export default function AccountDetails() {
    const { t } = useTranslation();
    const { auth, flash } = usePage<PageProps>().props;
    const { user } = auth;
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [fieldFocus, setFieldFocus] = useState('');

    const {
        data: profileData,
        setData,
        post,
        processing,
        errors,
        reset,
        isDirty,
    } = useForm<FormData>({
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
    });

    // Affichage du message de succès
    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation côté client
        if (!profileData.name.trim()) {
            return;
        }

        post(route('dashboard.user.settings.update'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setShowSuccess(true);
            },
            onError: (errors) => {
                console.error('Erreur lors de la mise à jour:', errors);
            }
        });
    };

    const handleReset = () => {
        if (confirm(t('confirm_reset_form') || 'Voulez-vous vraiment annuler les modifications ?')) {
            reset();
        }
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return !phone || phoneRegex.test(phone);
    };

    const isFormValid =
        profileData.name.trim() &&
        profileData.email.trim() &&
        validateEmail(profileData.email) &&
        validatePhone(profileData.phone);

    const handleFieldFocus = (field: string) => {
        setFieldFocus(field);
    };

    const handleFieldBlur = () => {
        setFieldFocus('');
    };

    const handleResendVerification = () => {
        post(route('verification.send'), {
            onSuccess: () => {
                setShowEmailVerification(true);
                setTimeout(() => setShowEmailVerification(false), 5000);
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Messages de notification */}
            {showSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between animate-slide-down">
                    <div className="flex items-center gap-3">
                        <CheckCircle size={20} className="text-green-600" />
                        <div>
                            <p className="text-green-800 font-medium">{flash?.success || t('profile_updated_success') || 'Profil mis à jour avec succès'}</p>
                            <p className="text-green-700 text-sm">{t('profile_updated_description') || 'Vos informations ont été enregistrées avec succès.'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSuccess(false)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            {flash?.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between animate-slide-down">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={20} className="text-red-600" />
                        <div>
                            <p className="text-red-800 font-medium">{flash.error}</p>
                            <p className="text-red-700 text-sm">{t('error_occurred') || 'Une erreur est survenue lors de la mise à jour.'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.reload()}
                        className="text-red-600 hover:text-red-800 transition-colors"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            )}

            {showEmailVerification && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between animate-slide-down">
                    <div className="flex items-center gap-3">
                        <Info size={20} className="text-blue-600" />
                        <div>
                            <p className="text-blue-800 font-medium">{t('verification_email_sent') || 'Email de vérification envoyé'}</p>
                            <p className="text-blue-700 text-sm">{t('check_email_for_verification') || 'Vérifiez votre boîte de réception pour confirmer votre adresse email.'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowEmailVerification(false)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            {/* Carte d'informations du compte */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <Shield size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{t('account_security') || 'Sécurité du compte'}</h3>
                        <p className="text-gray-600 text-sm">{t('account_security_description') || 'Ces informations sont utilisées pour sécuriser votre compte et vous contacter.'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Mail size={16} className="text-orange-500" />
                            <span className="text-sm font-medium text-gray-700">{t('email_verification') || "Vérification de l'email"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-900 font-medium">{user.email}</span>
                            {user.email_verified_at ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                                    <CheckCircle size={12} />
                                    {t('verified') || 'Vérifié'}
                                </span>
                            ) : (
                                <button
                                    onClick={handleResendVerification}
                                    className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full hover:bg-orange-200 transition-colors"
                                >
                                    {t('verify_now') || 'Vérifier maintenant'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar size={16} className="text-orange-500" />
                            <span className="text-sm font-medium text-gray-700">{t('member_since') || 'Membre depuis'}</span>
                        </div>
                        <span className="text-gray-900 font-medium">
                            {new Date(user.created_at || '').toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Formulaire de mise à jour */}
            <form onSubmit={handleSubmit} noValidate>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <Edit3 size={24} />
                            {t('personal_information') || 'Informations personnelles'}
                        </h3>
                        <p className="text-white/90 mt-2">
                            {t('update_personal_info') || 'Mettez à jour vos informations personnelles pour améliorer votre expérience.'}
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Champ Nom */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                    <User size={16} className="text-orange-500" />
                                    {t('name') || 'Nom'} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="name"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                                            fieldFocus === 'name' ? 'border-orange-500' : 'border-gray-300'
                                        } ${errors.name ? 'border-red-500' : ''} ${profileData.name.trim() ? 'bg-green-50' : ''}`}
                                        value={profileData.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        onFocus={() => handleFieldFocus('name')}
                                        onBlur={handleFieldBlur}
                                        placeholder={t('enter_name') || 'Entrez votre nom'}
                                        required
                                        maxLength={100}
                                    />
                                    {profileData.name.trim() && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <CheckCircle size={20} className="text-green-500" />
                                        </div>
                                    )}
                                </div>
                                {errors.name && (
                                    <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                                        <AlertCircle size={14} />
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            {/* Champ Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                    <Mail size={16} className="text-orange-500" />
                                    {t('email') || 'Email'} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                                            fieldFocus === 'email' ? 'border-orange-500' : 'border-gray-300'
                                        } ${errors.email ? 'border-red-500' : ''} ${validateEmail(profileData.email) ? 'bg-green-50' : ''}`}
                                        value={profileData.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        onFocus={() => handleFieldFocus('email')}
                                        onBlur={handleFieldBlur}
                                        placeholder={t('enter_email') || 'Entrez votre email'}
                                        required
                                        maxLength={255}
                                    />
                                    {validateEmail(profileData.email) && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <CheckCircle size={20} className="text-green-500" />
                                        </div>
                                    )}
                                </div>
                                {errors.email && (
                                    <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                                        <AlertCircle size={14} />
                                        {errors.email}
                                    </div>
                                )}
                                {!validateEmail(profileData.email) && profileData.email && (
                                    <div className="mt-1 flex items-center gap-1 text-amber-600 text-sm">
                                        <AlertCircle size={14} />
                                        {t('invalid_email_format') || 'Format d\'email invalide'}
                                    </div>
                                )}
                            </div>

                            {/* Champ Téléphone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                    <Phone size={16} className="text-orange-500" />
                                    {t('phone') || 'Téléphone'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        id="phone"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                                            fieldFocus === 'phone' ? 'border-orange-500' : 'border-gray-300'
                                        } ${errors.phone ? 'border-red-500' : ''} ${validatePhone(profileData.phone) && profileData.phone ? 'bg-green-50' : ''}`}
                                        value={profileData.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        onFocus={() => handleFieldFocus('phone')}
                                        onBlur={handleFieldBlur}
                                        placeholder={t('enter_phone') || 'Entrez votre téléphone'}
                                        maxLength={20}
                                    />
                                    {validatePhone(profileData.phone) && profileData.phone && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <CheckCircle size={20} className="text-green-500" />
                                        </div>
                                    )}
                                </div>
                                {errors.phone && (
                                    <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                                        <AlertCircle size={14} />
                                        {errors.phone}
                                    </div>
                                )}
                                {!validatePhone(profileData.phone) && profileData.phone && (
                                    <div className="mt-1 flex items-center gap-1 text-amber-600 text-sm">
                                        <AlertCircle size={14} />
                                        {t('invalid_phone_format') || 'Format de téléphone invalide'}
                                    </div>
                                )}
                            </div>

                            {/* Champ Adresse */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                    <MapPin size={16} className="text-orange-500" />
                                    {t('address') || 'Adresse'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="address"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                                            fieldFocus === 'address' ? 'border-orange-500' : 'border-gray-300'
                                        }`}
                                        value={user.address || ''}
                                        onFocus={() => handleFieldFocus('address')}
                                        onBlur={handleFieldBlur}
                                        placeholder={t('enter_address') || 'Entrez votre adresse'}
                                        maxLength={255}
                                        readOnly
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <Info size={20} className="text-gray-400" />
                                    </div>
                                </div>
                                <div className="mt-1 text-gray-500 text-xs">
                                    {t('address_info') || 'Pour modifier votre adresse, veuillez contacter le support.'}
                                </div>
                            </div>
                        </div>

                        {/* Indicateur de progression */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">{t('profile_completion') || 'Profil complété à'}</span>
                                <span className="text-sm font-bold text-orange-600">
                                    {Math.round((profileData.name.trim() ? 33 : 0) + (validateEmail(profileData.email) ? 33 : 0) + (validatePhone(profileData.phone) ? 34 : 0))}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(profileData.name.trim() ? 33 : 0) + (validateEmail(profileData.email) ? 33 : 0) + (validatePhone(profileData.phone) ? 34 : 0)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={processing || !isFormValid}
                                className="flex-1 flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        {t('saving') || 'Enregistrement...'}
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        {t('save_changes') || 'Enregistrer les modifications'}
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={processing || !isDirty}
                                className="flex-1 flex justify-center items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 disabled:opacity-50"
                            >
                                <RefreshCw size={20} />
                                {t('reset') || 'Réinitialiser'}
                            </button>
                        </div>

                        {isDirty && (
                            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                <AlertCircle size={16} className="text-amber-600" />
                                <p className="text-amber-800 text-sm">{t('unsaved_changes') || 'Vous avez des modifications non sauvegardées'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </form>

            {/* Carte d'informations supplémentaires */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Zap size={24} />
                        {t('quick_actions') || 'Actions rapides'}
                    </h3>
                    <p className="text-white/90 mt-2">
                        {t('quick_actions_description') || 'Accédez rapidement à des fonctionnalités importantes de votre compte.'}
                    </p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Shield size={20} className="text-blue-600" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-medium text-gray-900">{t('change_password') || 'Changer le mot de passe'}</h4>
                                <p className="text-sm text-gray-600">{t('change_password_description') || 'Mettez à jour votre mot de passe pour sécuriser votre compte'}</p>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <UserCheck size={20} className="text-green-600" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-medium text-gray-900">{t('two_factor_auth') || 'Authentification à deux facteurs'}</h4>
                                <p className="text-sm text-gray-600">{t('two_factor_auth_description') || 'Ajoutez une couche de sécurité supplémentaire'}</p>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Globe size={20} className="text-purple-600" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-medium text-gray-900">{t('language_preferences') || 'Préférences de langue'}</h4>
                                <p className="text-sm text-gray-600">{t('language_preferences_description') || 'Personnalisez votre expérience'}</p>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                <Award size={20} className="text-amber-600" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-medium text-gray-900">{t('notification_settings') || 'Paramètres de notification'}</h4>
                                <p className="text-sm text-gray-600">{t('notification_settings_description') || 'Contrôlez les notifications que vous recevez'}</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}