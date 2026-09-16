import App from '@/components/layouts/Home/App';
import ErrorText from '@/components/ui/ErrorText';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    LucideArrowRight,
    LucideCheck,
    LucideEye,
    LucideEyeOff,
    LucideLock,
    LucideMail,
} from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } =
        useForm<LoginForm>({
            email: '',
            password: '',
            remember: false,
        });
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [socialLoading, setSocialLoading] = useState<string | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const currentUrl = window.location.href;

        post(route('login'), {
            onSuccess: (page) => {
                if (page.props.redirectUrl) {
                    router.visit(page.props.redirectUrl as string);
                }
            },
            onFinish: () => {
                if (window.location.href !== currentUrl) {
                    window.scrollTo(0, 0);
                }
                reset('password');
            },
            preserveScroll: true,
        });
    };

    const handleShowPassword = (show: boolean) => {
        setShowPassword(show);
    };

    const handleSocialLogin = (provider: string) => {
        setSocialLoading(provider);
        window.location.href = `/auth/${provider}`;
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <App>
            <Head title={t('login')} />
            <section className="bg-gradient-to-b from-slate-100/80 to-white px-4 pt-28 pb-12 sm:pt-32 sm:pb-16">
                <div className="mx-auto w-full max-w-[460px]">
                    <nav
                        aria-label={t('breadcrumb', 'Fil d’Ariane')}
                        className="mb-5 flex items-center justify-center gap-2 text-xs text-gray-500"
                    >
                        <Link
                            href={route('home')}
                            className="transition-colors hover:text-gray-900"
                        >
                            {t('home')}
                        </Link>
                        <span aria-hidden="true">/</span>
                        <span aria-current="page" className="text-gray-700">
                            {t('login')}
                        </span>
                    </nav>
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 text-gray-900 shadow-xl shadow-slate-900/5 sm:p-7">
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A84C]/15 text-[#927321]">
                                <LucideLock size={20} aria-hidden="true" />
                            </div>
                            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                                {t('welcome_back')}
                            </h1>
                            <p className="text-sm leading-relaxed text-gray-500">
                                {t('login_to_access_account')}
                            </p>
                        </div>
                        {status && (
                            <div
                                role="status"
                                className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800"
                            >
                                <LucideCheck size={18} />
                                {status}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleSocialLogin('google')}
                                disabled={socialLoading !== null}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
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
                                        Google
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => handleSocialLogin('facebook')}
                                disabled={socialLoading !== null}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                            >
                                {socialLoading === 'facebook' ? (
                                    <>
                                        <svg
                                            className="mr-2 -ml-1 h-5 w-5 animate-spin text-current"
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
                                            className="h-5 w-5 text-[#1877F2]"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        Facebook
                                    </>
                                )}
                            </button>

                            {canResetPassword && (
                                <div className="mt-6 text-center">
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-[#C9A84C] hover:text-[#A8882E]"
                                    >
                                        {t('forgot_password')}
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
                            <span className="h-px flex-1 bg-gray-200" />
                            <span>{t('or')}</span>
                            <span className="h-px flex-1 bg-gray-200" />
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="Email"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"
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
                                        className={`w-full rounded-xl border bg-white py-2.5 pr-3 pl-10 text-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#C9A84C] ${
                                            focusedField === 'email'
                                                ? 'border-[#C9A84C]'
                                                : 'border-gray-300'
                                        } ${errors.email ? 'border-red-500' : ''}`}
                                        placeholder={t('enter_email')}
                                        id="Email"
                                        name="email"
                                        autoComplete="email"
                                        required
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField('')}
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
                                    htmlFor="your-password"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"
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
                                            showPassword ? 'text' : 'password'
                                        }
                                        className={`w-full rounded-xl border bg-white py-2.5 pr-12 pl-10 text-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#C9A84C] ${
                                            focusedField === 'password'
                                                ? 'border-[#C9A84C]'
                                                : 'border-gray-300'
                                        } ${errors.password ? 'border-red-500' : ''}`}
                                        placeholder={t('enter_password')}
                                        id="your-password"
                                        name="password"
                                        autoComplete="current-password"
                                        required
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        onFocus={() =>
                                            setFocusedField('password')
                                        }
                                        onBlur={() => setFocusedField('')}
                                    />
                                    <button
                                        type="button"
                                        aria-label={t('password')}
                                        aria-pressed={showPassword}
                                        onClick={() =>
                                            handleShowPassword(!showPassword)
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
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                'remember',
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        {t('remember_me')}
                                    </label>
                                </div>
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-medium text-[#C9A84C] transition-colors hover:text-[#A8882E]"
                                >
                                    {t('forgot_password')}
                                </Link>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#A8882E] px-4 py-3 font-medium text-white transition-all duration-300 hover:from-[#A8882E] hover:to-[#8A6E22] focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <svg
                                                className="mr-2 -ml-1 h-5 w-5 animate-spin text-current"
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
                                            {t('signing_in')}
                                        </>
                                    ) : (
                                        <>
                                            {t('sign_in')}
                                            <LucideArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                        <p className="mt-5 border-t border-gray-100 pt-5 text-center text-sm text-gray-500">
                            {t('dont_have_an_account')}{' '}
                            <Link
                                href={route('register')}
                                className="font-semibold text-[#927321] underline-offset-4 hover:underline"
                            >
                                {t('create_account')}
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </App>
    );
}
