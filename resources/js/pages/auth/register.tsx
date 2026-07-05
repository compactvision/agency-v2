import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import ErrorText from '@/components/ui/ErrorText';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    LucideArrowRight,
    LucideCheckCircle,
    LucideEye,
    LucideEyeOff,
    LucideKey,
    LucideLock,
    LucideMail,
    LucideShield,
    LucideUser,
    LucideUserCheck,
    LucideXCircle,
    LucideZap,
} from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } =
        useForm<RegisterForm>({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        });
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [registerMethod, setRegisterMethod] = useState<'email' | 'social'>(
        'email',
    );
    const [socialLoading, setSocialLoading] = useState<string | null>(null);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const currentPath = window.location.pathname;

        post(route('register'), {
            onSuccess: (page) => {
                if (page.props.redirectUrl) {
                    router.visit(page.props.redirectUrl as string);
                }
            },
            onFinish: () => {
                reset('password', 'password_confirmation');
            },
            preserveScroll: (page) => currentPath === page.url,
        });
    };

    const handleShowPassword = (show: boolean) => {
        setShowPassword(show);
    };

    const handleShowConfirmPassword = (show: boolean) => {
        setShowConfirmPassword(show);
    };

    const handleSocialRegister = (provider: string) => {
        setSocialLoading(provider);
        setTimeout(() => {
            setSocialLoading(null);
            window.location.href = `/auth/${provider}`;
        }, 1000);
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
            <Head title="Register" />
            <Breadcumb title={t('register')} homeLink={route('home')} />

            <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
                <div className="w-full max-w-6xl">
                    <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left Side - Visual */}
                            <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0d2340] via-[#152C47] to-[#0d2340] p-8 lg:p-12">
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-white/10"></div>
                                <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-48 w-48 rounded-full bg-white/10"></div>

                                <div className="relative z-10">
                                    <div className="mb-8">
                                        <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
                                            {t('create_account')}
                                        </h1>
                                        <p className="max-w-md text-xl text-white/90">
                                            {t('register_subtitle')}
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                                <LucideUserCheck
                                                    size={24}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {t(
                                                        'personalized_experience',
                                                    )}
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    {t(
                                                        'personalized_experience_desc',
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                                <LucideShield
                                                    size={24}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {t('secure_account')}
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    {t('secure_account_desc')}
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
                                                    {t('quick_access')}
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    {t('quick_access_desc')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 mt-8">
                                    <img
                                        src="/assets/images/thumbs/register.png"
                                        alt="register-img"
                                        className="mx-auto w-full max-w-md"
                                    />
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="p-8 lg:p-12">
                                <div className="mx-auto w-full max-w-md">
                                    <div className="mb-8">
                                        <h2 className="mb-2 text-3xl font-bold text-gray-900">
                                            {t('register_to_theagencydrc')}
                                        </h2>
                                        <p className="text-gray-600">
                                            {t('join_our_community')}
                                        </p>
                                    </div>

                                    {/* Register Method & Language Toggle */}
                                    <div className="mb-8 space-y-4">
                                        <div className="flex rounded-xl bg-gray-100 p-1">
                                            <button
                                                onClick={() =>
                                                    setRegisterMethod('email')
                                                }
                                                className={`flex-1 rounded-lg px-4 py-2 font-medium transition-all duration-300 ${
                                                    registerMethod === 'email'
                                                        ? 'bg-white text-[#C9A84C] shadow-sm'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                {t('email_register')}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setRegisterMethod('social')
                                                }
                                                className={`flex-1 rounded-lg px-4 py-2 font-medium transition-all duration-300 ${
                                                    registerMethod === 'social'
                                                        ? 'bg-white text-[#C9A84C] shadow-sm'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                {t('social_register')}
                                            </button>
                                        </div>
                                    </div>

                                    {registerMethod === 'email' ? (
                                        <form
                                            onSubmit={submit}
                                            className="space-y-6"
                                        >
                                            <div>
                                                <label
                                                    htmlFor="name"
                                                    className="mb-2 block text-sm font-medium text-gray-700"
                                                >
                                                    {t('full_name')}
                                                </label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <LucideUser
                                                            size={20}
                                                            className="text-gray-400"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className={`w-full rounded-xl border py-3 pr-3 pl-10 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#C9A84C] ${
                                                            focusedField ===
                                                            'name'
                                                                ? 'border-[#C9A84C]'
                                                                : 'border-gray-300'
                                                        } ${errors.name ? 'border-red-500' : ''}`}
                                                        placeholder={t(
                                                            'enter_full_name',
                                                        )}
                                                        id="name"
                                                        value={data.name}
                                                        onChange={(e) =>
                                                            setData(
                                                                'name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        onFocus={() =>
                                                            setFocusedField(
                                                                'name',
                                                            )
                                                        }
                                                        onBlur={() =>
                                                            setFocusedField('')
                                                        }
                                                    />
                                                </div>
                                                <ErrorText
                                                    error={
                                                        errors.name
                                                            ? t(errors.name)
                                                            : undefined
                                                    }
                                                />
                                            </div>

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
                                                        className={`w-full rounded-xl border py-3 pr-3 pl-10 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#C9A84C] ${
                                                            focusedField ===
                                                            'email'
                                                                ? 'border-[#C9A84C]'
                                                                : 'border-gray-300'
                                                        } ${errors.email ? 'border-red-500' : ''}`}
                                                        placeholder={t(
                                                            'enter_email',
                                                        )}
                                                        id="email"
                                                        value={data.email}
                                                        onChange={(e) =>
                                                            setData(
                                                                'email',
                                                                e.target.value,
                                                            )
                                                        }
                                                        onFocus={() =>
                                                            setFocusedField(
                                                                'email',
                                                            )
                                                        }
                                                        onBlur={() =>
                                                            setFocusedField('')
                                                        }
                                                    />
                                                </div>
                                                <ErrorText
                                                    error={
                                                        errors.email
                                                            ? t(errors.email)
                                                            : undefined
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="password"
                                                    className="mb-2 block text-sm font-medium text-gray-700"
                                                >
                                                    {t('password')}
                                                </label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <LucideLock
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
                                                        className={`w-full rounded-xl border py-3 pr-12 pl-10 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#C9A84C] ${
                                                            focusedField ===
                                                            'password'
                                                                ? 'border-[#C9A84C]'
                                                                : 'border-gray-300'
                                                        } ${errors.password ? 'border-red-500' : ''}`}
                                                        placeholder={t(
                                                            'enter_password',
                                                        )}
                                                        id="password"
                                                        value={data.password}
                                                        onChange={(e) =>
                                                            setData(
                                                                'password',
                                                                e.target.value,
                                                            )
                                                        }
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
                                                            handleShowPassword(
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
                                                    error={
                                                        errors.password
                                                            ? t(errors.password)
                                                            : undefined
                                                    }
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
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-green-500"
                                                                    />
                                                                ) : (
                                                                    <LucideXCircle
                                                                        size={
                                                                            14
                                                                        }
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
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-green-500"
                                                                    />
                                                                ) : (
                                                                    <LucideXCircle
                                                                        size={
                                                                            14
                                                                        }
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
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-green-500"
                                                                    />
                                                                ) : (
                                                                    <LucideXCircle
                                                                        size={
                                                                            14
                                                                        }
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
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-green-500"
                                                                    />
                                                                ) : (
                                                                    <LucideXCircle
                                                                        size={
                                                                            14
                                                                        }
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
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-green-500"
                                                                    />
                                                                ) : (
                                                                    <LucideXCircle
                                                                        size={
                                                                            14
                                                                        }
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
                                                        className={`w-full rounded-xl border py-3 pr-12 pl-10 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#C9A84C] ${
                                                            focusedField ===
                                                            'password_confirmation'
                                                                ? 'border-[#C9A84C]'
                                                                : 'border-gray-300'
                                                        } ${errors.password_confirmation ? 'border-red-500' : ''}`}
                                                        placeholder={t(
                                                            'confirm_password',
                                                        )}
                                                        id="password_confirmation"
                                                        value={
                                                            data.password_confirmation
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'password_confirmation',
                                                                e.target.value,
                                                            )
                                                        }
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
                                                            handleShowConfirmPassword(
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
                                                            ? t(
                                                                  errors.password_confirmation,
                                                              )
                                                            : undefined
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-start">
                                                    <input
                                                        id="terms"
                                                        type="checkbox"
                                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                                                        checked={agreedToTerms}
                                                        onChange={(e) =>
                                                            setAgreedToTerms(
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                    />
                                                    <div className="ml-2 text-sm text-gray-700">
                                                        <label
                                                            htmlFor="terms"
                                                            className="font-medium"
                                                        >
                                                            {t(
                                                                'i_agree_to_the',
                                                            )}{' '}
                                                            <Link
                                                                href="#"
                                                                className="text-[#C9A84C] hover:text-[#A8882E]"
                                                            >
                                                                {t(
                                                                    'terms_of_service',
                                                                )}
                                                            </Link>{' '}
                                                            {t('and')}{' '}
                                                            <Link
                                                                href="#"
                                                                className="text-[#C9A84C] hover:text-[#A8882E]"
                                                            >
                                                                {t(
                                                                    'privacy_policy',
                                                                )}
                                                            </Link>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        processing ||
                                                        !agreedToTerms
                                                    }
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#A8882E] px-4 py-3 font-medium text-white transition-all duration-300 hover:from-[#A8882E] hover:to-[#8A6E22] focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <svg
                                                                className="mr-2 -ml-1 h-5 w-5 animate-spin text-white"
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
                                                            {t(
                                                                'creating_account',
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {t(
                                                                'create_account',
                                                            )}
                                                            <LucideArrowRight
                                                                size={18}
                                                            />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-4">
                                            <button
                                                onClick={() =>
                                                    handleSocialRegister(
                                                        'google',
                                                    )
                                                }
                                                disabled={
                                                    socialLoading !== null
                                                }
                                                className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                            >
                                                {socialLoading === 'google' ? (
                                                    <>
                                                        <svg
                                                            className="mr-2 -ml-1 h-5 w-5 animate-spin text-gray-700"
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
                                                        {t('connecting')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg
                                                            className="h-5 w-5"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                fill="#4285F4"
                                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                            />
                                                            <path
                                                                fill="#34A853"
                                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                            />
                                                            <path
                                                                fill="#FBBC05"
                                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                            />
                                                            <path
                                                                fill="#EA4335"
                                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                            />
                                                        </svg>
                                                        {t(
                                                            'register_with_google',
                                                        )}
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleSocialRegister(
                                                        'facebook',
                                                    )
                                                }
                                                disabled={
                                                    socialLoading !== null
                                                }
                                                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#1877F2] px-4 py-3 font-medium text-white transition-all duration-300 hover:bg-[#166FE5] focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                            >
                                                {socialLoading ===
                                                'facebook' ? (
                                                    <>
                                                        <svg
                                                            className="mr-2 -ml-1 h-5 w-5 animate-spin text-white"
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
                                                        {t('connecting')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg
                                                            className="h-5 w-5"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                        </svg>
                                                        {t(
                                                            'register_with_facebook',
                                                        )}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}

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
                                            <p className="text-sm text-gray-600">
                                                {t('already_have_an_account')}{' '}
                                                <Link
                                                    href={route('login')}
                                                    className="font-medium text-orange-600 hover:text-orange-500"
                                                >
                                                    {t('sign_in')}
                                                </Link>
                                            </p>
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
