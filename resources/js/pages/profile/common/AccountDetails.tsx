import { router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Award,
    Calendar,
    Camera,
    CheckCircle,
    Edit3,
    Globe,
    Info,
    Loader2,
    Mail,
    MapPin,
    Phone,
    RefreshCw,
    Save,
    Shield,
    User,
    UserCheck,
    X,
    Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    email_verified_at?: string;
    profile_photo?: string;
    profile_photo_url?: string;
    created_at?: string;
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
    address: string;
    profile_photo: File | null;
}

export default function AccountDetails() {
    const { t } = useTranslation();
    const { auth, flash } = usePage<PageProps>().props;
    const { user } = auth;
    const [showSuccess, setShowSuccess] = useState(false);
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
        address: user?.address ?? '',
        profile_photo: null,
    });

    const [photoPreview, setPhotoPreview] = useState<string | null>(
        user?.profile_photo_url ??
            (user?.profile_photo ? `/storage/${user.profile_photo}` : null),
    );

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

        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setShowSuccess(true);
            },
            onError: (errors) => {
                console.error('Erreur lors de la mise à jour:', errors);
            },
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReset = () => {
        if (
            confirm(
                t('confirm_reset_form') ||
                    'Voulez-vous vraiment annuler les modifications ?',
            )
        ) {
            reset();
            setPhotoPreview(
                user?.profile_photo ? `/storage/${user.profile_photo}` : null,
            );
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
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Messages de notification */}
            {showSuccess && (
                <div className="animate-slide-down flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle size={20} className="text-green-600" />
                        <div>
                            <p className="font-medium text-green-800">
                                {flash?.success ||
                                    t('profile_updated_success') ||
                                    'Profil mis à jour avec succès'}
                            </p>
                            <p className="text-sm text-green-700">
                                {t('profile_updated_description') ||
                                    'Vos informations ont été enregistrées avec succès.'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSuccess(false)}
                        className="text-green-600 transition-colors hover:text-green-800"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            {flash?.error && (
                <div className="animate-slide-down flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={20} className="text-red-600" />
                        <div>
                            <p className="font-medium text-red-800">
                                {flash.error}
                            </p>
                            <p className="text-sm text-red-700">
                                {t('error_occurred') ||
                                    'Une erreur est survenue lors de la mise à jour.'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.reload()}
                        className="text-red-600 transition-colors hover:text-red-800"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            )}

            {showEmailVerification && (
                <div className="animate-slide-down flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center gap-3">
                        <Info size={20} className="text-blue-600" />
                        <div>
                            <p className="font-medium text-blue-800">
                                {t('verification_email_sent') ||
                                    'Email de vérification envoyé'}
                            </p>
                            <p className="text-sm text-blue-700">
                                {t('check_email_for_verification') ||
                                    'Vérifiez votre boîte de réception pour confirmer votre adresse email.'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowEmailVerification(false)}
                        className="text-blue-600 transition-colors hover:text-blue-800"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            {/* Carte d'informations du compte */}
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-6">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A84C]">
                        <Shield size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {t('account_security') || 'Sécurité du compte'}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {t('account_security_description') ||
                                'Ces informations sont utilisées pour sécuriser votre compte et vous contacter.'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-white p-4">
                        <div className="mb-2 flex items-center gap-2">
                            <Mail size={16} className="text-[#C9A84C]" />
                            <span className="text-sm font-medium text-gray-700">
                                {t('email_verification') ||
                                    "Vérification de l'email"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                                {user.email}
                            </span>
                            {user.email_verified_at ? (
                                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                                    <CheckCircle size={12} />
                                    {t('verified') || 'Vérifié'}
                                </span>
                            ) : (
                                <button
                                    onClick={handleResendVerification}
                                    className="rounded-full bg-slate-100 px-2 py-1 text-xs text-[#0d2340] transition-colors hover:bg-slate-200"
                                >
                                    {t('verify_now') || 'Vérifier maintenant'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4">
                        <div className="mb-2 flex items-center gap-2">
                            <Calendar size={16} className="text-[#C9A84C]" />
                            <span className="text-sm font-medium text-gray-700">
                                {t('member_since') || 'Membre depuis'}
                            </span>
                        </div>
                        <span className="font-medium text-gray-900">
                            {new Date(user.created_at || '').toLocaleDateString(
                                'fr-FR',
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                },
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {/* Formulaire de mise à jour */}
            <form onSubmit={handleSubmit} noValidate>
                <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                    <div className="bg-gradient-to-r from-[#C9A84C] to-slate-600 p-6 text-white">
                        <h3 className="flex items-center gap-2 text-2xl font-bold">
                            <Edit3 size={24} />
                            {t('personal_information') ||
                                'Informations personnelles'}
                        </h3>
                        <p className="mt-2 text-white/90">
                            {t('update_personal_info') ||
                                'Mettez à jour vos informations personnelles pour améliorer votre expérience.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 border-b border-gray-100 p-6">
                        <div className="group relative">
                            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-slate-100 bg-gray-100">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <User size={40} className="text-gray-400" />
                                )}
                            </div>
                            <label
                                htmlFor="profile_photo"
                                className="absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#C9A84C] text-white shadow-lg transition-colors hover:bg-slate-600"
                            >
                                <Camera size={16} />
                                <input
                                    type="file"
                                    id="profile_photo"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                />
                            </label>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">
                                {t('profile_photo') || 'Photo de profil'}
                            </h4>
                            <p className="text-sm text-gray-500">
                                {t('photo_description') ||
                                    'Changez votre photo pour que les autres vous reconnaissent plus facilement.'}
                            </p>
                            {errors.profile_photo && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.profile_photo}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6 p-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Champ Nom */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block flex items-center gap-1 text-sm font-medium text-gray-700"
                                >
                                    <User
                                        size={16}
                                        className="text-[#C9A84C]"
                                    />
                                    {t('name') || 'Nom'}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="name"
                                        className={`w-full rounded-xl border px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#C9A84C] ${
                                            fieldFocus === 'name'
                                                ? 'border-[#C9A84C]'
                                                : 'border-gray-300'
                                        } ${errors.name ? 'border-red-500' : ''} ${profileData.name.trim() ? 'bg-green-50' : ''}`}
                                        value={profileData.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        onFocus={() => handleFieldFocus('name')}
                                        onBlur={handleFieldBlur}
                                        placeholder={
                                            t('enter_name') ||
                                            'Entrez votre nom'
                                        }
                                        required
                                        maxLength={100}
                                    />
                                    {profileData.name.trim() && (
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <CheckCircle
                                                size={20}
                                                className="text-green-500"
                                            />
                                        </div>
                                    )}
                                </div>
                                {errors.name && (
                                    <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                                        <AlertCircle size={14} />
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            {/* Champ Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block flex items-center gap-1 text-sm font-medium text-gray-700"
                                >
                                    <Mail
                                        size={16}
                                        className="text-[#C9A84C]"
                                    />
                                    {t('email') || 'Email'}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        className={`w-full rounded-xl border px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#C9A84C] ${
                                            fieldFocus === 'email'
                                                ? 'border-[#C9A84C]'
                                                : 'border-gray-300'
                                        } ${errors.email ? 'border-red-500' : ''} ${validateEmail(profileData.email) ? 'bg-green-50' : ''}`}
                                        value={profileData.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        onFocus={() =>
                                            handleFieldFocus('email')
                                        }
                                        onBlur={handleFieldBlur}
                                        placeholder={
                                            t('enter_email') ||
                                            'Entrez votre email'
                                        }
                                        required
                                        maxLength={255}
                                        readOnly={!!user.email_verified_at}
                                    />
                                    {validateEmail(profileData.email) && (
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <CheckCircle
                                                size={20}
                                                className="text-green-500"
                                            />
                                        </div>
                                    )}
                                </div>
                                {errors.email && (
                                    <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                                        <AlertCircle size={14} />
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            {/* Champ Téléphone */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block flex items-center gap-1 text-sm font-medium text-gray-700"
                                >
                                    <Phone
                                        size={16}
                                        className="text-[#C9A84C]"
                                    />
                                    {t('phone') || 'Téléphone'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        id="phone"
                                        className={`w-full rounded-xl border px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#C9A84C] ${
                                            fieldFocus === 'phone'
                                                ? 'border-[#C9A84C]'
                                                : 'border-gray-300'
                                        } ${errors.phone ? 'border-red-500' : ''} ${validatePhone(profileData.phone) && profileData.phone ? 'bg-green-50' : ''}`}
                                        value={profileData.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        onFocus={() =>
                                            handleFieldFocus('phone')
                                        }
                                        onBlur={handleFieldBlur}
                                        placeholder={
                                            t('enter_phone') ||
                                            'Entrez votre téléphone'
                                        }
                                        maxLength={20}
                                    />
                                    {validatePhone(profileData.phone) &&
                                        profileData.phone && (
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <CheckCircle
                                                    size={20}
                                                    className="text-green-500"
                                                />
                                            </div>
                                        )}
                                </div>
                                {errors.phone && (
                                    <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                                        <AlertCircle size={14} />
                                        {errors.phone}
                                    </div>
                                )}
                            </div>

                            {/* Champ Adresse */}
                            <div>
                                <label
                                    htmlFor="address"
                                    className="mb-2 block flex items-center gap-1 text-sm font-medium text-gray-700"
                                >
                                    <MapPin
                                        size={16}
                                        className="text-[#C9A84C]"
                                    />
                                    {t('address') || 'Adresse'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="address"
                                        className={`w-full rounded-xl border px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#C9A84C] ${
                                            fieldFocus === 'address'
                                                ? 'border-[#C9A84C]'
                                                : 'border-gray-300'
                                        }`}
                                        value={profileData.address}
                                        onChange={(e) =>
                                            setData('address', e.target.value)
                                        }
                                        onFocus={() =>
                                            handleFieldFocus('address')
                                        }
                                        onBlur={handleFieldBlur}
                                        placeholder={
                                            t('enter_address') ||
                                            'Entrez votre adresse'
                                        }
                                        maxLength={255}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <button
                                type="submit"
                                disabled={processing || !isFormValid}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-slate-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:from-slate-600 hover:to-[#0d2340] focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />
                                        {t('saving') || 'Enregistrement...'}
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        {t('save_changes') ||
                                            'Enregistrer les modifications'}
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={processing || !isDirty}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                            >
                                <RefreshCw size={20} />
                                {t('reset') || 'Réinitialiser'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Carte d'informations supplémentaires */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                    <h3 className="flex items-center gap-2 text-2xl font-bold">
                        <Zap size={24} />
                        {t('quick_actions') || 'Actions rapides'}
                    </h3>
                    <p className="mt-2 text-white/90">
                        {t('quick_actions_description') ||
                            'Accédez rapidement à des fonctionnalités importantes de votre compte.'}
                    </p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <button
                            onClick={() =>
                                router.visit(route('profile')) + '?tab=settings'
                            }
                            className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                <Shield size={20} className="text-blue-600" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-medium text-gray-900">
                                    {t('change_password') ||
                                        'Changer le mot de passe'}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {t('change_password_description') ||
                                        'Mettez à jour votre mot de passe pour sécuriser votre compte'}
                                </p>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                                <UserCheck
                                    size={20}
                                    className="text-green-600"
                                />
                            </div>
                            <div className="text-left">
                                <h4 className="font-medium text-gray-900">
                                    {t('two_factor_auth') ||
                                        'Authentification à deux facteurs'}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {t('two_factor_auth_description') ||
                                        'Ajoutez une couche de sécurité supplémentaire'}
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={() =>
                                router.visit(route('profile')) + '?tab=settings'
                            }
                            className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                                <Globe size={20} className="text-purple-600" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-medium text-gray-900">
                                    {t('language_preferences') ||
                                        'Préférences de langue'}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {t('language_preferences_description') ||
                                        'Personnalisez votre expérience'}
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={() =>
                                router.visit(route('profile')) + '?tab=settings'
                            }
                            className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                                <Award size={20} className="text-slate-600" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-medium text-gray-900">
                                    {t('notification_settings') ||
                                        'Paramètres de notification'}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {t('notification_settings_description') ||
                                        'Contrôlez les notifications que vous recevez'}
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
