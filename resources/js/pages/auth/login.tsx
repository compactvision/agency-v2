import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import ErrorText from '@/components/ui/ErrorText';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    LucideEye,
    LucideEyeOff,
    LucideMail,
    LucideLock,
    LucideArrowRight,
    LucideShield,
    LucideZap,
    LucideSmartphone,
    LucideCheck,
} from 'lucide-react';
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
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [loginMethod, setLoginMethod] = useState<'email' | 'social'>('email');
    const [socialLoading, setSocialLoading] = useState<string | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const currentUrl = window.location.href;

        post(route('login'), {
            onSuccess: (page) => {
                if (page.props.redirectUrl) {
                    router.visit(page.props.redirectUrl);
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
        // Simuler une connexion sociale
        setTimeout(() => {
            setSocialLoading(null);
            // Ici, vous redirigeriez vers le provider OAuth
            window.location.href = `/auth/${provider}`;
        }, 1000);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <App>
            <Head title="Login" />
            <Breadcumb title={t('login')} homeLink={route('home')} />
            
            <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left Side - Visual */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-8 lg:p-12 flex flex-col justify-between">
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                                
                                <div className="relative z-10">
                                    <div className="mb-8">
                                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                                            {t('welcome_back')}
                                        </h1>
                                        <p className="text-xl text-white/90 max-w-md">
                                            {t('login_subtitle')}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                <LucideShield size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{t('secure_login')}</h3>
                                                <p className="text-white/80 text-sm">{t('secure_login_desc')}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                <LucideZap size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{t('fast_access')}</h3>
                                                <p className="text-white/80 text-sm">{t('fast_access_desc')}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                <LucideSmartphone size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{t('all_devices')}</h3>
                                                <p className="text-white/80 text-sm">{t('all_devices_desc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="relative z-10 mt-8">
                                    <img src="/assets/images/thumbs/login.svg" alt="login-img" className="w-full max-w-md mx-auto" />
                                </div>
                            </div>
                            
                            {/* Right Side - Form */}
                            <div className="p-8 lg:p-12">
                                <div className="max-w-md mx-auto w-full">
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                            {t('login_to_theagencydrc')}
                                        </h2>
                                        <p className="text-gray-600">
                                            {t('login_to_access_account')}
                                        </p>
                                    </div>
                                    
                                    {status && (
                                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                                            <LucideCheck size={20} className="text-green-600" />
                                            <p className="text-green-800 text-sm">{status}</p>
                                        </div>
                                    )}
                                    
                                    {/* Login Method Toggle */}
                                    <div className="mb-8">
                                        <div className="flex bg-gray-100 rounded-xl p-1">
                                            <button
                                                onClick={() => setLoginMethod('email')}
                                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                                                    loginMethod === 'email'
                                                        ? 'bg-white text-orange-600 shadow-sm'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                {t('email_login')}
                                            </button>
                                            <button
                                                onClick={() => setLoginMethod('social')}
                                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                                                    loginMethod === 'social'
                                                        ? 'bg-white text-orange-600 shadow-sm'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                {t('social_login')}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {loginMethod === 'email' ? (
                                        <form onSubmit={submit} className="space-y-6">
                                            <div>
                                                <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-2">
                                                    {t('email_address')}
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <LucideMail size={20} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                                                            focusedField === 'email' ? 'border-orange-500' : 'border-gray-300'
                                                        } ${errors.email ? 'border-red-500' : ''}`}
                                                        placeholder={t('enter_email')}
                                                        id="Email"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        onFocus={() => setFocusedField('email')}
                                                        onBlur={() => setFocusedField('')}
                                                    />
                                                </div>
                                                <ErrorText error={errors.email} />
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="your-password" className="block text-sm font-medium text-gray-700 mb-2">
                                                    {t('password')}
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <LucideLock size={20} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                                                            focusedField === 'password' ? 'border-orange-500' : 'border-gray-300'
                                                        } ${errors.password ? 'border-red-500' : ''}`}
                                                        placeholder={t('enter_password')}
                                                        id="your-password"
                                                        value={data.password}
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        onFocus={() => setFocusedField('password')}
                                                        onBlur={() => setFocusedField('')}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    >
                                                        {showPassword ? (
                                                            <LucideEyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                                                        ) : (
                                                            <LucideEye size={20} className="text-gray-400 hover:text-gray-600" />
                                                        )}
                                                    </button>
                                                </div>
                                                <ErrorText error={errors.password} />
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <input
                                                        id="remember"
                                                        type="checkbox"
                                                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                                        checked={data.remember}
                                                        onChange={(e) => setData('remember', e.target.checked)}
                                                    />
                                                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                                        {t('remember_me')}
                                                    </label>
                                                </div>
                                                <Link
                                                    href=""
                                                    className="text-sm font-medium text-orange-600 hover:text-orange-500"
                                                >
                                                    {t('forgot_password')}
                                                </Link>
                                            </div>
                                            
                                            <div>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 disabled:opacity-50"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                                    ) : (
                                        <div className="space-y-4">
                                            <button
                                                onClick={() => handleSocialLogin('google')}
                                                disabled={socialLoading !== null}
                                                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 disabled:opacity-50"
                                            >
                                                {socialLoading === 'google' ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        {t('connecting')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                                        </svg>
                                                        {t('continue_with_google')}
                                                    </>
                                                )}
                                            </button>
                                            
                                            <button
                                                onClick={() => handleSocialLogin('facebook')}
                                                disabled={socialLoading !== null}
                                                className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-medium py-3 px-4 rounded-xl hover:bg-[#166FE5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2] transition-all duration-300 disabled:opacity-50"
                                            >
                                                {socialLoading === 'facebook' ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        {t('connecting')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                        </svg>
                                                        {t('continue_with_facebook')}
                                                    </>
                                                )}
                                            </button>
                                            
                                            {canResetPassword && (
                                                <div className="mt-6 text-center">
                                                    <Link
                                                        href={route('forgot.password')}
                                                        className="text-sm font-medium text-orange-600 hover:text-orange-500"
                                                    >
                                                        {t('forgot_password')}
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
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
                                            <p className="text-sm text-gray-600">
                                                {t('dont_have_an_account')}{' '}
                                                <Link
                                                    href={route('register')}
                                                    className="font-medium text-orange-600 hover:text-orange-500"
                                                >
                                                    {t('sign_up')}
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