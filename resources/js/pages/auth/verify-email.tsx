import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    LucideAlertCircle,
    LucideCheckCircle,
    LucideClock,
    LucideInbox,
    LucideLogOut,
    LucideMail,
    LucideMailOpen,
    LucideSend,
    LucideShield,
    LucideZap,
} from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});
    const { t } = useTranslation();
    const [localStatus, setLocalStatus] = useState<string | undefined>(status);
    const [countdown, setCountdown] = useState(0);
    const [canResend, setCanResend] = useState(true);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'), {
            preserveScroll: true,
            onSuccess: () => {
                setLocalStatus('verification-link-sent');
                setCanResend(false);
                setCountdown(60);
            },
        });
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
            <Head title="Verify Email" />
            <Breadcumb title={t('verify_email')} homeLink={route('home')} />

            <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
                <div className="w-full max-w-6xl">
                    <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left Side - Visual */}
                            <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700 p-8 lg:p-12">
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-white/10"></div>
                                <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-48 w-48 rounded-full bg-white/10"></div>

                                <div className="relative z-10">
                                    <div className="mb-8">
                                        <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
                                            {t('verify_your_email')}
                                        </h1>
                                        <p className="max-w-md text-xl text-white/90">
                                            {t('verify_email_subtitle')}
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
                                                    {t('email_verification')}
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    {t(
                                                        'email_verification_desc',
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
                                                    {t('account_security')}
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    {t('account_security_desc')}
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
                                                    {t('check_your_inbox')}
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
                                    <div className="mb-8 text-center">
                                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
                                            <LucideMailOpen
                                                size={40}
                                                className="text-teal-600"
                                            />
                                        </div>
                                        <h2 className="mb-4 text-3xl font-bold text-gray-900">
                                            {t('verify_your_email')}
                                        </h2>
                                        <p className="text-gray-600">
                                            {t('verify_email_instruction')}
                                        </p>
                                    </div>

                                    {localStatus ===
                                        'verification-link-sent' && (
                                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                                            <LucideCheckCircle
                                                size={20}
                                                className="text-green-600"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-green-800">
                                                    {t(
                                                        'verification_link_sent',
                                                    )}
                                                </p>
                                                <p className="mt-1 text-xs text-green-700">
                                                    {t(
                                                        'check_email_instructions',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <LucideAlertCircle
                                                size={20}
                                                className="mt-0.5 text-blue-600"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-blue-800">
                                                    {t('didnt_receive_email')}
                                                </p>
                                                <p className="mt-1 text-xs text-blue-700">
                                                    {t('check_spam_promotions')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={submit}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <button
                                                type="submit"
                                                disabled={
                                                    processing || !canResend
                                                }
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:from-teal-600 hover:to-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
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
                                                        {canResend ? (
                                                            <>
                                                                <LucideSend
                                                                    size={18}
                                                                />
                                                                {t(
                                                                    'resend_verification_email',
                                                                )}
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
                                                href={route('logout')}
                                                method="post"
                                                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                                            >
                                                <LucideLogOut size={16} />
                                                {t('logout')}
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
