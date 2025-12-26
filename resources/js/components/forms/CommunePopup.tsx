import { useForm } from '@inertiajs/react';
import { AlertCircle, Camera, CheckCircle, FileText, Globe, Loader2, MapPin, Upload, X } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

function resolveImagePreview(value) {
    if (!value) return null;
    if (typeof value === 'string') {
        if (value.startsWith('http') || value.startsWith('data:')) return value;
        return `/storage/${value}`;
    }
    return null;
}

export default function CommunePopup({
    isOpen,
    onClose,
    initialData = {},
    editMode = false,
}: {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    editMode?: boolean;
}) {
    const [imagePreview, setImagePreview] = useState(resolveImagePreview(initialData?.image));
    const [isDragging, setIsDragging] = useState(false);
    const [isImageHovered, setIsImageHovered] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: initialData?.name ?? '',
        country: initialData?.country ?? '',
        city: initialData?.city ?? '',
        image: null,
    });

    // Réinitialiser quand on ouvre/ferme ou quand les données initiales changent
    useEffect(() => {
        if (isOpen) {
            setData({
                name: initialData?.name ?? '',
                country: initialData?.country ?? '',
                city: initialData?.city ?? '',
                image: null,
            });
            setImagePreview(resolveImagePreview(initialData?.image));
            clearErrors();
        } else {
            reset();
            setImagePreview(null);
        }
    }, [isOpen, initialData?.id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error("Format d'image non supporté. Formats acceptés: JPEG, PNG, WebP");
            e.target.value = '';
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error('Image trop volumineuse. Taille maximale: 5 Mo');
            e.target.value = '';
            return;
        }

        setData('image', file);
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (ALLOWED_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE) {
                setData('image', file);
                const reader = new FileReader();
                reader.onload = () => setImagePreview(reader.result);
                reader.readAsDataURL(file);
            }
        }
    };

    const handleImageRemove = () => {
        setData('image', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submissionData = {
            ...data,
            name: data.name?.trim(),
            country: data.country?.trim(),
            city: data.city?.trim(),
        };

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(editMode ? 'Commune modifiée avec succès' : 'Commune créée avec succès');
                reset();
                setImagePreview(null);
                onClose();
            },
            onError: (errs) => {
                const errorList = Object.values(errs).flat();
                if (errorList.length) {
                    toast.error(errorList[0]);
                }
            },
        };

        if (editMode && initialData?.id) {
            put(route('dashboard.municipalities.update', initialData.id), submissionData, options);
        } else {
            post(route('dashboard.municipalities.store'), submissionData, options);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Overlay avec effet de flou */}
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

                {/* Modal content */}
                <div className="relative max-h-[90vh] w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                    {/* Header avec dégradé */}
                    <div className="bg-gradient-to-r from-amber-400 to-amber-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                                    {editMode ? <FileText size={24} className="text-white" /> : <Upload size={24} className="text-white" />}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{editMode ? 'Modifier la commune' : 'Créer une commune'}</h2>
                                    <p className="text-sm text-amber-100">
                                        {editMode ? 'Modifiez les informations de la commune' : 'Ajoutez une nouvelle commune'}
                                    </p>
                                </div>
                            </div>
                            <button type="button" className="rounded-full p-2 transition-colors hover:bg-white/20" onClick={onClose}>
                                <X size={24} className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="max-h-[60vh] space-y-6 overflow-y-auto p-6">
                        {/* Champ Nom */}
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                                Nom de la commune
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <FileText size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full rounded-lg border bg-white py-3 pr-4 pl-10 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Entrez le nom de la commune"
                                    required
                                    autoFocus
                                />
                            </div>
                            {errors.name && (
                                <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    <AlertCircle size={16} />
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        {/* Champ Pays */}
                        <div>
                            <label htmlFor="country" className="mb-2 block text-sm font-medium text-gray-700">
                                Pays
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Globe size={18} className="text-gray-400" />
                                </div>
                                <select
                                    id="country"
                                    value={data.country}
                                    onChange={(e) => setData('country', e.target.value)}
                                    className={`w-full appearance-none rounded-lg border bg-white py-3 pr-4 pl-10 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                                        errors.country ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    <option value="">Sélectionner un pays</option>
                                    <option value="COD">République Démocratique du Congo</option>
                                    <option value="RDC">République Démocratique du Congo</option>
                                </select>
                            </div>
                            {errors.country && (
                                <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    <AlertCircle size={16} />
                                    {errors.country}
                                </div>
                            )}
                        </div>

                        {/* Champ Ville */}
                        <div>
                            <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-700">
                                Ville
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MapPin size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="city"
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className={`w-full rounded-lg border bg-white py-3 pr-4 pl-10 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                                        errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Entrez le nom de la ville"
                                    required
                                />
                            </div>
                            {errors.city && (
                                <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    <AlertCircle size={16} />
                                    {errors.city}
                                </div>
                            )}
                        </div>

                        {/* Champ Image */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Image de la commune</label>
                            <div className="space-y-4">
                                {/* Zone de drag & drop */}
                                <div
                                    className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                                        isDragging ? 'border-amber-400 bg-amber-50' : 'border-gray-300 bg-gray-50 hover:border-amber-400'
                                    } ${isImageHovered ? 'border-amber-500 bg-amber-50' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Aperçu de l'image" className="h-48 w-full rounded-lg object-cover" />
                                            <button
                                                type="button"
                                                onClick={handleImageRemove}
                                                className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                                                title="Supprimer l'image"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                                                <Camera size={24} className="text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="mb-2 text-sm text-gray-600">Glissez-déposez une image ici</p>
                                                <p className="text-xs text-gray-500">ou cliquez pour parcourir</p>
                                            </div>
                                        </div>
                                    )}
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </div>

                                {/* Bouton d'upload */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-100 px-4 py-2 text-amber-700 transition-colors hover:bg-amber-200"
                                >
                                    <Upload size={16} />
                                    <span>Choisir une image</span>
                                </button>

                                {/* Informations sur l'image */}
                                <div className="text-center text-xs text-gray-500">Formats acceptés: JPEG, PNG, WebP • Taille maximale: 5 Mo</div>
                            </div>

                            {errors.image && (
                                <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    <AlertCircle size={16} />
                                    {errors.image}
                                </div>
                            )}
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg bg-gray-100 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                                disabled={processing}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 text-white transition-all hover:from-amber-500 hover:to-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                                        {editMode ? 'Modification...' : 'Création...'}
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={18} />
                                        {editMode ? 'Modifier' : 'Créer'}
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
