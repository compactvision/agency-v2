import { useForm } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    Edit3,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Save,
    Shield,
    User,
    UserPlus,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Role = { name: string };
type UserLite = {
    id?: number | string;
    name?: string;
    email?: string;
    roles?: { name: string }[];
};

type Props = {
    readonly isOpen: boolean;
    readonly setIsOpen: (v: boolean) => void;
    readonly user?: UserLite;
    readonly roles: Role[];
};

export default function RoleAndPermission({
    isOpen,
    setIsOpen,
    user,
    roles,
}: Props) {
    const isEdit = Boolean(user?.id);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        data,
        setData,
        transform,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<{
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        roles: string[];
    }>({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        roles: user?.roles?.map((r) => r.name) ?? [],
    });

    // Sync quand on ouvre / change d'utilisateur
    useEffect(() => {
        if (!isOpen) return;
        setData({
            name: user?.name ?? '',
            email: user?.email ?? '',
            password: '',
            password_confirmation: '',
            roles: user?.roles?.map((r) => r.name) ?? [],
        });
        clearErrors();
    }, [isOpen, user?.id]);

    const close = () => {
        setIsOpen(false);
        reset('password', 'password_confirmation');
        clearErrors();
    };

    const toggleRole = (roleName: string) => {
        setData(
            'roles',
            data.roles.includes(roleName)
                ? data.roles.filter((r) => r !== roleName)
                : [...data.roles, roleName],
        );
    };

    const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isEdit && user?.id != null) {
            // ÉDITION : on n'envoie PAS de mot de passe ici
            transform((current) => ({
                name: current.name,
                email: current.email,
                roles: current.roles,
            }));
            put(route('dashboard.users.update', user.id), {
                preserveScroll: true,
                onSuccess: () => {
                    close();
                    toast.success('Utilisateur modifié');
                },
            });
        } else {
            // CRÉATION : les rôles sélectionnés sont également transmis.
            transform((current) => current);
            post(route('dashboard.users.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    close();
                    toast.success('Utilisateur créé');
                },
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="agency-modal-layer fixed inset-0 z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
        >
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Overlay avec effet de flou */}
                <div
                    className="agency-modal-overlay fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={() => !processing && close()}
                ></div>

                {/* Modal content */}
                <div className="agency-modal relative max-h-[90vh] w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                    {/* Header */}
                    <div className="agency-modal-header bg-gradient-to-r from-amber-400 to-amber-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                                    {isEdit ? (
                                        <Edit3
                                            size={24}
                                            className="text-white"
                                        />
                                    ) : (
                                        <UserPlus
                                            size={24}
                                            className="text-white"
                                        />
                                    )}
                                </div>
                                <h2
                                    id="user-modal-title"
                                    className="text-2xl font-bold"
                                >
                                    {isEdit
                                        ? "Modifier l'utilisateur"
                                        : 'Créer un utilisateur'}
                                </h2>
                            </div>
                            <button
                                type="button"
                                aria-label="Fermer"
                                className="rounded-full p-2 transition-colors hover:bg-white/20"
                                onClick={() => !processing && close()}
                            >
                                <X size={24} className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Form content */}
                    <form
                        onSubmit={handleSave}
                        className="agency-modal-body max-h-[60vh] space-y-6 overflow-y-auto p-6"
                    >
                        {/* Nom */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Nom complet
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                    placeholder="Jean Dupont"
                                    required
                                    disabled={processing}
                                />
                            </div>
                            {errors.name && (
                                <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    <AlertCircle size={16} />
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Adresse email
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                    placeholder="jean.dupont@example.com"
                                    required
                                    disabled={processing || isEdit}
                                />
                            </div>
                            {errors.email && (
                                <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    <AlertCircle size={16} />
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        {/* Password fields - création uniquement */}
                        {!isEdit && (
                            <>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Lock
                                                size={18}
                                                className="text-gray-400"
                                            />
                                        </div>
                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-12 pl-10 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                            placeholder="•••••••••"
                                            required
                                            disabled={processing}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            ) : (
                                                <Eye
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                            <AlertCircle size={16} />
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Confirmer le mot de passe
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Lock
                                                size={18}
                                                className="text-gray-400"
                                            />
                                        </div>
                                        <input
                                            id="password_confirmation"
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-12 pl-10 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                            placeholder="•••••••••"
                                            required
                                            disabled={processing}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            ) : (
                                                <Eye
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                            <AlertCircle size={16} />
                                            {errors.password_confirmation}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Roles - édition uniquement */}
                        {isEdit && (
                            <div>
                                <label className="mb-4 block text-sm font-medium text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <Shield
                                            size={18}
                                            className="text-amber-500"
                                        />
                                        Rôles assignés
                                    </div>
                                </label>
                                <div className="space-y-3">
                                    {roles.map((role) => (
                                        <div
                                            key={role.name}
                                            className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-amber-300"
                                        >
                                            <input
                                                type="checkbox"
                                                id={`role-${role.name}`}
                                                checked={data.roles.includes(
                                                    role.name,
                                                )}
                                                onChange={() =>
                                                    toggleRole(role.name)
                                                }
                                                disabled={processing}
                                                className="h-5 w-5 cursor-pointer rounded border-amber-300 text-amber-600 focus:ring-amber-500 focus:ring-offset-2"
                                            />
                                            <label
                                                htmlFor={`role-${role.name}`}
                                                className="ml-3 flex-1 cursor-pointer select-none"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-gray-900 capitalize">
                                                        {role.name}
                                                    </span>
                                                    {data.roles.includes(
                                                        role.name,
                                                    ) && (
                                                        <CheckCircle
                                                            size={16}
                                                            className="text-amber-500"
                                                        />
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {role.name === 'Admin' &&
                                                        "Accès complet à l'administration"}
                                                    {role.name === 'Agency' &&
                                                        'Peut créer et gérer des propriétés'}
                                                    {role.name ===
                                                        'Simple_seller' &&
                                                        'Peut vendre des propriétés'}
                                                </p>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {errors.roles && (
                                    <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                        <AlertCircle size={16} />
                                        {errors.roles}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
                            <button
                                type="button"
                                className="agency-btn-secondary rounded-xl px-6 py-3 font-medium transition-colors focus:ring-2 focus:ring-[#CF8E19] focus:ring-offset-2 focus:outline-none"
                                onClick={close}
                                disabled={processing}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="agency-btn-primary flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all focus:ring-2 focus:ring-[#CF8E19] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            className="h-5 w-5 animate-spin text-white"
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
                                        {isEdit
                                            ? 'Modification...'
                                            : 'Création...'}
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        {isEdit ? 'Sauvegarder' : 'Créer'}
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
