import DashboardLayout from '@/components/layouts/Dashboard/Dashboard';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Bath,
    Bed,
    CheckCircle,
    Eye,
    Info,
    MapPin,
    Search,
    Square,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ValidationShowProps {
    property: any;
}

export default function ValidationShow({
    property,
}: Readonly<ValidationShowProps>) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<
        'details' | 'location' | 'images'
    >('details');
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const handleApprove = () => {
        if (
            confirm(
                'Êtes-vous sûr de vouloir approuver cette propriété ? Elle sera visible publiquement.',
            )
        ) {
            router.patch(
                route('dashboard.properties.approve', property.id),
                {},
                {
                    onSuccess: () => {
                        router.visit(route('dashboard.properties.validation'));
                    },
                },
            );
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
                },
            },
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
                    className="mb-4 inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-[#1E3A5F]"
                >
                    <ArrowLeft size={16} className="mr-2" /> Retour à la liste
                    d'attente
                </Link>
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-800">
                            {property.title}
                            <span className="rounded-full border border-slate-200 bg-[#1E3A5F]/10 px-3 py-1 text-xs font-semibold text-[#0d2340]">
                                En attente
                            </span>
                        </h1>
                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                            Réf:{' '}
                            <span className="font-medium text-slate-700">
                                {property.reference}
                            </span>
                            • Soumis le{' '}
                            {new Date(property.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-[#1E3A5F]">
                            {formatPrice(property.price, property.currency)}
                        </div>
                        <div className="text-sm font-medium text-slate-500 uppercase">
                            {property.sale_type === 'rent'
                                ? 'À louer'
                                : 'À vendre'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Système d'onglets */}
            <div className="mb-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex overflow-x-auto border-b border-slate-200">
                    <button
                        className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors sm:flex-none ${activeTab === 'details' ? 'border-slate-200 bg-slate-50 text-[#1E3A5F]' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        onClick={() => setActiveTab('details')}
                    >
                        <Info size={16} /> Informations de l'annonce
                    </button>
                    <button
                        className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors sm:flex-none ${activeTab === 'location' ? 'border-slate-200 bg-slate-50 text-[#1E3A5F]' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        onClick={() => setActiveTab('location')}
                    >
                        <MapPin size={16} /> Localisation & Caractéristiques
                    </button>
                    <button
                        className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors sm:flex-none ${activeTab === 'images' ? 'border-slate-200 bg-slate-50 text-[#1E3A5F]' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        onClick={() => setActiveTab('images')}
                    >
                        <Eye size={16} /> Galerie Photos (
                        {property.images?.length || 0})
                    </button>
                </div>

                <div className="p-6">
                    {/* ONGLET: DÉTAILS */}
                    {activeTab === 'details' && (
                        <div className="animate-in space-y-8 duration-300 fade-in slide-in-from-bottom-2">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="space-y-6 md:col-span-2">
                                    <div>
                                        <h3 className="mb-4 border-b pb-2 text-lg font-bold text-slate-800">
                                            Description
                                        </h3>
                                        <div
                                            className="prose prose-sm max-w-none text-slate-600"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    property.description ||
                                                    'Aucune description fournie.',
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                                            <span className="mb-1 block text-xs text-slate-500">
                                                Catégorie
                                            </span>
                                            <span className="font-semibold text-slate-800">
                                                {property.category?.name ||
                                                    'N/A'}
                                            </span>
                                        </div>
                                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                                            <span className="mb-1 block text-xs text-slate-500">
                                                Type de transaction
                                            </span>
                                            <span className="font-semibold text-slate-800 capitalize">
                                                {property.sale_type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-slate-800 uppercase">
                                            <User
                                                size={16}
                                                className="text-slate-400"
                                            />{' '}
                                            Auteur de l'annonce
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="block text-xs text-slate-500">
                                                    Nom complet
                                                </span>
                                                <span className="font-medium text-slate-800">
                                                    {property.user?.name}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-slate-500">
                                                    Email
                                                </span>
                                                <a
                                                    href={`mailto:${property.user?.email}`}
                                                    className="font-medium text-[#1E3A5F] hover:underline"
                                                >
                                                    {property.user?.email}
                                                </a>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-slate-500">
                                                    Téléphone
                                                </span>
                                                <span className="font-medium text-slate-800">
                                                    {property.user?.phone ||
                                                        'Non renseigné'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ONGLET: LOCALISATION & CARACTÉRISTIQUES */}
                    {activeTab === 'location' && (
                        <div className="animate-in space-y-8 duration-300 fade-in slide-in-from-bottom-2">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div>
                                    <h3 className="mb-4 border-b pb-2 text-lg font-bold text-slate-800">
                                        Emplacement
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 rounded-lg bg-slate-100 p-2 text-slate-600">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <span className="block text-sm font-medium text-slate-800">
                                                    {property.municipality
                                                        ?.name ||
                                                        'Non spécifiée'}
                                                </span>
                                                <span className="block text-xs text-slate-500">
                                                    {property.city?.name},{' '}
                                                    {property.country?.name}
                                                </span>
                                            </div>
                                        </div>
                                        {property.latitude &&
                                        property.longitude ? (
                                            <div className="relative mt-4 flex h-48 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
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
                                            <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                                                <span className="text-sm text-slate-400">
                                                    Aucune coordonnée GPS
                                                    fournie
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="mb-4 border-b pb-2 text-lg font-bold text-slate-800">
                                        Caractéristiques clés
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                                        <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-3 text-center">
                                            <Square
                                                size={20}
                                                className="mb-2 text-slate-400"
                                            />
                                            <span className="text-lg font-bold text-slate-800">
                                                {property.surface || '-'}
                                            </span>
                                            <span className="text-xs text-slate-500 uppercase">
                                                Surface (m²)
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-3 text-center">
                                            <Bed
                                                size={20}
                                                className="mb-2 text-slate-400"
                                            />
                                            <span className="text-lg font-bold text-slate-800">
                                                {property.details?.bedrooms ||
                                                    '-'}
                                            </span>
                                            <span className="text-xs text-slate-500 uppercase">
                                                Chambres
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-3 text-center">
                                            <Bath
                                                size={20}
                                                className="mb-2 text-slate-400"
                                            />
                                            <span className="text-lg font-bold text-slate-800">
                                                {property.details?.bathrooms ||
                                                    '-'}
                                            </span>
                                            <span className="text-xs text-slate-500 uppercase">
                                                Salles de bain
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="mt-6 mb-3 text-sm font-bold text-slate-800">
                                            Équipements (
                                            {property.amenities?.length || 0})
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {property.amenities &&
                                            property.amenities.length > 0 ? (
                                                property.amenities.map(
                                                    (amenity: any) => (
                                                        <span
                                                            key={amenity.id}
                                                            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                                                        >
                                                            {amenity.name}
                                                        </span>
                                                    ),
                                                )
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">
                                                    Aucun équipement spécifié
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ONGLET: IMAGES */}
                    {activeTab === 'images' && (
                        <div className="animate-in duration-300 fade-in slide-in-from-bottom-2">
                            {property.images && property.images.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                    {property.images.map(
                                        (image: any, idx: number) => (
                                            <div
                                                key={image.id}
                                                className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                                            >
                                                <img
                                                    src={`/storage/${image.url}`}
                                                    alt={`Property image ${idx + 1}`}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                {idx === 0 && (
                                                    <div className="absolute top-2 left-2 rounded bg-slate-500 px-2 py-1 text-[10px] font-bold text-white uppercase shadow-sm">
                                                        Image principale
                                                    </div>
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                                        <Search
                                            size={24}
                                            className="text-slate-300"
                                        />
                                    </div>
                                    <h3 className="mb-1 text-lg font-medium text-slate-800">
                                        Aucune image
                                    </h3>
                                    <p className="max-w-sm text-sm text-slate-500">
                                        Cette annonce a été soumise sans
                                        photographies, ce qui est généralement
                                        déconseillé pour une bonne visibilité.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* BARRE D'ACTION PREMIUM (FLOATING ISLAND) */}
            <div className="fixed right-6 bottom-6 left-6 z-50 animate-in duration-500 slide-in-from-bottom-6 lg:left-[calc(16rem+1.5rem)]">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/95 p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 md:p-5">
                        {isRejecting ? (
                            <div className="flex animate-in flex-col items-center gap-4 duration-200 zoom-in-95 md:flex-row">
                                <div className="relative w-full flex-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Info
                                            size={18}
                                            className="text-slate-500"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={rejectReason}
                                        onChange={(e) =>
                                            setRejectReason(e.target.value)
                                        }
                                        placeholder="Motivation du rejet (sera envoyée par e-mail au vendeur)..."
                                        className="w-full rounded-xl border-dashed border-slate-600 bg-slate-800/50 py-3 pr-4 pl-10 text-white placeholder-slate-500 transition-all focus:border-slate-200 focus:ring-slate-200"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex w-full gap-3 md:w-auto">
                                    <button
                                        onClick={() => setIsRejecting(false)}
                                        className="flex-1 rounded-xl border border-slate-600/50 bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700 md:flex-none"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition-all hover:bg-red-500 active:scale-95 md:flex-none"
                                    >
                                        <XCircle size={18} /> Confirmer le rejet
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <div className="flex items-center gap-4">
                                    <div className="hidden h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-500/10 md:flex">
                                        <Info
                                            size={24}
                                            className="text-[#C9A84C]"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-sm leading-tight font-bold text-white md:text-base">
                                            Décision finale requise
                                        </h4>
                                        <p className="mt-0.5 text-xs font-medium text-slate-400">
                                            Validation de l'annonce par{' '}
                                            {property.user?.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex w-full items-center gap-3 sm:w-auto">
                                    <button
                                        onClick={() => setIsRejecting(true)}
                                        className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-sm font-bold text-red-400 transition-all hover:border-red-900/30 hover:bg-slate-700/50 sm:flex-none"
                                    >
                                        <XCircle
                                            size={18}
                                            className="transition-transform duration-300 group-hover:rotate-90"
                                        />{' '}
                                        Rejeter
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-95 sm:flex-none"
                                    >
                                        <CheckCircle size={18} /> Approuver la
                                        publication
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
