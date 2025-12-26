import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import { router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Building,
    CheckCircle,
    CheckSquare,
    ChevronDown,
    ChevronRight,
    DollarSign,
    FileText,
    Home,
    Image,
    MapPin,
    RotateCcw,
    Save,
    Trash2,
    Upload,
    Zap,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Municipality = {
    id: number;
    name: string;
    country: string;
    city?: string;
};

type Amenity = {
    id: number;
    name: string;
};

type Property = {
    id?: number;
    title: string;
    description: string;
    type: string;
    sale_type: string;
    reference_number: string;
    price: string;
    rental_guarantee: string;
    surface: string;
    bedrooms: string;
    bathrooms: string;
    kitchens: string;
    rooms: string;
    garages: string;
    garage_size: string;
    balconies: string;
    terraces: string;
    floor: string;
    total_floors: string;
    address: string;
    quarter: string;
    city: string;
    country: string;
    postal_code: string;
    municipality_id: number | null;
    map_location: string;
    latitude: string;
    longitude: string;
    construction_year: string;
    renovation_year: string;
    condition: string;
    furnished: boolean;
    elevator: boolean;
    parking: boolean;
    garden: boolean;
    swimming_pool: boolean;
    cellar: boolean;
    attic: boolean;
    urgency: string;
    is_published: boolean;
    is_featured: boolean;
    images: File[];
    amenities: number[];
    existing_images?: Array<{ id: number; url: string }>;
    slug?: string;
    land_surface?: string;
};

interface Props {
    countries: { [key: string]: string };
    municipalities: Municipality[];
    amenities: Amenity[];
    hasActiveSubscription: boolean;
    property?: Property | null;
}

const PropertyForm: React.FC<Props> = ({ countries, municipalities, amenities, hasActiveSubscription, property = null }) => {
    const { t } = useTranslation();
    const { auth } = usePage().props as { auth: { user: any } };
    const isEditMode = !!property?.id;
    const fileInputRef = useRef<HTMLInputElement>(null);

    // États pour l'UI responsive
    const [activeSection, setActiveSection] = useState('basic');
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [availableMunicipalities, setAvailableMunicipalities] = useState<Municipality[]>([]);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDescriptionGenerated, setIsDescriptionGenerated] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<any[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Détection de la taille d'écran
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768); // Changement de 640 à 768 pour une meilleure expérience tablette
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Initialisation des données du formulaire
    const initializeFormData = useCallback(() => {
        const baseData = {
            title: '',
            description: '',
            type: '',
            sale_type: '',
            reference_number: '',
            price: '',
            rental_guarantee: '',
            surface: '',
            bedrooms: '0',
            bathrooms: '0',
            kitchens: '0',
            rooms: '0',
            garages: '0',
            garage_size: '',
            balconies: '0',
            terraces: '0',
            floor: '0',
            total_floors: '1',
            address: '',
            quarter: '',
            city: '',
            country: '',
            postal_code: '',
            municipality_id: null,
            map_location: '',
            latitude: '',
            longitude: '',
            construction_year: '',
            renovation_year: '',
            condition: '',
            furnished: false,
            elevator: false,
            parking: false,
            garden: false,
            swimming_pool: false,
            cellar: false,
            attic: false,
            urgency: 'normal',
            is_published: true,
            is_featured: false,
            images: [] as File[],
            amenities: [] as number[],
            existing_images: [] as Array<{ id: number; url: string }>,
            land_surface: '',
            slug: '',
            images_to_delete: [] as number[],
        };

        if (property && isEditMode) {
            const amenityIds = Array.isArray((property as any).amenities)
                ? ((property as any).amenities as Array<{ id: number }>).map((a) => a.id)
                : property.amenities || [];

            const existingImages = Array.isArray((property as any).images)
                ? ((property as any).images as Array<any>).map((img) => ({
                      id: img.id,
                      url: img.url?.startsWith('http') || img.url?.startsWith('/') ? img.url : `/storage/${img.url}`,
                      name: img.original_name ?? `Image ${img.id}`,
                      isExisting: true,
                  }))
                : property.existing_images || [];

            return {
                ...baseData,
                title: property.title || '',
                description: property.description || '',
                type: property.type || '',
                sale_type: property.sale_type || '',
                reference_number: property.reference_number || '',
                price: property.price?.toString() || '',
                rental_guarantee: property.rental_guarantee?.toString() || '',
                surface: property.surface?.toString() || '',
                bedrooms: property.bedrooms?.toString() || '0',
                bathrooms: property.bathrooms?.toString() || '0',
                kitchens: property.kitchens?.toString() || '0',
                rooms: property.rooms?.toString() || '0',
                garages: property.garages?.toString() || '0',
                garage_size: property.garage_size?.toString() || '',
                balconies: property.balconies?.toString() || '0',
                terraces: property.terraces?.toString() || '0',
                floor: property.floor?.toString() || '0',
                total_floors: property.total_floors?.toString() || '1',
                address: property.address || '',
                quarter: property.quarter || '',
                city: property.city || '',
                country: property.country || '',
                postal_code: property.postal_code || '',
                municipality_id: property.municipality_id || null,
                map_location: property.map_location || '',
                latitude: property.latitude?.toString() || '',
                longitude: property.longitude?.toString() || '',
                construction_year: property.construction_year?.toString() || '',
                renovation_year: property.renovation_year?.toString() || '',
                condition: property.condition || '',
                furnished: !!property.furnished,
                elevator: !!property.elevator,
                parking: !!property.parking,
                garden: !!property.garden,
                swimming_pool: !!property.swimming_pool,
                cellar: !!property.cellar,
                attic: !!property.attic,
                urgency: property.urgency || 'normal',
                is_published: property.is_published !== undefined ? !!property.is_published : true,
                is_featured: !!property.is_featured,
                images: [] as File[],
                amenities: amenityIds,
                existing_images: existingImages,
                land_surface: property.land_surface?.toString() || '',
                slug: property.slug || '',
                images_to_delete: [] as number[],
            };
        }

        return baseData;
    }, [property, isEditMode]);

    const { data, setData, post, put, errors, processing, reset, transform } = useForm(initializeFormData());

    // Fonctions utilitaires
    const generateReferenceNumber = useCallback(() => {
        return 'REF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }, []);

    const generateSlug = useCallback((title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-');
    }, []);

    // Effets pour l'initialisation
    useEffect(() => {
        if (!isEditMode && !data.reference_number) {
            setData('reference_number', generateReferenceNumber());
        }
    }, [isEditMode, data.reference_number, generateReferenceNumber, setData]);

    useEffect(() => {
        if (data.title) {
            const slug = generateSlug(data.title);
            if (!data.slug || !isEditMode) {
                setData('slug', slug);
            }
        }
    }, [data.title, isEditMode, generateSlug, setData]);

    // Effets pour la localisation
    useEffect(() => {
        if (isEditMode && property) {
            if (property.country) {
                const citiesInCountry = [
                    ...new Set(
                        municipalities
                            .filter((m) => m.country === property.country)
                            .map((m) => m.city)
                            .filter(Boolean),
                    ),
                ] as string[];
                setAvailableCities(citiesInCountry);

                if (property.city) {
                    const municipalitiesInCity = municipalities.filter((m) => m.country === property.country && m.city === property.city);
                    setAvailableMunicipalities(municipalitiesInCity);
                }
            }
        }
    }, [isEditMode, property, municipalities]);

    useEffect(() => {
        if (data.country) {
            const citiesInCountry = [
                ...new Set(
                    municipalities
                        .filter((m) => m.country === data.country)
                        .map((m) => m.city)
                        .filter(Boolean),
                ),
            ] as string[];
            setAvailableCities(citiesInCountry);

            if (!isEditMode) {
                if (data.city && !citiesInCountry.includes(data.city)) {
                    setData((prev) => ({
                        ...prev,
                        city: '',
                        municipality_id: null,
                    }));
                }
                setAvailableMunicipalities([]);
            }
        } else {
            setAvailableCities([]);
            setAvailableMunicipalities([]);
        }
    }, [data.country, municipalities, isEditMode, setData]);

    useEffect(() => {
        if (data.city && data.country) {
            const municipalitiesInCity = municipalities.filter((m) => m.country === data.country && m.city === data.city);
            setAvailableMunicipalities(municipalitiesInCity);

            if (data.municipality_id && !municipalitiesInCity.some((m) => m.id === data.municipality_id)) {
                setData((prev) => ({
                    ...prev,
                    municipality_id: null,
                }));
            }
        } else {
            setAvailableMunicipalities([]);
            if (!isEditMode && data.municipality_id) {
                setData((prev) => ({
                    ...prev,
                    municipality_id: null,
                }));
            }
        }
    }, [data.city, data.country, municipalities, isEditMode, setData]);

    // Effet pour les images existantes
    useEffect(() => {
        if (!isEditMode) return;
        const imgs = (data as any).existing_images;
        if (!Array.isArray(imgs) || imgs.length === 0) return;

        setImagePreviews((prev) => {
            if (prev.length) return prev;
            return imgs.map((img: any) => ({
                id: img.id,
                url: img.url,
                name: img.name ?? `Image ${img.id}`,
                isExisting: true,
            }));
        });
    }, [isEditMode, (data as any).existing_images]);

    // Gestionnaires d'événements
    const handleInputChange = useCallback(
        (field: string, value: any) => {
            if (!hasActiveSubscription) return;
            setData((prev) => ({
                ...prev,
                [field]: value,
            }));
        },
        [hasActiveSubscription, setData],
    );

    const handleCheckboxChange = useCallback(
        (field: keyof typeof data) => {
            if (!hasActiveSubscription) return;
            setData((prev) => ({
                ...prev,
                [field]: !(prev as any)[field],
            }));
        },
        [hasActiveSubscription, setData],
    );

    const handleAmenityChange = useCallback(
        (amenityId: number) => {
            if (!hasActiveSubscription) return;

            setData((prev) => {
                const currentAmenities = prev.amenities || [];
                const updatedAmenities = currentAmenities.includes(amenityId)
                    ? currentAmenities.filter((a) => a !== amenityId)
                    : [...currentAmenities, amenityId];

                return {
                    ...prev,
                    amenities: updatedAmenities,
                };
            });
        },
        [hasActiveSubscription, setData],
    );

    const handleFileUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!hasActiveSubscription) return;

            const files = Array.from(e.target.files || []);

            setData((prev) => ({
                ...prev,
                images: [...(prev.images || []), ...files],
            }));

            const newPreviews = files
                .map((file) => {
                    if (file.type.startsWith('image/')) {
                        return {
                            file: file,
                            url: URL.createObjectURL(file),
                            name: file.name,
                            isExisting: false,
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            setImagePreviews((prev) => [...prev, ...newPreviews]);
        },
        [hasActiveSubscription, setData],
    );

    const removeFile = useCallback(
        (index: number) => {
            if (!hasActiveSubscription) return;

            const previewToRemove = imagePreviews[index];

            if (previewToRemove.isExisting && previewToRemove.id) {
                const newImagesToDelete = [...imagesToDelete, previewToRemove.id];
                setImagesToDelete(newImagesToDelete);
                setData((prev) => ({
                    ...prev,
                    images_to_delete: newImagesToDelete,
                }));
            } else {
                URL.revokeObjectURL(previewToRemove.url);
                const existingImagesCount = imagePreviews.filter((p) => p.isExisting).length;
                const newImageIndex = index - existingImagesCount;
                if (newImageIndex >= 0) {
                    setData((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== newImageIndex),
                    }));
                }
            }

            const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
            setImagePreviews(updatedPreviews);
        },
        [hasActiveSubscription, imagePreviews, imagesToDelete, setData],
    );

    const handleGenerateDescription = useCallback(async () => {
        if (!hasActiveSubscription) return;

        setLoading(true);
        try {
            const municipalityName = municipalities.find((m) => m.id === data.municipality_id)?.name || '';
            const selectedAmenities = data.amenities.map((id) => amenities.find((a) => a.id === id)?.name || '').filter(Boolean);

            const response = await axios.post(route('description.ai.generate-description'), {
                type: data.type,
                sale_type: data.sale_type,
                municipality: municipalityName,
                price: data.price,
                surface: data.surface,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                rooms: data.rooms,
                kitchens: data.kitchens,
                amenities: selectedAmenities,
            });

            setData((prev) => ({
                ...prev,
                description: response.data.description,
            }));
            setIsDescriptionGenerated(true);
        } catch (error: any) {
            const message = error?.response?.data?.error || 'Erreur lors de la génération de la description.';
            setSubmitStatus('error');
            setSubmitMessage(message);
        } finally {
            setLoading(false);
        }
    }, [hasActiveSubscription, municipalities, amenities, data, setData]);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            if (!hasActiveSubscription) return;

            setSubmitStatus('idle');
            setSubmitMessage('');

            const submitData = {
                ...data,
                price: data.price ? parseFloat(data.price) : 0,
                surface: data.surface ? parseFloat(data.surface) : null,
                rental_guarantee: data.sale_type === 'rent' ? (data.rental_guarantee ? parseFloat(data.rental_guarantee) : 0) : null,
                bedrooms: Number.isFinite(parseInt(data.bedrooms)) ? parseInt(data.bedrooms) : 0,
                bathrooms: Number.isFinite(parseInt(data.bathrooms)) ? parseInt(data.bathrooms) : 0,
                kitchens: Number.isFinite(parseInt(data.kitchens)) ? parseInt(data.kitchens) : 0,
                rooms: Number.isFinite(parseInt(data.rooms)) ? parseInt(data.rooms) : 0,
                terraces: Number.isFinite(parseInt(data.terraces)) ? parseInt(data.terraces) : 0,
                balconies: Number.isFinite(parseInt(data.balconies)) ? parseInt(data.balconies) : 0,
                floor: data.floor ? parseInt(data.floor) : null,
                total_floors: data.total_floors ? parseInt(data.total_floors) : null,
                construction_year: data.construction_year ? parseInt(data.construction_year) : null,
                renovation_year: data.renovation_year ? parseInt(data.renovation_year) : null,
                garages: Number.isFinite(parseInt(data.garages)) ? parseInt(data.garages) : 0,
                garage_size: data.garage_size || null,
                land_surface: undefined,
                images_to_delete: imagesToDelete,
            };

            const payload: any = { ...submitData };
            delete payload.existing_images;
            if (payload.land_surface === undefined) delete payload.land_surface;

            if (Array.isArray(payload.amenities)) {
                payload.amenities = payload.amenities.map((n: any) => parseInt(n));
            }

            ['furnished', 'elevator', 'parking', 'garden', 'swimming_pool', 'cellar', 'attic', 'is_published', 'is_featured'].forEach((k) => {
                payload[k] = !!payload[k];
            });

            const onSuccessCallback = () => {
                setSubmitStatus('success');
                setSubmitMessage(isEditMode ? 'Propriété mise à jour avec succès!' : 'Propriété créée avec succès!');
                if (!isEditMode) {
                    reset();
                    setImagePreviews([]);
                    setImagesToDelete([]);
                }
            };

            const onErrorCallback = (errors: any) => {
                setSubmitStatus('error');
                setSubmitMessage(
                    isEditMode
                        ? 'Erreur lors de la mise à jour de la propriété. Veuillez vérifier les champs.'
                        : 'Erreur lors de la création de la propriété. Veuillez vérifier les champs.',
                );
                console.error('Erreurs:', errors);
            };

            if (isEditMode && property?.id) {
                if (!payload.images?.length) delete payload.images;
                if (!payload.images_to_delete?.length) delete payload.images_to_delete;

                transform(() => ({
                    ...payload,
                    _method: 'PUT',
                }));

                post(route('dashboard.properties.update', property.id), {
                    preserveScroll: true,
                    forceFormData: true,
                    onSuccess: onSuccessCallback,
                    onError: onErrorCallback,
                });
            } else {
                transform(() => payload);
                post(route('dashboard.properties.store'), {
                    preserveScroll: true,
                    forceFormData: true,
                    onSuccess: onSuccessCallback,
                    onError: onErrorCallback,
                });
            }
        },
        [hasActiveSubscription, data, imagesToDelete, isEditMode, property, reset, transform, post],
    );

    const resetForm = useCallback(() => {
        reset();
        setImagePreviews([]);
        setImagesToDelete([]);
        setIsDescriptionGenerated(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        imagePreviews.forEach((p) => {
            if (!p.isExisting && p.url) {
                try {
                    URL.revokeObjectURL(p.url);
                } catch {}
            }
        });
    }, [reset, imagePreviews]);

    // Vérifier si la description peut être générée
    const canGenerateDescription = data.type && data.sale_type && data.municipality_id && data.price && data.surface && data.bedrooms;

    // Vérifier si les champs requis sont remplis
    const requiredFieldsFilled = data.title && data.type && data.sale_type && data.municipality_id && data.price && data.surface && data.bedrooms;

    // Sections de navigation
    const sections = [
        { id: 'basic', label: 'Infos', icon: Home, fullLabel: 'Infos principales' },
        { id: 'pricing', label: 'Prix', icon: DollarSign, fullLabel: 'Prix et transaction' },
        { id: 'features', label: 'Caract.', icon: Building, fullLabel: 'Caractéristiques' },
        { id: 'location', label: 'Localisation', icon: MapPin, fullLabel: 'Localisation' },
        { id: 'equipment', label: 'Équip.', icon: CheckSquare, fullLabel: 'Équipements' },
        { id: 'media', label: 'Photos', icon: Image, fullLabel: 'Photos et médias' },
        { id: 'publication', label: 'Publication', icon: FileText, fullLabel: 'Publication' },
    ];

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                {/* Header responsive */}
                <div className="sticky top-0 z-1 border-b border-amber-200/30 bg-white/80 shadow-lg shadow-amber-500/5 backdrop-blur-xl">
                    <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                onClick={() => router.visit(route('dashboard.properties.index'))}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-100/50 px-3 py-2 text-amber-700 transition-colors duration-200 hover:bg-amber-100 sm:w-auto"
                            >
                                <ArrowLeft size={16} />
                                <span className="text-sm sm:text-base">Retour</span>
                            </button>

                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-xl font-bold text-transparent sm:text-2xl lg:text-3xl">
                                    {isEditMode ? 'Modifier' : 'Publier'} une propriété
                                </h1>
                                <p className="mt-1 px-2 text-sm text-slate-600 sm:text-base">
                                    {isEditMode
                                        ? 'Modifiez les détails de votre propriété'
                                        : 'Remplissez tous les détails pour attirer les meilleurs acheteurs'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alertes responsives */}
                <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
                    {submitStatus === 'success' && (
                        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-100 p-3 text-emerald-800 sm:p-4">
                            <CheckCircle size={20} />
                            <span className="text-sm sm:text-base">{submitMessage}</span>
                        </div>
                    )}

                    {!hasActiveSubscription && (
                        <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-100 p-3 text-amber-800 sm:flex-row sm:p-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle size={20} />
                                <span className="text-sm sm:text-base">{t('no_active_subscription')}</span>
                            </div>
                            <a
                                href={route('dashboard.subscriptions.index')}
                                className="rounded-lg bg-amber-500 px-4 py-2 text-center text-sm text-white transition-colors hover:bg-amber-600 sm:text-base"
                            >
                                {t('subscribe_now')}
                            </a>
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="rounded-xl border border-red-200 bg-red-100 p-3 text-red-800 sm:p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle size={20} />
                                <div className="flex-1">
                                    <span className="text-sm sm:text-base">{submitMessage}</span>
                                    {Object.keys(errors).length > 0 && (
                                        <ul className="mt-2 list-inside list-disc text-xs sm:text-sm">
                                            {Object.entries(errors).map(([field, error]) => (
                                                <li key={field}>
                                                    <span className="font-medium">{field}:</span> {error}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Formulaire responsive */}
                <form onSubmit={handleSubmit} className="px-3 pb-8 sm:px-4 lg:px-8">
                    <div className="relative overflow-hidden rounded-xl border border-amber-200/30 bg-white shadow-lg shadow-amber-500/10 sm:rounded-2xl">
                        {/* Overlay de désactivation */}
                        {!hasActiveSubscription && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                                <div className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl">
                                    <AlertCircle size={48} className="mx-auto mb-4 text-amber-500" />
                                    <h3 className="mb-2 text-xl font-semibold text-slate-900">Abonnement requis</h3>
                                    <p className="mb-4 text-sm text-slate-600">
                                        Vous devez avoir un abonnement actif pour {isEditMode ? 'modifier' : 'publier'} une propriété.
                                    </p>
                                    <a
                                        href={route('dashboard.subscriptions.index')}
                                        className="inline-flex items-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:from-amber-500 hover:to-amber-700"
                                    >
                                        {t('subscribe_now')}
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Navigation par sections - Ultra responsive */}
                        <div className="border-b border-amber-200/30">
                            {/* Version desktop */}
                            <div className="hidden overflow-x-auto p-1 md:flex">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => setActiveSection(section.id)}
                                        className={`flex items-center gap-2 rounded-lg px-3 py-2 font-medium whitespace-nowrap transition-all duration-200 ${
                                            activeSection === section.id
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900'
                                        }`}
                                    >
                                        <section.icon size={16} />
                                        <span className="text-sm">{section.fullLabel}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Version tablette */}
                            <div className="hidden overflow-x-auto p-1 sm:flex md:hidden">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => setActiveSection(section.id)}
                                        className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 font-medium whitespace-nowrap transition-all duration-200 ${
                                            activeSection === section.id
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900'
                                        }`}
                                    >
                                        <section.icon size={18} />
                                        <span className="text-xs">{section.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Version mobile - Menu déroulant */}
                            <div className="sm:hidden">
                                <div className="flex items-center justify-between border-b border-amber-200/30 p-3">
                                    <div className="flex items-center gap-2">
                                        {sections.find((s) => s.id === activeSection)?.icon &&
                                            React.createElement(sections.find((s) => s.id === activeSection).icon, {
                                                size: 20,
                                                className: 'text-amber-500',
                                            })}

                                        <span className="text-sm font-medium">{sections.find((s) => s.id === activeSection)?.fullLabel}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="rounded-md p-1 transition-colors hover:bg-amber-50"
                                    >
                                        {isMobileMenuOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </button>
                                </div>

                                {isMobileMenuOpen && (
                                    <div className="bg-amber-50/50 p-2">
                                        {sections.map((section) => (
                                            <button
                                                key={section.id}
                                                type="button"
                                                onClick={() => {
                                                    setActiveSection(section.id);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 font-medium transition-all duration-200 ${
                                                    activeSection === section.id
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900'
                                                }`}
                                            >
                                                <section.icon size={16} />
                                                <span className="text-sm">{section.fullLabel}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contenu du formulaire */}
                        <div className="p-4 sm:p-6 lg:p-8">
                            {/* Section: Informations de base */}
                            {activeSection === 'basic' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <Home size={20} className="text-amber-500" />
                                        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Informations principales</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                Titre de la propriété <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                placeholder="Ex: Villa moderne avec piscine à Gombe"
                                                value={data.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                disabled={!hasActiveSubscription}
                                            />
                                            {errors.title && <div className="mt-1 text-sm text-red-600">{errors.title}</div>}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Numéro de référence
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-lg border border-amber-200/50 bg-amber-50 px-3 py-2.5 text-sm text-slate-600 sm:text-base"
                                                    value={data.reference_number}
                                                    readOnly
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Niveau d'urgence <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    value={data.urgency}
                                                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                >
                                                    <option value="normal">Normal</option>
                                                    <option value="urgent">Urgent</option>
                                                    <option value="very_urgent">Très urgent</option>
                                                </select>
                                                {errors.urgency && <div className="mt-1 text-sm text-red-600">{errors.urgency}</div>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                Description détaillée
                                            </label>
                                            <div className="relative">
                                                <textarea
                                                    className="w-full resize-none rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    placeholder="Décrivez votre propriété en détail..."
                                                    value={data.description}
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                    rows={4}
                                                    disabled={!hasActiveSubscription}
                                                />
                                                {errors.description && <div className="mt-1 text-sm text-red-600">{errors.description}</div>}

                                                {/* Bouton de génération de description */}
                                                <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                                                    <button
                                                        type="button"
                                                        onClick={handleGenerateDescription}
                                                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 sm:text-base ${
                                                            !canGenerateDescription || loading || isDescriptionGenerated || !hasActiveSubscription
                                                                ? 'cursor-not-allowed bg-gray-100 text-gray-400 opacity-50'
                                                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                        }`}
                                                        disabled={
                                                            !canGenerateDescription || loading || isDescriptionGenerated || !hasActiveSubscription
                                                        }
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
                                                                Génération en cours...
                                                            </>
                                                        ) : isDescriptionGenerated ? (
                                                            <>
                                                                <CheckCircle size={16} />
                                                                Description générée
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Zap size={16} />
                                                                Générer avec l'IA
                                                            </>
                                                        )}
                                                    </button>

                                                    {!canGenerateDescription && !loading && !isDescriptionGenerated && (
                                                        <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                                                            <AlertTriangle size={12} />
                                                            <span>Remplissez les champs requis pour générer</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section: Prix et transaction */}
                            {activeSection === 'pricing' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <DollarSign size={20} className="text-amber-500" />
                                        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Prix et transaction</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Type de propriété <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    value={data.type}
                                                    onChange={(e) => handleInputChange('type', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                >
                                                    <option value="">Sélectionner un type</option>
                                                    <option value="apartment">Appartement</option>
                                                    <option value="house">Maison</option>
                                                    <option value="studio">Studio</option>
                                                    <option value="villa">Villa</option>
                                                    <option value="office">Bureau</option>
                                                    <option value="shop">Commerce</option>
                                                    <option value="land">Terrain</option>
                                                    <option value="garage">Garage</option>
                                                    <option value="warehouse">Entrepôt</option>
                                                    <option value="other">Autre</option>
                                                </select>
                                                {errors.type && <div className="mt-1 text-sm text-red-600">{errors.type}</div>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Type de transaction <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    value={data.sale_type}
                                                    onChange={(e) => handleInputChange('sale_type', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                >
                                                    <option value="">Type de transaction</option>
                                                    <option value="sale">Vente</option>
                                                    <option value="rent">Location</option>
                                                </select>
                                                {errors.sale_type && <div className="mt-1 text-sm text-red-600">{errors.sale_type}</div>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    {data.sale_type === 'rent' ? 'Loyer mensuel (USD)' : 'Prix de vente (USD)'}{' '}
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    placeholder={data.sale_type === 'rent' ? 'Ex: 80000' : 'Ex: 15000000'}
                                                    value={data.price}
                                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                />
                                                {errors.price && <div className="mt-1 text-sm text-red-600">{errors.price}</div>}
                                            </div>

                                            {data.sale_type === 'rent' && (
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                        Garantie locative (USD)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                        placeholder="Ex: 160000 (2 mois de loyer)"
                                                        value={data.rental_guarantee}
                                                        onChange={(e) => handleInputChange('rental_guarantee', e.target.value)}
                                                        disabled={!hasActiveSubscription}
                                                    />
                                                    {errors.rental_guarantee && (
                                                        <div className="mt-1 text-sm text-red-600">{errors.rental_guarantee}</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                État du bien <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                value={data.condition}
                                                onChange={(e) => handleInputChange('condition', e.target.value)}
                                                disabled={!hasActiveSubscription}
                                            >
                                                <option value="">Sélectionner l'état</option>
                                                <option value="new">Neuf</option>
                                                <option value="old">Ancien</option>
                                                <option value="renovated">Rénové</option>
                                                <option value="renovation_needed">À rénover</option>
                                            </select>
                                            {errors.condition && <div className="mt-1 text-sm text-red-600">{errors.condition}</div>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section: Caractéristiques */}
                            {activeSection === 'features' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <Building size={20} className="text-amber-500" />
                                        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Caractéristiques</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Surface habitable (m²) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    placeholder="Ex: 120"
                                                    value={data.surface}
                                                    onChange={(e) => handleInputChange('surface', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                />
                                                {errors.surface && <div className="mt-1 text-sm text-red-600">{errors.surface}</div>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Chambres <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    value={data.bedrooms}
                                                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                >
                                                    <option value="0">0</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6+</option>
                                                </select>
                                                {errors.bedrooms && <div className="mt-1 text-sm text-red-600">{errors.bedrooms}</div>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Salles de bain <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    value={data.bathrooms}
                                                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                >
                                                    <option value="0">0</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5+</option>
                                                </select>
                                                {errors.bathrooms && <div className="mt-1 text-sm text-red-600">{errors.bathrooms}</div>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Cuisines <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    value={data.kitchens}
                                                    onChange={(e) => handleInputChange('kitchens', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                >
                                                    <option value="0">0</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                </select>
                                                {errors.kitchens && <div className="mt-1 text-sm text-red-600">{errors.kitchens}</div>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Nombre de pièces <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    value={data.rooms}
                                                    onChange={(e) => handleInputChange('rooms', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                >
                                                    <option value="0">0</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6+</option>
                                                </select>
                                                {errors.rooms && <div className="mt-1 text-sm text-red-600">{errors.rooms}</div>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Balcons <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    value={data.balconies}
                                                    onChange={(e) => handleInputChange('balconies', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                >
                                                    <option value="0">0</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4+</option>
                                                </select>
                                                {errors.balconies && <div className="mt-1 text-sm text-red-600">{errors.balconies}</div>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Terrasses <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    value={data.terraces}
                                                    onChange={(e) => handleInputChange('terraces', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                >
                                                    <option value="0">0</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4+</option>
                                                </select>
                                                {errors.terraces && <div className="mt-1 text-sm text-red-600">{errors.terraces}</div>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Étage du bien <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    value={data.floor}
                                                    onChange={(e) => handleInputChange('floor', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                >
                                                    <option value="0">Rez-de-chaussée</option>
                                                    <option value="1">1er étage</option>
                                                    <option value="2">2e étage</option>
                                                    <option value="3">3e étage</option>
                                                    <option value="4">4e étage</option>
                                                    <option value="5">5e étage et +</option>
                                                </select>
                                                {errors.floor && <div className="mt-1 text-sm text-red-600">{errors.floor}</div>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Nombre total d'étages <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    value={data.total_floors}
                                                    onChange={(e) => handleInputChange('total_floors', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                >
                                                    <option value="1">1 étage</option>
                                                    <option value="2">2 étages</option>
                                                    <option value="3">3 étages</option>
                                                    <option value="4">4 étages</option>
                                                    <option value="5">5 étages et +</option>
                                                </select>
                                                {errors.total_floors && <div className="mt-1 text-sm text-red-600">{errors.total_floors}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section: Localisation */}
                            {activeSection === 'location' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <MapPin size={20} className="text-amber-500" />
                                        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Localisation</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                Adresse complète <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                placeholder="Ex: 145 Avenue de la Paix"
                                                value={data.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                disabled={!hasActiveSubscription}
                                            />
                                            {errors.address && <div className="mt-1 text-sm text-red-600">{errors.address}</div>}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Pays <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    value={data.country}
                                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                >
                                                    <option value="">Sélectionner un pays</option>
                                                    {Object.entries(countries).map(([code, name]) => (
                                                        <option key={code} value={code}>
                                                            {name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.country && <div className="mt-1 text-sm text-red-600">{errors.country}</div>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Ville <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    value={data.city}
                                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                                    disabled={!data.country || availableCities.length === 0 || !hasActiveSubscription}
                                                >
                                                    <option value="">Sélectionner une ville</option>
                                                    {availableCities.map((city) => (
                                                        <option key={city} value={city}>
                                                            {city}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.city && <div className="mt-1 text-sm text-red-600">{errors.city}</div>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Quartier <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    placeholder="Ex: Gombe, Kimpe, Lemba..."
                                                    value={data.quarter}
                                                    onChange={(e) => handleInputChange('quarter', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                />
                                                {errors.quarter && <div className="mt-1 text-sm text-red-600">{errors.quarter}</div>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Code postal <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    placeholder="Ex: 8200"
                                                    value={data.postal_code}
                                                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                />
                                                {errors.postal_code && <div className="mt-1 text-sm text-red-600">{errors.postal_code}</div>}
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                    Commune/Municipality <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    value={data.municipality_id || ''}
                                                    onChange={(e) =>
                                                        handleInputChange('municipality_id', e.target.value ? parseInt(e.target.value) : null)
                                                    }
                                                    disabled={!data.city || availableMunicipalities.length === 0 || !hasActiveSubscription}
                                                >
                                                    <option value="">Sélectionner une commune</option>
                                                    {availableMunicipalities.map((municipality) => (
                                                        <option key={municipality.id} value={municipality.id}>
                                                            {municipality.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.municipality_id && <div className="mt-1 text-sm text-red-600">{errors.municipality_id}</div>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">Latitude</label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    placeholder="Ex: -4.4419"
                                                    value={data.latitude}
                                                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                />
                                                {errors.latitude && <div className="mt-1 text-sm text-red-600">{errors.latitude}</div>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">Longitude</label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                    placeholder="Ex: 15.2663"
                                                    value={data.longitude}
                                                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                                                    disabled={!hasActiveSubscription}
                                                />
                                                {errors.longitude && <div className="mt-1 text-sm text-red-600">{errors.longitude}</div>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">Lien Google Maps</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-amber-200/50 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:text-base"
                                                placeholder="Ex: https://maps.google.com/?q=..."
                                                value={data.map_location}
                                                onChange={(e) => handleInputChange('map_location', e.target.value)}
                                                disabled={!hasActiveSubscription}
                                            />
                                            {errors.map_location && <div className="mt-1 text-sm text-red-600">{errors.map_location}</div>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section: Équipements */}
                            {activeSection === 'equipment' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <CheckSquare size={20} className="text-amber-500" />
                                        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Équipements</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <h3 className="mb-4 text-base font-medium text-slate-900 sm:text-lg">Équipements de base</h3>
                                                <div className="space-y-3">
                                                    <label className="flex cursor-pointer items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                                            checked={data.furnished}
                                                            onChange={() => handleCheckboxChange('furnished')}
                                                            disabled={!hasActiveSubscription}
                                                        />
                                                        <span className="ml-3 text-sm sm:text-base">Meublé</span>
                                                    </label>

                                                    <label className="flex cursor-pointer items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                                            checked={data.elevator}
                                                            onChange={() => handleCheckboxChange('elevator')}
                                                            disabled={!hasActiveSubscription}
                                                        />
                                                        <span className="ml-3 text-sm sm:text-base">Ascenseur</span>
                                                    </label>

                                                    <label className="flex cursor-pointer items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                                            checked={data.parking}
                                                            onChange={() => handleCheckboxChange('parking')}
                                                            disabled={!hasActiveSubscription}
                                                        />
                                                        <span className="ml-3 text-sm sm:text-base">Parking</span>
                                                    </label>

                                                    <label className="flex cursor-pointer items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                                            checked={data.garden}
                                                            onChange={() => handleCheckboxChange('garden')}
                                                            disabled={!hasActiveSubscription}
                                                        />
                                                        <span className="ml-3 text-sm sm:text-base">Jardin</span>
                                                    </label>

                                                    <label className="flex cursor-pointer items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                                            checked={data.swimming_pool}
                                                            onChange={() => handleCheckboxChange('swimming_pool')}
                                                            disabled={!hasActiveSubscription}
                                                        />
                                                        <span className="ml-3 text-sm sm:text-base">Piscine</span>
                                                    </label>

                                                    <label className="flex cursor-pointer items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                                            checked={data.cellar}
                                                            onChange={() => handleCheckboxChange('cellar')}
                                                            disabled={!hasActiveSubscription}
                                                        />
                                                        <span className="ml-3 text-sm sm:text-base">Cave</span>
                                                    </label>

                                                    <label className="flex cursor-pointer items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                                            checked={data.attic}
                                                            onChange={() => handleCheckboxChange('attic')}
                                                            disabled={!hasActiveSubscription}
                                                        />
                                                        <span className="ml-3 text-sm sm:text-base">Grenier</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="mb-4 text-base font-medium text-slate-900 sm:text-lg">Équipements avancés</h3>
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    {amenities.map((amenity) => (
                                                        <label
                                                            key={amenity.id}
                                                            className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all ${
                                                                (data.amenities || []).includes(amenity.id)
                                                                    ? 'border-amber-300 bg-amber-50'
                                                                    : 'border-gray-200 hover:border-amber-200'
                                                            } ${!hasActiveSubscription ? 'cursor-not-allowed opacity-50' : ''}`}
                                                            onClick={() => hasActiveSubscription && handleAmenityChange(amenity.id)}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                                                checked={(data.amenities || []).includes(amenity.id)}
                                                                onChange={() => hasActiveSubscription && handleAmenityChange(amenity.id)}
                                                                disabled={!hasActiveSubscription}
                                                            />
                                                            <span className="ml-3 text-sm sm:text-base">{amenity.name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                {errors.amenities && <div className="mt-1 text-sm text-red-600">{errors.amenities}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section: Photos */}
                            {activeSection === 'media' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <Image size={20} className="text-amber-500" />
                                        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Photos</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700 sm:text-base">
                                                Images de la propriété {!isEditMode && <span className="text-red-500">*</span>}
                                            </label>

                                            {imagePreviews.length > 0 && (
                                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                                    {imagePreviews.map((preview, index) => (
                                                        <div key={index} className="group relative">
                                                            <img
                                                                src={preview.url}
                                                                alt={preview.name}
                                                                className="h-32 w-full rounded-lg object-cover sm:h-40"
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeFile(index)}
                                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                                                                    disabled={!hasActiveSubscription}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                            <div className="mt-2 truncate text-xs text-slate-600">{preview.name}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex w-full items-center justify-center">
                                                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-amber-300 transition-colors hover:bg-amber-50">
                                                    <Upload size={24} className="mb-2 text-amber-500" />
                                                    <span className="text-sm text-slate-600 sm:text-base">Cliquez pour télécharger</span>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleFileUpload}
                                                        disabled={!hasActiveSubscription}
                                                    />
                                                </label>
                                                <p className="text-xs text-slate-500">Formats: JPG, PNG, GIF (Max 5MB)</p>
                                            </div>
                                            {errors.images && <div className="mt-1 text-sm text-red-600">{errors.images}</div>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section: Publication */}
                            {activeSection === 'publication' && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <FileText size={20} className="text-amber-500" />
                                        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Publication</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label className="flex cursor-pointer items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                                        checked={data.is_published}
                                                        onChange={() => handleCheckboxChange('is_published')}
                                                        disabled={!hasActiveSubscription}
                                                    />
                                                    <span className="ml-3 text-sm sm:text-base">Publier immédiatement</span>
                                                </label>
                                                <p className="mt-1 ml-8 text-xs text-slate-500">
                                                    Cochez cette case pour publier la propriété immédiatement
                                                </p>
                                            </div>

                                            <div>
                                                <label className="flex cursor-pointer items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                                        checked={data.is_featured}
                                                        onChange={() => handleCheckboxChange('is_featured')}
                                                        disabled={!hasActiveSubscription}
                                                    />
                                                    <span className="ml-3 text-sm sm:text-base">Mettre en vedette</span>
                                                </label>
                                                <p className="mt-1 ml-8 text-xs text-slate-500">
                                                    Cochez cette case pour mettre en avant cette propriété
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Boutons d'action - Ultra responsive */}
                            <div className="sticky bottom-0 mt-6 border-t border-amber-200/30 bg-white/95 p-4 backdrop-blur-sm">
                                <div className="flex flex-col justify-end gap-3 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-base"
                                        disabled={processing || !hasActiveSubscription}
                                    >
                                        <RotateCcw size={16} />
                                        Réinitialiser
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-2.5 text-sm text-white transition-all duration-300 hover:from-amber-500 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-base"
                                        disabled={processing || !hasActiveSubscription}
                                    >
                                        {processing ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                {isEditMode ? 'Mise à jour...' : 'Publication...'}
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} />
                                                {isEditMode ? 'Mettre à jour' : 'Publier'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Dashboard>
    );
};

export default PropertyForm;
