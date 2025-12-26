import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { router } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    Info,
    Search,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type Log = {
    id: number;
    user: string;
    action: string;
    entity_type: string;
    entity_id: number | null;
    description: string;
    level: string;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
};

type Props = {
    logs: {
        data: Log[];
        links: any[];
        current_page: number;
        last_page: number;
        total?: number;
    };
};

export default function AuditLog({
    logs = { data: [], links: [], current_page: 1, last_page: 1, total: 0 },
}: Readonly<Props>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            router.get(
                route('dashboard.audit-logs.index'),
                { search: searchQuery, page: 1 },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                    only: ['logs'],
                    onStart: () => setIsSearching(true),
                    onFinish: () => setIsSearching(false),
                },
            );
        }, 350);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const getLevelIcon = (level: string) => {
        switch (level.toLowerCase()) {
            case 'info':
                return <Info size={12} className="text-emerald-600" />;
            case 'warning':
                return <AlertTriangle size={12} className="text-amber-600" />;
            case 'error':
                return <XCircle size={12} className="text-red-600" />;
            case 'critical':
                return <AlertCircle size={12} className="text-purple-600" />;
            default:
                return <Info size={12} className="text-gray-600" />;
        }
    };

    const getLevelBadge = (level: string) => {
        switch (level.toLowerCase()) {
            case 'info':
                return (
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        {getLevelIcon(level)}
                        <span className="ml-1">{level.toUpperCase()}</span>
                    </span>
                );
            case 'warning':
                return (
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                        {getLevelIcon(level)}
                        <span className="ml-1">{level.toUpperCase()}</span>
                    </span>
                );
            case 'error':
                return (
                    <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                        {getLevelIcon(level)}
                        <span className="ml-1">{level.toUpperCase()}</span>
                    </span>
                );
            case 'critical':
                return (
                    <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                        {getLevelIcon(level)}
                        <span className="ml-1">{level.toUpperCase()}</span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                        {getLevelIcon(level)}
                        <span className="ml-1">{level.toUpperCase()}</span>
                    </span>
                );
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const goTo = (url: string | null) => {
        if (!url) return;
        const u = new URL(url, window.location.origin);
        if (searchQuery) u.searchParams.set('search', searchQuery);
        else u.searchParams.delete('search');

        router.visit(u.toString(), {
            only: ['logs'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onStart: () => setIsSearching(true),
            onFinish: () => setIsSearching(false),
        });
    };

    const purgeLogs = () => {
        if (confirm('Confirmer la purge des logs de plus de 6 mois ?')) {
            router.delete(route('dashboard.audit-logs.purge'), {
                preserveScroll: true,
            });
        }
    };

    const infoLogs =
        logs?.data?.filter((log) => log.level.toLowerCase() === 'info')
            .length || 0;
    const warningLogs =
        logs?.data?.filter((log) => log.level.toLowerCase() === 'warning')
            .length || 0;
    const errorLogs =
        logs?.data?.filter((log) => log.level.toLowerCase() === 'error')
            .length || 0;
    const criticalLogs =
        logs?.data?.filter((log) => log.level.toLowerCase() === 'critical')
            .length || 0;

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                {/* Header Section */}
                <div className="sticky top-0 z-10 border-b border-amber-200/30 bg-white/80 shadow-lg shadow-amber-500/5 backdrop-blur-xl">
                    <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="flex items-start justify-between sm:items-center">
                                <BackButton />

                                <div className="ml-0 flex-1 text-center sm:ml-4 sm:text-left">
                                    <h1 className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-xl font-bold text-transparent sm:text-2xl lg:text-3xl">
                                        Audit Logs
                                    </h1>
                                    <p className="mt-1 text-xs text-slate-600 sm:text-sm lg:text-base">
                                        Consultez et gérez l'ensemble des
                                        activités système
                                    </p>
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:gap-4">
                                <div className="relative w-full flex-1 sm:max-w-md">
                                    <Search
                                        size={16}
                                        className="absolute top-1/2 left-3 -translate-y-1/2 text-amber-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Rechercher dans les logs..."
                                        className={`w-full rounded-lg border border-amber-200/50 bg-white/80 py-2.5 pr-8 pl-9 text-xs shadow-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:rounded-xl sm:py-3 sm:pr-10 sm:pl-10 sm:text-sm ${isSearching ? 'opacity-70' : ''}`}
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-amber-400 transition-colors hover:text-amber-600 sm:right-3"
                                            aria-label="Effacer"
                                        >
                                            <XCircle size={14} />
                                        </button>
                                    )}
                                    {isSearching && (
                                        <div className="absolute top-1/2 right-8 -translate-y-1/2 sm:right-12">
                                            <svg
                                                className="h-3 w-3 animate-spin text-amber-500 sm:h-4 sm:w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="flex transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-red-600 hover:to-red-700 hover:shadow-xl sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
                                    onClick={purgeLogs}
                                >
                                    <AlertCircle size={14} />
                                    <span>Purger</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        <div className="transform rounded-xl border border-amber-200/30 bg-white p-3 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20 sm:rounded-2xl sm:p-5">
                            <div className="mb-2 flex items-center justify-between sm:mb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 sm:h-10 sm:w-10 sm:rounded-xl">
                                    <Info
                                        size={14}
                                        className="text-white sm:size-18"
                                    />
                                </div>
                                <div className="hidden items-center rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600 sm:flex sm:text-sm">
                                    <CheckCircle
                                        size={10}
                                        className="mr-1 sm:size-12"
                                    />
                                    Info
                                </div>
                            </div>
                            <div className="text-lg font-bold text-slate-900 sm:text-2xl">
                                {infoLogs}
                            </div>
                            <div className="text-xs text-slate-600 sm:text-sm">
                                Logs d'information
                            </div>
                        </div>

                        <div className="transform rounded-xl border border-amber-200/30 bg-white p-3 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20 sm:rounded-2xl sm:p-5">
                            <div className="mb-2 flex items-center justify-between sm:mb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 sm:h-10 sm:w-10 sm:rounded-xl">
                                    <AlertTriangle
                                        size={14}
                                        className="text-white sm:size-18"
                                    />
                                </div>
                                <div className="hidden items-center rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-600 sm:flex sm:text-sm">
                                    <AlertCircle
                                        size={10}
                                        className="mr-1 sm:size-12"
                                    />
                                    Warning
                                </div>
                            </div>
                            <div className="text-lg font-bold text-slate-900 sm:text-2xl">
                                {warningLogs}
                            </div>
                            <div className="text-xs text-slate-600 sm:text-sm">
                                Avertissements
                            </div>
                        </div>

                        <div className="transform rounded-xl border border-amber-200/30 bg-white p-3 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20 sm:rounded-2xl sm:p-5">
                            <div className="mb-2 flex items-center justify-between sm:mb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/30 sm:h-10 sm:w-10 sm:rounded-xl">
                                    <XCircle
                                        size={14}
                                        className="text-white sm:size-18"
                                    />
                                </div>
                                <div className="hidden items-center rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-600 sm:flex sm:text-sm">
                                    <AlertCircle
                                        size={10}
                                        className="mr-1 sm:size-12"
                                    />
                                    Error
                                </div>
                            </div>
                            <div className="text-lg font-bold text-slate-900 sm:text-2xl">
                                {errorLogs}
                            </div>
                            <div className="text-xs text-slate-600 sm:text-sm">
                                Erreurs système
                            </div>
                        </div>

                        <div className="transform rounded-xl border border-amber-200/30 bg-white p-3 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20 sm:rounded-2xl sm:p-5">
                            <div className="mb-2 flex items-center justify-between sm:mb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/30 sm:h-10 sm:w-10 sm:rounded-xl">
                                    <AlertCircle
                                        size={14}
                                        className="text-white sm:size-18"
                                    />
                                </div>
                                <div className="hidden items-center rounded-lg bg-purple-50 px-2 py-1 text-xs font-medium text-purple-600 sm:flex sm:text-sm">
                                    <AlertCircle
                                        size={10}
                                        className="mr-1 sm:size-12"
                                    />
                                    Critical
                                </div>
                            </div>
                            <div className="text-lg font-bold text-slate-900 sm:text-2xl">
                                {criticalLogs}
                            </div>
                            <div className="text-xs text-slate-600 sm:text-sm">
                                Erreurs critiques
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
                    <div className="overflow-hidden rounded-xl border border-amber-200/30 bg-white shadow-lg shadow-amber-500/10 sm:rounded-2xl">
                        <div className="overflow-x-auto">
                            {/* Desktop Table */}
                            <table className="hidden w-full lg:table">
                                <thead className="bg-amber-50/30">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-700 uppercase lg:px-6 lg:py-4">
                                            #
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-700 uppercase lg:px-6 lg:py-4">
                                            Agent
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-700 uppercase lg:px-6 lg:py-4">
                                            Utilisateur
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-700 uppercase lg:px-6 lg:py-4">
                                            Action
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-700 uppercase lg:px-6 lg:py-4">
                                            Cible
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-700 uppercase lg:px-6 lg:py-4">
                                            Niveau
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-700 uppercase lg:px-6 lg:py-4">
                                            IP
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-700 uppercase lg:px-6 lg:py-4">
                                            Description
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-700 uppercase lg:px-6 lg:py-4">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-200/30">
                                    {logs?.data?.map((log, index) => (
                                        <tr
                                            key={log.id}
                                            className="transition-colors hover:bg-amber-50/30"
                                            style={{
                                                animationDelay: `${index * 0.05}s`,
                                            }}
                                        >
                                            <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-900 lg:px-6 lg:py-4">
                                                {index + 1}
                                            </td>
                                            <td
                                                className="max-w-xs truncate px-4 py-3 text-sm whitespace-nowrap text-slate-600 lg:px-6 lg:py-4"
                                                title={log.user_agent || '-'}
                                            >
                                                {log.user_agent || '-'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap lg:px-6 lg:py-4">
                                                <div className="flex items-center">
                                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-bold text-white sm:h-7 sm:w-7">
                                                        {log.user
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div className="ml-2 sm:ml-3">
                                                        <div className="text-xs font-medium text-slate-900 sm:text-sm">
                                                            {log.user}
                                                        </div>
                                                        <div className="hidden text-xs text-slate-500 sm:block">
                                                            ID: #{log.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-900 lg:px-6 lg:py-4">
                                                {log.action}
                                            </td>
                                            <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-900 lg:px-6 lg:py-4">
                                                {log.entity_type}{' '}
                                                {log.entity_id
                                                    ? `#${log.entity_id}`
                                                    : ''}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap lg:px-6 lg:py-4">
                                                {getLevelBadge(log.level)}
                                            </td>
                                            <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-600 lg:px-6 lg:py-4">
                                                {log.ip_address || '-'}
                                            </td>
                                            <td
                                                className="max-w-xs truncate px-4 py-3 text-sm text-slate-600 lg:px-6 lg:py-4"
                                                title={log.description || '-'}
                                            >
                                                {log.description || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-600 lg:px-6 lg:py-4">
                                                {formatDate(log.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile Cards */}
                            <div className="lg:hidden">
                                {logs?.data?.map((log, index) => (
                                    <div
                                        key={log.id}
                                        className="border-b border-amber-200/30 p-3 last:border-b-0 sm:p-4"
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex min-w-0 flex-1 items-center">
                                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-bold text-white sm:h-7 sm:w-7">
                                                    {log.user
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div className="ml-2 min-w-0 flex-1 sm:ml-3">
                                                    <h3 className="truncate text-sm font-medium text-slate-900 sm:text-base">
                                                        {log.user}
                                                    </h3>
                                                    <p className="text-xs text-slate-500">
                                                        ID: #{log.id}
                                                    </p>
                                                </div>
                                            </div>
                                            {getLevelBadge(log.level)}
                                        </div>

                                        <div className="mb-3 space-y-2">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-2">
                                                <span className="text-xs text-slate-500">
                                                    Action
                                                </span>
                                                <span className="truncate text-right text-xs text-slate-900 sm:text-left sm:text-sm">
                                                    {log.action}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-2">
                                                <span className="text-xs text-slate-500">
                                                    Cible
                                                </span>
                                                <span className="truncate text-right text-xs text-slate-900 sm:text-left sm:text-sm">
                                                    {log.entity_type}{' '}
                                                    {log.entity_id
                                                        ? `#${log.entity_id}`
                                                        : ''}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-2">
                                                <span className="text-xs text-slate-500">
                                                    IP
                                                </span>
                                                <span className="text-right text-xs text-slate-900 sm:text-left sm:text-sm">
                                                    {log.ip_address || '-'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-2">
                                                <span className="text-xs text-slate-500">
                                                    Date
                                                </span>
                                                <span className="text-right text-xs text-slate-900 sm:text-left sm:text-sm">
                                                    {formatDate(log.created_at)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <span className="text-xs text-slate-500">
                                                Description
                                            </span>
                                            <p className="mt-1 text-xs break-words text-slate-900 sm:text-sm">
                                                {log.description || '-'}
                                            </p>
                                        </div>

                                        <div>
                                            <span className="text-xs text-slate-500">
                                                Agent
                                            </span>
                                            <p className="mt-1 text-xs break-all text-slate-900 sm:text-sm">
                                                {log.user_agent || '-'}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {logs?.data?.length === 0 && (
                                    <div className="py-8 text-center sm:py-12">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-amber-100/50 sm:mb-6 sm:h-20 sm:w-20 sm:rounded-2xl">
                                            <Activity
                                                size={20}
                                                className="text-amber-500 sm:size-24"
                                            />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-slate-900 sm:text-xl">
                                            Aucun log trouvé
                                        </h3>
                                        <p className="px-4 text-sm text-slate-600">
                                            {searchQuery
                                                ? 'Aucun log ne correspond à votre recherche'
                                                : "Il n'y a pas encore d'activité enregistrée"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className="px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
                        <div className="text-center text-xs text-slate-600 sm:text-left sm:text-sm">
                            {logs?.data?.length > 0 ? (
                                <>
                                    Affichage de {logs.data.length} sur{' '}
                                    {logs.total || logs.data.length} logs
                                </>
                            ) : (
                                'Aucun log'
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                            {logs?.links?.map((link, index) => (
                                <button
                                    key={index}
                                    className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200 sm:px-3 sm:py-2 sm:text-sm ${
                                        link.active
                                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                            : 'text-slate-600 hover:bg-amber-100 hover:text-amber-700'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={!link.url}
                                    onClick={() => goTo(link.url)}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
