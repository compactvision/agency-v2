import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layouts/Dashboard/Dashboard';
import { useTranslation } from 'react-i18next';
import { 
    CheckCircle, XCircle, ArrowLeft, MapPin, Bed, Bath, 
    Square, DollarSign, Calendar, Eye, Info, User, Search
} from 'lucide-react';

interface ValidationShowProps {
    property: any;
}

export default function ValidationShow({ property }: Readonly<ValidationShowProps>) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'details' | 'location' | 'images'>('details');
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const handleApprove = () => {
        if (confirm('Êtes-vous sûr de vouloir approuver cette propriété ? Elle sera visible publiquement.')) {
            router.patch(route('dashboard.properties.approve', property.id), {}, {
                onSuccess: () => {
                    router.visit(route('dashboard.properties.validation'));
                }
            });
        }
    };

    const handleReject = () => {
        if (!rejectReason.trim()) {
            alert('Veuillez spécifier une raison de rejet.');
            return;
        }

        router.put(
            route('dashboard.properties.reject', property.id),
            { reason: rejectReason },
            {
                onSuccess: () => {
                    setIsRejecting(false);
                    setRejectReason('');
                    router.visit(route('dashboard.properties.validation'));
                }
            }
        );
    };

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency || 'USD',
        }).format(price);
    };

    return (
        <DashboardLayout>
            <Head title={`Validation: ${property.title}`} />

            {/* En-tête de la page */}
            <div className="mb-6">
                <Link 
                    href={route('dashboard.properties.validation')} 
                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-amber-600 mb-4 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" /> Retour à la liste d'attente
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            {property.title}
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                                En attente
                            </span>
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            Réf: <span className="font-medium text-slate-700">{property.reference}</span>
                            • Soumis le {new Date(property.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-amber-600">
                            {formatPrice(property.price, property.currency)}
                        </div>
                        <div className="text-sm font-medium text-slate-500 uppercase">
                            {property.sale_type === 'rent' ? 'À louer' : 'À vendre'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Système d'onglets */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-24">
                <div className="border-b border-slate-200 flex overflow-x-auto">
                    <button
                        className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors border-b-2 whitespace-nowrap ${activeTab === 'details' ? 'border-amber-500 text-amber-600 bg-amber-50/30' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                        onClick={() => setActiveTab('details')}
                    >
                        <Info size={16} /> Informations de l'annonce
                    </button>
                    <button
                        className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors border-b-2 whitespace-nowrap ${activeTab === 'location' ? 'border-amber-500 text-amber-600 bg-amber-50/30' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                        onClick={() => setActiveTab('location')}
                    >
                        <MapPin size={16} /> Localisation & Caractéristiques
                    </button>
                    <button
                        className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors border-b-2 whitespace-nowrap ${activeTab === 'images' ? 'border-amber-500 text-amber-600 bg-amber-50/30' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                        onClick={() => setActiveTab('images')}
                    >
                        <Eye size={16} /> Galerie Photos ({property.images?.length || 0})
                    </button>
                </div>

                <div className="p-6">
                    {/* ONGLET: DÉTAILS */}
                    {activeTab === 'details' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Description</h3>
                                        <div className="prose prose-sm max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: property.description || 'Aucune description fournie.' }} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                            <span className="block text-xs text-slate-500 mb-1">Catégorie</span>
                                            <span className="font-semibold text-slate-800">{property.category?.name || 'N/A'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                            <span className="block text-xs text-slate-500 mb-1">Type de transaction</span>
                                            <span className="font-semibold text-slate-800 capitalize">{property.sale_type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4 uppercase tracking-wider">
                                            <User size={16} className="text-slate-400" /> Auteur de l'annonce
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="block text-xs text-slate-500">Nom complet</span>
                                                <span className="font-medium text-slate-800">{property.user?.name}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-slate-500">Email</span>
                                                <a href={`mailto:${property.user?.email}`} className="font-medium text-amber-600 hover:underline">{property.user?.email}</a>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-slate-500">Téléphone</span>
                                                <span className="font-medium text-slate-800">{property.user?.phone || 'Non renseigné'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ONGLET: LOCALISATION & CARACTÉRISTIQUES */}
                    {activeTab === 'location' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Emplacement</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-2 bg-slate-100 rounded-lg text-slate-600"><MapPin size={18} /></div>
                                            <div>
                                                <span className="block text-sm font-medium text-slate-800">{property.municipality?.name || 'Non spécifiée'}</span>
                                                <span className="block text-xs text-slate-500">{property.city?.name}, {property.country?.name}</span>
                                            </div>
                                        </div>
                                        {property.latitude && property.longitude ? (
                                            <div className="bg-slate-100 h-48 rounded-lg flex items-center justify-center border border-slate-200 mt-4 overflow-hidden relative">
                                                <iframe
                                                    title="Map"
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 0 }}
                                                    loading="lazy"
                                                    allowFullScreen
                                                    src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
                                                ></iframe>
                                            </div>
                                        ) : (
                                            <div className="bg-slate-50 h-32 rounded-lg flex items-center justify-center border border-slate-200 border-dashed mt-4">
                                                <span className="text-sm text-slate-400">Aucune coordonnée GPS fournie</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Caractéristiques clés</h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center">
                                            <Square size={20} className="text-slate-400 mb-2" />
                                            <span className="text-lg font-bold text-slate-800">{property.surface || '-'}</span>
                                            <span className="text-xs text-slate-500 uppercase">Surface (m²)</span>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center">
                                            <Bed size={20} className="text-slate-400 mb-2" />
                                            <span className="text-lg font-bold text-slate-800">{property.details?.bedrooms || '-'}</span>
                                            <span className="text-xs text-slate-500 uppercase">Chambres</span>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center">
                                            <Bath size={20} className="text-slate-400 mb-2" />
                                            <span className="text-lg font-bold text-slate-800">{property.details?.bathrooms || '-'}</span>
                                            <span className="text-xs text-slate-500 uppercase">Salles de bain</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 mt-6 mb-3">Équipements ({property.amenities?.length || 0})</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {property.amenities && property.amenities.length > 0 ? (
                                                property.amenities.map((amenity: any) => (
                                                    <span key={amenity.id} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                                                        {amenity.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">Aucun équipement spécifié</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ONGLET: IMAGES */}
                    {activeTab === 'images' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {property.images && property.images.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {property.images.map((image: any, idx: number) => (
                                        <div key={image.id} className="group aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                                            <img 
                                                src={`/storage/${image.url}`} 
                                                alt={`Property image ${idx+1}`} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {idx === 0 && (
                                                <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-[10px] uppercase font-bold rounded shadow-sm">
                                                    Image principale
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                        <Search size={24} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-800 mb-1">Aucune image</h3>
                                    <p className="text-slate-500 text-sm max-w-sm">
                                        Cette annonce a été soumise sans photographies, ce qui est généralement déconseillé pour une bonne visibilité.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* BARRE D'ACTION PREMIUM (FLOATING ISLAND) */}
            <div className="fixed bottom-6 left-6 lg:left-[calc(16rem+1.5rem)] right-6 z-50 animate-in slide-in-from-bottom-6 duration-500">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-4 md:p-5 transition-all duration-300">
                        {isRejecting ? (
                            <div className="flex flex-col md:flex-row items-center gap-4 animate-in zoom-in-95 duration-200">
                                <div className="flex-1 w-full relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Info size={18} className="text-slate-500" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Motivation du rejet (sera envoyée par e-mail au vendeur)..."
                                        className="w-full bg-slate-800/50 border-slate-600 border-dashed text-white placeholder-slate-500 rounded-xl py-3 pl-10 pr-4 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button 
                                        onClick={() => setIsRejecting(false)}
                                        className="flex-1 md:flex-none px-6 py-3 bg-slate-800 text-slate-300 font-semibold text-sm rounded-xl hover:bg-slate-700 transition-colors border border-slate-600/50"
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        onClick={handleReject}
                                        className="flex-1 md:flex-none px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <XCircle size={18} /> Confirmer le rejet
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="hidden md:flex h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 items-center justify-center">
                                        <Info size={24} className="text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm md:text-base leading-tight">Décision finale requise</h4>
                                        <p className="text-slate-400 text-xs mt-0.5 font-medium">Validation de l'annonce par {property.user?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button 
                                        onClick={() => setIsRejecting(true)}
                                        className="flex-1 sm:flex-none px-6 py-3.5 bg-slate-800 text-red-400 font-bold text-sm rounded-xl border border-slate-700 hover:bg-slate-700/50 hover:border-red-900/30 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <XCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" /> Rejeter
                                    </button>
                                    <button 
                                        onClick={handleApprove}
                                        className="flex-1 sm:flex-none px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <CheckCircle size={18} /> Approuver la publication
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="h-32"></div>
        </DashboardLayout>
    );
}
