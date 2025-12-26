import { useState, useEffect } from 'react';
import { ImageOff, Plus, Edit3, Trash2, ArrowLeft, Search, Check, Shield, Users, Key, Lock } from 'lucide-react';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import PermissionsPopup from '@/components/forms/PermissionsPopup';
import BackButton from '@/components/ui/BackButton';
import { route } from 'ziggy-js';

interface Role {
    id: number;
    name: string;
    permissions: { name: string }[];
}

interface Permission {
    name: string;
}

interface PageProps {
    roles: {
        data: Role[];
        links: { url: string | null; label: string; active: boolean }[];
        meta?: { total: number; current_page: number; last_page: number; per_page: number };
    };
    permissions: Permission[];
    auth: {
        permissions: string[];
    };
}

export default function Roles({ roles, permissions }: PageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [currentRole, setCurrentRole] = useState<Role | null>(null);
    const { filters } = usePage<{ filters?: { search?: string; per_page?: number } }>().props;

    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');
    const [perPage, setPerPage] = useState<number>(filters?.per_page ?? 20);

    const { auth } = usePage<PageProps>().props;
    const userPermissions: string[] = auth?.permissions || [];

    useEffect(() => {
        const t = setTimeout(() => {
            router.get(
                route('dashboard.roles.index'),
                {
                    search: searchQuery,
                    per_page: perPage,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                    only: ['roles', 'filters'],
                }
            );
        }, 350);
        return () => clearTimeout(t);
    }, [searchQuery, perPage]);

    const handleCreateOpen = () => {
        setCurrentRole(null);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setEditOpen(false);
    };

    const handleEditOpen = (role: Role) => {
        setCurrentRole(role);
        setEditOpen(true);
    };

    const deleteRole = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
            router.delete(route('dashboard.roles.destroy', id), {
                onError: () => toast.error('Erreur lors de la suppression.'),
            });
        }
    };

    const goTo = (url: string | null) => {
        if (!url) return;
        const u = new URL(url, window.location.origin);
        if (searchQuery) u.searchParams.set('search', searchQuery);
        else u.searchParams.delete('search');
        
        if (perPage) u.searchParams.set('per_page', perPage.toString());
        else u.searchParams.delete('per_page');

        router.visit(u.toString(), {
            only: ['roles', 'filters'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                {/* Header Section */}
                <div className="bg-white/80 backdrop-blur-xl shadow-lg shadow-amber-500/5 border-b border-amber-200/30 sticky top-0 z-10">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <BackButton />
                            
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                                    Gestion des Rôles
                                </h1>
                                <p className="text-sm sm:text-base text-slate-600 mt-1">
                                    Gérez vos rôles et leurs permissions
                                </p>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un rôle..."
                                    className="w-full pl-10 pr-4 py-3 border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm text-sm shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')} 
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600 transition-colors"
                                        aria-label="Effacer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <select
                                    className="px-4 py-3 border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm text-sm shadow-sm"
                                    value={perPage}
                                    onChange={(e) => setPerPage(Number(e.target.value))}
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>

                                <button
                                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-6 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleCreateOpen}
                                    disabled={!userPermissions.includes('role.create')}
                                >
                                    <Plus size={18} />
                                    <span>Nouveau rôle</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                    <Shield size={24} className="text-white" />
                                </div>
                                <div className="flex items-center text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">
                                    <Users size={16} className="mr-1" />
                                    Total
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">{roles.data.length}</div>
                            <div className="text-sm text-slate-600">Rôles</div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <Key size={24} className="text-white" />
                                </div>
                                <div className="flex items-center text-amber-600 text-sm font-medium bg-amber-50 px-2 py-1 rounded-lg">
                                    <Lock size={16} className="mr-1" />
                                    Actif
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {roles.data.filter((role) => role.permissions.length > 0).length}
                            </div>
                            <div className="text-sm text-slate-600">Avec permissions</div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <Check size={24} className="text-white" />
                                </div>
                                <div className="flex items-center text-amber-600 text-sm font-medium bg-amber-50 px-2 py-1 rounded-lg">
                                    <Shield size={16} className="mr-1" />
                                    Total
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {roles.data.reduce((acc, role) => acc + role.permissions.length, 0)}
                            </div>
                            <div className="text-sm text-slate-600">Permissions</div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden">
                        <div className="overflow-x-auto">
                            {/* Desktop Table */}
                            <table className="w-full hidden md:table">
                                <thead className="bg-amber-50/30">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Nom</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Permissions</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-200/30">
                                    {roles.data.map((role, index) => (
                                        <tr 
                                            key={role.id} 
                                            className="hover:bg-amber-50/30 transition-colors"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold">
                                                        {role.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900">{role.name}</div>
                                                        <div className="text-sm text-slate-500">ID: #{role.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {role.permissions.slice(0, 3).map((perm) => (
                                                        <span 
                                                            key={perm.name} 
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                        >
                                                            {perm.name}
                                                        </span>
                                                    ))}
                                                    {role.permissions.length > 3 && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                            +{role.permissions.length - 3} plus
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="text-amber-600 hover:text-amber-900 p-1 rounded hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => handleEditOpen(role)}
                                                        title="Modifier"
                                                        disabled={!userPermissions.includes('role.update')}
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => deleteRole(role.id)}
                                                        title="Supprimer"
                                                        disabled={!userPermissions.includes('role.delete')}
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
                                {roles.data.map((role, index) => (
                                    <div
                                        key={role.id}
                                        className="p-4 border-b border-amber-200/30 last:border-b-0"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold">
                                                    {role.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-base font-medium text-slate-900">{role.name}</h3>
                                                    <p className="text-sm text-slate-500">ID: #{role.id}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <h4 className="text-sm font-medium text-slate-700 mb-2">Permissions ({role.permissions.length})</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions.slice(0, 3).map((perm) => (
                                                    <span 
                                                        key={perm.name} 
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                    >
                                                        {perm.name}
                                                    </span>
                                                ))}
                                                {role.permissions.length > 3 && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                        +{role.permissions.length - 3} plus
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="text-amber-600 hover:text-amber-900 p-2 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => handleEditOpen(role)}
                                                title="Modifier"
                                                disabled={!userPermissions.includes('role.update')}
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900 p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => deleteRole(role.id)}
                                                title="Supprimer"
                                                disabled={!userPermissions.includes('role.delete')}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {roles.data.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-amber-100/50 flex items-center justify-center">
                                            <Shield size={32} className="text-amber-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun rôle trouvé</h3>
                                        <p className="text-slate-600 mb-6">
                                            {searchQuery ? 'Aucun rôle ne correspond à votre recherche' : 'Commencez par créer votre premier rôle'}
                                        </p>
                                        <button
                                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 mx-auto transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            onClick={handleCreateOpen}
                                            disabled={!userPermissions.includes('role.create')}
                                        >
                                            <Plus size={18} />
                                            Créer un rôle
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-slate-600">
                            {roles.data.length > 0 ? (
                                <>
                                    Affichage de {roles.data.length} sur {roles.meta?.total || roles.data.length} rôles
                                </>
                            ) : (
                                'Aucun rôle'
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {roles.links.map((link, index) => (
                                <button
                                    key={index}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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

            {isOpen && (
                <PermissionsPopup
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    mode="create"
                    initialRole=""
                    initialPermissions={[]}
                    availablePermissions={permissions.map((perm) => perm.name)}
                    submitRoute={route('dashboard.roles.store')}
                />
            )}

            {editOpen && currentRole && (
                <PermissionsPopup
                    isOpen={editOpen}
                    setIsOpen={setEditOpen}
                    mode="edit"
                    initialRole={currentRole.name}
                    initialPermissions={currentRole.permissions.map((perm) => perm.name)}
                    availablePermissions={permissions.map((perm) => perm.name)}
                    submitRoute={route('dashboard.roles.update', currentRole.id)}
                />
            )}
        </Dashboard>
    );
}