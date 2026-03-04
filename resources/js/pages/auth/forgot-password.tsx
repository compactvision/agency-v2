import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import ErrorText from '@/components/ui/ErrorText';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    LucideAlertCircle,
    LucideArrowLeft,
    LucideCheckCircle,
    LucideClock,
    LucideInbox,
    LucideLock,
    LucideMail,
    LucideMailOpen,
    LucideRefreshCw,
    LucideSend,
    LucideShield,
} from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword({ status }: { status?: string }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm<{
        email: string;
    }>({
        email: '',
    });
    const [focusedField, setFocusedField] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [canResend, setCanResend] = useState(true);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'), {
            onSuccess: () => {
                setEmailSent(true);
                setCanResend(false);
                setCountdown(60);
                reset('email');
            },
            onError: () => {
                setEmailSent(false);
            },
        });
    };

    const handleResend = () => {
        if (canResend) {
            submit(new Event('submit') as any);
        }
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <App>
            <Head title="Forgot Password" />
            <Breadcumb title={t('forgot_password')} homeLink={route('home')} />

            <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
                <div className="w-full max-w-6xl">
                    <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left Side - Visual */}
                            <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-8 lg:p-12">
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-white/10"></div>
                                <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-48 w-48 rounded-full bg-white/10"></div>

                                <div className="relative z-10">
                                    <div className="mb-8">
                                        <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
                                            {t('password_reset')}
                                        </h1>
                                        <p className="max-w-md text-xl text-white/90">
                                            {t('password_reset_subtitle')}
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                                <LucideMail
                                                    size={24}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {t('email_delivery')}
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    {t('email_delivery_desc')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                                <LucideClock
                                                    size={24}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {t('quick_reset')}
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    {t('quick_reset_desc')}
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
                                                    {t('secure_process')}
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    {t('secure_process_desc')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 mt-8">
                                    <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                                                <LucideInbox
                                                    size={32}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="mb-1 text-xl font-bold text-white">
                                                    {t('check_your_email')}
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    {t('check_spam_folder')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="p-8 lg:p-12">
                                <div className="mx-auto w-full max-w-md">
                                    {!emailSent ? (
                                        <>
                                            <div className="mb-8">
                                                <div className="mb-4 flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                                        <LucideLock
                                                            size={24}
                                                            className="text-blue-600"
                                                        />
                                                    </div>
                                                    <h2 className="text-3xl font-bold text-gray-900">
                                                        {t('forgot_password')}
                                                    </h2>
                                                </div>
                                                <p className="text-gray-600">
                                                    {t('forgot_password_desc')}
                                                </p>
                                            </div>

                                            {status && (
                                                <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                                                    <LucideCheckCircle
                                                        size={20}
                                                        className="text-green-600"
                                                    />
                                                    <p className="text-sm text-green-800">
                                                        {status}
                                                    </p>
                                                </div>
                                            )}

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
                                                            autoComplete="off"
                                                            autoFocus
                                                            className={`w-full rounded-xl border py-3 pr-3 pl-10 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                                                                focusedField ===
                                                                'email'
                                                                    ? 'border-blue-500'
                                                                    : 'border-gray-300'
                                                            } ${errors.email ? 'border-red-500' : ''}`}
                                                            placeholder={t(
                                                                'enter_email',
                                                            )}
                                                            value={data.email}
                                                            onChange={(e) =>
                                                                setData(
                                                                    'email',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onFocus={() =>
                                                                setFocusedField(
                                                                    'email',
                                                                )
                                                            }
                                                            onBlur={() =>
                                                                setFocusedField(
                                                                    '',
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <ErrorText
                                                        error={
                                                            errors.email
                                                                ? t(
                                                                      errors.email,
                                                                  )
                                                                : undefined
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
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
                                                                {t('sending')}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <LucideSend
                                                                    size={18}
                                                                />
                                                                {t(
                                                                    'send_reset_link',
                                                                )}
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <div className="mb-8">
                                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                                                    <LucideMailOpen
                                                        size={40}
                                                        className="text-green-600"
                                                    />
                                                </div>
                                                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                                                    {t('email_sent')}
                                                </h2>
                                                <p className="mb-2 text-gray-600">
                                                    {t('reset_link_sent')}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {t(
                                                        'check_email_instructions',
                                                    )}
                                                </p>
                                            </div>

                                            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                                                <div className="flex items-center gap-3">
                                                    <LucideAlertCircle
                                                        size={20}
                                                        className="text-blue-600"
                                                    />
                                                    <div className="text-left">
                                                        <p className="text-sm font-medium text-blue-800">
                                                            {t(
                                                                'didnt_receive_email',
                                                            )}
                                                        </p>
                                                        <p className="mt-1 text-xs text-blue-700">
                                                            {t(
                                                                'check_spam_promotions',
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <button
                                                    onClick={handleResend}
                                                    disabled={!canResend}
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                                >
                                                    {canResend ? (
                                                        <>
                                                            <LucideRefreshCw
                                                                size={18}
                                                            />
                                                            {t('resend_email')}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <LucideClock
                                                                size={18}
                                                            />
                                                            {t('resend_in')}{' '}
                                                            {countdown}s
                                                        </>
                                                    )}
                                                </button>
                                            </div>
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
                                            <Link
                                                href={route('login')}
                                                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-500"
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
