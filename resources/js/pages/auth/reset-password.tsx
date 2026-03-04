import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import ErrorText from '@/components/ui/ErrorText';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    LoaderCircle,
    LucideArrowLeft,
    LucideCheckCircle,
    LucideEye,
    LucideEyeOff,
    LucideKey,
    LucideLock,
    LucideMail,
    LucideRefreshCw,
    LucideShield,
    LucideXCircle,
    LucideZap,
} from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm<
        Required<ResetPasswordForm>
    >({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.update'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Vérifier la force du mot de passe
    useEffect(() => {
        if (data.password) {
            const length = data.password.length >= 8;
            const uppercase = /[A-Z]/.test(data.password);
            const lowercase = /[a-z]/.test(data.password);
            const number = /[0-9]/.test(data.password);
            const special = /[!@#$%^&*(),.?":{}|<>]/.test(data.password);

            setPasswordCriteria({
                length,
                uppercase,
                lowercase,
                number,
                special,
            });

            // Calculer la force du mot de passe (0-4)
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
    }, [data.password]);

    // Vérifier si les mots de passe correspondent
    useEffect(() => {
        if (data.password && data.password_confirmation) {
            setPasswordsMatch(data.password === data.password_confirmation);
        } else {
            setPasswordsMatch(false);
        }
    }, [data.password, data.password_confirmation]);

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'bg-red-500';
        if (passwordStrength === 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength === 0) return t('very_weak');
        if (passwordStrength <= 2) return t('weak');
        if (passwordStrength === 3) return t('medium');
        return t('strong');
    };

    return (
        <App>
            <Head title="Reset Password" />
            <Breadcumb title={t('reset_password')} homeLink={route('home')} />

            <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
                <div className="w-full max-w-6xl">
                    <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left Side - Visual */}
                            <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 p-8 lg:p-12">
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-white/10"></div>
                                <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-48 w-48 rounded-full bg-white/10"></div>

                                <div className="relative z-10">
                                    <div className="mb-8">
                                        <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
                                            {t('create_new_password')}
                                        </h1>
                                        <p className="max-w-md text-xl text-white/90">
                                            {t('reset_password_subtitle')}
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                                <LucideShield
                                                    size={24}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {t('secure_password')}
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    {t('secure_password_desc')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                                <LucideKey
                                                    size={24}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {t('unique_password')}
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    {t('unique_password_desc')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                                <LucideZap
                                                    size={24}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {t('quick_process')}
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    {t('quick_process_desc')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 mt-8">
                                    <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                                                <LucideLock
                                                    size={32}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="mb-1 text-xl font-bold text-white">
                                                    {t('protect_your_account')}
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    {t(
                                                        'password_protection_tip',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="p-8 lg:p-12">
                                <div className="mx-auto w-full max-w-md">
                                    <div className="mb-8">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                                                <LucideLock
                                                    size={24}
                                                    className="text-purple-600"
                                                />
                                            </div>
                                            <h2 className="text-3xl font-bold text-gray-900">
                                                {t('reset_password')}
                                            </h2>
                                        </div>
                                        <p className="text-gray-600">
                                            {t('reset_password_desc')}
                                        </p>
                                    </div>

                                    <form
                                        onSubmit={submit}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="mb-2 block text-sm font-medium text-gray-700"
                                            >
                                                {t('email_address')}
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <LucideMail
                                                        size={20}
                                                        className="text-gray-400"
                                                    />
                                                </div>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    autoComplete="email"
                                                    value={data.email}
                                                    readOnly
                                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pr-3 pl-10 text-gray-700"
                                                />
                                            </div>
                                            <ErrorText error={errors.email} />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="password"
                                                className="mb-2 block text-sm font-medium text-gray-700"
                                            >
                                                {t('new_password')}
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <LucideKey
                                                        size={20}
                                                        className="text-gray-400"
                                                    />
                                                </div>
                                                <input
                                                    type={
                                                        showPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    id="password"
                                                    name="password"
                                                    autoComplete="new-password"
                                                    value={data.password}
                                                    onChange={(e) =>
                                                        setData(
                                                            'password',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`w-full rounded-xl border py-3 pr-12 pl-10 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                                                        focusedField ===
                                                        'password'
                                                            ? 'border-purple-500'
                                                            : 'border-gray-300'
                                                    } ${errors.password ? 'border-red-500' : ''}`}
                                                    placeholder={t(
                                                        'enter_new_password',
                                                    )}
                                                    autoFocus
                                                    onFocus={() =>
                                                        setFocusedField(
                                                            'password',
                                                        )
                                                    }
                                                    onBlur={() =>
                                                        setFocusedField('')
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword,
                                                        )
                                                    }
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                >
                                                    {showPassword ? (
                                                        <LucideEyeOff
                                                            size={20}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        />
                                                    ) : (
                                                        <LucideEye
                                                            size={20}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        />
                                                    )}
                                                </button>
                                            </div>
                                            <ErrorText
                                                error={errors.password}
                                            />

                                            {/* Password Strength Indicator */}
                                            {data.password && (
                                                <div className="mt-2">
                                                    <div className="mb-1 flex items-center justify-between">
                                                        <span className="text-xs text-gray-500">
                                                            {t(
                                                                'password_strength',
                                                            )}
                                                        </span>
                                                        <span
                                                            className={`text-xs font-medium ${
                                                                passwordStrength <=
                                                                2
                                                                    ? 'text-red-500'
                                                                    : passwordStrength ===
                                                                        3
                                                                      ? 'text-yellow-500'
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

                                                    {/* Password Criteria */}
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            {passwordCriteria.length ? (
                                                                <LucideCheckCircle
                                                                    size={14}
                                                                    className="text-green-500"
                                                                />
                                                            ) : (
                                                                <LucideXCircle
                                                                    size={14}
                                                                    className="text-gray-400"
                                                                />
                                                            )}
                                                            <span
                                                                className={`text-xs ${passwordCriteria.length ? 'text-green-700' : 'text-gray-500'}`}
                                                            >
                                                                {t(
                                                                    'at_least_8_characters',
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {passwordCriteria.uppercase ? (
                                                                <LucideCheckCircle
                                                                    size={14}
                                                                    className="text-green-500"
                                                                />
                                                            ) : (
                                                                <LucideXCircle
                                                                    size={14}
                                                                    className="text-gray-400"
                                                                />
                                                            )}
                                                            <span
                                                                className={`text-xs ${passwordCriteria.uppercase ? 'text-green-700' : 'text-gray-500'}`}
                                                            >
                                                                {t(
                                                                    'one_uppercase_letter',
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {passwordCriteria.lowercase ? (
                                                                <LucideCheckCircle
                                                                    size={14}
                                                                    className="text-green-500"
                                                                />
                                                            ) : (
                                                                <LucideXCircle
                                                                    size={14}
                                                                    className="text-gray-400"
                                                                />
                                                            )}
                                                            <span
                                                                className={`text-xs ${passwordCriteria.lowercase ? 'text-green-700' : 'text-gray-500'}`}
                                                            >
                                                                {t(
                                                                    'one_lowercase_letter',
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {passwordCriteria.number ? (
                                                                <LucideCheckCircle
                                                                    size={14}
                                                                    className="text-green-500"
                                                                />
                                                            ) : (
                                                                <LucideXCircle
                                                                    size={14}
                                                                    className="text-gray-400"
                                                                />
                                                            )}
                                                            <span
                                                                className={`text-xs ${passwordCriteria.number ? 'text-green-700' : 'text-gray-500'}`}
                                                            >
                                                                {t(
                                                                    'one_number',
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {passwordCriteria.special ? (
                                                                <LucideCheckCircle
                                                                    size={14}
                                                                    className="text-green-500"
                                                                />
                                                            ) : (
                                                                <LucideXCircle
                                                                    size={14}
                                                                    className="text-gray-400"
                                                                />
                                                            )}
                                                            <span
                                                                className={`text-xs ${passwordCriteria.special ? 'text-green-700' : 'text-gray-500'}`}
                                                            >
                                                                {t(
                                                                    'one_special_character',
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="password_confirmation"
                                                className="mb-2 block text-sm font-medium text-gray-700"
                                            >
                                                {t('confirm_password')}
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <LucideKey
                                                        size={20}
                                                        className="text-gray-400"
                                                    />
                                                </div>
                                                <input
                                                    type={
                                                        showConfirmPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    autoComplete="new-password"
                                                    value={
                                                        data.password_confirmation
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'password_confirmation',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`w-full rounded-xl border py-3 pr-12 pl-10 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-purple-500 ${
                                                        focusedField ===
                                                        'password_confirmation'
                                                            ? 'border-purple-500'
                                                            : 'border-gray-300'
                                                    } ${errors.password_confirmation ? 'border-red-500' : ''}`}
                                                    placeholder={t(
                                                        'confirm_new_password',
                                                    )}
                                                    onFocus={() =>
                                                        setFocusedField(
                                                            'password_confirmation',
                                                        )
                                                    }
                                                    onBlur={() =>
                                                        setFocusedField('')
                                                    }
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
                                                        <LucideEyeOff
                                                            size={20}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        />
                                                    ) : (
                                                        <LucideEye
                                                            size={20}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        />
                                                    )}
                                                </button>
                                            </div>
                                            <ErrorText
                                                error={
                                                    errors.password_confirmation
                                                }
                                            />

                                            {/* Password Match Indicator */}
                                            {data.password_confirmation && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    {passwordsMatch ? (
                                                        <>
                                                            <LucideCheckCircle
                                                                size={14}
                                                                className="text-green-500"
                                                            />
                                                            <span className="text-xs text-green-700">
                                                                {t(
                                                                    'passwords_match',
                                                                )}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <LucideXCircle
                                                                size={14}
                                                                className="text-red-500"
                                                            />
                                                            <span className="text-xs text-red-700">
                                                                {t(
                                                                    'passwords_do_not_match',
                                                                )}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <button
                                                type="submit"
                                                disabled={
                                                    processing ||
                                                    !passwordsMatch ||
                                                    passwordStrength < 3
                                                }
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:from-purple-600 hover:to-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                            >
                                                {processing ? (
                                                    <>
                                                        <LoaderCircle
                                                            className="animate-spin"
                                                            size={20}
                                                        />
                                                        {t(
                                                            'resetting_password',
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <LucideRefreshCw
                                                            size={18}
                                                        />
                                                        {t('reset_password')}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>

                                    <div className="mt-8">
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-300"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="bg-white px-2 text-gray-500">
                                                    {t('or')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-6 text-center">
                                            <Link
                                                href={route('login')}
                                                className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 transition-colors hover:text-purple-500"
                                            >
                                                <LucideArrowLeft size={16} />
                                                {t('back_to_login')}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </App>
    );
}
