import RoleAndPermission from '@/components/forms/RoleAndPermission';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { router, usePage } from '@inertiajs/react';
import {
    Edit3,
    Filter,
    Mail,
    Plus,
    Search,
    Shield,
    Trash2,
    User as UserIcon,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
    const {
        users,
        roles = [],
        filters = {},
    } = usePage().props as unknown as PageProps;
    const [searchQuery, setSearchQuery] = useState(
        typeof filters?.filter === 'string' ? filters.filter : '',
    );
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [perPage, setPerPage] = useState(20);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    // Safeguard users data
    const usersData = users?.data || [];
    const usersMeta = users?.meta || {
        current_page: 1,
        from: 0,
        to: 0,
        total: 0,
    };
    const usersLinks = users?.links || [];

    useEffect(() => {
        const t = setTimeout(() => {
            router.get(
                route('dashboard.users.index'),
                {
                    search: searchQuery,
                    filter: selectedRole,
                    per_page: perPage,
                    page: 1,
                },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 350);
        return () => clearTimeout(t);
    }, [searchQuery, selectedRole, perPage]);

    const handleFilter = (roleName: string | null) => {
        setSelectedRole(roleName);
        router.get(
            route('dashboard.users.index'),
            {
                search: searchQuery,
                filter: roleName,
                per_page: perPage,
                page: 1,
            },
            { preserveState: true, replace: true, preserveScroll: true },
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
            <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    hasRoles
                        ? 'border border-emerald-200 bg-emerald-100 text-emerald-800'
                        : 'border border-gray-200 bg-gray-100 text-gray-800'
                }`}
            >
                {hasRoles ? 'Actif' : 'Inactif'}
            </span>
        );
    };

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6">
                        <BackButton />
                        <div className="mt-4 overflow-hidden rounded-xl border border-amber-200/30 bg-white shadow-sm">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    <div className="mb-6 lg:mb-0">
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Utilisateurs
                                        </h1>
                                        <p className="mt-1 text-gray-600">
                                            Gérez vos utilisateurs et leurs
                                            informations
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="min-w-[120px] rounded-lg bg-amber-50 p-4 text-center">
                                            <span className="block text-2xl font-bold text-amber-600">
                                                {usersData.length}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                Utilisateurs
                                            </span>
                                        </div>
                                        <div className="min-w-[120px] rounded-lg bg-emerald-50 p-4 text-center">
                                            <span className="block text-2xl font-bold text-emerald-600">
                                                {
                                                    usersData.filter(
                                                        (user) =>
                                                            (user.roles || [])
                                                                .length > 0,
                                                    ).length
                                                }
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                Actifs
                                            </span>
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
                                    <Search
                                        size={20}
                                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un utilisateur..."
                                        className={`w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                                            isSearching ? 'opacity-70' : ''
                                        }`}
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
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
                                            onChange={(e) =>
                                                handleFilter(
                                                    e.target.value || null,
                                                )
                                            }
                                            className="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                        >
                                            <option value="">
                                                Tous les rôles
                                            </option>
                                            {roles.map((role) => (
                                                <option
                                                    key={role.name}
                                                    value={role.name}
                                                >
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        <Filter
                                            size={16}
                                            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                                        />
                                    </div>

                                    <button
                                        onClick={() => {
                                            setSelectedUser(null);
                                            setIsOpen(true);
                                        }}
                                        className="inline-flex transform items-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-3 font-medium text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700"
                                    >
                                        <Plus size={18} className="mr-2" />
                                        <span className="hidden sm:inline">
                                            Nouvel utilisateur
                                        </span>
                                        <span className="sm:hidden">
                                            Ajouter
                                        </span>
                                    </button>
                                </div>
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
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                            Image
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                            Nom
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                            Rôle
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                            Statut
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-200/30">
                                    {usersData.map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-amber-50/30"
                                            style={{
                                                animationDelay: `${index * 0.05}s`,
                                            }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="h-10 w-10 overflow-hidden rounded-full">
                                                    {user.profile_photo ? (
                                                        <img
                                                            src={`/storage/${user.profile_photo}`}
                                                            alt={user.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600">
                                                            <UserIcon
                                                                size={16}
                                                                className="text-white"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            #{user.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Mail
                                                        size={16}
                                                        className="mr-2 text-gray-400"
                                                    />
                                                    <span className="text-sm text-gray-900">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Shield
                                                        size={16}
                                                        className="mr-2 text-amber-500"
                                                    />
                                                    <span className="text-sm text-gray-900">
                                                        {user.roles &&
                                                        user.roles.length > 0
                                                            ? user.roles
                                                                  .map(
                                                                      (role) =>
                                                                          role.name,
                                                                  )
                                                                  .join(', ')
                                                            : 'Aucun rôle'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(user)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="rounded-lg p-1 text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-900"
                                                        onClick={() =>
                                                            handleEdit(user)
                                                        }
                                                        title="Modifier"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        className="rounded-lg p-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-900"
                                                        onClick={() =>
                                                            deleteUser(user.id)
                                                        }
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
                                {usersData.map((user, index) => (
                                    <div
                                        key={user.id}
                                        className="border-b border-amber-200/30 p-4 last:border-b-0"
                                        style={{
                                            animationDelay: `${index * 0.05}s`,
                                        }}
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex items-center">
                                                <div className="mr-3 h-12 w-12 overflow-hidden rounded-full">
                                                    {user.profile_photo ? (
                                                        <img
                                                            src={`/storage/${user.profile_photo}`}
                                                            alt={user.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600">
                                                            <UserIcon
                                                                size={20}
                                                                className="text-white"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-medium text-gray-900">
                                                        {user.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        #{user.id}
                                                    </p>
                                                </div>
                                            </div>
                                            {getStatusBadge(user)}
                                        </div>

                                        <div className="mb-3 space-y-3">
                                            <div className="flex items-center">
                                                <Mail
                                                    size={16}
                                                    className="mr-2 text-gray-400"
                                                />
                                                <span className="text-sm text-gray-900">
                                                    {user.email}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <Shield
                                                    size={16}
                                                    className="mr-2 text-amber-500"
                                                />
                                                <span className="text-sm text-gray-900">
                                                    {user.roles &&
                                                    user.roles.length > 0
                                                        ? user.roles
                                                              .map(
                                                                  (role) =>
                                                                      role.name,
                                                              )
                                                              .join(', ')
                                                        : 'Aucun rôle'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="rounded-lg p-2 text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-900"
                                                onClick={() => handleEdit(user)}
                                                title="Modifier"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-900"
                                                onClick={() =>
                                                    deleteUser(user.id)
                                                }
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {usersData.length === 0 && (
                                <div className="py-12 text-center">
                                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-amber-100/50">
                                        <Users
                                            size={32}
                                            className="text-amber-500"
                                        />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                        Aucun utilisateur trouvé
                                    </h3>
                                    <p className="mb-6 text-gray-600">
                                        Commencez par créer votre premier
                                        utilisateur
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSelectedUser(null);
                                            setIsOpen(true);
                                        }}
                                        className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 font-medium text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-700"
                                    >
                                        <Plus size={20} className="mr-2" />
                                        Créer un utilisateur
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex flex-col items-center justify-between sm:flex-row">
                        <div className="mb-4 text-sm text-gray-700 sm:mb-0">
                            {usersData.length > 0 ? (
                                <>
                                    Affichage de {usersMeta.from} à{' '}
                                    {usersMeta.to} sur {usersMeta.total}{' '}
                                    utilisateurs
                                </>
                            ) : (
                                'Aucun utilisateur'
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {usersLinks.map((link, index) => (
                                <button
                                    key={index}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        link.active
                                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                            : 'text-gray-600 hover:bg-amber-100 hover:text-amber-700'
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
