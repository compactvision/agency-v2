import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import { router } from '@inertiajs/react';
import { ArrowLeft, ImageOff, Plus, Search, MessageSquare, Bot, User, Clock, Download, Filter, XCircle, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import BackButton from '@/components/ui/BackButton';

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

export default function ChatbotLogs({ logs }: Readonly<Props>) {
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
                }
            );
        }, 350);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const getIntentIcon = (intent?: string) => {
        if (!intent) return <HelpCircle size={12} className="text-gray-500" />;
        
        const lowerIntent = intent.toLowerCase();
        if (lowerIntent.includes('question') || lowerIntent.includes('help')) {
            return <HelpCircle size={12} className="text-blue-500" />;
        } else if (lowerIntent.includes('greeting') || lowerIntent.includes('hello')) {
            return <MessageSquare size={12} className="text-emerald-500" />;
        } else if (lowerIntent.includes('goodbye') || lowerIntent.includes('bye')) {
            return <CheckCircle size={12} className="text-amber-500" />;
        } else if (lowerIntent.includes('error') || lowerIntent.includes('problem')) {
            return <XCircle size={12} className="text-red-500" />;
        } else {
            return <AlertCircle size={12} className="text-purple-500" />;
        }
    };

    const getIntentBadge = (intent?: string) => {
        if (!intent) {
            return (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                    {getIntentIcon(intent)}
                    <span className="ml-1">Non défini</span>
                </span>
            );
        }

        const lowerIntent = intent.toLowerCase();
        let badgeClass = "bg-gray-100 text-gray-800 border border-gray-200";
        
        if (lowerIntent.includes('question') || lowerIntent.includes('help')) {
            badgeClass = "bg-blue-100 text-blue-800 border border-blue-200";
        } else if (lowerIntent.includes('greeting') || lowerIntent.includes('hello')) {
            badgeClass = "bg-emerald-100 text-emerald-800 border border-emerald-200";
        } else if (lowerIntent.includes('goodbye') || lowerIntent.includes('bye')) {
            badgeClass = "bg-amber-100 text-amber-800 border border-amber-200";
        } else if (lowerIntent.includes('error') || lowerIntent.includes('problem')) {
            badgeClass = "bg-red-100 text-red-800 border border-red-200";
        } else {
            badgeClass = "bg-purple-100 text-purple-800 border border-purple-200";
        }

        return (
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
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
            minute: '2-digit'
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
    const totalConversations = new Set(logs.data.map(log => log.session_id)).size;
    const totalMessages = logs.data.length;
    const uniqueUsers = new Set(logs.data.map(log => log.user?.name).filter(Boolean)).size;
    const definedIntents = logs.data.filter(log => log.intent).length;

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                {/* Header Section - Mobile First */}
                <div className="bg-white/80 backdrop-blur-xl shadow-lg shadow-amber-500/5 border-b border-amber-200/30 sticky top-0 z-10">
                    <div className="w-full px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4 lg:px-8 lg:py-4">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="flex items-center justify-between">
                                <BackButton />
                                
                                <div className="flex-1 text-center sm:text-left ml-0 sm:ml-4">
                                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                                        Historique des conversations
                                    </h1>
                                    <p className="text-xs sm:text-sm md:text-base lg:text-base text-slate-600 mt-1">
                                        Consultez et analysez les interactions avec le chatbot
                                    </p>
                                </div>
                            </div>

                            {/* Search and Filters - Mobile First */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-between">
                                <div className="relative w-full sm:flex-1 sm:max-w-md">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher une conversation..."
                                        className={`w-full pl-9 pr-8 py-2.5 sm:pl-10 sm:pr-10 sm:py-3 border border-amber-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm text-xs sm:text-sm shadow-sm ${isSearching ? 'opacity-70' : ''}`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button 
                                            onClick={() => setSearchQuery('')} 
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600 transition-colors p-1"
                                            aria-label="Effacer"
                                        >
                                            <XCircle size={12} />
                                        </button>
                                    )}
                                    {isSearching && (
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2">
                                            <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-2.5 px-4 sm:py-3 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm whitespace-nowrap"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-3 sm:p-4 md:p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <MessageSquare size={14} className="sm:size-16 md:size-20 text-white" />
                                </div>
                                <div className="hidden sm:flex items-center text-blue-600 text-xs sm:text-sm font-medium bg-blue-50 px-2 py-1 rounded-lg">
                                    <Clock size={10} className="sm:size-12 mr-1" />
                                    Total
                                </div>
                            </div>
                            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-900">{totalConversations}</div>
                            <div className="text-xs sm:text-sm text-slate-600">Conversations</div>
                        </div>

                        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-3 sm:p-4 md:p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <Bot size={14} className="sm:size-16 md:size-20 text-white" />
                                </div>
                                <div className="hidden sm:flex items-center text-emerald-600 text-xs sm:text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">
                                    <MessageSquare size={10} className="sm:size-12 mr-1" />
                                    Messages
                                </div>
                            </div>
                            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-900">{totalMessages}</div>
                            <div className="text-xs sm:text-sm text-slate-600">Messages échangés</div>
                        </div>

                        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-3 sm:p-4 md:p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                    <User size={14} className="sm:size-16 md:size-20 text-white" />
                                </div>
                                <div className="hidden sm:flex items-center text-amber-600 text-xs sm:text-sm font-medium bg-amber-50 px-2 py-1 rounded-lg">
                                    <User size={10} className="sm:size-12 mr-1" />
                                    Utilisateurs
                                </div>
                            </div>
                            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-900">{uniqueUsers}</div>
                            <div className="text-xs sm:text-sm text-slate-600">Utilisateurs uniques</div>
                        </div>

                        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-3 sm:p-4 md:p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                    <AlertCircle size={14} className="sm:size-16 md:size-20 text-white" />
                                </div>
                                <div className="hidden sm:flex items-center text-purple-600 text-xs sm:text-sm font-medium bg-purple-50 px-2 py-1 rounded-lg">
                                    <CheckCircle size={10} className="sm:size-12 mr-1" />
                                    Intents
                                </div>
                            </div>
                            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-900">{definedIntents}</div>
                            <div className="text-xs sm:text-sm text-slate-600">Intents identifiés</div>
                        </div>
                    </div>
                </div>

                {/* Table Section - Mobile First */}
                <div className="w-full px-3 py-4 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 lg:py-6">
                    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden">
                        <div className="overflow-x-auto">
                            {/* Desktop Table - Hidden on Mobile */}
                            <table className="w-full hidden md:table lg:table">
                                <thead className="bg-amber-50/30">
                                    <tr>
                                        <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">#</th>
                                        <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Session</th>
                                        <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Utilisateur</th>
                                        <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Message</th>
                                        <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Réponse</th>
                                        <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Intent</th>
                                        <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-200/30">
                                    {logs.data.map((log, index) => (
                                        <tr 
                                            key={log.id} 
                                            className="hover:bg-amber-50/30 transition-colors"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap text-sm text-slate-900">
                                                {(logs.current_page - 1) * (logs.per_page || 20) + index + 1}
                                            </td>
                                            <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap text-sm text-slate-600 max-w-xs truncate" title={log.session_id}>
                                                {log.session_id}
                                            </td>
                                            <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-xs">
                                                        {(log.user?.name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-2 sm:ml-3">
                                                        <div className="text-xs sm:text-sm font-medium text-slate-900">{log.user?.name || 'Utilisateur inconnu'}</div>
                                                        <div className="text-xs text-slate-500 hidden sm:block">ID: #{log.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-sm text-slate-600 max-w-xs truncate" title={log.message}>
                                                {log.message}
                                            </td>
                                            <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-sm text-slate-600 max-w-xs truncate" title={log.response}>
                                                {log.response}
                                            </td>
                                            <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap">
                                                {getIntentBadge(log.intent)}
                                            </td>
                                            <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap text-sm text-slate-600">
                                                {log.formatted_date || formatDate(log.created_at)}
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
                                        className="p-3 sm:p-4 border-b border-amber-200/30 last:border-b-0"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center min-w-0 flex-1">
                                                <div className="flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-xs">
                                                    {(log.user?.name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                                                    <h3 className="text-sm sm:text-base font-medium text-slate-900 truncate">{log.user?.name || 'Utilisateur inconnu'}</h3>
                                                    <p className="text-xs text-slate-500">Session: {log.session_id.substring(0, 8)}...</p>
                                                </div>
                                            </div>
                                            {getIntentBadge(log.intent)}
                                        </div>

                                        <div className="space-y-2 mb-3">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-slate-500 font-medium">Message</span>
                                                <span className="text-sm text-slate-900 break-words">{log.message}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-slate-500 font-medium">Réponse</span>
                                                <span className="text-sm text-slate-900 break-words">{log.response}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-slate-500 font-medium">Date</span>
                                                <span className="text-sm text-slate-900">{log.formatted_date || formatDate(log.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {logs.data.length === 0 && (
                                    <div className="text-center py-8 sm:py-12">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-4 sm:mb-6 rounded-lg sm:rounded-xl md:rounded-2xl bg-amber-100/50 flex items-center justify-center">
                                            <MessageSquare size={16} className="sm:size-20 md:size-24 text-amber-500" />
                                        </div>
                                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 mb-2">Aucune conversation trouvée</h3>
                                        <p className="text-sm text-slate-600 px-4">
                                            {searchQuery ? 'Aucune conversation ne correspond à votre recherche' : 'Le chatbot n\'a encore reçu aucune interaction'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination - Mobile First */}
                <div className="w-full px-3 py-4 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 lg:py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                        <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-left w-full sm:w-auto">
                            {logs.data.length > 0 ? (
                                <>
                                    Affichage de {logs.data.length} sur {logs.total || logs.data.length} conversations
                                </>
                            ) : (
                                'Aucune conversation'
                            )}
                        </div>
                        
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center sm:justify-start w-full sm:w-auto">
                            {logs.links.map((link, index) => (
                                <button
                                    key={index}
                                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                                        link.active 
                                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                                            : 'text-slate-600 hover:bg-amber-100 hover:text-amber-700'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={!link.url}
                                    onClick={() => goTo(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}