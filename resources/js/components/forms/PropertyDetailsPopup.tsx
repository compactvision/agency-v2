import { usePage } from '@inertiajs/react';
import {
    Bath,
    Bed,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    ForkKnife,
    Home,
    MapPin,
    Star,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Composant PropertyPopup
export default function PropertyDetailsPopup({
    isOpen,
    onClose,
    property,
    toggleApproval,
}) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const typeLabels = {
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

    const user = usePage().props.auth.user;
    const isAdmin = !!user?.roles?.includes?.('Admin');

    const saleTypeLabels = {
        rent: 'À louer',
        sale: 'À vendre',
    };

    const nextImage = () => {
        if (property?.images?.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
        }
    };

    const prevImage = () => {
        if (property?.images?.length > 0) {
            setCurrentImageIndex(
                (prev) =>
                    (prev - 1 + property.images.length) %
                    property.images.length,
            );
        }
    };

    const setImage = (index) => {
        setCurrentImageIndex(index);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    useEffect(() => {
        if (isOpen && property?.images?.length > 0) {
            const interval = setInterval(nextImage, 5000);
            return () => clearInterval(interval);
        }
    }, [isOpen, property?.images?.length]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!isOpen || !property) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay limité au contenu principal uniquement */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm lg:left-64 xl:left-72"></div>

            {/* Conteneur principal du popup - parfaitement centré */}
            <div className="relative z-10 mx-auto my-4 max-h-[90vh] w-full max-w-6xl px-4 lg:my-8 lg:px-8">
                <div
                    className="scale-100 transform overflow-hidden rounded-2xl border border-amber-200/30 bg-white opacity-100 shadow-2xl shadow-amber-500/20 transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* En-tête du popup */}
                    <div className="relative bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-4 sm:px-8 sm:py-5">
                        <div className="flex items-center justify-between">
                            <h2 className="truncate pr-4 text-xl font-bold text-white sm:text-2xl">
                                {property.title}
                            </h2>
                            <button
                                className="flex h-10 w-10 transform items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/30"
                                onClick={onClose}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Contenu du popup */}
                    <div className="flex h-[calc(90vh-80px)] flex-col overflow-hidden lg:flex-row">
                        {/* Section images avec carousel */}
                        <div className="w-full p-4 sm:p-6 lg:w-1/2">
                            <div className="relative h-full min-h-[400px] overflow-hidden rounded-xl border border-amber-200/30 shadow-lg shadow-amber-500/10">
                                {property.images &&
                                property.images.length > 0 ? (
                                    <>
                                        <img
                                            src={`/storage/${property.images[currentImageIndex].url}`}
                                            alt={`Vue ${currentImageIndex + 1}`}
                                            className="h-full w-full object-cover transition-opacity duration-500"
                                        />

                                        {/* Navigation du carousel */}
                                        {property.images.length > 1 && (
                                            <>
                                                <button
                                                    className="absolute top-1/2 left-2 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white"
                                                    onClick={prevImage}
                                                >
                                                    <ChevronLeft className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white"
                                                    onClick={nextImage}
                                                >
                                                    <ChevronRight className="h-5 w-5" />
                                                </button>

                                                {/* Points de navigation */}
                                                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
                                                    {property.images.map(
                                                        (_, index) => (
                                                            <button
                                                                key={index}
                                                                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                                                                    index ===
                                                                    currentImageIndex
                                                                        ? 'w-8 bg-amber-500'
                                                                        : 'bg-white/60 hover:bg-white/80'
                                                                }`}
                                                                onClick={() =>
                                                                    setImage(
                                                                        index,
                                                                    )
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">
                                        <div className="text-center">
                                            <Home className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                                            <p>Aucune image disponible</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section détails */}
                        <div className="w-full overflow-y-auto p-4 sm:p-6 lg:w-1/2">
                            {/* Bouton d'approbation pour admin */}
                            {isAdmin && (
                                <div className="mb-4">
                                    <button
                                        className={`inline-flex transform items-center rounded-lg px-4 py-2 font-medium transition-all duration-200 hover:scale-105 ${
                                            property.is_approved
                                                ? 'border border-red-200 bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'border border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                        }`}
                                        onClick={() =>
                                            toggleApproval(property.id)
                                        }
                                    >
                                        {property.is_approved ? (
                                            <>
                                                <X className="mr-2 h-4 w-4" />
                                                Refuser
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Publier
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Badge de type de propriété */}
                            <div className="mb-4 inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                                {typeLabels[property.type] || property.type}
                            </div>

                            {/* Section prix */}
                            <div className="mb-6">
                                <div className="mb-1 bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-3xl font-bold text-transparent">
                                    {formatPrice(property.price)}
                                </div>
                                <div className="text-sm font-medium text-gray-600">
                                    {saleTypeLabels[property.sale_type] ||
                                        property.sale_type}
                                </div>
                            </div>

                            {/* Description */}
                            {property.description && (
                                <div className="mb-6 rounded-xl border border-amber-200/30 bg-amber-50/50 p-4">
                                    <p className="leading-relaxed text-gray-700">
                                        {property.description}
                                    </p>
                                </div>
                            )}

                            {/* Caractéristiques principales */}
                            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                {property.surface && (
                                    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                                        <Home className="mb-2 h-6 w-6 text-amber-500" />
                                        <div className="text-lg font-bold text-gray-900">
                                            {property.surface}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            m² Surface
                                        </div>
                                    </div>
                                )}

                                {property.bedrooms > 0 && (
                                    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                                        <Bed className="mb-2 h-6 w-6 text-amber-500" />
                                        <div className="text-lg font-bold text-gray-900">
                                            {property.bedrooms}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Chambres
                                        </div>
                                    </div>
                                )}

                                {property.bathrooms > 0 && (
                                    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                                        <Bath className="mb-2 h-6 w-6 text-amber-500" />
                                        <div className="text-lg font-bold text-gray-900">
                                            {property.bathrooms}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Salles de bain
                                        </div>
                                    </div>
                                )}

                                {property.kitchens > 0 && (
                                    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                                        <ForkKnife className="mb-2 h-6 w-6 text-amber-500" />
                                        <div className="text-lg font-bold text-gray-900">
                                            {property.kitchens}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Cuisines
                                        </div>
                                    </div>
                                )}

                                {property.rooms > 0 && (
                                    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                                        <Home className="mb-2 h-6 w-6 text-amber-500" />
                                        <div className="text-lg font-bold text-gray-900">
                                            {property.rooms}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Pièces
                                        </div>
                                    </div>
                                )}

                                {property.property_age && (
                                    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                                        <Calendar className="mb-2 h-6 w-6 text-amber-500" />
                                        <div className="text-lg font-bold text-gray-900">
                                            {property.property_age}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Ans
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Informations supplémentaires */}
                            <div className="mb-6">
                                <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                                    <MapPin className="mr-2 h-5 w-5 text-amber-500" />
                                    Informations supplémentaires
                                </h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {property.address && (
                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <div className="mb-1 text-xs text-gray-500">
                                                Adresse
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {property.address}
                                            </div>
                                        </div>
                                    )}
                                    {property.floor && (
                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <div className="mb-1 text-xs text-gray-500">
                                                Étage
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {property.floor}
                                            </div>
                                        </div>
                                    )}
                                    {property.total_floors && (
                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <div className="mb-1 text-xs text-gray-500">
                                                Total étages
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {property.total_floors}
                                            </div>
                                        </div>
                                    )}
                                    {property.property_age && (
                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <div className="mb-1 text-xs text-gray-500">
                                                Âge de la propriété
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {property.property_age} ans
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Badges de statut */}
                            <div className="flex flex-wrap gap-2">
                                {property.is_published && (
                                    <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                                        <CheckCircle className="mr-1 h-3 w-3" />
                                        Publié
                                    </div>
                                )}
                                {property.is_featured && (
                                    <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                                        <Star className="mr-1 h-3 w-3" />
                                        En vedette
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
