import ErrorText from '@/components/ui/ErrorText';
import { useForm, usePage } from '@inertiajs/react';
import {
    Building,
    Camera,
    CheckCircle,
    Loader,
    Mail,
    MapPin,
    Phone,
    User,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { route } from 'ziggy-js';

// Types
interface User {
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
    profile_photo?: string;
    company?: string;
    address?: string;
    rc_number?: string;
    tax_number?: string;
}

interface SellerPopupProps {
    onClose: () => void;
    user?: User;
    active: boolean;
}

type UserType = 'seller' | 'agency';
type TabType = 'simpleSeller' | 'agency';

interface FormData {
    name: string;
    email: string;
    phone: string;
    bio: string;
    profile_photo: File | null;
    company: string;
    address: string;
    rc_number: string;
    tax_number: string;
    user_type: UserType;
    preselected_plan: string | null;
}

// Liste des codes pays (Exemple)
const COUNTRY_CODES = [
    { code: '+243', flag: '🇨🇩', name: 'RD Congo' },
    { code: '+1', flag: '🇺🇸', name: 'USA' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+41', flag: '🇨🇭', name: 'Suisse' },
    { code: '+32', flag: '🇧🇪', name: 'Belgique' },
    { code: '+49', flag: '🇩🇪', name: 'Allemagne' },
];

const SellerPopup: React.FC<SellerPopupProps> = ({ onClose, user, active }) => {
    const [selectedTab, setSelectedTab] = useState<TabType>('simpleSeller');
    const [wasOpened, setWasOpened] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState('+243');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { props } = usePage<{ flash?: { message?: string } }>();
    const flashSuccess = props.flash?.message;

    const preselectedPlan = useMemo(
        () =>
            typeof window !== 'undefined'
                ? localStorage.getItem('preselected_plan_id')
                : null,
        [],
    );

    const { data, setData, post, errors, processing, reset, transform } =
        useForm<FormData>({
            name: '',
            email: '',
            phone: '',
            bio: '',
            profile_photo: null,
            company: '',
            address: '',
            rc_number: '',
            tax_number: '',
            user_type: 'seller',
            preselected_plan: preselectedPlan,
        });

    // S'assurer que le téléphone envoyé contient toujours l'indicatif
    useEffect(() => {
        transform((data) => ({
            ...data,
            phone:
                data.phone.startsWith('+') || !data.phone
                    ? data.phone
                    : `${selectedCountryCode}${data.phone}`,
        }));
    }, [selectedCountryCode, transform]);

    // Initialize form data when popup opens
    useEffect(() => {
        if (active && !wasOpened && user) {
            setWasOpened(true);

            // Essayer d'extraire l'indicatif si le téléphone existe déjà
            let phoneValue = user.phone || '';
            let initialCode = '+243';

            // Logique simple d'extraction (si le téléphone commence par un des codes)
            const foundCode = COUNTRY_CODES.find((cc) =>
                phoneValue.startsWith(cc.code),
            );
            if (foundCode) {
                initialCode = foundCode.code;
                phoneValue = phoneValue.replace(foundCode.code, '');
            }

            setSelectedCountryCode(initialCode);

            setData({
                ...data,
                name: user.name || '',
                email: user.email || '',
                phone: phoneValue,
                bio: user.bio || '',
                company: user.company || '',
                address: user.address || '',
                rc_number: user.rc_number || '',
                tax_number: user.tax_number || '',
                profile_photo: null,
                user_type: data.user_type, // Persist current user_type
                preselected_plan: data.preselected_plan, // Persist preselected_plan
            });

            // Prévisualisation de l'image existante
            if (user.profile_photo) {
                setPreviewImage(`/storage/${user.profile_photo}`);
            }
        }
    }, [active, wasOpened, user, setData]);

    // Reset form when popup closes
    useEffect(() => {
        if (!active) {
            reset();
            setWasOpened(false);
            setPreviewImage(null);
        }
    }, [active, reset]);

    // Close popup on success
    useEffect(() => {
        if (flashSuccess && active) {
            setIsAnimating(true);
            setTimeout(() => {
                onClose();
                setIsAnimating(false);
            }, 300);
        }
    }, [flashSuccess, active, onClose]);

    // Handle body scroll
    useEffect(() => {
        if (active) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [active]);

    const photoAlreadyPresent = Boolean(user?.profile_photo);

    const handleTabChange = useCallback(
        (tab: TabType) => {
            setSelectedTab(tab);
            setData('user_type', tab === 'agency' ? 'agency' : 'seller');
        },
        [setData],
    );

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('phone', `${selectedCountryCode}${value}`);
    };

    const handleCountryCodeChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const newCode = e.target.value;
        setSelectedCountryCode(newCode);
        // Mettre à jour le téléphone complet en gardant le numéro actuel
        const currentNumber = data.phone.startsWith(selectedCountryCode)
            ? data.phone.slice(selectedCountryCode.length)
            : data.phone;
        setData('phone', `${newCode}${currentNumber}`);
    };

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const target = e.target as HTMLInputElement;
            const { name, value, type, files } = target;

            if (type === 'file') {
                const file = files?.[0] || null;
                setData(name as keyof FormData, file);

                if (file) {
                    setPreviewImage(URL.createObjectURL(file));
                } else {
                    setPreviewImage(null);
                }
            } else {
                setData(name as keyof FormData, value);
            }
        },
        [setData],
    );

    const handleRemoveImage = () => {
        setData('profile_photo', null);
        setPreviewImage(null);
        // Si on veut effacer l'ancienne image du serveur, il faudrait un champ 'delete_profile_photo' = true
    };

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            post(route('become-seller'), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
                onError: (err) => {
                    console.error('Become Seller Error:', err);
                },
            });
        },
        [post, reset, onClose],
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsAnimating(true);
                setTimeout(() => {
                    onClose();
                    setIsAnimating(false);
                }, 200);
            }
        },
        [onClose],
    );

    const handleOverlayClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                setIsAnimating(true);
                setTimeout(() => {
                    onClose();
                    setIsAnimating(false);
                }, 200);
            }
        },
        [onClose],
    );

    if (!active) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="seller-popup__title"
            onKeyDown={handleKeyDown}
            onClick={handleOverlayClick}
        >
            <div className="absolute inset-0 bg-[#0d2340]/80 backdrop-blur-sm" />

            <div
                className={`relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ${
                    isAnimating
                        ? 'translate-y-4 scale-95 opacity-0'
                        : 'translate-y-0 scale-100 opacity-100'
                }`}
            >
                {/* Header navy */}
                <div className="relative shrink-0 overflow-hidden bg-[#0d2340] px-6 pt-6 pb-0">
                    <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#C9A84C]/10 blur-2xl" />
                    <div className="relative flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C9A84C] shadow-lg shadow-[#C9A84C]/30">
                                {selectedTab === 'simpleSeller' ? (
                                    <User className="h-5 w-5 text-white" />
                                ) : (
                                    <Building className="h-5 w-5 text-white" />
                                )}
                            </div>
                            <div>
                                <h2
                                    id="seller-popup__title"
                                    className="text-lg font-bold text-white"
                                >
                                    {selectedTab === 'simpleSeller'
                                        ? 'Devenir Vendeur'
                                        : 'Inscrire votre Agence'}
                                </h2>
                                <p className="text-xs text-white/50">
                                    Complétez votre profil pour publier des
                                    annonces
                                </p>
                            </div>
                        </div>
                        <button
                            className="flex h-9 w-9 items-center justify-center rounded-full text-white/40 transition-all hover:bg-white/10 hover:text-white"
                            onClick={onClose}
                            aria-label="Fermer"
                            type="button"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <nav className="relative mt-5 flex gap-1" role="tablist">
                        {(
                            [
                                {
                                    key: 'simpleSeller',
                                    label: 'Particulier',
                                    Icon: User,
                                },
                                {
                                    key: 'agency',
                                    label: 'Agence Immobilière',
                                    Icon: Building,
                                },
                            ] as const
                        ).map(({ key, label, Icon }) => (
                            <button
                                key={key}
                                onClick={() => handleTabChange(key)}
                                role="tab"
                                aria-selected={selectedTab === key}
                                type="button"
                                className={`relative flex items-center gap-2 rounded-t-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                    selectedTab === key
                                        ? 'bg-white text-[#1E3A5F]'
                                        : 'text-white/50 hover:bg-white/10 hover:text-white/80'
                                }`}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {label}
                                {selectedTab === key && (
                                    <span className="absolute top-2.5 right-3 h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Form */}
                <div className="overflow-y-auto bg-white p-6 md:p-8">
                    <form
                        id="seller-popup__form"
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        role="tabpanel"
                        noValidate
                    >
                        {selectedTab === 'simpleSeller' ? (
                            <div className="space-y-5">
                                <div>
                                    <label
                                        className="mb-1.5 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                                        htmlFor="name"
                                    >
                                        Nom complet{' '}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-xl border py-3 pr-4 pl-10 text-sm font-medium text-gray-900 placeholder-gray-300 transition-all focus:ring-2 focus:outline-none ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-[#1E3A5F] focus:ring-[#1E3A5F]/10'}`}
                                            placeholder="Ex: Jean Dupont"
                                            required
                                        />
                                    </div>
                                    <ErrorText error={errors.name} />
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label
                                            className="mb-1.5 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                                            htmlFor="email"
                                        >
                                            Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                readOnly
                                                className="w-full cursor-not-allowed rounded-xl border border-gray-100 bg-gray-50 py-3 pr-4 pl-10 text-sm text-gray-400 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            className="mb-1.5 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                                            htmlFor="phone"
                                        >
                                            Téléphone
                                        </label>
                                        <div className="flex overflow-hidden rounded-xl border border-gray-200 transition-all focus-within:border-[#1E3A5F] focus-within:ring-2 focus-within:ring-[#1E3A5F]/10">
                                            <select
                                                value={selectedCountryCode}
                                                onChange={
                                                    handleCountryCodeChange
                                                }
                                                className="cursor-pointer border-r border-gray-200 bg-gray-50 px-2 py-3 text-xs font-semibold text-gray-600 focus:outline-none"
                                            >
                                                {COUNTRY_CODES.map((c) => (
                                                    <option
                                                        key={c.code}
                                                        value={c.code}
                                                    >
                                                        {c.flag} {c.code}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="relative flex-1">
                                                <Phone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    name="phone"
                                                    value={
                                                        data.phone.startsWith(
                                                            selectedCountryCode,
                                                        )
                                                            ? data.phone.slice(
                                                                  selectedCountryCode.length,
                                                              )
                                                            : data.phone
                                                    }
                                                    onChange={handlePhoneChange}
                                                    className="w-full border-none py-3 pr-4 pl-9 text-sm font-medium placeholder-gray-300 focus:ring-0 focus:outline-none"
                                                    placeholder="000 000 000"
                                                />
                                            </div>
                                        </div>
                                        <ErrorText error={errors.phone} />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        className="mb-1.5 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                                        htmlFor="bio"
                                    >
                                        À propos de vous
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={data.bio}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium placeholder-gray-300 transition-all focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                        placeholder="Décrivez brièvement qui vous êtes..."
                                    />
                                    <ErrorText error={errors.bio} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label
                                            className="mb-1.5 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                                            htmlFor="company"
                                        >
                                            Nom de l'agence{' '}
                                            <span className="text-red-400">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <Building className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                            <input
                                                id="company"
                                                type="text"
                                                name="company"
                                                value={data.company}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 text-sm font-medium placeholder-gray-300 transition-all focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                                placeholder="Ex: Immo Congo"
                                            />
                                        </div>
                                        <ErrorText error={errors.company} />
                                    </div>
                                    <div>
                                        <label
                                            className="mb-1.5 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                                            htmlFor="agency-phone"
                                        >
                                            Téléphone{' '}
                                            <span className="text-red-400">
                                                *
                                            </span>
                                        </label>
                                        <div className="flex overflow-hidden rounded-xl border border-gray-200 transition-all focus-within:border-[#1E3A5F] focus-within:ring-2 focus-within:ring-[#1E3A5F]/10">
                                            <select
                                                value={selectedCountryCode}
                                                onChange={
                                                    handleCountryCodeChange
                                                }
                                                className="cursor-pointer border-r border-gray-200 bg-gray-50 px-2 py-3 text-xs font-semibold text-gray-600 focus:outline-none"
                                            >
                                                {COUNTRY_CODES.map((c) => (
                                                    <option
                                                        key={c.code}
                                                        value={c.code}
                                                    >
                                                        {c.flag} {c.code}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="relative flex-1">
                                                <Phone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    id="agency-phone"
                                                    type="tel"
                                                    name="phone"
                                                    value={
                                                        data.phone.startsWith(
                                                            selectedCountryCode,
                                                        )
                                                            ? data.phone.slice(
                                                                  selectedCountryCode.length,
                                                              )
                                                            : data.phone
                                                    }
                                                    onChange={handlePhoneChange}
                                                    className="w-full border-none py-3 pr-4 pl-9 text-sm font-medium placeholder-gray-300 focus:ring-0 focus:outline-none"
                                                    placeholder="000 000 000"
                                                />
                                            </div>
                                        </div>
                                        <ErrorText error={errors.phone} />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        className="mb-1.5 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                                        htmlFor="address"
                                    >
                                        Adresse physique
                                    </label>
                                    <div className="relative">
                                        <MapPin className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                        <input
                                            id="address"
                                            type="text"
                                            name="address"
                                            value={data.address}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 text-sm font-medium placeholder-gray-300 transition-all focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                            placeholder="Ex: Av. de l'Indépendance, Kinshasa"
                                        />
                                    </div>
                                    <ErrorText error={errors.address} />
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label
                                            className="mb-1.5 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                                            htmlFor="rc_number"
                                        >
                                            Numéro RC
                                        </label>
                                        <input
                                            id="rc_number"
                                            type="text"
                                            name="rc_number"
                                            value={data.rc_number}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium placeholder-gray-300 transition-all focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                            placeholder="CD/KIN/..."
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="mb-1.5 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                                            htmlFor="tax_number"
                                        >
                                            Numéro NIF
                                        </label>
                                        <input
                                            id="tax_number"
                                            type="text"
                                            name="tax_number"
                                            value={data.tax_number}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium placeholder-gray-300 transition-all focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                            placeholder="0000000000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        className="mb-1.5 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                                        htmlFor="agency-bio"
                                    >
                                        Description de l'agence
                                    </label>
                                    <textarea
                                        id="agency-bio"
                                        name="bio"
                                        value={data.bio}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium placeholder-gray-300 transition-all focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 focus:outline-none"
                                        placeholder="Présentez vos services..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Photo Upload */}
                        <div>
                            <label className="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase">
                                {selectedTab === 'simpleSeller'
                                    ? 'Photo de profil'
                                    : "Logo de l'agence"}
                            </label>
                            {previewImage ? (
                                <div className="relative inline-flex">
                                    <div className="h-24 w-24 overflow-hidden rounded-2xl border-2 border-[#C9A84C]/30 shadow-md">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <input
                                        id="profile_photo"
                                        type="file"
                                        name="profile_photo"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor="profile_photo"
                                        className="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-8 transition-all hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition-all group-hover:bg-[#C9A84C]/10">
                                            <Camera className="h-5 w-5 text-gray-400 transition-colors group-hover:text-[#C9A84C]" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-gray-600 group-hover:text-[#1E3A5F]">
                                                Choisir une image
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                PNG, JPG jusqu'à 2MB
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            )}
                            <ErrorText error={errors.profile_photo} />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 bg-white px-6 py-4">
                    <p className="hidden text-xs text-gray-400 sm:block">
                        Vos informations sont{' '}
                        <span className="font-semibold text-[#1E3A5F]">
                            sécurisées
                        </span>
                    </p>
                    <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
                        <button
                            type="button"
                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50"
                            onClick={onClose}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            form="seller-popup__form"
                            className={`flex items-center gap-2 rounded-xl bg-[#C9A84C] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#C9A84C]/25 transition-all hover:bg-[#A8882E] disabled:cursor-not-allowed disabled:opacity-60 ${processing ? 'cursor-wait' : ''}`}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    <span>Enregistrement...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Enregistrer</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerPopup;
