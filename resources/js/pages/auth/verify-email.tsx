import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    LucideMail,
    LucideMailOpen,
    LucideCheckCircle,
    LucideAlertCircle,
    LucideSend,
    LucideClock,
    LucideLogOut,
    LucideInbox,
    LucideShield,
    LucideZap,
} from 'lucide-react';

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
            
            <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left Side - Visual */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700 p-8 lg:p-12 flex flex-col justify-between">
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                                
                                <div className="relative z-10">
                                    <div className="mb-8">
                                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                                            {t('verify_your_email')}
                                        </h1>
                                        <p className="text-xl text-white/90 max-w-md">
                                            {t('verify_email_subtitle')}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                <LucideMail size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{t('email_verification')}</h3>
                                                <p className="text-white/80 text-sm">{t('email_verification_desc')}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                <LucideShield size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{t('account_security')}</h3>
                                                <p className="text-white/80 text-sm">{t('account_security_desc')}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                <LucideZap size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{t('quick_access')}</h3>
                                                <p className="text-white/80 text-sm">{t('quick_access_desc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="relative z-10 mt-8">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                                <LucideInbox size={32} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{t('check_your_inbox')}</h3>
                                                <p className="text-white/80 text-sm">{t('check_spam_folder')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Side - Form */}
                            <div className="p-8 lg:p-12">
                                <div className="max-w-md mx-auto w-full">
                                    <div className="mb-8 text-center">
                                        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <LucideMailOpen size={40} className="text-teal-600" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                            {t('verify_your_email')}
                                        </h2>
                                        <p className="text-gray-600">
                                            {t('verify_email_instruction')}
                                        </p>
                                    </div>
                                    
                                    {localStatus === 'verification-link-sent' && (
                                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                                            <LucideCheckCircle size={20} className="text-green-600" />
                                            <div>
                                                <p className="text-green-800 font-medium text-sm">{t('verification_link_sent')}</p>
                                                <p className="text-green-700 text-xs mt-1">{t('check_email_instructions')}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                                        <div className="flex items-start gap-3">
                                            <LucideAlertCircle size={20} className="text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="text-blue-800 font-medium text-sm">{t('didnt_receive_email')}</p>
                                                <p className="text-blue-700 text-xs mt-1">{t('check_spam_promotions')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <form onSubmit={submit} className="space-y-6">
                                        <div>
                                            <button
                                                type="submit"
                                                disabled={processing || !canResend}
                                                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium py-3 px-4 rounded-xl hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 disabled:opacity-50"
                                            >
                                                {processing ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        {t('sending')}
                                                    </>
                                                ) : (
                                                    <>
                                                        {canResend ? (
                                                            <>
                                                                <LucideSend size={18} />
                                                                {t('resend_verification_email')}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <LucideClock size={18} />
                                                                {t('resend_in')} {countdown}s
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
                                                <span className="px-2 bg-white text-gray-500">{t('or')}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 text-center">
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
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