import CommunePopup from '@/components/forms/CommunePopup';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import { router } from '@inertiajs/react';
import {
    Building,
    Building2,
    Edit3,
    Globe,
    Landmark,
    ListTree,
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
    country_id?: number;
    country: string;
    city: string;
    image?: string | null;
    image_url?: string | null;
    properties?: number;
    properties_count: number;
};

type PageProps = {
    municipalities: {
        data: Municipality[];
        links: { url: string | null; label: string; active: boolean }[];
        meta: { current_page: number; from: number; to: number; total: number };
    };
    filters?: { search?: string };
    cities: {
        id: number;
        name: string;
        country_id: number;
        country?: string;
        municipalities_count?: number;
    }[];
    countries: {
        id: number;
        name: string;
        iso_code?: string;
        cities_count?: number;
        municipalities_count?: number;
    }[];
};

export default function Municipalities({
    municipalities,
    filters,
    cities = [],
    countries = [],
}: PageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedMunicipality, setSelectedMunicipality] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState<
        'municipalities' | 'cities' | 'countries'
    >('municipalities');
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
            (total, commune) =>
                total + (commune.properties_count ?? commune.properties ?? 0),
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

                    <div className="mb-8 rounded-3xl border border-slate-200/80 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-[#353130]">
                        <div
                            className="grid grid-cols-3 gap-2"
                            role="tablist"
                            aria-label="Référentiel géographique"
                        >
                            {[
                                {
                                    id: 'municipalities' as const,
                                    label: 'Communes',
                                    count: totalCount,
                                    icon: Building2,
                                },
                                {
                                    id: 'cities' as const,
                                    label: 'Villes',
                                    count: cities.length,
                                    icon: MapPin,
                                },
                                {
                                    id: 'countries' as const,
                                    label: 'Pays',
                                    count: countries.length,
                                    icon: Globe,
                                },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                const active = activeView === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => setActiveView(tab.id)}
                                        className={`flex min-w-0 items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-bold transition-all sm:py-4 ${
                                            active
                                                ? 'bg-[#292625] text-white shadow-lg dark:bg-[#CF8E19] dark:text-[#292625]'
                                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-[#C9C5BB] dark:hover:bg-white/5 dark:hover:text-white'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                                        <span className="truncate">
                                            {tab.label}
                                        </span>
                                        <span
                                            className={`hidden rounded-full px-2 py-0.5 text-xs sm:inline ${
                                                active
                                                    ? 'bg-white/15'
                                                    : 'bg-slate-100 dark:bg-white/10'
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {activeView === 'municipalities' && (
                        <>
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
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full rounded-2xl border border-gray-200 bg-white py-4 pr-4 pl-12 shadow-sm transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-slate-200"
                                    />
                                </div>
                                <button
                                    onClick={handleOpenCreate}
                                    className="inline-flex items-center justify-center rounded-2xl bg-[#292625] px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-[#CF8E19] hover:text-[#292625] active:scale-[0.98] dark:bg-[#CF8E19] dark:text-[#292625]"
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
                                                            {m.image_url ||
                                                            m.image ? (
                                                                <img
                                                                    src={
                                                                        m.image_url ??
                                                                        `/storage/${m.image}`
                                                                    }
                                                                    alt=""
                                                                    className="h-12 w-12 rounded-xl object-cover shadow-sm transition-transform group-hover:scale-110"
                                                                />
                                                            ) : (
                                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-[#1E3A5F] transition-transform group-hover:scale-110">
                                                                    <Building
                                                                        size={
                                                                            24
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
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
                                                            {m.properties_count ??
                                                                m.properties ??
                                                                0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                            <button
                                                                onClick={() =>
                                                                    handleOpenEdit(
                                                                        m,
                                                                    )
                                                                }
                                                                className="rounded-lg p-2 text-[#1E3A5F] transition-all hover:bg-slate-100"
                                                            >
                                                                <Edit3
                                                                    size={18}
                                                                />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    deleteMunicipality(
                                                                        m.id,
                                                                    )
                                                                }
                                                                className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                                                            >
                                                                <Trash2
                                                                    size={18}
                                                                />
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
                                                Commencez par ajouter une
                                                nouvelle division géographique.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {municipalities.meta.total >
                                municipalities.meta.to && (
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
                        </>
                    )}

                    {activeView === 'cities' && (
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#353130]">
                            <div className="border-b border-slate-100 p-6 dark:border-white/10">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#CF8E19]/15 text-[#CF8E19]">
                                        <ListTree className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <h2 className="font-bold text-slate-900 dark:text-white">
                                            Villes du système
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-[#C9C5BB]">
                                            Chaque ville est rattachée à son
                                            pays.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                                {cities.map((city) => (
                                    <div
                                        key={city.id}
                                        className="group flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:-translate-y-0.5 hover:border-[#CF8E19]/40 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]"
                                    >
                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-[#292625] group-hover:bg-[#CF8E19] dark:bg-white/10 dark:text-white">
                                            <Building2 className="h-5 w-5" />
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="truncate font-bold text-slate-900 dark:text-white">
                                                {city.name}
                                            </h3>
                                            <p className="truncate text-xs text-slate-500 dark:text-[#C9C5BB]">
                                                {city.country ??
                                                    'Pays non renseigné'}
                                            </p>
                                            <p className="mt-1 text-xs font-semibold text-[#CF8E19]">
                                                {city.municipalities_count ?? 0}{' '}
                                                commune(s)
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeView === 'countries' && (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {countries.map((country) => (
                                <article
                                    key={country.id}
                                    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#CF8E19]/50 hover:shadow-xl dark:border-white/10 dark:bg-[#353130]"
                                >
                                    <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#CF8E19]/10 transition-transform duration-500 group-hover:scale-150" />
                                    <div className="relative flex items-start justify-between gap-4">
                                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#292625] text-[#CF8E19] shadow-lg dark:bg-[#CF8E19] dark:text-[#292625]">
                                            <Landmark className="h-6 w-6" />
                                        </span>
                                        <span className="rounded-full border border-[#CF8E19]/30 bg-[#CF8E19]/10 px-3 py-1 text-xs font-black tracking-widest text-[#A36B08] dark:text-[#E0A43A]">
                                            {country.iso_code ?? '—'}
                                        </span>
                                    </div>
                                    <h2 className="relative mt-6 text-xl font-black text-slate-900 dark:text-white">
                                        {country.name}
                                    </h2>
                                    <div className="relative mt-5 grid grid-cols-2 gap-3">
                                        <div className="rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
                                            <strong className="block text-xl text-[#292625] dark:text-white">
                                                {country.cities_count ?? 0}
                                            </strong>
                                            <span className="text-xs text-slate-500 dark:text-[#C9C5BB]">
                                                Villes
                                            </span>
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
                                            <strong className="block text-xl text-[#292625] dark:text-white">
                                                {country.municipalities_count ??
                                                    0}
                                            </strong>
                                            <span className="text-xs text-slate-500 dark:text-[#C9C5BB]">
                                                Communes
                                            </span>
                                        </div>
                                    </div>
                                </article>
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
                countries={countries}
            />
        </Dashboard>
    );
}
