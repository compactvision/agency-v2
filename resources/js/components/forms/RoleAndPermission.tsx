import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ErrorText from '../ui/ErrorText';
import { toast } from 'sonner';
import { 
    X, 
    User, 
    Mail, 
    Lock, 
    Shield, 
    Key, 
    CheckCircle, 
    AlertCircle, 
    Save, 
    Users,
    UserPlus,
    Edit3,
    Eye,
    EyeOff
} from 'lucide-react';

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

export default function RoleAndPermission({ isOpen, setIsOpen, user, roles }: Props) {
    const isEdit = Boolean(user?.id);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<{
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
        roles: user?.roles?.map(r => r.name) ?? [],
    });

    // Sync quand on ouvre / change d'utilisateur
    useEffect(() => {
        if (!isOpen) return;
        setData({
            name: user?.name ?? '',
            email: user?.email ?? '',
            password: '',
            password_confirmation: '',
            roles: user?.roles?.map(r => r.name) ?? [],
        });
        clearErrors();
    }, [isOpen, user?.id]);

    const close = () => {
        setIsOpen(false);
        reset('password', 'password_confirmation');
        clearErrors();
    };

    const toggleRole = (roleName: string) => {
        setData('roles',
            data.roles.includes(roleName)
                ? data.roles.filter(r => r !== roleName)
                : [...data.roles, roleName]
        );
    };

    const handleSave = () => {
        if (isEdit && user?.id != null) {
            // ÉDITION : on n'envoie PAS de mot de passe ici
            put(route('dashboard.users.update', user.id), {
                data: {
                    name: data.name,
                    email: data.email,
                    roles: data.roles,
                },
                preserveScroll: true,
                onSuccess: () => {
                    close();
                    toast.success('Utilisateur modifié');
                },
            });
        } else {
            // CRÉATION : uniquement nom, email, password (+ confirmation)
            post(route('dashboard.users.store'), {
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                },
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
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Overlay avec effet de flou */}
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={() => !processing && close()}
                ></div>
                
                {/* Modal content */}
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-400 to-amber-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    {isEdit ? (
                                        <Edit3 size={24} className="text-white" />
                                    ) : (
                                        <UserPlus size={24} className="text-white" />
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold">
                                    {isEdit ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                onClick={() => !processing && close()}
                            >
                                <X size={24} className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Form content */}
                    <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                        {/* Nom */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nom complet
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500"
                                    placeholder="Jean Dupont"
                                    required
                                    disabled={processing}
                                />
                            </div>
                            {errors.name && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                    <AlertCircle size={16} />
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Adresse email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500"
                                    placeholder="jean.dupont@example.com"
                                    required
                                    disabled={processing || isEdit}
                                />
                            </div>
                            {errors.email && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                    <AlertCircle size={16} />
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        {/* Password fields - création uniquement */}
                        {!isEdit && (
                            <>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500"
                                            placeholder="•••••••••"
                                            required
                                            disabled={processing}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} className="text-gray-400" />
                                            ) : (
                                                <Eye size={18} className="text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                            <AlertCircle size={16} />
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmer le mot de passe
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500"
                                            placeholder="•••••••••"
                                            required
                                            disabled={processing}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={18} className="text-gray-400" />
                                            ) : (
                                                <Eye size={18} className="text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
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
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Shield size={18} className="text-amber-500" />
                                        Rôles assignés
                                    </div>
                                </label>
                                <div className="space-y-3">
                                    {roles.map((role) => (
                                        <div key={role.name} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-amber-300 transition-colors">
                                            <input
                                                type="checkbox"
                                                id={`role-${role.name}`}
                                                checked={data.roles.includes(role.name)}
                                                onChange={() => toggleRole(role.name)}
                                                disabled={processing}
                                                className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500 focus:ring-offset-2 cursor-pointer"
                                            />
                                            <label 
                                                htmlFor={`role-${role.name}`}
                                                className="ml-3 flex-1 cursor-pointer select-none"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-gray-900 capitalize">{role.name}</span>
                                                    {data.roles.includes(role.name) && (
                                                        <CheckCircle size={16} className="text-amber-500" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {role.name === 'Admin' && 'Accès complet à l\'administration'}
                                                    {role.name === 'Agency' && 'Peut créer et gérer des propriétés'}
                                                    {role.name === 'Simple_seller' && 'Peut vendre des propriétés'}
                                                </p>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {errors.roles && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                        <AlertCircle size={16} />
                                        {errors.roles}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                onClick={close}
                                disabled={processing}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl font-medium hover:from-amber-500 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {isEdit ? 'Modification...' : 'Création...'}
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