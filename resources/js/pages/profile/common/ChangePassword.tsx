import ErrorText from '@/components/ui/ErrorText';
import { useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    Info,
    Key,
    Loader2,
    Lock,
    RefreshCw,
    X,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PageProps {
    [key: string]: unknown;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function ChangePassword() {
    const { t } = useTranslation();
    const { flash } = usePage<PageProps>().props;
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword,
        processing: processingPassword,
        errors: passwordErrors,
        reset: resetPasswordData,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (passwordData.password) {
            const length = passwordData.password.length >= 8;
            const uppercase = /[A-Z]/.test(passwordData.password);
            const lowercase = /[a-z]/.test(passwordData.password);
            const number = /[0-9]/.test(passwordData.password);
            const special = /[!@#$%^&*(),.?":{}|<>]/.test(
                passwordData.password,
            );

            setPasswordCriteria({
                length,
                uppercase,
                lowercase,
                number,
                special,
            });

            // Calculer la force du mot de passe (0-5)
            const criteriaMet = [
                length,
                uppercase,
                lowercase,
                number,
                special,
            ].filter(Boolean).length;
            setPasswordStrength(criteriaMet);
        } else {
            setPasswordStrength(0);
            setPasswordCriteria({
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                special: false,
            });
        }
    }, [passwordData.password]);

    useEffect(() => {
        if (passwordData.password && passwordData.password_confirmation) {
            setPasswordsMatch(
                passwordData.password === passwordData.password_confirmation,
            );
        } else {
            setPasswordsMatch(false);
        }
    }, [passwordData.password, passwordData.password_confirmation]);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putPassword(route('user-password.update'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setShowSuccess(true);
                resetPasswordData();
            },
        });
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'bg-red-500';
        if (passwordStrength === 3) return 'bg-yellow-500';
        if (passwordStrength === 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength === 0) return t('very_weak');
        if (passwordStrength === 1) return t('weak');
        if (passwordStrength === 2) return t('fair');
        if (passwordStrength === 3) return t('good');
        if (passwordStrength === 4) return t('strong');
        return t('very_strong');
    };

    return (
        <div className="space-y-6">
            {/* Messages de notification */}
            {showSuccess && (
                <div className="animate-slide-down flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                    <CheckCircle size={20} className="text-green-600" />
                    <div>
                        <p className="font-medium text-green-800">
                            {flash?.success || t('password_updated_success')}
                        </p>
                        <p className="text-sm text-green-700">
                            {t('password_updated_description')}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowSuccess(false)}
                        className="text-green-600 hover:text-green-800"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            {flash?.error && (
                <div className="animate-slide-down flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertCircle size={20} className="text-red-600" />
                    <div>
                        <p className="font-medium text-red-800">
                            {flash.error}
                        </p>
                        <p className="text-sm text-red-700">
                            {t('password_update_error')}
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-red-600 hover:text-red-800"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            )}

            {/* Carte principale */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className="bg-gradient-to-r from-[#C9A84C] to-[#A8882E] p-6 text-white">
                    <h3 className="flex items-center gap-2 text-2xl font-bold">
                        <Lock size={24} />
                        {t('change_password')}
                    </h3>
                    <p className="mt-2 text-white/90">
                        {t('change_password_description')}
                    </p>
                </div>

                <div className="space-y-6 p-6">
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        {/* Champ mot de passe actuel */}
                        <div>
                            <label
                                htmlFor="current_password"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                {t('current_password')}
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Key size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type={
                                        showCurrentPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    id="current_password"
                                    className={`w-full rounded-xl border py-3 pr-12 pl-10 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#C9A84C] ${
                                        passwordErrors.current_password
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                    }`}
                                    value={passwordData.current_password}
                                    onChange={(e) =>
                                        setPasswordData(
                                            'current_password',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={t('enter_current_password')}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCurrentPassword(
                                            !showCurrentPassword,
                                        )
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff
                                            size={20}
                                            className="text-gray-400 hover:text-gray-600"
                                        />
                                    ) : (
                                        <Eye
                                            size={20}
                                            className="text-gray-400 hover:text-gray-600"
                                        />
                                    )}
                                </button>
                            </div>
                            <ErrorText
                                error={passwordErrors.current_password}
                            />
                        </div>

                        {/* Champ nouveau mot de passe */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                {t('new_password_input') || t('new_password')}
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    id="password"
                                    className={`w-full rounded-xl border py-3 pr-12 pl-10 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#C9A84C] ${
                                        passwordErrors.password
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                    }`}
                                    value={passwordData.password}
                                    onChange={(e) =>
                                        setPasswordData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={t('enter_new_password')}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNewPassword(!showNewPassword)
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    {showNewPassword ? (
                                        <EyeOff
                                            size={20}
                                            className="text-gray-400 hover:text-gray-600"
                                        />
                                    ) : (
                                        <Eye
                                            size={20}
                                            className="text-gray-400 hover:text-gray-600"
                                        />
                                    )}
                                </button>
                            </div>
                            <ErrorText error={passwordErrors.password} />

                            {/* Indicateur de force du mot de passe */}
                            {passwordData.password && (
                                <div className="mt-2">
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            {t('password_strength')}
                                        </span>
                                        <span
                                            className={`text-xs font-medium ${
                                                passwordStrength <= 2
                                                    ? 'text-red-500'
                                                    : passwordStrength === 3
                                                      ? 'text-yellow-500'
                                                      : passwordStrength === 4
                                                        ? 'text-blue-500'
                                                        : 'text-green-500'
                                            }`}
                                        >
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-gray-200">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                            style={{
                                                width: `${(passwordStrength / 5) * 100}%`,
                                            }}
                                        ></div>
                                    </div>

                                    {/* Critères du mot de passe */}
                                    <div className="mt-2 space-y-1">
                                        <div className="flex items-center gap-2">
                                            {passwordCriteria.length ? (
                                                <CheckCircle
                                                    size={14}
                                                    className="text-green-500"
                                                />
                                            ) : (
                                                <XCircle
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                            )}
                                            <span
                                                className={`text-xs ${passwordCriteria.length ? 'text-green-700' : 'text-gray-500'}`}
                                            >
                                                {t('at_least_8_characters')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {passwordCriteria.uppercase ? (
                                                <CheckCircle
                                                    size={14}
                                                    className="text-green-500"
                                                />
                                            ) : (
                                                <XCircle
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                            )}
                                            <span
                                                className={`text-xs ${passwordCriteria.uppercase ? 'text-green-700' : 'text-gray-500'}`}
                                            >
                                                {t('one_uppercase_letter')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {passwordCriteria.lowercase ? (
                                                <CheckCircle
                                                    size={14}
                                                    className="text-green-500"
                                                />
                                            ) : (
                                                <XCircle
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                            )}
                                            <span
                                                className={`text-xs ${passwordCriteria.lowercase ? 'text-green-700' : 'text-gray-500'}`}
                                            >
                                                {t('one_lowercase_letter')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {passwordCriteria.number ? (
                                                <CheckCircle
                                                    size={14}
                                                    className="text-green-500"
                                                />
                                            ) : (
                                                <XCircle
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                            )}
                                            <span
                                                className={`text-xs ${passwordCriteria.number ? 'text-green-700' : 'text-gray-500'}`}
                                            >
                                                {t('one_number')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {passwordCriteria.special ? (
                                                <CheckCircle
                                                    size={14}
                                                    className="text-green-500"
                                                />
                                            ) : (
                                                <XCircle
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                            )}
                                            <span
                                                className={`text-xs ${passwordCriteria.special ? 'text-green-700' : 'text-gray-500'}`}
                                            >
                                                {t('one_special_character')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Champ confirmation mot de passe */}
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                {t('password_confirmation_input') ||
                                    t('confirm_password')}
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    id="password_confirmation"
                                    className={`w-full rounded-xl border py-3 pr-12 pl-10 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#C9A84C] ${
                                        passwordErrors.password_confirmation
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                    }`}
                                    value={passwordData.password_confirmation}
                                    onChange={(e) =>
                                        setPasswordData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={t('confirm_new_password')}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff
                                            size={20}
                                            className="text-gray-400 hover:text-gray-600"
                                        />
                                    ) : (
                                        <Eye
                                            size={20}
                                            className="text-gray-400 hover:text-gray-600"
                                        />
                                    )}
                                </button>
                            </div>
                            <ErrorText
                                error={passwordErrors.password_confirmation}
                            />

                            {/* Indicateur de correspondance */}
                            {passwordData.password_confirmation && (
                                <div className="mt-2 flex items-center gap-2">
                                    {passwordsMatch ? (
                                        <>
                                            <CheckCircle
                                                size={14}
                                                className="text-green-500"
                                            />
                                            <span className="text-xs text-green-700">
                                                {t('passwords_match')}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle
                                                size={14}
                                                className="text-red-500"
                                            />
                                            <span className="text-xs text-red-700">
                                                {t('passwords_do_not_match')}
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bouton de soumission */}
                        <div>
                            <button
                                type="submit"
                                disabled={
                                    processingPassword ||
                                    !passwordsMatch ||
                                    passwordStrength < 3
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#A8882E] px-4 py-3 font-medium text-white transition-all duration-300 hover:from-[#1E3A5F] hover:to-[#0d2340] focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                            >
                                {processingPassword ? (
                                    <>
                                        <Loader2 className="mr-2 -ml-1 h-5 w-5 animate-spin text-white" />
                                        {t('updating_label') ||
                                            t('updating_password')}
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw size={18} />
                                        {t('update_password_btn') ||
                                            t('update_password')}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Conseils de sécurité */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                <div className="flex items-start gap-3">
                    <Info size={20} className="mt-0.5 text-blue-600" />
                    <div>
                        <h4 className="mb-2 font-medium text-blue-800">
                            {t('password_security_tips')}
                        </h4>
                        <ul className="space-y-1 text-sm text-blue-700">
                            <li>{t('password_tip_1')}</li>
                            <li>{t('password_tip_2')}</li>
                            <li>{t('password_tip_3')}</li>
                            <li>{t('password_tip_4')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
