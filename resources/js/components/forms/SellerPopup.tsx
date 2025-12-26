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
                setPreviewImage(user.profile_photo);
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
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="seller-popup__title"
            onKeyDown={handleKeyDown}
            onClick={handleOverlayClick}
        >
            {/* Overlay with blur effect */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            {/* Popup container */}
            <div
                className={`relative flex max-h-[90vh] w-full max-w-2xl transform flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ${isAnimating ? 'translate-y-4 scale-95 opacity-0' : 'translate-y-0 scale-100 opacity-100'}`}
            >
                {/* Header */}
                <header className="z-10 flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                            {selectedTab === 'simpleSeller' ? (
                                <User className="h-5 w-5" />
                            ) : (
                                <Building className="h-5 w-5" />
                            )}
                        </div>
                        <div>
                            <h2
                                id="seller-popup__title"
                                className="text-xl font-bold text-gray-900"
                            >
                                {selectedTab === 'simpleSeller'
                                    ? 'Vendeur Particulier'
                                    : 'Inscription Agence'}
                            </h2>
                            <p className="text-xs text-gray-500">
                                Complétez votre profil pour commencer
                            </p>
                        </div>
                    </div>
                    <button
                        className="rounded-full p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600"
                        onClick={onClose}
                        aria-label="Fermer"
                        type="button"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                {/* Tabs */}
                <nav
                    className="flex shrink-0 border-b border-gray-200 bg-gray-50 px-6"
                    role="tablist"
                >
                    <button
                        className={`mr-2 -mb-px flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            selectedTab === 'simpleSeller'
                                ? 'border-amber-500 bg-white text-amber-600'
                                : 'border-transparent text-gray-500 hover:bg-gray-100/50 hover:text-gray-700'
                        }`}
                        onClick={() => handleTabChange('simpleSeller')}
                        role="tab"
                        aria-selected={selectedTab === 'simpleSeller'}
                        type="button"
                    >
                        <User className="h-4 w-4" />
                        Particulier
                    </button>
                    <button
                        className={`-mb-px flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            selectedTab === 'agency'
                                ? 'border-amber-500 bg-white text-amber-600'
                                : 'border-transparent text-gray-500 hover:bg-gray-100/50 hover:text-gray-700'
                        }`}
                        onClick={() => handleTabChange('agency')}
                        role="tab"
                        aria-selected={selectedTab === 'agency'}
                        type="button"
                    >
                        <Building className="h-4 w-4" />
                        Agence Immobilière
                    </button>
                </nav>

                {/* Scrollable Form Content */}
                <div className="overflow-y-auto bg-gray-50/50 p-6 md:p-8">
                    <form
                        id="seller-popup__form"
                        onSubmit={handleSubmit}
                        className="space-y-6"
                        role="tabpanel"
                        noValidate
                    >
                        {selectedTab === 'simpleSeller' ? (
                            <div className="space-y-5">
                                {/* Nom complet */}
                                <div>
                                    <label
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                        htmlFor="name"
                                    >
                                        Nom complet{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 text-sm placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                                                errors.name
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                    : ''
                                            }`}
                                            placeholder="Ex: Jean Dupont"
                                            required
                                        />
                                    </div>
                                    <ErrorText error={errors.name} />
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    {/* Email (Read only) */}
                                    <div>
                                        <label
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                            htmlFor="email"
                                        >
                                            Email
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                readOnly
                                                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 py-3 pr-4 pl-10 text-sm text-gray-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Téléphone - Séparé */}
                                    <div>
                                        <label
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                            htmlFor="phone"
                                        >
                                            Téléphone
                                        </label>
                                        <div className="flex rounded-lg border border-gray-300 transition-shadow focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
                                            <select
                                                value={selectedCountryCode}
                                                onChange={
                                                    handleCountryCodeChange
                                                }
                                                className="flex cursor-pointer items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-2 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-amber-500 focus:outline-none"
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
                                            <div className="pointer-events-none absolute inset-y-0 left-[110px] flex items-center text-gray-400 md:left-[120px]">
                                                <Phone className="h-4 w-4" />
                                            </div>
                                            <input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                // On affiche seulement le numéro sans l'indicatif
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
                                                className="w-full rounded-r-lg py-3 pr-4 pl-10 text-sm placeholder-gray-400 focus:outline-none"
                                                placeholder="000 000 000"
                                            />
                                        </div>
                                        <ErrorText error={errors.phone} />
                                    </div>
                                </div>

                                {/* Bio */}
                                <div>
                                    <label
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
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
                                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                                        placeholder="Décrivez brièvement qui vous êtes..."
                                    />
                                    <ErrorText error={errors.bio} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    {/* Nom Agence */}
                                    <div>
                                        <label
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                            htmlFor="company"
                                        >
                                            Nom de l'agence{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <Building className="h-5 w-5" />
                                            </div>
                                            <input
                                                id="company"
                                                type="text"
                                                name="company"
                                                value={data.company}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 text-sm placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                                                placeholder="Ex: Immo Congo"
                                            />
                                        </div>
                                        <ErrorText error={errors.company} />
                                    </div>

                                    {/* Téléphone - Séparé */}
                                    <div>
                                        <label
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                            htmlFor="agency-phone"
                                        >
                                            Téléphone{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="flex rounded-lg border border-gray-300 transition-shadow focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
                                            <select
                                                value={selectedCountryCode}
                                                onChange={
                                                    handleCountryCodeChange
                                                }
                                                className="flex cursor-pointer items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-2 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-amber-500 focus:outline-none"
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
                                            <div className="pointer-events-none absolute inset-y-0 left-[110px] flex items-center text-gray-400 md:left-[120px]">
                                                <Phone className="h-4 w-4" />
                                            </div>
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
                                                className="w-full rounded-r-lg py-3 pr-4 pl-10 text-sm placeholder-gray-400 focus:outline-none"
                                                placeholder="000 000 000"
                                            />
                                        </div>
                                        <ErrorText error={errors.phone} />
                                    </div>
                                </div>

                                {/* Adresse */}
                                <div>
                                    <label
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                        htmlFor="address"
                                    >
                                        Adresse physique
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="address"
                                            type="text"
                                            name="address"
                                            value={data.address}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 text-sm placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                                            placeholder="Ex: Av. de l'Indépendance, Kinshasa"
                                        />
                                    </div>
                                    <ErrorText error={errors.address} />
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    {/* RC Number */}
                                    <div>
                                        <label
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
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
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                                            placeholder="CD/KIN/..."
                                        />
                                    </div>

                                    {/* Tax Number */}
                                    <div>
                                        <label
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                            htmlFor="tax_number"
                                        >
                                            Numéro d'impôt (NIF)
                                        </label>
                                        <input
                                            id="tax_number"
                                            type="text"
                                            name="tax_number"
                                            value={data.tax_number}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                                            placeholder="0000000000"
                                        />
                                    </div>
                                </div>

                                {/* Bio Agence */}
                                <div>
                                    <label
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
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
                                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                                        placeholder="Présentez vos services..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Photo Upload (Pour les deux onglets) */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                {selectedTab === 'simpleSeller'
                                    ? 'Photo de profil'
                                    : "Logo de l'agence"}
                            </label>

                            {/* Zone de prévisualisation */}
                            {previewImage ? (
                                <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white shadow-sm transition-opacity hover:opacity-90"
                                        title="Supprimer l'image"
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
                                        className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-8 transition-all hover:border-amber-400 hover:bg-amber-50/30"
                                    >
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-amber-100">
                                            <Camera className="h-5 w-5 text-gray-500 group-hover:text-amber-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-amber-700">
                                            Choisir une image
                                        </span>
                                        <span className="mt-1 text-xs text-gray-400">
                                            PNG, JPG jusqu'à 2MB
                                        </span>
                                    </label>
                                </div>
                            )}
                            <ErrorText error={errors.profile_photo} />
                        </div>
                    </form>
                </div>

                {/* Footer Sticky - Boutons d'action */}
                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-white p-4 md:p-6">
                    <button
                        type="button"
                        className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        onClick={onClose}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        form="seller-popup__form"
                        className={`flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-amber-500/20 transition-all duration-200 hover:bg-amber-600 hover:shadow-amber-500/30 focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 ${
                            processing ? 'cursor-wait' : ''
                        }`}
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
    );
};

export default SellerPopup;
