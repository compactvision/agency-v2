import { useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    Edit3,
    Eye,
    Key,
    Plus,
    Shield,
    Trash2,
    UserCog,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ErrorText from '../ui/ErrorText';

type PermissionsPopupProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    mode: 'create' | 'edit';
    initialRole?: string;
    initialPermissions?: string[];
    availablePermissions: string[];
    submitRoute: string;
};

export default function PermissionsPopup({
    isOpen,
    setIsOpen,
    mode,
    initialRole = '',
    initialPermissions = [],
    availablePermissions,
    submitRoute,
}: PermissionsPopupProps) {
    const [localError, setLocalError] = useState<string | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: initialRole,
        permissions: initialPermissions,
    });

    useEffect(() => {
        if (isOpen) {
            setData({
                name: initialRole || '',
                permissions: initialPermissions || [],
            });
            setLocalError(null);
        } else {
            reset();
        }
    }, [isOpen, initialRole, initialPermissions]);

    const togglePermission = (permission: string) => {
        const updated = data.permissions.includes(permission)
            ? data.permissions.filter((p) => p !== permission)
            : [...data.permissions, permission];
        setData('permissions', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.permissions.length === 0) {
            setLocalError('Veuillez sélectionner au moins une permission.');
            return;
        }

        if (mode === 'create') {
            post(submitRoute, {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            put(submitRoute, {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    const getPermissionIcon = (permission: string) => {
        if (permission.includes('create')) return <Plus size={16} />;
        if (permission.includes('edit') || permission.includes('update'))
            return <Edit3 size={16} />;
        if (permission.includes('delete')) return <Trash2 size={16} />;
        if (permission.includes('view') || permission.includes('read'))
            return <Eye size={16} />;
        return <Key size={16} />;
    };

    const getPermissionColor = (permission: string) => {
        if (permission.includes('create'))
            return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (permission.includes('edit') || permission.includes('update'))
            return 'bg-blue-100 text-blue-700 border-blue-200';
        if (permission.includes('delete'))
            return 'bg-red-100 text-red-700 border-red-200';
        if (permission.includes('view') || permission.includes('read'))
            return 'bg-purple-100 text-purple-700 border-purple-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsOpen(false)}
            />

            {/* Popup Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="relative w-full max-w-2xl scale-100 transform overflow-hidden rounded-2xl bg-white opacity-100 shadow-2xl transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                    <UserCog size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {mode === 'edit'
                                            ? 'Modifier le rôle'
                                            : 'Créer un rôle'}
                                    </h2>
                                    <p className="mt-1 text-sm text-amber-100">
                                        {mode === 'edit'
                                            ? 'Modifiez les informations et permissions du rôle'
                                            : 'Définissez un nouveau rôle avec ses permissions'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Role Name Input */}
                        <div className="mb-6">
                            <label
                                htmlFor="role-name"
                                className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                            >
                                <Shield size={16} className="text-amber-500" />
                                Nom du rôle
                            </label>
                            <input
                                type="text"
                                id="role-name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Ex: Administrateur, Éditeur, Lecteur..."
                                className={`w-full rounded-xl border px-4 py-3 ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-amber-200/50 focus:ring-amber-500'} bg-white/80 text-sm shadow-sm backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:outline-none`}
                                required
                                disabled={processing}
                            />
                            {errors.name && <ErrorText error={errors.name} />}
                        </div>

                        {/* Permissions Section */}
                        <div className="mb-6">
                            <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <Key size={16} className="text-amber-500" />
                                Permissions
                                <span className="ml-2 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                                    {data.permissions.length} sélectionnée
                                    {data.permissions.length > 1 ? 's' : ''}
                                </span>
                            </label>

                            <div className="grid max-h-96 grid-cols-1 gap-3 overflow-y-auto pr-2 md:grid-cols-2">
                                {availablePermissions.map((permission) => {
                                    const isSelected =
                                        data.permissions.includes(permission);
                                    const colorClass =
                                        getPermissionColor(permission);

                                    return (
                                        <div
                                            key={permission}
                                            className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                                                isSelected
                                                    ? 'border-amber-400 bg-amber-50/50 shadow-md'
                                                    : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/30'
                                            }`}
                                            onClick={() =>
                                                togglePermission(permission)
                                            }
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors ${
                                                        isSelected
                                                            ? 'border-amber-500 bg-amber-500'
                                                            : 'border-gray-300'
                                                    }`}
                                                >
                                                    {isSelected && (
                                                        <Check
                                                            size={14}
                                                            className="text-white"
                                                        />
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colorClass}`}
                                                        >
                                                            {getPermissionIcon(
                                                                permission,
                                                            )}
                                                            <span className="ml-1">
                                                                {permission
                                                                    .split('.')
                                                                    .pop()}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-600">
                                                        {permission
                                                            .replace(/\./g, ' ')
                                                            .replace(/_/g, ' ')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {localError && (
                                <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                                    <AlertCircle
                                        size={16}
                                        className="flex-shrink-0 text-red-500"
                                    />
                                    <span className="text-sm text-red-700">
                                        {localError}
                                    </span>
                                </div>
                            )}

                            {Object.keys(errors).length > 0 && (
                                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
                                    {Object.values(errors).map((err, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 text-sm text-red-700"
                                        >
                                            <AlertCircle
                                                size={14}
                                                className="flex-shrink-0"
                                            />
                                            <span>{err}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                disabled={processing}
                                className="rounded-xl bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex min-w-[140px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-amber-600 hover:to-amber-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        En cours...
                                    </>
                                ) : (
                                    <>
                                        <Check size={18} />
                                        {mode === 'edit'
                                            ? 'Mettre à jour'
                                            : 'Créer'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
