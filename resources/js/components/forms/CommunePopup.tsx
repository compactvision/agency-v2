import { useForm } from '@inertiajs/react';
import { CheckCircle, FileText, Loader2, MapPin, X } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface City {
    id: number;
    name: string;
}

interface CommunePopupProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    editMode?: boolean;
    cities?: City[];
}

export default function CommunePopup({
    isOpen,
    onClose,
    initialData = {},
    editMode = false,
    cities = [],
}: CommunePopupProps) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            city_id: '',
        });

    useEffect(() => {
        if (isOpen) {
            setData({
                name: initialData?.name ?? '',
                city_id: initialData?.city_id?.toString() ?? '',
            });
            clearErrors();
        } else {
            reset();
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    editMode
                        ? 'Commune modifiée avec succès'
                        : 'Commune créée avec succès',
                );
                reset();
                onClose();
            },
            onError: (errs: any) => {
                const errorList = Object.values(errs).flat();
                if (errorList.length) {
                    toast.error(errorList[0] as string);
                }
            },
        };

        if (editMode && initialData?.id) {
            put(
                route('dashboard.municipalities.update', initialData.id),
                options,
            );
        } else {
            post(route('dashboard.municipalities.store'), options);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-300">
            <div className="w-full max-w-lg animate-in overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 fade-in zoom-in">
                <div className="relative border-b border-gray-100 bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {editMode
                                    ? 'Modifier la commune'
                                    : 'Nouvelle commune'}
                            </h2>
                            <p className="text-sm text-amber-50">
                                {editMode
                                    ? 'Mettez à jour les informations de la commune'
                                    : 'Ajoutez une nouvelle commune géographique'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 rounded-lg p-2 transition-colors hover:bg-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-6 text-gray-900"
                >
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Nom de la commune
                        </label>
                        <div className="relative">
                            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
                                <FileText size={18} />
                            </div>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className={`w-full rounded-xl border py-3 pr-4 pl-12 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'} transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-amber-500`}
                                placeholder="Ex: Gombe, Ngaliema..."
                                required
                            />
                        </div>
                        {errors.name && (
                            <p className="text-xs font-medium text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Ville rattachement
                        </label>
                        <div className="relative">
                            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
                                <MapPin size={18} />
                            </div>
                            <select
                                value={data.city_id}
                                onChange={(e) =>
                                    setData('city_id', e.target.value)
                                }
                                className={`w-full appearance-none rounded-xl border py-3 pr-10 pl-12 ${errors.city_id ? 'border-red-500 bg-red-50' : 'border-gray-200'} transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-amber-500`}
                                required
                            >
                                <option value="">Sélectionner une ville</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-400">
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                        {errors.city_id && (
                            <p className="text-xs font-medium text-red-500">
                                {errors.city_id}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-200 active:scale-95"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-[2] rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-600 hover:to-amber-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Enregistrement...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <CheckCircle size={18} />
                                    <span>
                                        {editMode
                                            ? 'Mettre à jour'
                                            : 'Créer la commune'}
                                    </span>
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
