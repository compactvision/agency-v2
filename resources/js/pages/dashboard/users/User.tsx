import { useState, useEffect } from 'react';
import { ImageOff, Plus, Edit3, Trash2, Search, Shield, User as UserIcon, Mail, X, CheckCircle, AlertCircle, Filter, Users } from 'lucide-react';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import { router, usePage } from '@inertiajs/react';
import RoleAndPermission from '@/components/forms/RoleAndPermission';
import BackButton from '@/components/ui/BackButton';

type Role = { name: string };
type UserType = {
    id: number;
    name: string;
    email: string;
    roles: Role[];
    profile_photo: string;
    created_at?: string;
};

interface PageProps {
    users: {
        data: UserType[];
        links: { url: string | null; label: string; active: boolean }[];
        meta: { current_page: number; from: number; to: number; total: number };
    };
    roles: Role[];
    filters: {
        filter?: string | null;
    };
}

export default function User() {
    const { users, roles, filters } = usePage().props as unknown as PageProps;
    const [searchQuery, setSearchQuery] = useState(filters?.filter || '');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [perPage, setPerPage] = useState(20);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    useEffect(() => {
        const t = setTimeout(() => {
            router.get(route('dashboard.users.index'), 
                { search: searchQuery, filter: selectedRole, per_page: perPage, page: 1 },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 350);
        return () => clearTimeout(t);
    }, [searchQuery, selectedRole, perPage]);

    const handleFilter = (roleName: string | null) => {
        setSelectedRole(roleName);
        router.get(route('dashboard.users.index'), 
            { search: searchQuery, filter: roleName, per_page: perPage, page: 1 },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const handleEdit = (user: UserType) => {
        setSelectedUser(user);
        setIsOpen(true);
    };

    const deleteUser = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            router.delete(route('dashboard.users.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Notification de succès pourrait être ajoutée ici
                },
            });
        }
    };

    const goTo = (url: string | null) => {
        if (!url) return;
        const u = new URL(url, window.location.origin);
        if (searchQuery) u.searchParams.set('search', searchQuery);
        if (selectedRole) u.searchParams.set('filter', selectedRole);
        if (perPage) u.searchParams.set('per_page', perPage.toString());
        
        router.visit(u.toString(), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusBadge = (user: UserType) => {
        const hasRoles = user.roles && user.roles.length > 0;
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                hasRoles 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}>
                {hasRoles ? 'Actif' : 'Inactif'}
            </span>
        );
    };

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Header Section */}
                    <div className="mb-6">
                        <BackButton />
                        <div className="mt-4 bg-white rounded-xl shadow-sm border border-amber-200/30 overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    <div className="mb-6 lg:mb-0">
                                        <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
                                        <p className="text-gray-600 mt-1">Gérez vos utilisateurs et leurs informations</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="bg-amber-50 rounded-lg p-4 text-center min-w-[120px]">
                                            <span className="block text-2xl font-bold text-amber-600">{users.data.length}</span>
                                            <span className="text-sm text-gray-600">Utilisateurs</span>
                                        </div>
                                        <div className="bg-emerald-50 rounded-lg p-4 text-center min-w-[120px]">
                                            <span className="block text-2xl font-bold text-emerald-600">
                                                {users.data.filter((user) => user.roles.length > 0).length}
                                            </span>
                                            <span className="text-sm text-gray-600">Actifs</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className="mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-amber-200/30 p-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un utilisateur..."
                                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-sm ${
                                            isSearching ? 'opacity-70' : ''
                                        }`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button 
                                            onClick={() => setSearchQuery('')} 
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            aria-label="Effacer"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <select
                                            value={selectedRole || ''}
                                            onChange={(e) => handleFilter(e.target.value || null)}
                                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-pointer"
                                        >
                                            <option value="">Tous les rôles</option>
                                            {roles.map((role) => (
                                                <option key={role.name} value={role.name}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                    
                                    <button 
                                        onClick={() => {
                                            setSelectedUser(null);
                                            setIsOpen(true);
                                        }}
                                        className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-lg font-medium hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/30"
                                    >
                                        <Plus size={18} className="mr-2" />
                                        <span className="hidden sm:inline">Nouvel utilisateur</span>
                                        <span className="sm:hidden">Ajouter</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-amber-200/30 overflow-hidden">
                        <div className="overflow-x-auto">
                            {/* Desktop Table */}
                            <table className="w-full hidden md:table">
                                <thead className="bg-amber-50/30">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nom</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rôle</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-200/30">
                                    {users.data.map((user, index) => (
                                        <tr 
                                            key={user.id} 
                                            className="hover:bg-amber-50/30 transition-colors"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                                    {user.profile_photo ? (
                                                        <img
                                                            src={`/storage/${user.profile_photo}`}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                                            <UserIcon size={16} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">#{user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Mail size={16} className="text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-900">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Shield size={16} className="text-amber-500 mr-2" />
                                                    <span className="text-sm text-gray-900">
                                                        {user.roles && user.roles.length > 0 
                                                            ? user.roles.map((role) => role.name).join(', ')
                                                            : 'Aucun rôle'
                                                        }
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(user)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="text-amber-600 hover:text-amber-900 p-1 rounded-lg hover:bg-amber-50 transition-colors"
                                                        onClick={() => handleEdit(user)}
                                                        title="Modifier"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                                        onClick={() => deleteUser(user.id)}
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
                                {users.data.map((user, index) => (
                                    <div
                                        key={user.id}
                                        className="p-4 border-b border-amber-200/30 last:border-b-0"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                                    {user.profile_photo ? (
                                                        <img
                                                            src={`/storage/${user.profile_photo}`}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                                            <UserIcon size={20} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-medium text-gray-900">{user.name}</h3>
                                                    <p className="text-sm text-gray-500">#{user.id}</p>
                                                </div>
                                            </div>
                                            {getStatusBadge(user)}
                                        </div>

                                        <div className="space-y-3 mb-3">
                                            <div className="flex items-center">
                                                <Mail size={16} className="text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">{user.email}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Shield size={16} className="text-amber-500 mr-2" />
                                                <span className="text-sm text-gray-900">
                                                    {user.roles && user.roles.length > 0 
                                                        ? user.roles.map((role) => role.name).join(', ')
                                                        : 'Aucun rôle'
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="text-amber-600 hover:text-amber-900 p-2 rounded-lg hover:bg-amber-50 transition-colors"
                                                onClick={() => handleEdit(user)}
                                                title="Modifier"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                onClick={() => deleteUser(user.id)}
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {users.data.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-amber-100/50 flex items-center justify-center">
                                        <Users size={32} className="text-amber-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
                                    <p className="text-gray-600 mb-6">Commencez par créer votre premier utilisateur</p>
                                    <button 
                                        onClick={() => {
                                            setSelectedUser(null);
                                            setIsOpen(true);
                                        }}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl font-medium hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/30"
                                    >
                                        <Plus size={20} className="mr-2" />
                                        Créer un utilisateur
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                            {users.data.length > 0 ? (
                                <>
                                    {/* Affichage de {users.meta.from} à {users.meta.to} sur {users.meta.total} utilisateurs */}
                                </>
                            ) : (
                                'Aucun utilisateur'
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {users.links.map((link, index) => (
                                <button
                                    key={index}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        link.active 
                                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                                            : 'text-gray-600 hover:bg-amber-100 hover:text-amber-700'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={!link.url}
                                    onClick={() => goTo(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>

                    <RoleAndPermission
                        key={selectedUser?.id ?? 'create'}
                        isOpen={isOpen}
                        setIsOpen={(v) => {
                            if (!v) setSelectedUser(null);
                            setIsOpen(v);
                        }}
                        user={selectedUser ?? undefined}
                        roles={roles}
                    />
                </div>
            </div>
        </Dashboard>
    );
}