import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { router, usePage } from '@inertiajs/react';
import {
    Bath,
    Bed,
    Building,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Edit3,
    ForkKnife,
    Home,
    ImageOff,
    MapPin,
    Star,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

type PropertyImage = { url: string; path?: string };
type Property = {
    id: number;
    title: string;
    type: string;
    sale_type: string;
    price: number;
    description?: string;
    surface?: number;
    bedrooms: number;
    bathrooms: number;
    kitchens: number;
    rooms: number;
    property_age?: number;
    address?: string;
    floor?: string;
    total_floors?: string;
    is_published: boolean;
    is_approved: boolean;
    is_featured: boolean;
    status?: string;
    images?: PropertyImage[];
    views_count?: number;
    created_at?: string;
    location?: string;
};

export default function ShowProperty({ property }: { property: Property }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const typeLabels: Record<string, string> = {
        house: 'Maison',
        apartment: 'Appartement',
        studio: 'Studio',
        villa: 'Villa',
        land: 'Terrain',
        office: 'Bureau',
        shop: 'Boutique',
        garage: 'Garage',
        warehouse: 'Entrepôt',
        other: 'Autre',
    };

    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.roles?.includes('Admin') ?? false;

    const saleTypeLabels: Record<string, string> = {
        rent: 'À louer',
        sale: 'À vendre',
    };

    const nextImage = () => {
        if (property?.images && property.images.length > 0) {
            setCurrentImageIndex(
                (prev) => (prev + 1) % property.images!.length,
            );
        }
    };

    const prevImage = () => {
        if (property?.images && property.images.length > 0) {
            setCurrentImageIndex(
                (prev) =>
                    (prev - 1 + property.images!.length) %
                    property.images!.length,
            );
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const toggleApproval = () => {
        router.patch(
            route('dashboard.properties.approve', property.id),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    useEffect(() => {
        if (property?.images && property.images.length > 1) {
            const interval = setInterval(nextImage, 5000);
            return () => clearInterval(interval);
        }
    }, [property?.images?.length]);

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                            <BackButton />
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                    {property.title}
                                </h1>
                                <div className="mt-1 flex items-center gap-2 text-slate-600">
                                    <MapPin
                                        size={16}
                                        className="text-amber-500"
                                    />
                                    <span>
                                        {property.location ||
                                            property.address ||
                                            'Localisation non spécifiée'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {isAdmin && (
                                <button
                                    onClick={toggleApproval}
                                    className={`inline-flex items-center rounded-xl px-4 py-2 font-medium shadow-lg transition-all duration-300 ${
                                        property.is_approved
                                            ? 'border border-red-200 bg-red-100 text-red-700 shadow-red-500/10 hover:bg-red-200'
                                            : 'border border-emerald-200 bg-emerald-100 text-emerald-700 shadow-emerald-500/10 hover:bg-emerald-200'
                                    }`}
                                >
                                    {property.is_approved ? (
                                        <>
                                            <X size={18} className="mr-2" />{' '}
                                            Retirer l'approbation
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle
                                                size={18}
                                                className="mr-2"
                                            />{' '}
                                            Approuver pour publication
                                        </>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={() =>
                                    router.visit(
                                        route(
                                            'dashboard.properties.edit',
                                            property.id,
                                        ),
                                    )
                                }
                                className="inline-flex items-center rounded-xl border border-amber-200 bg-white px-4 py-2 font-medium text-amber-700 shadow-lg shadow-amber-500/5 transition-all duration-300 hover:bg-amber-50"
                            >
                                <Edit3 size={18} className="mr-2" />
                                Modifier
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Left Column: Images & Description */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Image Carousel */}
                            <div className="relative aspect-video overflow-hidden rounded-3xl border border-amber-200/30 bg-white shadow-2xl shadow-amber-500/10">
                                {property.images &&
                                property.images.length > 0 ? (
                                    <>
                                        <img
                                            src={`/storage/${property.images[currentImageIndex].path || property.images[currentImageIndex].url}`}
                                            alt={property.title}
                                            className="h-full w-full object-cover"
                                        />

                                        {property.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute top-1/2 left-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-xl backdrop-blur-md transition-all hover:bg-white"
                                                >
                                                    <ChevronLeft size={24} />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute top-1/2 right-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-xl backdrop-blur-md transition-all hover:bg-white"
                                                >
                                                    <ChevronRight size={24} />
                                                </button>

                                                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                                                    {property.images.map(
                                                        (_, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() =>
                                                                    setCurrentImageIndex(
                                                                        idx,
                                                                    )
                                                                }
                                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                                    idx ===
                                                                    currentImageIndex
                                                                        ? 'w-8 bg-amber-500'
                                                                        : 'w-2 bg-white/60 hover:bg-white'
                                                                }`}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 text-slate-400">
                                        <ImageOff
                                            size={64}
                                            className="mb-4 opacity-20"
                                        />
                                        <p>Aucune image disponible</p>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="rounded-3xl border border-amber-200/30 bg-white p-8 shadow-xl shadow-amber-500/5">
                                <h2 className="mb-4 text-xl font-bold text-slate-900">
                                    Description
                                </h2>
                                <p className="leading-relaxed whitespace-pre-line text-slate-600">
                                    {property.description ||
                                        'Aucune description fournie pour cette propriété.'}
                                </p>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div className="flex flex-col items-center rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-sm">
                                    <Home
                                        className="mb-2 text-amber-500"
                                        size={24}
                                    />
                                    <span className="text-xl font-bold text-slate-900">
                                        {property.surface || 0} m²
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        Surface
                                    </span>
                                </div>
                                <div className="flex flex-col items-center rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-sm">
                                    <Bed
                                        className="mb-2 text-amber-500"
                                        size={24}
                                    />
                                    <span className="text-xl font-bold text-slate-900">
                                        {property.bedrooms || 0}
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        Chambres
                                    </span>
                                </div>
                                <div className="flex flex-col items-center rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-sm">
                                    <Bath
                                        className="mb-2 text-amber-500"
                                        size={24}
                                    />
                                    <span className="text-xl font-bold text-slate-900">
                                        {property.bathrooms || 0}
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        Salles de bain
                                    </span>
                                </div>
                                <div className="flex flex-col items-center rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-sm">
                                    <ForkKnife
                                        className="mb-2 text-amber-500"
                                        size={24}
                                    />
                                    <span className="text-xl font-bold text-slate-900">
                                        {property.kitchens || 0}
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        Cuisines
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Pricing & Overview */}
                        <div className="space-y-8">
                            {/* Pricing Card */}
                            <div className="rounded-3xl border border-amber-200/30 bg-white p-8 shadow-xl shadow-amber-500/10">
                                <span className="mb-4 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold tracking-wider text-amber-700 uppercase">
                                    {saleTypeLabels[property.sale_type] ||
                                        property.sale_type}
                                </span>
                                <div className="mb-6 text-4xl font-extrabold text-slate-900">
                                    {formatPrice(property.price)}
                                </div>

                                <div className="space-y-4 border-t border-slate-100 pt-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">
                                            Type
                                        </span>
                                        <span className="font-semibold text-slate-900">
                                            {typeLabels[property.type] ||
                                                property.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">
                                            Statut
                                        </span>
                                        <span
                                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                                property.is_published
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-700'
                                            }`}
                                        >
                                            {property.is_published
                                                ? 'Publié'
                                                : 'Brouillon'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">
                                            Vues
                                        </span>
                                        <span className="font-semibold text-slate-900">
                                            {property.views_count || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">
                                            Date d'ajout
                                        </span>
                                        <span className="font-semibold text-slate-900">
                                            {property.created_at
                                                ? new Date(
                                                      property.created_at,
                                                  ).toLocaleDateString()
                                                : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="rounded-3xl border border-amber-200/30 bg-white p-8 shadow-xl shadow-amber-500/5">
                                <h3 className="mb-6 flex items-center text-lg font-bold text-slate-900">
                                    <Building
                                        className="mr-2 text-amber-500"
                                        size={20}
                                    />
                                    Détails du bâtiment
                                </h3>

                                <div className="space-y-4">
                                    {property.floor && (
                                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                            <span className="text-sm text-slate-500">
                                                Étage
                                            </span>
                                            <span className="font-medium text-slate-900">
                                                {property.floor}
                                            </span>
                                        </div>
                                    )}
                                    {property.total_floors && (
                                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                            <span className="text-sm text-slate-500">
                                                Nombre d'étages
                                            </span>
                                            <span className="font-medium text-slate-900">
                                                {property.total_floors}
                                            </span>
                                        </div>
                                    )}
                                    {property.rooms && (
                                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                            <span className="text-sm text-slate-500">
                                                Nombre de pièces
                                            </span>
                                            <span className="font-medium text-slate-900">
                                                {property.rooms}
                                            </span>
                                        </div>
                                    )}
                                    {property.property_age && (
                                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                            <span className="text-sm text-slate-500">
                                                Âge du bâtiment
                                            </span>
                                            <span className="font-medium text-slate-900">
                                                {property.property_age} ans
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Badges Section */}
                            <div className="flex flex-wrap gap-2">
                                {property.is_featured && (
                                    <div className="inline-flex items-center rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-amber-500/20">
                                        <Star
                                            size={14}
                                            className="mr-2 fill-current"
                                        />
                                        EN VEDETTE
                                    </div>
                                )}
                                {property.is_approved && (
                                    <div className="inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20">
                                        <CheckCircle
                                            size={14}
                                            className="mr-2"
                                        />
                                        APPROUVÉ
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
