import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import DeleteUser from '@/components/ui/DeleteUser';
import { router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    Eye,
    EyeOff,
    Facebook,
    Globe,
    Hash,
    Instagram,
    Linkedin,
    Lock,
    Mail,
    MapPin,
    Monitor,
    Moon,
    Palette,
    Phone,
    Save,
    Settings as SettingsIcon,
    Sun,
    Trash2,
    Twitter,
    Upload,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Mock des hooks et composants pour la démo
const usePermission = () => ({ can: (permission) => true });

// Version corrigée de useForm avec router Inertia
const useForm = (initialData) => {
    const [data, setData] = useState(initialData);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const setDataField = (field, value) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const post = (routeName, options = {}) => {
        setProcessing(true);
        setErrors({});

        router.post(route(routeName), data, {
            ...options,
            onSuccess: (page) => {
                setProcessing(false);
                if (options.onSuccess) options.onSuccess(page);
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
                if (options.onError) options.onError(errors);
            },
            onFinish: () => {
                setProcessing(false);
                if (options.onFinish) options.onFinish();
            },
        });
    };

    const put = (routeName, options = {}) => {
        setProcessing(true);
        setErrors({});

        router.put(route(routeName), data, {
            ...options,
            onSuccess: (page) => {
                setProcessing(false);
                if (options.onSuccess) options.onSuccess(page);
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
                if (options.onError) options.onError(errors);
            },
            onFinish: () => {
                setProcessing(false);
                if (options.onFinish) options.onFinish();
            },
        });
    };

    const destroy = (routeName, options = {}) => {
        setProcessing(true);
        setErrors({});

        router.delete(route(routeName), {
            ...options,
            onSuccess: (page) => {
                setProcessing(false);
                if (options.onSuccess) options.onSuccess(page);
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
                if (options.onError) options.onError(errors);
            },
            onFinish: () => {
                setProcessing(false);
                if (options.onFinish) options.onFinish();
            },
        });
    };

    const reset = () => {
        setData(initialData);
        setErrors({});
    };

    return {
        data,
        setData: setDataField,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    };
};

const useTranslation = () => ({
    t: (key) => {
        const translations = {
            my_profile: 'Mon Profil',
            edit_your_photo: 'Modifier votre photo',
            bio: 'Biographie',
            type_bio_here: 'Tapez votre bio ici...',
            email_address: 'Adresse Email',
            name: 'Nom',
            phone: 'Téléphone',
            company: 'Entreprise',
            address: 'Adresse',
            rc_number: 'Numéro RC',
            tax_number: 'Numéro Fiscal',
            appearance: 'Apparence',
            site_language: 'Langue du site',
            current_password: 'Mot de passe actuel',
            new_password: 'Nouveau mot de passe',
            confirm_password: 'Confirmer le mot de passe',
            updating: 'Mise à jour...',
            update_password: 'Mettre à jour le mot de passe',
            site_name: 'Nom du site',
            numero: 'Numéro',
        };
        return translations[key] || key;
    },
    i18n: {
        language: 'fr',
        changeLanguage: (lng) => console.log('Language changed to:', lng),
    },
});

const ThemeSelector = () => {
    const [selectedTheme, setSelectedTheme] = useState('light');

    const themes = [
        {
            id: 'light',
            name: 'Clair',
            icon: <Sun size={18} />,
            bg: 'bg-white',
            border: 'border-gray-200',
        },
        {
            id: 'dark',
            name: 'Sombre',
            icon: <Moon size={18} />,
            bg: 'bg-gray-800',
            border: 'border-gray-700',
        },
        {
            id: 'auto',
            name: 'Auto',
            icon: <Monitor size={18} />,
            bg: 'bg-gradient-to-r from-white to-gray-800',
            border: 'border-gray-300',
        },
    ];

    return (
        <div className="p-6">
            <h4 className="mb-4 text-lg font-semibold text-gray-900">Thème</h4>
            <div className="grid grid-cols-3 gap-4">
                {themes.map((theme) => (
                    <div
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                            selectedTheme === theme.id
                                ? 'border-amber-500 shadow-md'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div
                            className={`mb-2 h-16 w-full rounded-lg ${theme.bg} ${theme.border} flex items-center justify-center`}
                        >
                            {theme.icon}
                        </div>
                        <div className="text-center text-sm font-medium text-gray-900">
                            {theme.name}
                        </div>
                        {selectedTheme === theme.id && (
                            <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500">
                                <Check size={12} className="text-white" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Settings() {
    const { can } = usePermission();

    const { user = {}, settings = {}, userRoles = [] } = usePage().props as any;

    const isAgency = userRoles.includes('Agency');
    const isSimpleSeller = userRoles.includes('Simple_seller');
    const isAdmin = userRoles.includes('Admin');
    const isSuperAdmin = userRoles.includes('Super Admin');
    const [activeTab, setActiveTab] = useState('profile');
    const [preview, setPreview] = useState(
        user.profile_photo ? `/storage/${user.profile_photo}` : null,
    );
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { t, i18n } = useTranslation();

    // Forms avec données initiales correctes
    const profileForm = useForm({
        name: user?.name ?? '',
        bio: user?.bio ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        company: user?.company ?? '',
        address: user?.address ?? '',
        profile_photo: null, // Important: null par défaut pour les fichiers
        rc_number: user?.rc_number ?? '',
        tax_number: user?.tax_number ?? '',
        facebook: user?.facebook ?? '',
        instagram: user?.instagram ?? '',
        twitter: user?.twitter ?? '',
        linkedin: user?.linkedin ?? '',
    });

    const appForm = useForm({
        site_name: settings?.site_name ?? '',
        app_email: settings?.email ?? '',
        numero: settings?.numero ?? '',
        adresse: settings?.adresse ?? '',
        facebook: settings?.facebook ?? '',
        instagram: settings?.instagram ?? '',
        twitter: settings?.twitter ?? '',
        linkedin: settings?.linkedin ?? '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Handlers corrigés
    const handleSubmit = (e) => {
        e.preventDefault();

        appForm.post('dashboard.app.settings.update', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success('Paramètres mis à jour avec succès');
            },
            onError: (errors) => {
                toast.error('Erreur lors de la mise à jour');
                console.error('Erreurs:', errors);
            },
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        passwordForm.put('password.update', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                toast.success('Mot de passe mis à jour avec succès');
            },
            onError: (errors) => {
                toast.error('Erreur lors de la mise à jour du mot de passe');
                console.error('Erreurs:', errors);
            },
        });
    };

    const handleUserSubmit = (e) => {
        e.preventDefault();

        // Créer FormData pour gérer les fichiers
        const formData = new FormData();
        Object.keys(profileForm.data).forEach((key) => {
            if (
                profileForm.data[key] !== null &&
                profileForm.data[key] !== ''
            ) {
                formData.append(key, profileForm.data[key]);
            }
        });

        profileForm.processing = true;

        // Utiliser router directement pour les FormData
        router.post(route('dashboard.user.settings.update'), formData, {
            forceFormData: true, // Important pour les fichiers
            preserveScroll: true,
            preserveState: true,
            onStart: () => {
                // Marquer le début du traitement
            },
            onSuccess: () => {
                profileForm.processing = false;
            },
            onError: (errors) => {
                profileForm.processing = false;
                toast.error('Erreur lors de la mise à jour du profil');
                console.error('Erreurs:', errors);
            },
            onFinish: () => {
                profileForm.processing = false;
            },
        });
    };

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    const hasProfilePhoto =
        user.profile_photo && user.profile_photo.trim() !== '';

    const handleDelete = () => {
        if (
            !window.confirm(
                'Êtes-vous sûr de vouloir supprimer votre photo de profil ?',
            )
        ) {
            return;
        }

        router.delete(route('profile-photo.delete'), {
            preserveScroll: true,
            onSuccess: () => {
                setPreview(null);
                router.reload({ only: ['user'] });
            },
            onError: (errors) => {
                console.error('Erreurs:', errors);
            },
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 2048 * 1024) {
            toast.error(
                'Le fichier est trop volumineux. Taille maximale : 2MB',
            );
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Veuillez sélectionner un fichier image valide');
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        profileForm.setData('profile_photo', file);
    };

    const handleUpdate = () => {
        if (!profileForm.data.profile_photo) {
            toast.error('Veuillez sélectionner une photo');
            return;
        }

        const formData = new FormData();
        formData.append('profile_photo', profileForm.data.profile_photo);

        router.post(route('profile-photo.update'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onStart: () => {
                profileForm.processing = true;
            },
            onSuccess: () => {
                profileForm.processing = false;
                setPreview(
                    user.profile_photo
                        ? `/storage/${user.profile_photo}`
                        : null,
                );
                profileForm.setData('profile_photo', null);
                toast.success('Photo mise à jour avec succès');

                router.reload({ only: ['user'] });
            },
            onError: (errors) => {
                profileForm.processing = false;
                toast.error('Erreur lors de la mise à jour de la photo');
                console.error('Erreurs:', errors);
            },
            onFinish: () => {
                profileForm.processing = false;
            },
        });
    };

    const adresseParts = (() => {
        const [avenue = '', numero = '', quartier = '', commune = ''] = (
            appForm.data.adresse ?? ''
        )
            .split(',')
            .map((s) => s.trim());
        return {
            avenue: avenue.replace(/^Av\/\s*/, ''),
            numero: numero.replace(/^N°\s*/, ''),
            quartier: quartier.replace(/^Q\/\s*/, ''),
            commune: commune.replace(/^C\/\s*/, ''),
        };
    })();

    const changeLanguage = async (lng) => {
        try {
            await i18n.changeLanguage(lng);
        } catch (error) {
            console.error('Erreur lors du changement de langue:', error);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profil', icon: <User size={18} /> },
        { id: 'password', label: 'Mot de passe', icon: <Lock size={18} /> },
        { id: 'appearance', label: 'Apparence', icon: <Palette size={18} /> },
        ...(isAdmin
            ? [
                  {
                      id: 'app-details',
                      label: "Détails de l'app",
                      icon: <SettingsIcon size={18} />,
                  },
              ]
            : []),
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        {/* Profile Photo Section */}
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="p-6">
                                <h3 className="mb-6 text-lg font-semibold text-gray-900">
                                    {t('my_profile')}
                                </h3>

                                <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                                    <div className="group relative">
                                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-25 blur transition duration-300 group-hover:opacity-40"></div>
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Profile"
                                                className="relative h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                                            />
                                        ) : (
                                            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-amber-400 to-amber-600 text-4xl font-bold text-white shadow-lg">
                                                {getInitial(user.name)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <h4 className="mb-2 text-lg font-medium text-gray-900">
                                            {t('edit_your_photo')}
                                        </h4>
                                        <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                                            {(hasProfilePhoto || preview) && (
                                                <button
                                                    className="inline-flex items-center rounded-lg bg-red-50 px-4 py-2 font-medium text-red-600 transition-colors hover:bg-red-100"
                                                    onClick={handleDelete}
                                                    disabled={
                                                        profileForm.processing
                                                    }
                                                >
                                                    <Trash2
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    {profileForm.processing
                                                        ? 'Suppression...'
                                                        : 'Supprimer'}
                                                </button>
                                            )}

                                            <label className="inline-flex cursor-pointer items-center rounded-lg bg-amber-50 px-4 py-2 font-medium text-amber-600 transition-colors hover:bg-amber-100">
                                                <Upload
                                                    size={16}
                                                    className="mr-2"
                                                />
                                                {hasProfilePhoto
                                                    ? 'Changer'
                                                    : 'Télécharger'}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                            </label>

                                            {profileForm.data.profile_photo && (
                                                <button
                                                    className="inline-flex items-center rounded-lg bg-emerald-50 px-4 py-2 font-medium text-emerald-600 transition-colors hover:bg-emerald-100"
                                                    onClick={handleUpdate}
                                                    disabled={
                                                        profileForm.processing
                                                    }
                                                >
                                                    <Save
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    {profileForm.processing
                                                        ? 'Sauvegarde...'
                                                        : 'Sauvegarder'}
                                                </button>
                                            )}
                                        </div>

                                        <div className="mt-3 text-sm text-gray-500">
                                            {profileForm.processing &&
                                                'Traitement en cours...'}
                                            {!hasProfilePhoto &&
                                                !preview &&
                                                'Aucune photo de profil'}
                                            {profileForm.data.profile_photo &&
                                                'Nouvelle photo sélectionnée - cliquez sur Sauvegarder'}
                                        </div>

                                        {profileForm.errors.profile_photo && (
                                            <div className="mt-2 flex items-center text-sm text-red-600">
                                                <AlertCircle
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {
                                                    profileForm.errors
                                                        .profile_photo
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Information Form */}
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="p-6">
                                <form
                                    onSubmit={handleUserSubmit}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            {t('bio')}
                                        </label>
                                        <textarea
                                            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                            rows={4}
                                            placeholder={t('type_bio_here')}
                                            value={profileForm.data.bio}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'bio',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {profileForm.errors.bio && (
                                            <div className="mt-2 flex items-center text-sm text-red-600">
                                                <AlertCircle
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {profileForm.errors.bio}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                {t('email_address')}
                                            </label>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-500"
                                                type="email"
                                                placeholder={t('email_address')}
                                                value={profileForm.data.email}
                                                readOnly
                                            />
                                            {profileForm.errors.email && (
                                                <div className="mt-2 flex items-center text-sm text-red-600">
                                                    <AlertCircle
                                                        size={14}
                                                        className="mr-1"
                                                    />
                                                    {profileForm.errors.email}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                {t('name')}
                                            </label>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                type="text"
                                                placeholder={t('name')}
                                                value={profileForm.data.name}
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {profileForm.errors.name && (
                                                <div className="mt-2 flex items-center text-sm text-red-600">
                                                    <AlertCircle
                                                        size={14}
                                                        className="mr-1"
                                                    />
                                                    {profileForm.errors.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                {t('phone')}
                                            </label>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                type="tel"
                                                placeholder="Ex : +33 6 12 34 56 78"
                                                value={profileForm.data.phone}
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'phone',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {profileForm.errors.phone && (
                                                <div className="mt-2 flex items-center text-sm text-red-600">
                                                    <AlertCircle
                                                        size={14}
                                                        className="mr-1"
                                                    />
                                                    {profileForm.errors.phone}
                                                </div>
                                            )}
                                        </div>

                                        {(isAgency ||
                                            isAdmin ||
                                            isSuperAdmin) && (
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    {t('company')}
                                                </label>
                                                <input
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                    type="text"
                                                    placeholder={t('company')}
                                                    value={
                                                        profileForm.data.company
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'company',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {profileForm.errors.company && (
                                                    <div className="mt-2 flex items-center text-sm text-red-600">
                                                        <AlertCircle
                                                            size={14}
                                                            className="mr-1"
                                                        />
                                                        {
                                                            profileForm.errors
                                                                .company
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {(isAgency || isAdmin || isSuperAdmin) && (
                                        <>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    {t('address')}
                                                </label>
                                                <input
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                    type="text"
                                                    placeholder={t('address')}
                                                    value={
                                                        profileForm.data.address
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'address',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {profileForm.errors.address && (
                                                    <div className="mt-2 flex items-center text-sm text-red-600">
                                                        <AlertCircle
                                                            size={14}
                                                            className="mr-1"
                                                        />
                                                        {
                                                            profileForm.errors
                                                                .address
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            {isAgency && (
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <div>
                                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                                            {t('rc_number')}
                                                        </label>
                                                        <input
                                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                            type="text"
                                                            placeholder={t(
                                                                'rc_number',
                                                            )}
                                                            value={
                                                                profileForm.data
                                                                    .rc_number
                                                            }
                                                            onChange={(e) =>
                                                                profileForm.setData(
                                                                    'rc_number',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        {profileForm.errors
                                                            .rc_number && (
                                                            <div className="mt-2 flex items-center text-sm text-red-600">
                                                                <AlertCircle
                                                                    size={14}
                                                                    className="mr-1"
                                                                />
                                                                {
                                                                    profileForm
                                                                        .errors
                                                                        .rc_number
                                                                }
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                                            {t('tax_number')}
                                                        </label>
                                                        <input
                                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                            type="text"
                                                            placeholder={t(
                                                                'tax_number',
                                                            )}
                                                            value={
                                                                profileForm.data
                                                                    .tax_number
                                                            }
                                                            onChange={(e) =>
                                                                profileForm.setData(
                                                                    'tax_number',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        {profileForm.errors
                                                            .tax_number && (
                                                            <div className="mt-2 flex items-center text-sm text-red-600">
                                                                <AlertCircle
                                                                    size={14}
                                                                    className="mr-1"
                                                                />
                                                                {
                                                                    profileForm
                                                                        .errors
                                                                        .tax_number
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Instagram
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Instagram
                                                        size={18}
                                                        className="text-gray-400"
                                                    />
                                                </div>
                                                <input
                                                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                    type="text"
                                                    placeholder="Nom d'utilisateur Instagram"
                                                    value={
                                                        profileForm.data
                                                            .instagram
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'instagram',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            {profileForm.errors.instagram && (
                                                <div className="mt-2 flex items-center text-sm text-red-600">
                                                    <AlertCircle
                                                        size={14}
                                                        className="mr-1"
                                                    />
                                                    {
                                                        profileForm.errors
                                                            .instagram
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Twitter
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Twitter
                                                        size={18}
                                                        className="text-gray-400"
                                                    />
                                                </div>
                                                <input
                                                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                    type="text"
                                                    placeholder="Nom d'utilisateur Twitter"
                                                    value={
                                                        profileForm.data.twitter
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'twitter',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            {profileForm.errors.twitter && (
                                                <div className="mt-2 flex items-center text-sm text-red-600">
                                                    <AlertCircle
                                                        size={14}
                                                        className="mr-1"
                                                    />
                                                    {profileForm.errors.twitter}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                LinkedIn
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Linkedin
                                                        size={18}
                                                        className="text-gray-400"
                                                    />
                                                </div>
                                                <input
                                                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                    type="text"
                                                    placeholder="URL du profil LinkedIn"
                                                    value={
                                                        profileForm.data
                                                            .linkedin
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'linkedin',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            {profileForm.errors.linkedin && (
                                                <div className="mt-2 flex items-center text-sm text-red-600">
                                                    <AlertCircle
                                                        size={14}
                                                        className="mr-1"
                                                    />
                                                    {
                                                        profileForm.errors
                                                            .linkedin
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Facebook
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Facebook
                                                        size={18}
                                                        className="text-gray-400"
                                                    />
                                                </div>
                                                <input
                                                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                    type="text"
                                                    placeholder="URL du profil Facebook"
                                                    value={
                                                        profileForm.data
                                                            .facebook
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'facebook',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            {profileForm.errors.facebook && (
                                                <div className="mt-2 flex items-center text-sm text-red-600">
                                                    <AlertCircle
                                                        size={14}
                                                        className="mr-1"
                                                    />
                                                    {
                                                        profileForm.errors
                                                            .facebook
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className={`inline-flex items-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 font-medium text-white transition-all hover:from-amber-500 hover:to-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none ${
                                                profileForm.processing
                                                    ? 'cursor-not-allowed opacity-75'
                                                    : ''
                                            }`}
                                            disabled={profileForm.processing}
                                        >
                                            {profileForm.processing ? (
                                                <>
                                                    <svg
                                                        className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
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
                                                    Sauvegarde...
                                                </>
                                            ) : (
                                                <>
                                                    <Save
                                                        size={18}
                                                        className="mr-2"
                                                    />
                                                    Sauvegarder
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <DeleteUser />
                    </div>
                );

            case 'password':
                return (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="p-6">
                            <h3 className="mb-6 text-lg font-semibold text-gray-900">
                                Changer le mot de passe
                            </h3>

                            <form
                                onSubmit={handlePasswordSubmit}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        {t('current_password')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                            type={
                                                showCurrentPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder={t('current_password')}
                                            value={
                                                passwordForm.data
                                                    .current_password
                                            }
                                            onChange={(e) =>
                                                passwordForm.setData(
                                                    'current_password',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    !showCurrentPassword,
                                                )
                                            }
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            ) : (
                                                <Eye
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            )}
                                        </button>
                                    </div>
                                    {passwordForm.errors.current_password && (
                                        <div className="mt-2 flex items-center text-sm text-red-600">
                                            <AlertCircle
                                                size={14}
                                                className="mr-1"
                                            />
                                            {
                                                passwordForm.errors
                                                    .current_password
                                            }
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            {t('new_password')}
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                type={
                                                    showNewPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder={t('new_password')}
                                                value={
                                                    passwordForm.data.password
                                                }
                                                onChange={(e) =>
                                                    passwordForm.setData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        !showNewPassword,
                                                    )
                                                }
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff
                                                        size={18}
                                                        className="text-gray-400"
                                                    />
                                                ) : (
                                                    <Eye
                                                        size={18}
                                                        className="text-gray-400"
                                                    />
                                                )}
                                            </button>
                                        </div>
                                        {passwordForm.errors.password && (
                                            <div className="mt-2 flex items-center text-sm text-red-600">
                                                <AlertCircle
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {passwordForm.errors.password}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            {t('confirm_password')}
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                type={
                                                    showConfirmPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder={t(
                                                    'confirm_password',
                                                )}
                                                value={
                                                    passwordForm.data
                                                        .password_confirmation
                                                }
                                                onChange={(e) =>
                                                    passwordForm.setData(
                                                        'password_confirmation',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword,
                                                    )
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff
                                                        size={18}
                                                        className="text-gray-400"
                                                    />
                                                ) : (
                                                    <Eye
                                                        size={18}
                                                        className="text-gray-400"
                                                    />
                                                )}
                                            </button>
                                        </div>
                                        {passwordForm.errors
                                            .password_confirmation && (
                                            <div className="mt-2 flex items-center text-sm text-red-600">
                                                <AlertCircle
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {
                                                    passwordForm.errors
                                                        .password_confirmation
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className={`inline-flex items-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 font-medium text-white transition-all hover:from-amber-500 hover:to-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none ${
                                            passwordForm.processing
                                                ? 'cursor-not-allowed opacity-75'
                                                : ''
                                        }`}
                                        disabled={passwordForm.processing}
                                    >
                                        {passwordForm.processing ? (
                                            <>
                                                <svg
                                                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
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
                                                {t('updating')}
                                            </>
                                        ) : (
                                            <>
                                                <Lock
                                                    size={18}
                                                    className="mr-2"
                                                />
                                                {t('update_password')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                );

            case 'appearance':
                return (
                    <div className="space-y-6">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <ThemeSelector />
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="p-6">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    {t('site_language')}
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Globe
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <select
                                        className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                        onChange={(e) =>
                                            changeLanguage(e.target.value)
                                        }
                                        value={i18n.language}
                                    >
                                        <option value="en">English</option>
                                        <option value="fr">Français</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'app-details':
                return (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <h3 className="mb-6 text-lg font-semibold text-gray-900">
                                        Détails de l'application
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            {t('site_name')}
                                        </label>
                                        <input
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                            type="text"
                                            value={appForm.data.site_name}
                                            onChange={(e) =>
                                                appForm.setData(
                                                    'site_name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {appForm.errors.site_name && (
                                            <div className="mt-2 flex items-center text-sm text-red-600">
                                                <AlertCircle
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {appForm.errors.site_name}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Mail
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                type="email"
                                                value={appForm.data.app_email}
                                                onChange={(e) =>
                                                    appForm.setData(
                                                        'app_email',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        {appForm.errors.app_email && (
                                            <div className="mt-2 flex items-center text-sm text-red-600">
                                                <AlertCircle
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {appForm.errors.app_email}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        {t('numero')}
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Phone
                                                size={18}
                                                className="text-gray-400"
                                            />
                                        </div>
                                        <input
                                            className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                            type="text"
                                            value={appForm.data.numero}
                                            onChange={(e) =>
                                                appForm.setData(
                                                    'numero',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    {appForm.errors.numero && (
                                        <div className="mt-2 flex items-center text-sm text-red-600">
                                            <AlertCircle
                                                size={14}
                                                className="mr-1"
                                            />
                                            {appForm.errors.numero}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="mb-6 text-lg font-semibold text-gray-900">
                                        Informations personnelles
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Avenue
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <MapPin
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                type="text"
                                                value={adresseParts.avenue}
                                                onChange={(e) =>
                                                    appForm.setData(
                                                        'adresse',
                                                        `Av/ ${e.target.value}, N°${adresseParts.numero}, Q/ ${adresseParts.quartier}, C/ ${adresseParts.commune}`,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Numéro
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Hash
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                type="text"
                                                value={adresseParts.numero}
                                                onChange={(e) =>
                                                    appForm.setData(
                                                        'adresse',
                                                        `Av/ ${adresseParts.avenue}, N°${e.target.value}, Q/ ${adresseParts.quartier}, C/ ${adresseParts.commune}`,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Quartier
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <MapPin
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                type="text"
                                                value={adresseParts.quartier}
                                                onChange={(e) =>
                                                    appForm.setData(
                                                        'adresse',
                                                        `Av/ ${adresseParts.avenue}, N°${adresseParts.numero}, Q/ ${e.target.value}, C/ ${adresseParts.commune}`,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Commune
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <MapPin
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                type="text"
                                                value={adresseParts.commune}
                                                onChange={(e) =>
                                                    appForm.setData(
                                                        'adresse',
                                                        `Av/ ${adresseParts.avenue}, N°${adresseParts.numero}, Q/ ${adresseParts.quartier}, C/ ${e.target.value}`,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Facebook
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Facebook
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                type="url"
                                                value={appForm.data.facebook}
                                                onChange={(e) =>
                                                    appForm.setData(
                                                        'facebook',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Instagram
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Instagram
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                type="url"
                                                value={appForm.data.instagram}
                                                onChange={(e) =>
                                                    appForm.setData(
                                                        'instagram',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Twitter
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Twitter
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                type="url"
                                                value={appForm.data.twitter}
                                                onChange={(e) =>
                                                    appForm.setData(
                                                        'twitter',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            LinkedIn
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Linkedin
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                type="url"
                                                value={appForm.data.linkedin}
                                                onChange={(e) =>
                                                    appForm.setData(
                                                        'linkedin',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-all hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                                    >
                                        <X size={18} className="mr-2" />
                                        Restaurer par défaut
                                    </button>
                                    <button
                                        type="submit"
                                        className={`inline-flex items-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 font-medium text-white transition-all hover:from-amber-500 hover:to-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none ${
                                            appForm.processing
                                                ? 'cursor-not-allowed opacity-75'
                                                : ''
                                        }`}
                                        disabled={appForm.processing}
                                    >
                                        {appForm.processing ? (
                                            <>
                                                <svg
                                                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
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
                                                Enregistrement...
                                            </>
                                        ) : (
                                            <>
                                                <Save
                                                    size={18}
                                                    className="mr-2"
                                                />
                                                Enregistrer
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <BackButton />
                        <div className="mt-6 text-center">
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">
                                Paramètres
                            </h1>
                            <p className="text-gray-600">
                                Gérez vos préférences et informations
                                personnelles
                            </p>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-medium transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-amber-500 bg-amber-50 text-amber-600'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div>{renderTabContent()}</div>
                </div>
            </div>
        </Dashboard>
    );
}
