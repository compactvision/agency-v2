import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, LucideLock, LucideMail, LucideEye, LucideEyeOff, LucideCheckCircle, LucideXCircle, LucideKey, LucideShield, LucideArrowLeft, LucideRefreshCw, LucideZap } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';
import Breadcumb from '@/components/ui/Breadcumb';
import ErrorText from '@/components/ui/ErrorText';
import App from '@/components/layouts/Home/App';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';

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
    const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
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
        post(route('password.store'), {
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
            
            setPasswordCriteria({ length, uppercase, lowercase, number, special });
            
            // Calculer la force du mot de passe (0-4)
            const criteriaMet = [length, uppercase, lowercase, number, special].filter(Boolean).length;
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
            
            <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left Side - Visual */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 p-8 lg:p-12 flex flex-col justify-between">
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                                
                                <div className="relative z-10">
                                    <div className="mb-8">
                                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                                            {t('create_new_password')}
                                        </h1>
                                        <p className="text-xl text-white/90 max-w-md">
                                            {t('reset_password_subtitle')}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                <LucideShield size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{t('secure_password')}</h3>
                                                <p className="text-white/80 text-sm">{t('secure_password_desc')}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                <LucideKey size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{t('unique_password')}</h3>
                                                <p className="text-white/80 text-sm">{t('unique_password_desc')}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                <LucideZap size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{t('quick_process')}</h3>
                                                <p className="text-white/80 text-sm">{t('quick_process_desc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="relative z-10 mt-8">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                                <LucideLock size={32} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{t('protect_your_account')}</h3>
                                                <p className="text-white/80 text-sm">{t('password_protection_tip')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Side - Form */}
                            <div className="p-8 lg:p-12">
                                <div className="max-w-md mx-auto w-full">
                                    <div className="mb-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                                <LucideLock size={24} className="text-purple-600" />
                                            </div>
                                            <h2 className="text-3xl font-bold text-gray-900">
                                                {t('reset_password')}
                                            </h2>
                                        </div>
                                        <p className="text-gray-600">
                                            {t('reset_password_desc')}
                                        </p>
                                    </div>
                                    
                                    <form onSubmit={submit} className="space-y-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('email_address')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <LucideMail size={20} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    autoComplete="email"
                                                    value={data.email}
                                                    readOnly
                                                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700"
                                                />
                                            </div>
                                            <ErrorText error={errors.email} />
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('new_password')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <LucideKey size={20} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="password"
                                                    name="password"
                                                    autoComplete="new-password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                                                        focusedField === 'password' ? 'border-purple-500' : 'border-gray-300'
                                                    } ${errors.password ? 'border-red-500' : ''}`}
                                                    placeholder={t('enter_new_password')}
                                                    autoFocus
                                                    onFocus={() => setFocusedField('password')}
                                                    onBlur={() => setFocusedField('')}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
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
                                            
                                            {/* Password Strength Indicator */}
                                            {data.password && (
                                                <div className="mt-2">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-gray-500">{t('password_strength')}</span>
                                                        <span className={`text-xs font-medium ${
                                                            passwordStrength <= 2 ? 'text-red-500' : 
                                                            passwordStrength === 3 ? 'text-yellow-500' : 'text-green-500'
                                                        }`}>
                                                            {getPasswordStrengthText()}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    
                                                    {/* Password Criteria */}
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            {passwordCriteria.length ? (
                                                                <LucideCheckCircle size={14} className="text-green-500" />
                                                            ) : (
                                                                <LucideXCircle size={14} className="text-gray-400" />
                                                            )}
                                                            <span className={`text-xs ${passwordCriteria.length ? 'text-green-700' : 'text-gray-500'}`}>
                                                                {t('at_least_8_characters')}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {passwordCriteria.uppercase ? (
                                                                <LucideCheckCircle size={14} className="text-green-500" />
                                                            ) : (
                                                                <LucideXCircle size={14} className="text-gray-400" />
                                                            )}
                                                            <span className={`text-xs ${passwordCriteria.uppercase ? 'text-green-700' : 'text-gray-500'}`}>
                                                                {t('one_uppercase_letter')}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {passwordCriteria.lowercase ? (
                                                                <LucideCheckCircle size={14} className="text-green-500" />
                                                            ) : (
                                                                <LucideXCircle size={14} className="text-gray-400" />
                                                            )}
                                                            <span className={`text-xs ${passwordCriteria.lowercase ? 'text-green-700' : 'text-gray-500'}`}>
                                                                {t('one_lowercase_letter')}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {passwordCriteria.number ? (
                                                                <LucideCheckCircle size={14} className="text-green-500" />
                                                            ) : (
                                                                <LucideXCircle size={14} className="text-gray-400" />
                                                            )}
                                                            <span className={`text-xs ${passwordCriteria.number ? 'text-green-700' : 'text-gray-500'}`}>
                                                                {t('one_number')}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {passwordCriteria.special ? (
                                                                <LucideCheckCircle size={14} className="text-green-500" />
                                                            ) : (
                                                                <LucideXCircle size={14} className="text-gray-400" />
                                                            )}
                                                            <span className={`text-xs ${passwordCriteria.special ? 'text-green-700' : 'text-gray-500'}`}>
                                                                {t('one_special_character')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('confirm_password')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <LucideKey size={20} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    autoComplete="new-password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                                                        focusedField === 'password_confirmation' ? 'border-purple-500' : 'border-gray-300'
                                                    } ${errors.password_confirmation ? 'border-red-500' : ''}`}
                                                    placeholder={t('confirm_new_password')}
                                                    onFocus={() => setFocusedField('password_confirmation')}
                                                    onBlur={() => setFocusedField('')}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                >
                                                    {showConfirmPassword ? (
                                                        <LucideEyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                                                    ) : (
                                                        <LucideEye size={20} className="text-gray-400 hover:text-gray-600" />
                                                    )}
                                                </button>
                                            </div>
                                            <ErrorText error={errors.password_confirmation} />
                                            
                                            {/* Password Match Indicator */}
                                            {data.password_confirmation && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    {passwordsMatch ? (
                                                        <>
                                                            <LucideCheckCircle size={14} className="text-green-500" />
                                                            <span className="text-xs text-green-700">{t('passwords_match')}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <LucideXCircle size={14} className="text-red-500" />
                                                            <span className="text-xs text-red-700">{t('passwords_do_not_match')}</span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <button
                                                type="submit"
                                                disabled={processing || !passwordsMatch || passwordStrength < 3}
                                                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50"
                                            >
                                                {processing ? (
                                                    <>
                                                        <LoaderCircle className="animate-spin" size={20} />
                                                        {t('resetting_password')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <LucideRefreshCw size={18} />
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
                                                <span className="px-2 bg-white text-gray-500">{t('or')}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 text-center">
                                            <Link
                                                href={route('login')}
                                                className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors"
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