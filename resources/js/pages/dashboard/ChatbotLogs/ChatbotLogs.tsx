import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { router } from '@inertiajs/react';
import {
    AlertCircle,
    Bot,
    CheckCircle,
    Clock,
    Download,
    HelpCircle,
    MessageSquare,
    Search,
    User,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type Log = {
    id: number;
    session_id: string;
    user?: { name: string };
    message: string;
    response: string;
    intent?: string;
    created_at: string;
    formatted_date?: string;
};

type Props = {
    logs: {
        data: Log[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page?: number;
        total?: number;
    };
};

export default function ChatbotLogs({
    logs = { data: [], links: [], current_page: 1, last_page: 1, total: 0 },
}: Readonly<Props>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            router.get(
                route('dashboard.chatbot-logs.index'),
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

    const getIntentIcon = (intent?: string) => {
        if (!intent) return <HelpCircle size={12} className="text-gray-500" />;

        const lowerIntent = intent.toLowerCase();
        if (lowerIntent.includes('question') || lowerIntent.includes('help')) {
            return <HelpCircle size={12} className="text-blue-500" />;
        } else if (
            lowerIntent.includes('greeting') ||
            lowerIntent.includes('hello')
        ) {
            return <MessageSquare size={12} className="text-emerald-500" />;
        } else if (
            lowerIntent.includes('goodbye') ||
            lowerIntent.includes('bye')
        ) {
            return <CheckCircle size={12} className="text-amber-500" />;
        } else if (
            lowerIntent.includes('error') ||
            lowerIntent.includes('problem')
        ) {
            return <XCircle size={12} className="text-red-500" />;
        } else {
            return <AlertCircle size={12} className="text-purple-500" />;
        }
    };

    const getIntentBadge = (intent?: string) => {
        if (!intent) {
            return (
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-800">
                    {getIntentIcon(intent)}
                    <span className="ml-1">Non défini</span>
                </span>
            );
        }

        const lowerIntent = intent.toLowerCase();
        let badgeClass = 'bg-gray-100 text-gray-800 border border-gray-200';

        if (lowerIntent.includes('question') || lowerIntent.includes('help')) {
            badgeClass = 'bg-blue-100 text-blue-800 border border-blue-200';
        } else if (
            lowerIntent.includes('greeting') ||
            lowerIntent.includes('hello')
        ) {
            badgeClass =
                'bg-emerald-100 text-emerald-800 border border-emerald-200';
        } else if (
            lowerIntent.includes('goodbye') ||
            lowerIntent.includes('bye')
        ) {
            badgeClass = 'bg-amber-100 text-amber-800 border border-amber-200';
        } else if (
            lowerIntent.includes('error') ||
            lowerIntent.includes('problem')
        ) {
            badgeClass = 'bg-red-100 text-red-800 border border-red-200';
        } else {
            badgeClass =
                'bg-purple-100 text-purple-800 border border-purple-200';
        }

        return (
            <span
                className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${badgeClass}`}
            >
                {getIntentIcon(intent)}
                <span className="ml-1">{intent}</span>
            </span>
        );
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

    const exportLogs = () => {
        window.location.href = route('dashboard.chatbot-logs.export');
    };

    // Calcul des statistiques
    const totalConversations = new Set(logs.data.map((log) => log.session_id))
        .size;
    const totalMessages = logs.data.length;
    const uniqueUsers = new Set(
        logs.data.map((log) => log.user?.name).filter(Boolean),
    ).size;
    const definedIntents = logs.data.filter((log) => log.intent).length;

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                {/* Header Section - Mobile First */}
                <div className="sticky top-0 z-10 border-b border-amber-200/30 bg-white/80 shadow-lg shadow-amber-500/5 backdrop-blur-xl">
                    <div className="w-full px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4 lg:px-8 lg:py-4">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="flex items-center justify-between">
                                <BackButton />

                                <div className="ml-0 flex-1 text-center sm:ml-4 sm:text-left">
                                    <h1 className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-lg font-bold text-transparent sm:text-xl md:text-2xl lg:text-3xl">
                                        Historique des conversations
                                    </h1>
                                    <p className="mt-1 text-xs text-slate-600 sm:text-sm md:text-base lg:text-base">
                                        Consultez et analysez les interactions
                                        avec le chatbot
                                    </p>
                                </div>
                            </div>

                            {/* Search and Filters - Mobile First */}
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:gap-4">
                                <div className="relative w-full sm:max-w-md sm:flex-1">
                                    <Search
                                        size={14}
                                        className="absolute top-1/2 left-3 -translate-y-1/2 text-amber-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Rechercher une conversation..."
                                        className={`w-full rounded-lg border border-amber-200/50 bg-white/80 py-2.5 pr-8 pl-9 text-xs shadow-sm backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none sm:py-3 sm:pr-10 sm:pl-10 sm:text-sm ${isSearching ? 'opacity-70' : ''}`}
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-amber-400 transition-colors hover:text-amber-600"
                                            aria-label="Effacer"
                                        >
                                            <XCircle size={12} />
                                        </button>
                                    )}
                                    {isSearching && (
                                        <div className="absolute top-1/2 right-8 -translate-y-1/2">
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
                                    className="flex w-full transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-amber-600 hover:to-amber-700 hover:shadow-xl sm:w-auto sm:px-6 sm:py-3"
                                    onClick={exportLogs}
                                >
                                    <Download size={14} />
                                    <span>Exporter</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - Mobile First Grid */}
                <div className="w-full px-3 py-4 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 lg:py-6">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                        <div className="transform rounded-lg border border-amber-200/30 bg-white p-3 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20 sm:rounded-xl sm:p-4 md:rounded-2xl md:p-5">
                            <div className="mb-2 flex items-center justify-between sm:mb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/30 sm:h-10 sm:w-10 sm:rounded-xl md:h-12 md:w-12">
                                    <MessageSquare
                                        size={14}
                                        className="text-white sm:size-16 md:size-20"
                                    />
                                </div>
                                <div className="hidden items-center rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 sm:flex sm:text-sm">
                                    <Clock
                                        size={10}
                                        className="mr-1 sm:size-12"
                                    />
                                    Total
                                </div>
                            </div>
                            <div className="text-base font-bold text-slate-900 sm:text-lg md:text-xl lg:text-2xl">
                                {totalConversations}
                            </div>
                            <div className="text-xs text-slate-600 sm:text-sm">
                                Conversations
                            </div>
                        </div>

                        <div className="transform rounded-lg border border-amber-200/30 bg-white p-3 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20 sm:rounded-xl sm:p-4 md:rounded-2xl md:p-5">
                            <div className="mb-2 flex items-center justify-between sm:mb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 sm:h-10 sm:w-10 sm:rounded-xl md:h-12 md:w-12">
                                    <Bot
                                        size={14}
                                        className="text-white sm:size-16 md:size-20"
                                    />
                                </div>
                                <div className="hidden items-center rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600 sm:flex sm:text-sm">
                                    <MessageSquare
                                        size={10}
                                        className="mr-1 sm:size-12"
                                    />
                                    Messages
                                </div>
                            </div>
                            <div className="text-base font-bold text-slate-900 sm:text-lg md:text-xl lg:text-2xl">
                                {totalMessages}
                            </div>
                            <div className="text-xs text-slate-600 sm:text-sm">
                                Messages échangés
                            </div>
                        </div>

                        <div className="transform rounded-lg border border-amber-200/30 bg-white p-3 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20 sm:rounded-xl sm:p-4 md:rounded-2xl md:p-5">
                            <div className="mb-2 flex items-center justify-between sm:mb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 sm:h-10 sm:w-10 sm:rounded-xl md:h-12 md:w-12">
                                    <User
                                        size={14}
                                        className="text-white sm:size-16 md:size-20"
                                    />
                                </div>
                                <div className="hidden items-center rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-600 sm:flex sm:text-sm">
                                    <User
                                        size={10}
                                        className="mr-1 sm:size-12"
                                    />
                                    Utilisateurs
                                </div>
                            </div>
                            <div className="text-base font-bold text-slate-900 sm:text-lg md:text-xl lg:text-2xl">
                                {uniqueUsers}
                            </div>
                            <div className="text-xs text-slate-600 sm:text-sm">
                                Utilisateurs uniques
                            </div>
                        </div>

                        <div className="transform rounded-lg border border-amber-200/30 bg-white p-3 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20 sm:rounded-xl sm:p-4 md:rounded-2xl md:p-5">
                            <div className="mb-2 flex items-center justify-between sm:mb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/30 sm:h-10 sm:w-10 sm:rounded-xl md:h-12 md:w-12">
                                    <AlertCircle
                                        size={14}
                                        className="text-white sm:size-16 md:size-20"
                                    />
                                </div>
                                <div className="hidden items-center rounded-lg bg-purple-50 px-2 py-1 text-xs font-medium text-purple-600 sm:flex sm:text-sm">
                                    <CheckCircle
                                        size={10}
                                        className="mr-1 sm:size-12"
                                    />
                                    Intents
                                </div>
                            </div>
                            <div className="text-base font-bold text-slate-900 sm:text-lg md:text-xl lg:text-2xl">
                                {definedIntents}
                            </div>
                            <div className="text-xs text-slate-600 sm:text-sm">
                                Intents identifiés
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section - Mobile First */}
                <div className="w-full px-3 py-4 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 lg:py-6">
                    <div className="overflow-hidden rounded-lg border border-amber-200/30 bg-white shadow-lg shadow-amber-500/10 sm:rounded-xl md:rounded-2xl">
                        <div className="overflow-x-auto">
                            {/* Desktop Table - Hidden on Mobile */}
                            <table className="hidden w-full md:table lg:table">
                                <thead className="bg-amber-50/30">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-slate-700 uppercase sm:px-4 sm:py-3 md:px-6">
                                            #
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-slate-700 uppercase sm:px-4 sm:py-3 md:px-6">
                                            Session
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-slate-700 uppercase sm:px-4 sm:py-3 md:px-6">
                                            Utilisateur
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-slate-700 uppercase sm:px-4 sm:py-3 md:px-6">
                                            Message
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-slate-700 uppercase sm:px-4 sm:py-3 md:px-6">
                                            Réponse
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-slate-700 uppercase sm:px-4 sm:py-3 md:px-6">
                                            Intent
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-slate-700 uppercase sm:px-4 sm:py-3 md:px-6">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-200/30">
                                    {logs.data.map((log, index) => (
                                        <tr
                                            key={log.id}
                                            className="transition-colors hover:bg-amber-50/30"
                                            style={{
                                                animationDelay: `${index * 0.05}s`,
                                            }}
                                        >
                                            <td className="px-3 py-2 text-sm whitespace-nowrap text-slate-900 sm:px-4 sm:py-3 md:px-6">
                                                {(logs.current_page - 1) *
                                                    (logs.per_page || 20) +
                                                    index +
                                                    1}
                                            </td>
                                            <td
                                                className="max-w-xs truncate px-3 py-2 text-sm whitespace-nowrap text-slate-600 sm:px-4 sm:py-3 md:px-6"
                                                title={log.session_id}
                                            >
                                                {log.session_id}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap sm:px-4 sm:py-3 md:px-6">
                                                <div className="flex items-center">
                                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-bold text-white sm:h-7 sm:w-7 md:h-8 md:w-8">
                                                        {(log.user?.name || 'U')
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div className="ml-2 sm:ml-3">
                                                        <div className="text-xs font-medium text-slate-900 sm:text-sm">
                                                            {log.user?.name ||
                                                                'Utilisateur inconnu'}
                                                        </div>
                                                        <div className="hidden text-xs text-slate-500 sm:block">
                                                            ID: #{log.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                className="max-w-xs truncate px-3 py-2 text-sm text-slate-600 sm:px-4 sm:py-3 md:px-6"
                                                title={log.message}
                                            >
                                                {log.message}
                                            </td>
                                            <td
                                                className="max-w-xs truncate px-3 py-2 text-sm text-slate-600 sm:px-4 sm:py-3 md:px-6"
                                                title={log.response}
                                            >
                                                {log.response}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap sm:px-4 sm:py-3 md:px-6">
                                                {getIntentBadge(log.intent)}
                                            </td>
                                            <td className="px-3 py-2 text-sm whitespace-nowrap text-slate-600 sm:px-4 sm:py-3 md:px-6">
                                                {log.formatted_date ||
                                                    formatDate(log.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile Cards - Mobile First */}
                            <div className="md:hidden lg:hidden">
                                {logs.data.map((log, index) => (
                                    <div
                                        key={log.id}
                                        className="border-b border-amber-200/30 p-3 last:border-b-0 sm:p-4"
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex min-w-0 flex-1 items-center">
                                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-bold text-white sm:h-7 sm:w-7">
                                                    {(log.user?.name || 'U')
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div className="ml-2 min-w-0 flex-1 sm:ml-3">
                                                    <h3 className="truncate text-sm font-medium text-slate-900 sm:text-base">
                                                        {log.user?.name ||
                                                            'Utilisateur inconnu'}
                                                    </h3>
                                                    <p className="text-xs text-slate-500">
                                                        Session:{' '}
                                                        {log.session_id.substring(
                                                            0,
                                                            8,
                                                        )}
                                                        ...
                                                    </p>
                                                </div>
                                            </div>
                                            {getIntentBadge(log.intent)}
                                        </div>

                                        <div className="mb-3 space-y-2">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-medium text-slate-500">
                                                    Message
                                                </span>
                                                <span className="text-sm break-words text-slate-900">
                                                    {log.message}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-medium text-slate-500">
                                                    Réponse
                                                </span>
                                                <span className="text-sm break-words text-slate-900">
                                                    {log.response}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-medium text-slate-500">
                                                    Date
                                                </span>
                                                <span className="text-sm text-slate-900">
                                                    {log.formatted_date ||
                                                        formatDate(
                                                            log.created_at,
                                                        )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {logs.data.length === 0 && (
                                    <div className="py-8 text-center sm:py-12">
                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100/50 sm:mb-6 sm:h-16 sm:w-16 sm:rounded-xl md:h-20 md:w-20 md:rounded-2xl">
                                            <MessageSquare
                                                size={16}
                                                className="text-amber-500 sm:size-20 md:size-24"
                                            />
                                        </div>
                                        <h3 className="mb-2 text-base font-semibold text-slate-900 sm:text-lg md:text-xl">
                                            Aucune conversation trouvée
                                        </h3>
                                        <p className="px-4 text-sm text-slate-600">
                                            {searchQuery
                                                ? 'Aucune conversation ne correspond à votre recherche'
                                                : "Le chatbot n'a encore reçu aucune interaction"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination - Mobile First */}
                <div className="w-full px-3 py-4 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 lg:py-6">
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
                        <div className="w-full text-center text-xs text-slate-600 sm:w-auto sm:text-left sm:text-sm">
                            {logs.data.length > 0 ? (
                                <>
                                    Affichage de {logs.data.length} sur{' '}
                                    {logs.total || logs.data.length}{' '}
                                    conversations
                                </>
                            ) : (
                                'Aucune conversation'
                            )}
                        </div>

                        <div className="flex w-full flex-wrap items-center justify-center gap-1 sm:w-auto sm:justify-start sm:gap-2">
                            {logs.links.map((link, index) => (
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
