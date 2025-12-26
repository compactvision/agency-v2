import ErrorText from '@/components/ui/ErrorText';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    Lock,
    Shield,
    Key,
    RefreshCw,
    X,
    Loader2,
    Check,
    XCircle,
    AlertTriangle,
    Info,
} from 'lucide-react';

interface PageProps {
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
            const special = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.password);
            
            setPasswordCriteria({ length, uppercase, lowercase, number, special });
            
            // Calculer la force du mot de passe (0-5)
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
    }, [passwordData.password]);

    useEffect(() => {
        if (passwordData.password && passwordData.password_confirmation) {
            setPasswordsMatch(passwordData.password === passwordData.password_confirmation);
        } else {
            setPasswordsMatch(false);
        }
    }, [passwordData.password, passwordData.password_confirmation]);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putPassword(route('password.update'), {
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
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-slide-down">
                    <CheckCircle size={20} className="text-green-600" />
                    <div>
                        <p className="text-green-800 font-medium">{flash?.success || t('password_updated_success')}</p>
                        <p className="text-green-700 text-sm">{t('password_updated_description')}</p>
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
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-slide-down">
                    <AlertCircle size={20} className="text-red-600" />
                    <div>
                        <p className="text-red-800 font-medium">{flash.error}</p>
                        <p className="text-red-700 text-sm">{t('password_update_error')}</p>
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
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Lock size={24} />
                        {t('change_password')}
                    </h3>
                    <p className="text-white/90 mt-2">
                        {t('change_password_description')}
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        {/* Champ mot de passe actuel */}
                        <div>
                            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('current_password')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    id="current_password"
                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                                        passwordErrors.current_password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    value={passwordData.current_password}
                                    onChange={(e) => setPasswordData('current_password', e.target.value)}
                                    placeholder={t('enter_current_password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            <ErrorText error={passwordErrors.current_password} />
                        </div>

                        {/* Champ nouveau mot de passe */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('new_password')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    id="password"
                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                                        passwordErrors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData('password', e.target.value)}
                                    placeholder={t('enter_new_password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showNewPassword ? (
                                        <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            <ErrorText error={passwordErrors.password} />
                            
                            {/* Indicateur de force du mot de passe */}
                            {passwordData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-500">{t('password_strength')}</span>
                                        <span className={`text-xs font-medium ${
                                            passwordStrength <= 2 ? 'text-red-500' : 
                                            passwordStrength === 3 ? 'text-yellow-500' : 
                                            passwordStrength === 4 ? 'text-blue-500' : 'text-green-500'
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
                                    
                                    {/* Critères du mot de passe */}
                                    <div className="mt-2 space-y-1">
                                        <div className="flex items-center gap-2">
                                            {passwordCriteria.length ? (
                                                <CheckCircle size={14} className="text-green-500" />
                                            ) : (
                                                <XCircle size={14} className="text-gray-400" />
                                            )}
                                            <span className={`text-xs ${passwordCriteria.length ? 'text-green-700' : 'text-gray-500'}`}>
                                                {t('at_least_8_characters')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {passwordCriteria.uppercase ? (
                                                <CheckCircle size={14} className="text-green-500" />
                                            ) : (
                                                <XCircle size={14} className="text-gray-400" />
                                            )}
                                            <span className={`text-xs ${passwordCriteria.uppercase ? 'text-green-700' : 'text-gray-500'}`}>
                                                {t('one_uppercase_letter')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {passwordCriteria.lowercase ? (
                                                <CheckCircle size={14} className="text-green-500" />
                                            ) : (
                                                <XCircle size={14} className="text-gray-400" />
                                            )}
                                            <span className={`text-xs ${passwordCriteria.lowercase ? 'text-green-700' : 'text-gray-500'}`}>
                                                {t('one_lowercase_letter')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {passwordCriteria.number ? (
                                                <CheckCircle size={14} className="text-green-500" />
                                            ) : (
                                                <XCircle size={14} className="text-gray-400" />
                                            )}
                                            <span className={`text-xs ${passwordCriteria.number ? 'text-green-700' : 'text-gray-500'}`}>
                                                {t('one_number')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {passwordCriteria.special ? (
                                                <CheckCircle size={14} className="text-green-500" />
                                            ) : (
                                                <XCircle size={14} className="text-gray-400" />
                                            )}
                                            <span className={`text-xs ${passwordCriteria.special ? 'text-green-700' : 'text-gray-500'}`}>
                                                {t('one_special_character')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Champ confirmation mot de passe */}
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('confirm_password')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="password_confirmation"
                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                                        passwordErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    value={passwordData.password_confirmation}
                                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                    placeholder={t('confirm_new_password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            <ErrorText error={passwordErrors.password_confirmation} />
                            
                            {/* Indicateur de correspondance */}
                            {passwordData.password_confirmation && (
                                <div className="mt-2 flex items-center gap-2">
                                    {passwordsMatch ? (
                                        <>
                                            <CheckCircle size={14} className="text-green-500" />
                                            <span className="text-xs text-green-700">{t('passwords_match')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={14} className="text-red-500" />
                                            <span className="text-xs text-red-700">{t('passwords_do_not_match')}</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bouton de soumission */}
                        <div>
                            <button
                                type="submit"
                                disabled={processingPassword || !passwordsMatch || passwordStrength < 3}
                                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 disabled:opacity-50"
                            >
                                {processingPassword ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                                        {t('updating_password')}
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw size={18} />
                                        {t('update_password')}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Conseils de sécurité */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <Info size={20} className="text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="text-blue-800 font-medium mb-2">{t('password_security_tips')}</h4>
                        <ul className="text-blue-700 text-sm space-y-1">
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