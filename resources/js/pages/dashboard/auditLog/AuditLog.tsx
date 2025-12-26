import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import { router } from '@inertiajs/react';
import { ArrowLeft, ImageOff, Plus, Search, Shield, Activity, AlertCircle, AlertTriangle, XCircle, CheckCircle, Info, Calendar, User, Globe, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import BackButton from '@/components/ui/BackButton';

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

export default function AuditLog({ logs }: Readonly<Props>) {
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
                }
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
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {getLevelIcon(level)}
                        <span className="ml-1">{level.toUpperCase()}</span>
                    </span>
                );
            case 'warning':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                        {getLevelIcon(level)}
                        <span className="ml-1">{level.toUpperCase()}</span>
                    </span>
                );
            case 'error':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        {getLevelIcon(level)}
                        <span className="ml-1">{level.toUpperCase()}</span>
                    </span>
                );
            case 'critical':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        {getLevelIcon(level)}
                        <span className="ml-1">{level.toUpperCase()}</span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
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

    const purgeLogs = () => {
        if (confirm('Confirmer la purge des logs de plus de 6 mois ?')) {
            router.delete(route('dashboard.audit-logs.purge'), {
                preserveScroll: true,
            });
        }
    };

    const infoLogs = logs.data.filter(log => log.level.toLowerCase() === 'info').length;
    const warningLogs = logs.data.filter(log => log.level.toLowerCase() === 'warning').length;
    const errorLogs = logs.data.filter(log => log.level.toLowerCase() === 'error').length;
    const criticalLogs = logs.data.filter(log => log.level.toLowerCase() === 'critical').length;

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                {/* Header Section */}
                <div className="bg-white/80 backdrop-blur-xl shadow-lg shadow-amber-500/5 border-b border-amber-200/30 sticky top-0 z-10">
                    <div className="px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="flex items-start sm:items-center justify-between">
                                <BackButton />
                                
                                <div className="flex-1 text-center sm:text-left ml-0 sm:ml-4">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                                        Audit Logs
                                    </h1>
                                    <p className="text-xs sm:text-sm lg:text-base text-slate-600 mt-1">
                                        Consultez et gérez l'ensemble des activités système
                                    </p>
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
                                <div className="relative flex-1 w-full sm:max-w-md">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher dans les logs..."
                                        className={`w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2.5 sm:py-3 border border-amber-200/50 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm text-xs sm:text-sm shadow-sm ${isSearching ? 'opacity-70' : ''}`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button 
                                            onClick={() => setSearchQuery('')} 
                                            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600 transition-colors p-1"
                                            aria-label="Effacer"
                                        >
                                            <XCircle size={14} />
                                        </button>
                                    )}
                                    {isSearching && (
                                        <div className="absolute right-8 sm:right-12 top-1/2 -translate-y-1/2">
                                            <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base whitespace-nowrap"
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
                <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-3 sm:p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <Info size={14} className="sm:size-18 text-white" />
                                </div>
                                <div className="hidden sm:flex items-center text-emerald-600 text-xs sm:text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">
                                    <CheckCircle size={10} className="sm:size-12 mr-1" />
                                    Info
                                </div>
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-slate-900">{infoLogs}</div>
                            <div className="text-xs sm:text-sm text-slate-600">Logs d'information</div>
                        </div>

                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-3 sm:p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                    <AlertTriangle size={14} className="sm:size-18 text-white" />
                                </div>
                                <div className="hidden sm:flex items-center text-amber-600 text-xs sm:text-sm font-medium bg-amber-50 px-2 py-1 rounded-lg">
                                    <AlertCircle size={10} className="sm:size-12 mr-1" />
                                    Warning
                                </div>
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-slate-900">{warningLogs}</div>
                            <div className="text-xs sm:text-sm text-slate-600">Avertissements</div>
                        </div>

                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-3 sm:p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                                    <XCircle size={14} className="sm:size-18 text-white" />
                                </div>
                                <div className="hidden sm:flex items-center text-red-600 text-xs sm:text-sm font-medium bg-red-50 px-2 py-1 rounded-lg">
                                    <AlertCircle size={10} className="sm:size-12 mr-1" />
                                    Error
                                </div>
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-slate-900">{errorLogs}</div>
                            <div className="text-xs sm:text-sm text-slate-600">Erreurs système</div>
                        </div>

                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-3 sm:p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                    <AlertCircle size={14} className="sm:size-18 text-white" />
                                </div>
                                <div className="hidden sm:flex items-center text-purple-600 text-xs sm:text-sm font-medium bg-purple-50 px-2 py-1 rounded-lg">
                                    <AlertCircle size={10} className="sm:size-12 mr-1" />
                                    Critical
                                </div>
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-slate-900">{criticalLogs}</div>
                            <div className="text-xs sm:text-sm text-slate-600">Erreurs critiques</div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden">
                        <div className="overflow-x-auto">
                            {/* Desktop Table */}
                            <table className="w-full hidden lg:table">
                                <thead className="bg-amber-50/30">
                                    <tr>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">#</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Agent</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Utilisateur</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Action</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Cible</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Niveau</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">IP</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Description</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-200/30">
                                    {logs.data.map((log, index) => (
                                        <tr 
                                            key={log.id} 
                                            className="hover:bg-amber-50/30 transition-colors"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-slate-900">{index + 1}</td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-slate-600 max-w-xs truncate" title={log.user_agent || '-'}>
                                                {log.user_agent || '-'}
                                            </td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-xs">
                                                        {log.user.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-2 sm:ml-3">
                                                        <div className="text-xs sm:text-sm font-medium text-slate-900">{log.user}</div>
                                                        <div className="text-xs text-slate-500 hidden sm:block">ID: #{log.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-slate-900">{log.action}</td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-slate-900">
                                                {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}
                                            </td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                                {getLevelBadge(log.level)}
                                            </td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-slate-600">{log.ip_address || '-'}</td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-600 max-w-xs truncate" title={log.description || '-'}>
                                                {log.description || '-'}
                                            </td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-slate-600">{formatDate(log.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile Cards */}
                            <div className="lg:hidden">
                                {logs.data.map((log, index) => (
                                    <div
                                        key={log.id}
                                        className="p-3 sm:p-4 border-b border-amber-200/30 last:border-b-0"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center min-w-0 flex-1">
                                                <div className="flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-xs">
                                                    {log.user.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                                                    <h3 className="text-sm sm:text-base font-medium text-slate-900 truncate">{log.user}</h3>
                                                    <p className="text-xs text-slate-500">ID: #{log.id}</p>
                                                </div>
                                            </div>
                                            {getLevelBadge(log.level)}
                                        </div>

                                        <div className="space-y-2 mb-3">
                                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                                                <span className="text-xs text-slate-500">Action</span>
                                                <span className="text-xs sm:text-sm text-slate-900 text-right sm:text-left truncate">{log.action}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                                                <span className="text-xs text-slate-500">Cible</span>
                                                <span className="text-xs sm:text-sm text-slate-900 text-right sm:text-left truncate">
                                                    {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                                                <span className="text-xs text-slate-500">IP</span>
                                                <span className="text-xs sm:text-sm text-slate-900 text-right sm:text-left">{log.ip_address || '-'}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                                                <span className="text-xs text-slate-500">Date</span>
                                                <span className="text-xs sm:text-sm text-slate-900 text-right sm:text-left">{formatDate(log.created_at)}</span>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <span className="text-xs text-slate-500">Description</span>
                                            <p className="text-xs sm:text-sm text-slate-900 mt-1 break-words">{log.description || '-'}</p>
                                        </div>

                                        <div>
                                            <span className="text-xs text-slate-500">Agent</span>
                                            <p className="text-xs sm:text-sm text-slate-900 mt-1 break-all">{log.user_agent || '-'}</p>
                                        </div>
                                    </div>
                                ))}

                                {logs.data.length === 0 && (
                                    <div className="text-center py-8 sm:py-12">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-amber-100/50 flex items-center justify-center">
                                            <Activity size={20} className="sm:size-24 text-amber-500" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Aucun log trouvé</h3>
                                        <p className="text-sm text-slate-600 px-4">
                                            {searchQuery ? 'Aucun log ne correspond à votre recherche' : 'Il n\'y a pas encore d\'activité enregistrée'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                        <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
                            {logs.data.length > 0 ? (
                                <>
                                    Affichage de {logs.data.length} sur {logs.total || logs.data.length} logs
                                </>
                            ) : (
                                'Aucun log'
                            )}
                        </div>
                        
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
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