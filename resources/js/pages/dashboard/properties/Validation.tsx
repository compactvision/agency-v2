import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '@/components/pagination/Pagination';
import { CheckCircle, XCircle, Search, Eye, Filter } from 'lucide-react';
import DashboardLayout from '@/components/layouts/Dashboard/Dashboard';
import { useTranslation } from 'react-i18next';

interface Filters {
    search?: string;
}

interface ValidationProps {
    properties: any;
    filters: Filters;
}

export default function Validation({ properties, filters }: ValidationProps) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('dashboard.properties.validation'),
            { search },
            { preserveState: true }
        );
    };

    const handleApprove = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir approuver cette propriété ?')) {
            router.patch(route('dashboard.properties.approve', id), {}, {
                preserveScroll: true,
            });
        }
    };

    const handleReject = (id: number) => {
        if (!rejectReason.trim()) {
            alert('Veuillez spécifier une raison de rejet.');
            return;
        }

        router.put(
            route('dashboard.properties.reject', id),
            { reason: rejectReason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRejectingId(null);
                    setRejectReason('');
                },
            }
        );
    };

    return (
        <DashboardLayout>
            <Head title="Validation des Propriétés" />

            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Validation des Propriétés
                    </h1>
                    <p className="text-sm text-slate-500">
                        Gérez les propriétés en attente d'approbation.
                    </p>
                </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-4 md:flex-row"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher par titre, référence..."
                            className="w-full rounded-xl border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-amber-500 focus:bg-white focus:ring-amber-500"
                        />
                    </div>
                </form>
            </div>

            {/* Liste des propriétés en attente */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Propriété
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Soumis par
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Prix
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {properties.data.length > 0 ? (
                                properties.data.map((property: any) => (
                                    <React.Fragment key={property.id}>
                                        <tr className="transition-colors hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                                        <img
                                                            src={property.images[0] ? `/storage/${property.images[0].url}` : '/assets/images/defaults/no-image.jpg'}
                                                            alt={property.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">
                                                            {property.title}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            Réf: {property.reference}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-slate-900">
                                                    {property.user?.name || 'Inconnu'}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {property.user?.email || ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-slate-900">
                                                    {property.price.toLocaleString()} {property.currency}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-500">
                                                    {new Date(property.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center space-x-2">
                                                <Link
                                                    href={route(
                                                        'dashboard.properties.validation.show',
                                                        property.id,
                                                    )}
                                                    className="p-1 text-slate-400 transition-colors hover:text-amber-500 rounded-md hover:bg-amber-50"
                                                    title={t('view')}
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <button
                                                        onClick={() => handleApprove(property.id)}
                                                        className="inline-flex items-center justify-center rounded-lg bg-emerald-50 p-2 text-emerald-600 transition-colors hover:bg-emerald-100"
                                                        title="Approuver"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setRejectingId(rejectingId === property.id ? null : property.id)}
                                                        className="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                                                        title="Rejeter"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Ligne d'expansion pour le rejet */}
                                        {rejectingId === property.id && (
                                            <tr>
                                                <td colSpan={5} className="bg-red-50/50 p-4">
                                                    <div className="flex flex-col gap-3 md:flex-row md:items-end">
                                                        <div className="flex-1">
                                                            <label htmlFor={`reject-reason-${property.id}`} className="mb-1 block text-sm font-medium text-red-800">
                                                                Motif du rejet
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id={`reject-reason-${property.id}`}
                                                                value={rejectReason}
                                                                onChange={(e) => setRejectReason(e.target.value)}
                                                                placeholder="Veuillez spécifier un motif clair..."
                                                                className="w-full rounded-lg border-red-200 py-2 text-sm focus:border-red-500 focus:ring-red-500"
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setRejectingId(null);
                                                                    setRejectReason('');
                                                                }}
                                                                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-50"
                                                            >
                                                                Annuler
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(property.id)}
                                                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                                            >
                                                                Confirmer le rejet
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-slate-500"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <CheckCircle className="mb-3 h-12 w-12 text-emerald-400 opacity-50" />
                                            <p className="text-base font-medium text-slate-600">
                                                Aucune propriété en attente de validation
                                            </p>
                                            <p className="mt-1 text-sm text-slate-400">
                                                Toutes les soumissions ont été traitées.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {properties.data.length > 0 && properties.links && (
                    <div className="border-t border-slate-100 p-4">
                        <Pagination links={properties.links} />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
