import { useForm } from '@inertiajs/react';
import {
    CheckCircle,
    FileImage,
    FileText,
    ImagePlus,
    Loader2,
    MapPin,
    UploadCloud,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface City {
    id: number;
    name: string;
    country_id: number;
}

interface Country {
    id: number;
    name: string;
    iso_code?: string;
}

interface CommunePopupProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    editMode?: boolean;
    cities?: City[];
    countries?: Country[];
}

type CommuneForm = {
    name: string;
    country_id: string;
    city_id: string;
    image: File | null;
    remove_image: boolean;
    _method: 'post' | 'put';
};

export default function CommunePopup({
    isOpen,
    onClose,
    initialData = {},
    editMode = false,
    cities = [],
    countries = [],
}: CommunePopupProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<CommuneForm>({
            name: '',
            country_id: '',
            city_id: '',
            image: null,
            remove_image: false,
            _method: 'post',
        });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const availableCities = data.country_id
        ? cities.filter(
              (city) => city.country_id.toString() === data.country_id,
          )
        : [];

    useEffect(() => {
        if (isOpen) {
            const initialCity = cities.find(
                (city) => city.id === Number(initialData?.city_id),
            );
            setData({
                name: initialData?.name ?? '',
                country_id:
                    initialData?.country_id?.toString() ??
                    initialCity?.country_id?.toString() ??
                    '',
                city_id: initialData?.city_id?.toString() ?? '',
                image: null,
                remove_image: false,
                _method: editMode ? 'put' : 'post',
            });
            setPreviewUrl(
                initialData?.image_url ??
                    (initialData?.image
                        ? `/storage/${initialData.image}`
                        : null),
            );
            clearErrors();
        } else {
            reset();
            setPreviewUrl(null);
        }
    }, [isOpen, initialData, editMode, cities]);

    useEffect(
        () => () => {
            if (previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        },
        [previewUrl],
    );

    if (!isOpen) return null;

    const selectImage = (file?: File) => {
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Choisissez une image JPG, PNG ou WebP.');
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            toast.error("L'image ne doit pas dépasser 4 Mo.");
            return;
        }

        if (previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        setData((current) => ({
            ...current,
            image: file,
            remove_image: false,
        }));
        setPreviewUrl(URL.createObjectURL(file));
    };

    const removeImage = () => {
        if (previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setData((current) => ({
            ...current,
            image: null,
            remove_image: Boolean(initialData?.image),
        }));
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            forceFormData: true,
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

        post(
            editMode && initialData?.id
                ? route('dashboard.municipalities.update', initialData.id)
                : route('dashboard.municipalities.store'),
            options,
        );
    };

    return (
        <div
            className="agency-modal-layer fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-300"
            role="dialog"
            aria-modal="true"
        >
            <div className="agency-modal flex max-h-[calc(100dvh-2rem)] w-full max-w-xl animate-in flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 fade-in zoom-in">
                <div className="agency-modal-header relative shrink-0 border-b border-gray-100 bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
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
                    className="agency-modal-body space-y-5 overflow-y-auto p-6 text-gray-900"
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
                            Pays
                        </label>
                        <div className="relative">
                            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
                                <MapPin size={18} />
                            </div>
                            <select
                                value={data.country_id}
                                onChange={(event) => {
                                    setData((current) => ({
                                        ...current,
                                        country_id: event.target.value,
                                        city_id: '',
                                    }));
                                }}
                                className="w-full appearance-none rounded-xl border border-gray-200 py-3 pr-10 pl-12 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-amber-500"
                                required
                            >
                                <option value="">Sélectionner un pays</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                        {country.iso_code
                                            ? ` (${country.iso_code})`
                                            : ''}
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
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Ville de rattachement
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
                                disabled={!data.country_id}
                            >
                                <option value="">
                                    {data.country_id
                                        ? 'Sélectionner une ville'
                                        : "Choisissez d'abord un pays"}
                                </option>
                                {availableCities.map((city) => (
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

                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <label
                                htmlFor="municipality-image"
                                className="text-sm font-semibold text-gray-700"
                            >
                                Image de la commune
                            </label>
                            <span className="text-xs text-gray-400">
                                JPG, PNG ou WebP · 4 Mo max.
                            </span>
                        </div>

                        <input
                            ref={inputRef}
                            id="municipality-image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            onChange={(event) =>
                                selectImage(event.target.files?.[0])
                            }
                        />

                        {previewUrl ? (
                            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                                <img
                                    src={previewUrl}
                                    alt={`Aperçu de ${data.name || 'la commune'}`}
                                    className="h-44 w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                                <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-3">
                                    <div className="min-w-0 text-white">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
                                            <FileImage className="h-4 w-4" />
                                            Image sélectionnée
                                        </div>
                                        <p className="truncate text-sm font-bold">
                                            {data.image?.name ??
                                                initialData?.image
                                                    ?.split('/')
                                                    .pop() ??
                                                'Image actuelle'}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                inputRef.current?.click()
                                            }
                                            className="rounded-xl bg-white/95 p-2.5 text-gray-800 shadow-sm transition hover:bg-white"
                                            aria-label="Remplacer l'image"
                                        >
                                            <ImagePlus className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="rounded-xl bg-red-500/95 p-2.5 text-white shadow-sm transition hover:bg-red-600"
                                            aria-label="Supprimer l'image"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                onDragEnter={(event) => {
                                    event.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragOver={(event) => event.preventDefault()}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(event) => {
                                    event.preventDefault();
                                    setIsDragging(false);
                                    selectImage(event.dataTransfer.files?.[0]);
                                }}
                                className={`group flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-6 text-center transition ${
                                    isDragging
                                        ? 'border-amber-500 bg-amber-50'
                                        : 'border-gray-200 bg-gray-50/80 hover:border-amber-400 hover:bg-amber-50/50'
                                }`}
                            >
                                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm transition-transform group-hover:-translate-y-1">
                                    <UploadCloud className="h-6 w-6" />
                                </span>
                                <span className="text-sm font-bold text-gray-800">
                                    Déposez une belle photo ici
                                </span>
                                <span className="mt-1 text-xs text-gray-500">
                                    ou cliquez pour parcourir vos fichiers
                                </span>
                            </button>
                        )}

                        {errors.image && (
                            <p className="text-xs font-medium text-red-500">
                                {errors.image}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="agency-btn-secondary flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-95"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="agency-btn-primary flex-[2] rounded-xl px-4 py-3 text-sm font-bold shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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
