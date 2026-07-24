import { Head, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle,
    CreditCard,
    Download,
    Home,
    Receipt,
    Share2,
    Shield,
    Sparkles,
    Zap,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
}

type ParticleStyle = CSSProperties & {
    '--vx': string;
    '--vy': string;
    '--size': string;
};

export default function PaymentSuccess() {
    const { t, i18n } = useTranslation();
    const { props } = usePage();
    const { payment, order } = props as any;

    const [showDetails, setShowDetails] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showBoom, setShowBoom] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        setIsLoaded(true);
        setTimeout(() => setShowBoom(true), 300);

        // Generate explosion particles
        const newParticles = [...Array(20)].map((_, i) => ({
            id: i,
            x: 50,
            y: 50,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            size: Math.random() * 4 + 2,
            opacity: 1,
            color: ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][
                Math.floor(Math.random() * 4)
            ],
        }));
        setParticles(newParticles);
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(
            i18n.resolvedLanguage === 'fr' ? 'fr-FR' : 'en-US',
            {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            },
        );
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat(
            i18n.resolvedLanguage === 'fr' ? 'fr-FR' : 'en-US',
            {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
            },
        ).format(amount);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const sharePayment = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: t('share_payment_title'),
                    text: t('share_payment_text', {
                        amount: formatPrice(payment?.amount || 0),
                    }),
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        }
    };

    return (
        <>
            <Head title={t('payment_successful')} />

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5"></div>

                {/* Explosion Particles */}
                {showBoom && (
                    <div className="pointer-events-none absolute inset-0 z-50">
                        {particles.map((particle) => (
                            <div
                                key={particle.id}
                                className="absolute h-2 w-2 rounded-full"
                                style={
                                    {
                                        backgroundColor: particle.color,
                                        left: '50%',
                                        top: '50%',
                                        transform: `translate(-50%, -50%)`,
                                        animation: `explode 1.5s ease-out forwards`,
                                        '--vx': `${particle.vx}rem`,
                                        '--vy': `${particle.vy}rem`,
                                        '--size': `${particle.size}px`,
                                    } as ParticleStyle
                                }
                            />
                        ))}
                    </div>
                )}

                {/* Main Content */}
                <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                    <div className="mx-auto max-w-4xl">
                        {/* Success Card */}
                        <div
                            className={`transform rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-1000 sm:p-12 lg:p-16 ${isLoaded ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'}`}
                        >
                            {/* Success Icon with Boom Animation */}
                            <div className="mb-8 flex justify-center">
                                <div
                                    className={`relative ${showBoom ? 'animate-bounce-in' : ''}`}
                                >
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl">
                                        <CheckCircle
                                            size={48}
                                            className="text-white"
                                        />
                                    </div>
                                    {showBoom && (
                                        <div className="absolute inset-0 h-24 w-24 animate-ping rounded-full bg-emerald-400 opacity-30"></div>
                                    )}
                                    <Sparkles
                                        className="absolute -top-4 -right-4 h-8 w-8 animate-spin text-emerald-400"
                                        size={32}
                                    />
                                </div>
                            </div>

                            {/* Success Message */}
                            <div className="mb-8 text-center">
                                <h1
                                    className={`mb-4 text-5xl font-bold text-slate-900 sm:text-6xl lg:text-7xl ${showBoom ? 'animate-slide-up' : ''}`}
                                >
                                    {t('payment_successful')}
                                </h1>
                                <p
                                    className={`mx-auto max-w-2xl text-xl text-slate-600 ${showBoom ? 'animate-slide-up animation-delay-200' : ''}`}
                                >
                                    {t('payment_processed_successfully')}
                                </p>
                            </div>

                            {/* Amount Display */}
                            <div
                                className={`mb-8 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-8 ${showBoom ? 'animate-scale-in animation-delay-400' : ''}`}
                            >
                                <div className="text-center">
                                    <p className="mb-2 text-sm font-medium tracking-wider text-emerald-700 uppercase">
                                        {t('amount_paid')}
                                    </p>
                                    <p className="text-5xl font-bold text-slate-900 lg:text-6xl">
                                        {formatPrice(payment?.amount || 29.99)}
                                    </p>
                                    <div className="mt-4 flex items-center justify-center gap-2">
                                        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                                        <span className="text-sm text-emerald-600">
                                            {t('secure_transaction')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="mb-8">
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-4 transition-colors duration-200 hover:bg-slate-100"
                                >
                                    <span className="font-semibold text-slate-800">
                                        {t('transaction_details')}
                                    </span>
                                    <ArrowRight
                                        className={`text-slate-600 transition-transform duration-200 ${showDetails ? 'rotate-90' : ''}`}
                                        size={20}
                                    />
                                </button>

                                {showDetails && (
                                    <div className="animate-fade-in mt-4 space-y-4 rounded-xl bg-slate-50 p-6">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">
                                                {t('reference')}
                                            </span>
                                            <span className="font-mono text-slate-900">
                                                {payment?.reference || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">
                                                {t('date')}
                                            </span>
                                            <span className="text-slate-900">
                                                {formatDate(
                                                    payment?.created_at ||
                                                        new Date(),
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">
                                                {t('payment_method_label')}
                                            </span>
                                            <span className="text-slate-900">
                                                {payment?.method || 'RdCard'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">
                                                {t('status')}
                                            </span>
                                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                                                <CheckCircle
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {t('completed')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <button
                                    onClick={() =>
                                        (window.location.href =
                                            route('dashboard'))
                                    }
                                    className="flex transform items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-slate-800 hover:shadow-lg"
                                >
                                    <Home size={18} />
                                    <span>{t('dashboard')}</span>
                                </button>

                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            payment?.reference || '',
                                        )
                                    }
                                    className="flex transform items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                    <Receipt size={18} />
                                    <span>
                                        {copied ? t('copied_short') : t('copy')}
                                    </span>
                                </button>

                                <button
                                    onClick={sharePayment}
                                    className="flex transform items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <Share2 size={18} />
                                    <span>{t('share')}</span>
                                </button>

                                <button
                                    onClick={() => window.print()}
                                    className="flex transform items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700"
                                >
                                    <Download size={18} />
                                    <span>{t('download')}</span>
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="text-center">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                                        <Shield
                                            size={32}
                                            className="text-slate-600"
                                        />
                                    </div>
                                    <h4 className="mb-1 font-semibold text-slate-900">
                                        {t('secure')}
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        {t('secure_payment_description')}
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                                        <CreditCard
                                            size={32}
                                            className="text-slate-600"
                                        />
                                    </div>
                                    <h4 className="mb-1 font-semibold text-slate-900">
                                        {t('fast')}
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        {t('instant_transaction')}
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                                        <Zap
                                            size={32}
                                            className="text-slate-600"
                                        />
                                    </div>
                                    <h4 className="mb-1 font-semibold text-slate-900">
                                        {t('efficient')}
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        {t('optimized_process')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes bounce-in {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.1); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                @keyframes slide-up {
                    0% { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes scale-in {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                
                @keyframes explode {
                    0% { 
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% { 
                        transform: translate(calc(-50% + var(--vx)), calc(-50% + var(--vy))) scale(var(--size));
                        opacity: 0;
                    }
                }
                
                .animate-bounce-in {
                    animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }
                
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out;
                }
                
                .animate-scale-in {
                    animation: scale-in 0.5s ease-out;
                }
                
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
            `}</style>
        </>
    );
}
