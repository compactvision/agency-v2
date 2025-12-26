import { useForm } from '@inertiajs/react';
import {
    BarChart3,
    Calendar,
    Check,
    DollarSign,
    FileText,
    Headphones,
    Home,
    Image,
    Save,
    Star,
    Tag,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { route } from 'ziggy-js';

type Feature = { name: string };

type Plan = {
    id?: number;
    name: string;
    price: string;
    duration: string;
    listing_limit: number | null;
    image_limit: number | null;
    is_featured: boolean;
    highlight_homepage: boolean;
    priority_support: boolean;
    analytics_access: boolean;
    description: string;
    features: Feature[];
    image?: string | null;
    payment_method: 'manual' | 'automatic';
};

type TarifPopupProps = {
    plan: Plan | null;
    onClose: () => void;
    isEditing: boolean;
};

type CheckboxOptionProps = {
    id: string;
    label: string;
    checked: boolean;
    onChange: (id: string, checked: boolean) => void;
    icon?: React.ReactNode;
    disabled?: boolean;
};

export default function TarifPopup({
    plan,
    onClose,
    isEditing,
}: TarifPopupProps) {
    const [activeSection, setActiveSection] = useState('basic');

    const { data, setData, post, put, processing, errors, reset, transform } =
        useForm({
            name: '',
            price: '',
            duration: '',
            listing_limit: '',
            image_limit: '',
            is_featured: false,
            highlight_homepage: false,
            priority_support: false,
            analytics_access: false,
            description: '',
            features: '',
            payment_method: 'manual',
        });

    useEffect(() => {
        transform((data) => ({
            ...data,
            features:
                typeof data.features === 'string'
                    ? data.features
                          .split(',')
                          .map((f: string) => f.trim())
                          .filter(Boolean)
                    : data.features,
        }));
    }, [transform]);

    // populate form when plan changes
    useEffect(() => {
        if (plan) {
            setData({
                name: plan.name ?? '',
                price: String(plan.price ?? ''),
                duration: plan.duration ?? '',
                listing_limit: plan.listing_limit?.toString() ?? '',
                image_limit: plan.image_limit?.toString() ?? '',
                highlight_homepage: !!plan.highlight_homepage,
                priority_support: !!plan.priority_support,
                analytics_access: !!plan.analytics_access,
                is_featured: !!plan.is_featured,
                description: plan.description ?? '',
                features: (plan.features ?? []).map((f) => f.name).join(', '),
                payment_method: plan.payment_method ?? 'manual',
            });
        } else {
            reset();
        }
    }, [plan, reset, setData]);

    // Close on Escape
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        },
        [onClose],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement &
            HTMLTextAreaElement &
            HTMLSelectElement;
        setData(name as any, type === 'checkbox' ? (checked as any) : value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && plan) {
            put(route('dashboard.plans.update', { id: plan.id }), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('dashboard.plans.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    // CORRECTION: Empêcher la propagation sur l'overlay
    const handleOverlayClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
    };

    const sections = [
        { id: 'basic', label: 'Informations de base', icon: <Tag size={16} /> },
        { id: 'limits', label: 'Limites', icon: <Calendar size={16} /> },
        { id: 'features', label: 'Fonctionnalités', icon: <Star size={16} /> },
        { id: 'visibility', label: 'Visibilité', icon: <Home size={16} /> },
    ];

    const CheckboxOption = ({
        id,
        label,
        checked,
        onChange,
        icon,
        disabled = false,
    }: CheckboxOptionProps) => (
        <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!disabled) onChange(id, !checked);
                }
            }}
            onClick={() => !disabled && onChange(id, !checked)}
            className={`flex items-center rounded-xl border-2 p-4 transition-all ${
                checked
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
            } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
            <div
                className={`mr-3 flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors ${
                    checked
                        ? 'border-amber-500 bg-amber-500'
                        : 'border-gray-300'
                }`}
            >
                {checked && <Check size={14} className="text-white" />}
            </div>
            <div className="flex items-center">
                {icon && <div className="mr-2 text-amber-500">{icon}</div>}
                <span className="font-medium text-gray-900">{label}</span>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
            {/* container centers content */}
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Overlay - CORRECTION: onClick appelle handleOverlayClick */}
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={handleOverlayClick}
                    aria-hidden="true"
                />

                {/* Modal content - CORRECTION: stopPropagation pour empêcher la fermeture */}
                <div
                    className="relative z-50 max-h-[90vh] w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-400 to-amber-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">
                                {isEditing
                                    ? `Modifier le plan: ${plan?.name ?? ''}`
                                    : 'Créer un nouveau plan'}
                            </h2>
                            {/* CORRECTION: onClick direct sur onClose */}
                            <button
                                type="button"
                                aria-label="Fermer"
                                className="rounded-full p-2 transition-colors hover:bg-white/20"
                                onClick={onClose}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Navigation sections */}
                    <div className="flex border-b border-gray-200">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                                    activeSection === section.id
                                        ? 'border-b-2 border-amber-600 bg-amber-50 text-amber-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {section.icon}
                                {section.label}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="max-h-[60vh] space-y-6 overflow-y-auto p-6"
                    >
                        {/* Basic */}
                        {activeSection === 'basic' && (
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Nom du plan
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Tag
                                                size={18}
                                                className="text-gray-400"
                                            />
                                        </div>
                                        <input
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={handleChange}
                                            required
                                            disabled={processing}
                                            className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                            placeholder="Nom du plan"
                                        />
                                    </div>
                                    {errors.name && (
                                        <div className="mt-2 flex items-center text-sm text-red-600">
                                            <span className="mr-1">⚠️</span>
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="price"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Prix
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <DollarSign
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                id="price"
                                                name="price"
                                                value={data.price}
                                                onChange={handleChange}
                                                required
                                                disabled={processing}
                                                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                placeholder="99.99"
                                            />
                                        </div>
                                        {errors.price && (
                                            <div className="mt-2 flex items-center text-sm text-red-600">
                                                <span className="mr-1">⚠️</span>
                                                {errors.price}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="duration"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Durée
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Calendar
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <select
                                                id="duration"
                                                name="duration"
                                                value={data.duration}
                                                onChange={handleChange}
                                                required
                                                disabled={processing}
                                                className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                            >
                                                <option value="">
                                                    Sélectionner une durée
                                                </option>
                                                <option value="monthly">
                                                    Mensuel
                                                </option>
                                                <option value="yearly">
                                                    Annuel
                                                </option>
                                            </select>
                                        </div>
                                        {errors.duration && (
                                            <div className="mt-2 flex items-center text-sm text-red-600">
                                                <span className="mr-1">⚠️</span>
                                                {errors.duration}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="payment_method"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Méthode de paiement
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <DollarSign
                                                size={18}
                                                className="text-gray-400"
                                            />
                                        </div>
                                        <select
                                            id="payment_method"
                                            name="payment_method"
                                            value={data.payment_method}
                                            onChange={handleChange}
                                            required
                                            disabled={processing}
                                            className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                        >
                                            <option value="manual">
                                                Manuel (Validation Admin)
                                            </option>
                                            <option value="automatic">
                                                Automatique (Gateway)
                                            </option>
                                        </select>
                                    </div>
                                    {errors.payment_method && (
                                        <div className="mt-2 flex items-center text-sm text-red-600">
                                            <span className="mr-1">⚠️</span>
                                            {errors.payment_method}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Description
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 pt-3 pl-3">
                                            <FileText
                                                size={18}
                                                className="text-gray-400"
                                            />
                                        </div>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            onChange={handleChange}
                                            disabled={processing}
                                            rows={4}
                                            className="w-full resize-none rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                            placeholder="Description du plan..."
                                        />
                                    </div>
                                    {errors.description && (
                                        <div className="mt-2 flex items-center text-sm text-red-600">
                                            <span className="mr-1">⚠️</span>
                                            {errors.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Limits */}
                        {activeSection === 'limits' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="listing_limit"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Limite d'annonces
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <FileText
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                id="listing_limit"
                                                name="listing_limit"
                                                type="number"
                                                value={
                                                    data.listing_limit as any
                                                }
                                                onChange={handleChange}
                                                disabled={processing}
                                                min={0}
                                                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                placeholder="10"
                                            />
                                        </div>
                                        {errors.listing_limit && (
                                            <div className="mt-2 flex items-center text-sm text-red-600">
                                                <span className="mr-1">⚠️</span>
                                                {errors.listing_limit}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="image_limit"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Limite d'images
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Image
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <input
                                                id="image_limit"
                                                name="image_limit"
                                                type="number"
                                                value={data.image_limit as any}
                                                onChange={handleChange}
                                                disabled={processing}
                                                min={0}
                                                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                                placeholder="20"
                                            />
                                        </div>
                                        {errors.image_limit && (
                                            <div className="mt-2 flex items-center text-sm text-red-600">
                                                <span className="mr-1">⚠️</span>
                                                {errors.image_limit}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Features */}
                        {activeSection === 'features' && (
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="features"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Fonctionnalités (séparées par des
                                        virgules)
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 pt-3 pl-3">
                                            <Star
                                                size={18}
                                                className="text-gray-400"
                                            />
                                        </div>
                                        <textarea
                                            id="features"
                                            name="features"
                                            value={data.features}
                                            onChange={handleChange}
                                            disabled={processing}
                                            rows={4}
                                            className="w-full resize-none rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                            placeholder="Fonctionnalité 1, Fonctionnalité 2, Fonctionnalité 3..."
                                        />
                                    </div>
                                    {errors.features && (
                                        <div className="mt-2 flex items-center text-sm text-red-600">
                                            <span className="mr-1">⚠️</span>
                                            {errors.features}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Visibility */}
                        {activeSection === 'visibility' && (
                            <div className="space-y-4">
                                <h3 className="mb-4 text-lg font-medium text-gray-900">
                                    Options de visibilité
                                </h3>

                                <CheckboxOption
                                    id="is_featured"
                                    label="Plan en vedette"
                                    checked={!!data.is_featured}
                                    onChange={(id, checked) =>
                                        setData(id as any, checked)
                                    }
                                    icon={<Star size={18} />}
                                    disabled={processing}
                                />
                                {errors.is_featured && (
                                    <div className="mt-2 flex items-center text-sm text-red-600">
                                        <span className="mr-1">⚠️</span>
                                        {errors.is_featured}
                                    </div>
                                )}

                                <CheckboxOption
                                    id="highlight_homepage"
                                    label="Mettre en avant sur la page d'accueil"
                                    checked={!!data.highlight_homepage}
                                    onChange={(id, checked) =>
                                        setData(id as any, checked)
                                    }
                                    icon={<Home size={18} />}
                                    disabled={processing}
                                />
                                {errors.highlight_homepage && (
                                    <div className="mt-2 flex items-center text-sm text-red-600">
                                        <span className="mr-1">⚠️</span>
                                        {errors.highlight_homepage}
                                    </div>
                                )}

                                <CheckboxOption
                                    id="priority_support"
                                    label="Support prioritaire"
                                    checked={!!data.priority_support}
                                    onChange={(id, checked) =>
                                        setData(id as any, checked)
                                    }
                                    icon={<Headphones size={18} />}
                                    disabled={processing}
                                />
                                {errors.priority_support && (
                                    <div className="mt-2 flex items-center text-sm text-red-600">
                                        <span className="mr-1">⚠️</span>
                                        {errors.priority_support}
                                    </div>
                                )}

                                <CheckboxOption
                                    id="analytics_access"
                                    label="Accès aux analyses"
                                    checked={!!data.analytics_access}
                                    onChange={(id, checked) =>
                                        setData(id as any, checked)
                                    }
                                    icon={<BarChart3 size={18} />}
                                    disabled={processing}
                                />
                                {errors.analytics_access && (
                                    <div className="mt-2 flex items-center text-sm text-red-600">
                                        <span className="mr-1">⚠️</span>
                                        {errors.analytics_access}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                            <button
                                type="button"
                                className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
                                onClick={onClose}
                                disabled={processing}
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-2 font-medium text-white"
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            className="h-5 w-5 animate-spin text-white"
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
                                        <Save size={18} />
                                        {isEditing ? 'Mettre à jour' : 'Créer'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
