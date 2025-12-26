import { usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Home, Bath, Bed, Calendar, CheckCircle, Star, ForkKnife } from 'lucide-react';

// Composant PropertyPopup
export default function PropertyDetailsPopup({ isOpen, onClose, property, toggleApproval }) {
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
        other: 'Autre'
    };

    const user = usePage().props.auth.user;
    const isAdmin = !!user?.roles?.includes?.('Admin');

    const saleTypeLabels = {
        rent: 'À louer',
        sale: 'À vendre'
    };

    const nextImage = () => {
        if (property?.images?.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
        }
    };

    const prevImage = () => {
        if (property?.images?.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
        }
    };

    const setImage = (index) => {
        setCurrentImageIndex(index);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
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
            <div className="relative z-10 w-full max-w-6xl max-h-[90vh] mx-auto my-4 lg:my-8 px-4 lg:px-8">
                <div className="bg-white rounded-2xl shadow-2xl shadow-amber-500/20 border border-amber-200/30 overflow-hidden transform transition-all duration-300 scale-100 opacity-100" onClick={(e) => e.stopPropagation()}>
                    {/* En-tête du popup */}
                    <div className="relative bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-4 sm:px-8 sm:py-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl sm:text-2xl font-bold text-white truncate pr-4">{property.title}</h2>
                            <button 
                                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-110" 
                                onClick={onClose}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Contenu du popup */}
                    <div className="flex flex-col lg:flex-row h-[calc(90vh-80px)] overflow-hidden">
                        {/* Section images avec carousel */}
                        <div className="w-full lg:w-1/2 p-4 sm:p-6">
                            <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden shadow-lg shadow-amber-500/10 border border-amber-200/30">
                                {property.images && property.images.length > 0 ? (
                                    <>
                                        <img
                                            src={`/storage/${property.images[currentImageIndex].url}`}
                                            alt={`Vue ${currentImageIndex + 1}`}
                                            className="w-full h-full object-cover transition-opacity duration-500"
                                        />

                                        {/* Navigation du carousel */}
                                        {property.images.length > 1 && (
                                            <>
                                                <button 
                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-white transition-all duration-200 shadow-lg" 
                                                    onClick={prevImage}
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-white transition-all duration-200 shadow-lg" 
                                                    onClick={nextImage}
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>

                                                {/* Points de navigation */}
                                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                    {property.images.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                                                index === currentImageIndex 
                                                                    ? 'bg-amber-500 w-8' 
                                                                    : 'bg-white/60 hover:bg-white/80'
                                                            }`}
                                                            onClick={() => setImage(index)}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                        <div className="text-center">
                                            <Home className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                            <p>Aucune image disponible</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section détails */}
                        <div className="w-full lg:w-1/2 p-4 sm:p-6 overflow-y-auto">
                            {/* Bouton d'approbation pour admin */}
                            {isAdmin && (
                                <div className="mb-4">
                                    <button
                                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                                            property.is_approved 
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200' 
                                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200'
                                        }`}
                                        onClick={() => toggleApproval(property.id)}
                                    >
                                        {property.is_approved ? (
                                            <>
                                                <X className="w-4 h-4 mr-2" />
                                                Refuser
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Publier
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Badge de type de propriété */}
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200 mb-4">
                                {typeLabels[property.type] || property.type}
                            </div>

                            {/* Section prix */}
                            <div className="mb-6">
                                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-700 mb-1">
                                    {formatPrice(property.price)}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                    {saleTypeLabels[property.sale_type] || property.sale_type}
                                </div>
                            </div>

                            {/* Description */}
                            {property.description && (
                                <div className="mb-6 p-4 bg-amber-50/50 rounded-xl border border-amber-200/30">
                                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                                </div>
                            )}

                            {/* Caractéristiques principales */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                                {property.surface && (
                                    <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                                        <Home className="w-6 h-6 text-amber-500 mb-2" />
                                        <div className="text-lg font-bold text-gray-900">{property.surface}</div>
                                        <div className="text-xs text-gray-600">m² Surface</div>
                                    </div>
                                )}

                                {property.bedrooms > 0 && (
                                    <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                                        <Bed className="w-6 h-6 text-amber-500 mb-2" />
                                        <div className="text-lg font-bold text-gray-900">{property.bedrooms}</div>
                                        <div className="text-xs text-gray-600">Chambres</div>
                                    </div>
                                )}

                                {property.bathrooms > 0 && (
                                    <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                                        <Bath className="w-6 h-6 text-amber-500 mb-2" />
                                        <div className="text-lg font-bold text-gray-900">{property.bathrooms}</div>
                                        <div className="text-xs text-gray-600">Salles de bain</div>
                                    </div>
                                )}

                                {property.kitchens > 0 && (
                                    <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                                        <ForkKnife className="w-6 h-6 text-amber-500 mb-2" />
                                        <div className="text-lg font-bold text-gray-900">{property.kitchens}</div>
                                        <div className="text-xs text-gray-600">Cuisines</div>
                                    </div>
                                )}

                                {property.rooms > 0 && (
                                    <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                                        <Home className="w-6 h-6 text-amber-500 mb-2" />
                                        <div className="text-lg font-bold text-gray-900">{property.rooms}</div>
                                        <div className="text-xs text-gray-600">Pièces</div>
                                    </div>
                                )}

                                {property.property_age && (
                                    <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                                        <Calendar className="w-6 h-6 text-amber-500 mb-2" />
                                        <div className="text-lg font-bold text-gray-900">{property.property_age}</div>
                                        <div className="text-xs text-gray-600">Ans</div>
                                    </div>
                                )}
                            </div>

                            {/* Informations supplémentaires */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <MapPin className="w-5 h-5 text-amber-500 mr-2" />
                                    Informations supplémentaires
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {property.address && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-xs text-gray-500 mb-1">Adresse</div>
                                            <div className="text-sm font-medium text-gray-900">{property.address}</div>
                                        </div>
                                    )}
                                    {property.floor && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-xs text-gray-500 mb-1">Étage</div>
                                            <div className="text-sm font-medium text-gray-900">{property.floor}</div>
                                        </div>
                                    )}
                                    {property.total_floors && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-xs text-gray-500 mb-1">Total étages</div>
                                            <div className="text-sm font-medium text-gray-900">{property.total_floors}</div>
                                        </div>
                                    )}
                                    {property.property_age && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-xs text-gray-500 mb-1">Âge de la propriété</div>
                                            <div className="text-sm font-medium text-gray-900">{property.property_age} ans</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Badges de statut */}
                            <div className="flex flex-wrap gap-2">
                                {property.is_published && (
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Publié
                                    </div>
                                )}
                                {property.is_featured && (
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                        <Star className="w-3 h-3 mr-1" />
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
};