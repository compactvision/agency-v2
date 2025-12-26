import CommunePopup from '@/components/forms/CommunePopup';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import { router } from '@inertiajs/react';
import { ArrowLeft, Building, Edit3, Globe, MapPin, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Petit hook debounce réutilisable
function useDebounce<T>(value: T, delay = 300) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setV(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return v;
}

type Municipality = {
    id: number;
    name: string;
    country: string;
    city: string;
    image?: string;
    properties_count: number;
    status?: string;
};

type PageProps = {
    municipalities: {
        data: Municipality[];
        links: { url: string | null; label: string; active: boolean }[];
        meta: { current_page: number; from: number; to: number; total: number };
    };
    filters?: { search?: string };
};

export default function Municipalities({ municipalities, filters }: PageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [initialData, setInitialData] = useState({ name: '', country: '', city: '', image: null });
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');
    const [loading, setLoading] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Recherche en temps réel avec debounce
    useEffect(() => {
        router.get(
            route('dashboard.municipalities.index'),
            { search: debouncedSearch, page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['municipalities', 'filters'],
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    }, [debouncedSearch]);

    const handleOpenCreate = () => {
        setInitialData({ name: '', country: '', city: '', image: null });
        setEditMode(false);
        setIsOpen(true);
    };

    const handleOpenEdit = (municipality) => {
        setInitialData(municipality);
        setEditMode(true);
        setIsOpen(true);
    };

    const deleteMunicipality = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette commune ?')) {
            router.delete(route('dashboard.municipalities.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Notification de succès pourrait être ajoutée ici
                },
            });
        }
    };

    const goTo = (url) => {
        if (!url) return;
        const u = new URL(url, window.location.origin);
        if (searchQuery) u.searchParams.set('search', searchQuery);
        router.visit(u.toString(), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Statistiques
    const totalCount = municipalities?.meta?.total ?? municipalities?.data?.length ?? 0;
    const totalProperties = municipalities?.data?.reduce((total, commune) => total + commune.properties_count, 0) ?? 0;

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex w-full items-center justify-center rounded-xl bg-amber-100/50 px-4 py-2.5 text-amber-700 transition-colors duration-200 hover:bg-amber-100 sm:w-auto"
                        >
                            <ArrowLeft size={18} />
                            <span className="ml-2 text-sm sm:text-base">Retour</span>
                        </button>

                        <div className="mt-4 overflow-hidden rounded-xl border border-amber-200/30 bg-white shadow-sm">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    <div className="mb-6 lg:mb-0">
                                        <h1 className="text-2xl font-bold text-gray-900">Communes</h1>
                                        <p className="mt-1 text-gray-600">Gérez vos communes et leurs informations</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="min-w-[120px] rounded-lg bg-amber-50 p-4 text-center">
                                            <span className="block text-2xl font-bold text-amber-600">{totalCount}</span>
                                            <span className="text-sm text-gray-600">Communes</span>
                                        </div>
                                        <div className="min-w-[120px] rounded-lg bg-emerald-50 p-4 text-center">
                                            <span className="block text-2xl font-bold text-emerald-600">{totalProperties}</span>
                                            <span className="text-sm text-gray-600">Propriétés</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className="mb-6">
                        <div className="rounded-xl border border-amber-200/30 bg-white p-4 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="relative flex-1">
                                    <Search size={20} className="absolute top-1/2 left-3 -translate-y-1/2 text-amber-500" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher une commune..."
                                        className={`w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none ${loading ? 'opacity-70' : ''}`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-amber-400 transition-colors hover:text-amber-600"
                                            aria-label="Effacer"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                <button
                                    onClick={handleOpenCreate}
                                    className="inline-flex transform items-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-3 font-medium text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700"
                                >
                                    <Plus size={18} className="mr-2" />
                                    <span className="hidden sm:inline">Nouvelle commune</span>
                                    <span className="sm:hidden">Ajouter</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-hidden rounded-xl border border-amber-200/30 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            {/* Desktop Table */}
                            <table className="hidden w-full md:table">
                                <thead className="bg-amber-50/30">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">Image</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">Commune</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">Pays</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">Ville</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">Propriétés</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-200/30">
                                    {municipalities.data.map((municipality, index) => (
                                        <tr
                                            key={municipality.id}
                                            className="transition-colors hover:bg-amber-50/30"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="h-10 w-10 overflow-hidden rounded-full">
                                                    {municipality.image ? (
                                                        <img
                                                            src={`/storage/${municipality.image}`}
                                                            alt={municipality.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600">
                                                            <Building size={16} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{municipality.name}</div>
                                                        <div className="text-sm text-gray-500">#{municipality.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Globe size={16} className="mr-2 text-gray-400" />
                                                    <span className="text-sm text-gray-900">{municipality.country}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <MapPin size={16} className="mr-2 text-gray-400" />
                                                    <span className="text-sm text-gray-900">{municipality.city}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                                                    {municipality.properties_count}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="rounded-lg p-1 text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-900"
                                                        onClick={() => handleOpenEdit(municipality)}
                                                        title="Modifier"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        className="rounded-lg p-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-900"
                                                        onClick={() => deleteMunicipality(municipality.id)}
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile Cards */}
                            <div className="md:hidden">
                                {municipalities.data.map((municipality, index) => (
                                    <div
                                        key={municipality.id}
                                        className="border-b border-amber-200/30 p-4 last:border-b-0"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex items-center">
                                                <div className="mr-3 h-12 w-12 overflow-hidden rounded-full">
                                                    {municipality.image ? (
                                                        <img
                                                            src={`/storage/${municipality.image}`}
                                                            alt={municipality.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600">
                                                            <Building size={20} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-medium text-gray-900">{municipality.name}</h3>
                                                    <p className="text-sm text-gray-500">#{municipality.id}</p>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                                                {municipality.properties_count} propriétés
                                            </span>
                                        </div>

                                        <div className="mb-3 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Pays</span>
                                                <span className="text-sm text-gray-900">{municipality.country}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Ville</span>
                                                <span className="text-sm text-gray-900">{municipality.city}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="rounded-lg p-2 text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-900"
                                                onClick={() => handleOpenEdit(municipality)}
                                                title="Modifier"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-900"
                                                onClick={() => deleteMunicipality(municipality.id)}
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {municipalities.data.length === 0 && (
                                <div className="py-12 text-center">
                                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-amber-100/50">
                                        <Building size={32} className="text-amber-500" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900">Aucune commune trouvée</h3>
                                    <p className="mb-6 text-gray-600">Commencez par créer votre première commune</p>
                                    <button
                                        onClick={handleOpenCreate}
                                        className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 font-medium text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700"
                                    >
                                        <Plus size={20} className="mr-2" />
                                        Créer une commune
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex flex-col items-center justify-between sm:flex-row">
                        <div className="mb-4 text-sm text-gray-700 sm:mb-0">
                            {municipalities.data.length > 0 ? (
                                <>
                                    {/* Affichage de {municipalities.meta.from} à {municipalities.meta.to} sur {municipalities.meta.total} communes */}
                                </>
                            ) : (
                                'Aucune commune'
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {municipalities.links.map((link, index) => (
                                <button
                                    key={index}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        link.active
                                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                            : 'text-gray-600 hover:bg-amber-100 hover:text-amber-700'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={!link.url}
                                    onClick={() => goTo(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <CommunePopup isOpen={isOpen} onClose={() => setIsOpen(false)} initialData={initialData} editMode={editMode} />
        </Dashboard>
    );
}
