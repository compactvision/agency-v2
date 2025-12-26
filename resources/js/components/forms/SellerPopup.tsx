import ErrorText from '@/components/ui/ErrorText';
import { useForm, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { X, User, Building, Loader, CheckCircle, AlertCircle, Camera } from 'lucide-react';

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

type UserType = 'simple_seller' | 'agency';
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
}

const SellerPopup: React.FC<SellerPopupProps> = ({ onClose, user, active }) => {
    const [selectedTab, setSelectedTab] = useState<TabType>('simpleSeller');
    const [wasOpened, setWasOpened] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const { props } = usePage<{ flash?: { message?: string } }>();
    const flashSuccess = props.flash?.message;

    const preselectedPlan = useMemo(() =>
            typeof window !== 'undefined' ? localStorage.getItem('preselected_plan_id') : null,
        []
    );

    const { data, setData, post, errors, processing, reset } = useForm<FormData>({
        name: '',
        email: '',
        phone: '',
        bio: '',
        profile_photo: null,
        company: '',
        address: '',
        rc_number: '',
        tax_number: '',
        user_type: 'simple_seller',
    });

    // Initialize form data when popup opens
    useEffect(() => {
        if (active && !wasOpened && user) {
            setWasOpened(true);
            setData({
                ...data,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
                company: user.company || '',
                address: user.address || '',
                rc_number: user.rc_number || '',
                tax_number: user.tax_number || '',
            });
        }
    }, [active, wasOpened, user, data, setData]);

    // Reset form when popup closes
    useEffect(() => {
        if (!active) {
            reset();
            setWasOpened(false);
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

    const handleTabChange = useCallback((tab: TabType) => {
        setSelectedTab(tab);
        setData('user_type', tab === 'agency' ? 'agency' : 'simple_seller');
    }, [setData]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, files } = target;

        if (type === 'file') {
            setData(name as keyof FormData, files?.[0] || null);
        } else {
            setData(name as keyof FormData, value);
        }
    }, [setData]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        // Append form data
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                formData.append(key, value as string | Blob);
            }
        });

        // Add preselected plan if exists
        if (preselectedPlan) {
            formData.append('preselected_plan', preselectedPlan);
        }

        // Ensure correct user_type
        formData.set('user_type', selectedTab === 'agency' ? 'agency' : 'simple_seller');

        post('/become-seller', formData, { forceFormData: true });
    }, [data, post, preselectedPlan, selectedTab]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsAnimating(true);
            setTimeout(() => {
                onClose();
                setIsAnimating(false);
            }, 200);
        }
    }, [onClose]);

    const handleOverlayClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsAnimating(true);
            setTimeout(() => {
                onClose();
                setIsAnimating(false);
            }, 200);
        }
    }, [onClose]);

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
            
            {/* Floating elements for visual interest */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-amber-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            
            {/* Popup container */}
            <div className={`relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${isAnimating ? 'scale-95 translate-y-4 opacity-0' : 'scale-100 translate-y-0 opacity-100'}`}>
                {/* Decorative top border */}
                <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
                
                {/* Header */}
                <header className="relative px-6 py-5 bg-gradient-to-br from-amber-50 to-white border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 id="seller-popup__title" className="text-2xl font-bold text-gray-800">
                            Devenir Vendeur
                        </h2>
                        <button
                            className="p-2 text-gray-400 transition-colors duration-200 rounded-full hover:bg-white hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            onClick={onClose}
                            aria-label="Fermer la popup"
                            type="button"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Tabs */}
                <nav className="flex bg-gray-50 border-b border-gray-200" role="tablist">
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            selectedTab === 'simpleSeller' 
                                ? 'text-amber-600 bg-white border-b-2 border-amber-500' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                        onClick={() => handleTabChange('simpleSeller')}
                        role="tab"
                        aria-selected={selectedTab === 'simpleSeller'}
                        aria-controls="seller-popup__form"
                        type="button"
                    >
                        <User className="w-4 h-4" />
                        Vendeur Simple
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            selectedTab === 'agency' 
                                ? 'text-amber-600 bg-white border-b-2 border-amber-500' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                        onClick={() => handleTabChange('agency')}
                        role="tab"
                        aria-selected={selectedTab === 'agency'}
                        aria-controls="seller-popup__form"
                        type="button"
                    >
                        <Building className="w-4 h-4" />
                        Agence
                    </button>
                </nav>

                {/* Form content */}
                <div className="max-h-[70vh] overflow-y-auto">
                    <form
                        id="seller-popup__form"
                        onSubmit={handleSubmit}
                        className="p-6 space-y-5"
                        role="tabpanel"
                        noValidate
                    >
                        {selectedTab === 'simpleSeller' ? (
                            <div className="space-y-5">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="name">
                                        Nom <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                                            errors.name 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:border-amber-500'
                                        }`}
                                        required
                                        autoComplete="name"
                                    />
                                    <ErrorText error={errors.name} />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        readOnly
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                        autoComplete="email"
                                    />
                                    <ErrorText error={errors.email} />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="phone">
                                        Téléphone
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={data.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                                            errors.phone 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:border-amber-500'
                                        }`}
                                        placeholder="243853621283"
                                        autoComplete="tel"
                                    />
                                    <ErrorText error={errors.phone} />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="bio">
                                        Bio
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={data.bio}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none ${
                                            errors.bio 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:border-amber-500'
                                        }`}
                                        placeholder="Entrer une courte description..."
                                    />
                                    <ErrorText error={errors.bio} />
                                </div>

                                {!photoAlreadyPresent && (
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="profile_photo">
                                            Photo de profil
                                        </label>
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
                                                className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors duration-200"
                                            >
                                                <Camera className="w-5 h-5 mr-2 text-gray-400" />
                                                <span className="text-sm text-gray-600">Choisir une image</span>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="company">
                                        Nom de l'agence
                                    </label>
                                    <input
                                        id="company"
                                        type="text"
                                        name="company"
                                        value={data.company}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                                            errors.company 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:border-amber-500'
                                        }`}
                                        autoComplete="organization"
                                    />
                                    <ErrorText error={errors.company} />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="address">
                                        Adresse
                                    </label>
                                    <input
                                        id="address"
                                        type="text"
                                        name="address"
                                        value={data.address}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                                            errors.address 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:border-amber-500'
                                        }`}
                                        autoComplete="street-address"
                                    />
                                    <ErrorText error={errors.address} />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="agency-phone">
                                        Téléphone
                                    </label>
                                    <input
                                        id="agency-phone"
                                        type="tel"
                                        name="phone"
                                        value={data.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                                            errors.phone 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:border-amber-500'
                                        }`}
                                        autoComplete="tel"
                                    />
                                    <ErrorText error={errors.phone} />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="rc_number">
                                        Numéro RC
                                    </label>
                                    <input
                                        id="rc_number"
                                        type="text"
                                        name="rc_number"
                                        value={data.rc_number}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="tax_number">
                                        Numéro d'impôt
                                    </label>
                                    <input
                                        id="tax_number"
                                        type="text"
                                        name="tax_number"
                                        value={data.tax_number}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="agency-bio">
                                        Bio
                                    </label>
                                    <textarea
                                        id="agency-bio"
                                        name="bio"
                                        value={data.bio}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
                                        placeholder="Description de l'agence..."
                                    />
                                </div>

                                {!photoAlreadyPresent && (
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="agency_logo">
                                            Logo de l'agence
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="agency_logo"
                                                type="file"
                                                name="profile_photo"
                                                accept="image/*"
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <label
                                                htmlFor="agency_logo"
                                                className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors duration-200"
                                            >
                                                <Camera className="w-5 h-5 mr-2 text-gray-400" />
                                                <span className="text-sm text-gray-600">Choisir une image</span>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Footer with action buttons */}
                        <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-200">
                            <button
                                type="button"
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
                                onClick={onClose}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className={`px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 flex items-center gap-2 ${
                                    processing ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        <span>Soumission...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Soumettre</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellerPopup;