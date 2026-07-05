import PermissionsPopup from '@/components/forms/PermissionsPopup';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { router, usePage } from '@inertiajs/react';
import {
    Check,
    Edit3,
    Key,
    Lock,
    Plus,
    Search,
    Shield,
    Trash2,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
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
        meta?: {
            total: number;
            current_page: number;
            last_page: number;
            per_page: number;
        };
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
    const { filters } = usePage<{
        filters?: { search?: string; per_page?: number };
    }>().props;

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
                },
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
            year: 'numeric',
        });
    };

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                {/* Header Section */}
                <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 shadow-lg shadow-sm backdrop-blur-xl">
                    <div className="px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <BackButton />

                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="bg-gradient-to-r from-slate-100 to-slate-100 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                                    Gestion des Rôles
                                </h1>
                                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                                    Gérez vos rôles et leurs permissions
                                </p>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row">
                            <div className="relative max-w-md flex-1">
                                <Search
                                    size={20}
                                    className="absolute top-1/2 left-3 -translate-y-1/2 text-[#C9A84C]"
                                />
                                <input
                                    type="text"
                                    placeholder="Rechercher un rôle..."
                                    className="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pr-4 pl-10 text-sm shadow-sm backdrop-blur-sm focus:border-slate-200 focus:ring-2 focus:ring-slate-200 focus:outline-none"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[#1E3A5F] transition-colors hover:text-[#1E3A5F]"
                                        aria-label="Effacer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <select
                                    className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm backdrop-blur-sm focus:border-slate-200 focus:ring-2 focus:ring-slate-200 focus:outline-none"
                                    value={perPage}
                                    onChange={(e) =>
                                        setPerPage(Number(e.target.value))
                                    }
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>

                                <button
                                    className="flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-slate-100 to-slate-100 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-slate-100 hover:to-slate-100 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                                    onClick={handleCreateOpen}
                                    disabled={
                                        !userPermissions.includes('role.create')
                                    }
                                >
                                    <Plus size={18} />
                                    <span>Nouveau rôle</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="transform rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:shadow-xl">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#A8882E] shadow-lg shadow-sm">
                                    <Shield size={24} className="text-white" />
                                </div>
                                <div className="flex items-center rounded-lg bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-600">
                                    <Users size={16} className="mr-1" />
                                    Total
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {roles.data.length}
                            </div>
                            <div className="text-sm text-slate-600">Rôles</div>
                        </div>

                        <div className="transform rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:shadow-xl">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
                                    <Key size={24} className="text-white" />
                                </div>
                                <div className="flex items-center rounded-lg bg-slate-50 px-2 py-1 text-sm font-medium text-[#1E3A5F]">
                                    <Lock size={16} className="mr-1" />
                                    Actif
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {
                                    roles.data.filter(
                                        (role) => role.permissions.length > 0,
                                    ).length
                                }
                            </div>
                            <div className="text-sm text-slate-600">
                                Avec permissions
                            </div>
                        </div>

                        <div className="transform rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:shadow-xl">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/30">
                                    <Check size={24} className="text-white" />
                                </div>
                                <div className="flex items-center rounded-lg bg-slate-50 px-2 py-1 text-sm font-medium text-[#1E3A5F]">
                                    <Shield size={16} className="mr-1" />
                                    Total
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {roles.data.reduce(
                                    (acc, role) =>
                                        acc + role.permissions.length,
                                    0,
                                )}
                            </div>
                            <div className="text-sm text-slate-600">
                                Permissions
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-sm">
                        <div className="overflow-x-auto">
                            {/* Desktop Table */}
                            <table className="hidden w-full md:table">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-700 uppercase">
                                            Nom
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-700 uppercase">
                                            Permissions
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-700 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {roles.data.map((role, index) => (
                                        <tr
                                            key={role.id}
                                            className="transition-colors hover:bg-slate-50"
                                            style={{
                                                animationDelay: `${index * 0.05}s`,
                                            }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#A8882E] font-bold text-white">
                                                        {role.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {role.name}
                                                        </div>
                                                        <div className="text-sm text-slate-500">
                                                            ID: #{role.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {role.permissions
                                                        .slice(0, 3)
                                                        .map((perm) => (
                                                            <span
                                                                key={perm.name}
                                                                className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                                                            >
                                                                {perm.name}
                                                            </span>
                                                        ))}
                                                    {role.permissions.length >
                                                        3 && (
                                                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                            +
                                                            {role.permissions
                                                                .length -
                                                                3}{' '}
                                                            plus
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="rounded p-1 text-[#1E3A5F] transition-colors hover:bg-slate-100 hover:text-[#1E3A5F] disabled:cursor-not-allowed disabled:opacity-50"
                                                        onClick={() =>
                                                            handleEditOpen(role)
                                                        }
                                                        title="Modifier"
                                                        disabled={
                                                            !userPermissions.includes(
                                                                'role.update',
                                                            )
                                                        }
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        className="rounded p-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                                                        onClick={() =>
                                                            deleteRole(role.id)
                                                        }
                                                        title="Supprimer"
                                                        disabled={
                                                            !userPermissions.includes(
                                                                'role.delete',
                                                            )
                                                        }
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
                                        className="border-b border-slate-200 p-4 last:border-b-0"
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex items-center">
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#A8882E] font-bold text-white">
                                                    {role.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-base font-medium text-slate-900">
                                                        {role.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-500">
                                                        ID: #{role.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <h4 className="mb-2 text-sm font-medium text-slate-700">
                                                Permissions (
                                                {role.permissions.length})
                                            </h4>
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions
                                                    .slice(0, 3)
                                                    .map((perm) => (
                                                        <span
                                                            key={perm.name}
                                                            className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                                                        >
                                                            {perm.name}
                                                        </span>
                                                    ))}
                                                {role.permissions.length >
                                                    3 && (
                                                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                        +
                                                        {role.permissions
                                                            .length - 3}{' '}
                                                        plus
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="rounded-lg bg-slate-50 p-2 text-[#1E3A5F] transition-colors hover:bg-slate-100 hover:text-[#1E3A5F] disabled:cursor-not-allowed disabled:opacity-50"
                                                onClick={() =>
                                                    handleEditOpen(role)
                                                }
                                                title="Modifier"
                                                disabled={
                                                    !userPermissions.includes(
                                                        'role.update',
                                                    )
                                                }
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                                                onClick={() =>
                                                    deleteRole(role.id)
                                                }
                                                title="Supprimer"
                                                disabled={
                                                    !userPermissions.includes(
                                                        'role.delete',
                                                    )
                                                }
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {roles.data.length === 0 && (
                                    <div className="py-12 text-center">
                                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#1E3A5F]/10">
                                            <Shield
                                                size={32}
                                                className="text-[#C9A84C]"
                                            />
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold text-slate-900">
                                            Aucun rôle trouvé
                                        </h3>
                                        <p className="mb-6 text-slate-600">
                                            {searchQuery
                                                ? 'Aucun rôle ne correspond à votre recherche'
                                                : 'Commencez par créer votre premier rôle'}
                                        </p>
                                        <button
                                            className="mx-auto flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-slate-100 to-slate-100 px-4 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-slate-100 hover:to-slate-100 hover:shadow-xl"
                                            onClick={handleCreateOpen}
                                            disabled={
                                                !userPermissions.includes(
                                                    'role.create',
                                                )
                                            }
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
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="text-sm text-slate-600">
                            {roles.data.length > 0 ? (
                                <>
                                    Affichage de {roles.data.length} sur{' '}
                                    {roles.meta?.total || roles.data.length}{' '}
                                    rôles
                                </>
                            ) : (
                                'Aucun rôle'
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {roles.links.map((link, index) => (
                                <button
                                    key={index}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        link.active
                                            ? 'bg-slate-500 text-white shadow-lg shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-[#0d2340]'
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
                    initialPermissions={currentRole.permissions.map(
                        (perm) => perm.name,
                    )}
                    availablePermissions={permissions.map((perm) => perm.name)}
                    submitRoute={route(
                        'dashboard.roles.update',
                        currentRole.id,
                    )}
                />
            )}
        </Dashboard>
    );
}
