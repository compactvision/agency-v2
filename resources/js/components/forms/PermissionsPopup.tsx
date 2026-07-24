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
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
        setLocalError(null);
    };

    const permissionGroups = useMemo(
        () =>
            Object.entries(
                [...availablePermissions].sort().reduce(
                    (groups, permission) => {
                        const resource = permission.split('.')[0];
                        groups[resource] ??= [];
                        groups[resource].push(permission);

                        return groups;
                    },
                    {} as Record<string, string[]>,
                ),
            ),
        [availablePermissions],
    );

    const selectAllPermissions = () => {
        setData('permissions', [...availablePermissions]);
        setLocalError(null);
    };

    const clearPermissions = () => {
        setData('permissions', []);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.permissions.length === 0) {
            setLocalError(t('dashboard_ui.roles.modal.permission_required'));
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
        <div
            className="agency-modal-layer fixed inset-0 z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="permissions-popup-title"
        >
            {/* Overlay */}
            <div
                className="agency-modal-overlay fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsOpen(false)}
            />

            {/* Popup Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="agency-modal relative w-full max-w-2xl scale-100 transform overflow-hidden rounded-2xl bg-white opacity-100 shadow-2xl transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="agency-modal-header bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                    <UserCog size={24} />
                                </div>
                                <div>
                                    <h2
                                        id="permissions-popup-title"
                                        className="text-2xl font-bold"
                                    >
                                        {mode === 'edit'
                                            ? t(
                                                  'dashboard_ui.roles.modal.edit_title',
                                              )
                                            : t(
                                                  'dashboard_ui.roles.modal.create_title',
                                              )}
                                    </h2>
                                    <p className="mt-1 text-sm text-amber-100">
                                        {mode === 'edit'
                                            ? t(
                                                  'dashboard_ui.roles.modal.edit_description',
                                              )
                                            : t(
                                                  'dashboard_ui.roles.modal.create_description',
                                              )}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label={t('dashboard_ui.common.close')}
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <form
                        onSubmit={handleSubmit}
                        className="agency-modal-body p-6"
                    >
                        {/* Role Name Input */}
                        <div className="mb-6">
                            <label
                                htmlFor="role-name"
                                className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                            >
                                <Shield size={16} className="text-amber-500" />
                                {t('dashboard_ui.roles.modal.role_name')}
                            </label>
                            <input
                                type="text"
                                id="role-name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder={t(
                                    'dashboard_ui.roles.modal.role_placeholder',
                                )}
                                className={`w-full rounded-xl border px-4 py-3 ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-amber-200/50 focus:ring-amber-500'} bg-white/80 text-sm shadow-sm backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:outline-none`}
                                required
                                disabled={processing}
                            />
                            {errors.name && <ErrorText error={errors.name} />}
                        </div>

                        {/* Permissions Section */}
                        <div className="mb-6">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Key size={16} className="text-amber-500" />
                                    {t('dashboard_ui.roles.permissions')}
                                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                                        {t(
                                            'dashboard_ui.roles.modal.selected_count',
                                            {
                                                count: data.permissions.length,
                                            },
                                        )}
                                    </span>
                                </div>
                                {availablePermissions.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={selectAllPermissions}
                                            disabled={
                                                processing ||
                                                data.permissions.length ===
                                                    availablePermissions.length
                                            }
                                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#8A5B08] transition-colors hover:bg-[#CF8E19]/10 disabled:opacity-40"
                                        >
                                            {t(
                                                'dashboard_ui.roles.modal.select_all',
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={clearPermissions}
                                            disabled={
                                                processing ||
                                                data.permissions.length === 0
                                            }
                                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40"
                                        >
                                            {t(
                                                'dashboard_ui.roles.modal.clear',
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="max-h-96 space-y-5 overflow-y-auto pr-2">
                                {permissionGroups.map(
                                    ([resource, groupPermissions]) => (
                                        <fieldset key={resource}>
                                            <legend className="mb-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
                                                {resource.replace(/-/g, ' ')}
                                            </legend>
                                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                                {groupPermissions.map(
                                                    (permission) => {
                                                        const isSelected =
                                                            data.permissions.includes(
                                                                permission,
                                                            );
                                                        const colorClass =
                                                            getPermissionColor(
                                                                permission,
                                                            );

                                                        return (
                                                            <button
                                                                type="button"
                                                                key={permission}
                                                                role="checkbox"
                                                                aria-checked={
                                                                    isSelected
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className={`relative rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                                                                    isSelected
                                                                        ? 'border-amber-400 bg-amber-50/50 shadow-md'
                                                                        : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/30'
                                                                } disabled:cursor-not-allowed disabled:opacity-60`}
                                                                onClick={() =>
                                                                    togglePermission(
                                                                        permission,
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <span
                                                                        aria-hidden="true"
                                                                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                                                                            isSelected
                                                                                ? 'border-amber-500 bg-amber-500'
                                                                                : 'border-gray-300'
                                                                        }`}
                                                                    >
                                                                        {isSelected && (
                                                                            <Check
                                                                                size={
                                                                                    14
                                                                                }
                                                                                className="text-white"
                                                                            />
                                                                        )}
                                                                    </span>
                                                                    <span className="min-w-0 flex-1">
                                                                        <span
                                                                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colorClass}`}
                                                                        >
                                                                            {getPermissionIcon(
                                                                                permission,
                                                                            )}
                                                                            <span className="ml-1">
                                                                                {permission
                                                                                    .split(
                                                                                        '.',
                                                                                    )
                                                                                    .slice(
                                                                                        1,
                                                                                    )
                                                                                    .join(
                                                                                        ' · ',
                                                                                    )}
                                                                            </span>
                                                                        </span>
                                                                        <span className="mt-1 block text-xs text-slate-500">
                                                                            {
                                                                                permission
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </fieldset>
                                    ),
                                )}
                                {availablePermissions.length === 0 && (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                        {t(
                                            'dashboard_ui.roles.modal.no_available_permissions',
                                        )}
                                    </div>
                                )}
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
                                className="agency-btn-secondary rounded-xl bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {t('dashboard_ui.common.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="agency-btn-primary flex min-w-[140px] items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        {t(
                                            'dashboard_ui.roles.modal.processing',
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Check size={18} />
                                        {mode === 'edit'
                                            ? t(
                                                  'dashboard_ui.roles.modal.update',
                                              )
                                            : t(
                                                  'dashboard_ui.roles.modal.create',
                                              )}
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
