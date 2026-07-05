import CommunePopup from '@/components/forms/CommunePopup';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import { router } from '@inertiajs/react';
import {
    Building,
    Edit3,
    Globe,
    MapPin,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
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
    city_id: number;
    country: string;
    city: string;
    properties_count: number;
};

type PageProps = {
    municipalities: {
        data: Municipality[];
        links: { url: string | null; label: string; active: boolean }[];
        meta: { current_page: number; from: number; to: number; total: number };
    };
    filters?: { search?: string };
    cities: { id: number; name: string }[];
};

export default function Municipalities({
    municipalities,
    filters,
    cities = [],
}: PageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedMunicipality, setSelectedMunicipality] = useState<any>(null);
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
        setSelectedMunicipality(null);
        setEditMode(false);
        setIsOpen(true);
    };

    const handleOpenEdit = (municipality: Municipality) => {
        setSelectedMunicipality(municipality);
        setEditMode(true);
        setIsOpen(true);
    };

    const deleteMunicipality = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette commune ?')) {
            router.delete(route('dashboard.municipalities.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const goTo = (url: string | null) => {
        if (!url) return;
        const u = new URL(url, window.location.origin);
        if (searchQuery) u.searchParams.set('search', searchQuery);
        router.visit(u.toString(), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const totalCount =
        municipalities?.meta?.total ?? municipalities?.data?.length ?? 0;
    const totalProperties =
        municipalities?.data?.reduce(
            (total, commune) => total + (commune.properties_count || 0),
            0,
        ) ?? 0;

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                Communes
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Gérez les divisions géographiques de la
                                plateforme.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex min-w-[120px] flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <span className="text-2xl font-bold text-[#1E3A5F]">
                                    {totalCount}
                                </span>
                                <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                    Communes
                                </span>
                            </div>
                            <div className="flex min-w-[120px] flex-col items-center rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                                <span className="text-2xl font-bold text-emerald-600">
                                    {totalProperties}
                                </span>
                                <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                    Propriétés
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Rechercher une commune..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-2xl border border-gray-200 bg-white py-4 pr-4 pl-12 shadow-sm transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-slate-200"
                            />
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="inline-flex items-center rounded-2xl bg-gradient-to-r from-slate-100 to-slate-100 px-8 py-4 font-bold text-white shadow-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Plus size={20} className="mr-2" />
                            Nouvelle Commune
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                        <th className="px-6 py-5 text-left">
                                            Commune
                                        </th>
                                        <th className="px-6 py-5 text-left">
                                            Ville / Pays
                                        </th>
                                        <th className="px-6 py-5 text-center">
                                            Propriétés
                                        </th>
                                        <th className="px-6 py-5 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {municipalities.data.map((m) => (
                                        <tr
                                            key={m.id}
                                            className="group transition-all hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-[#1E3A5F] transition-transform group-hover:scale-110">
                                                        <Building size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">
                                                            {m.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            ID: #{m.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                                        <MapPin
                                                            size={14}
                                                            className="text-gray-400"
                                                        />
                                                        {m.city}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Globe
                                                            size={14}
                                                            className="text-gray-400"
                                                        />
                                                        {m.country}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#0d2340]">
                                                    {m.properties_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <button
                                                        onClick={() =>
                                                            handleOpenEdit(m)
                                                        }
                                                        className="rounded-lg p-2 text-[#1E3A5F] transition-all hover:bg-slate-100"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteMunicipality(
                                                                m.id,
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {municipalities.data.length === 0 && (
                                <div className="py-20 text-center">
                                    <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-200">
                                        <Building size={40} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Aucune commune disponible
                                    </h3>
                                    <p className="text-gray-500">
                                        Commencez par ajouter une nouvelle
                                        division géographique.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {municipalities.meta.total > municipalities.meta.to && (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            {municipalities.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url || link.active}
                                    onClick={() => goTo(link.url)}
                                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                                        link.active
                                            ? 'bg-slate-500 text-white shadow-lg shadow-sm'
                                            : 'border border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
                                    } ${!link.url && 'cursor-not-allowed opacity-30'}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <CommunePopup
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                initialData={selectedMunicipality}
                editMode={editMode}
                cities={cities}
            />
        </Dashboard>
    );
}
