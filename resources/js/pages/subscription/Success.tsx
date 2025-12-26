import React, { useEffect, useState, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Home, Receipt, Download, Share2, Mail, Calendar, CreditCard, Shield, ArrowRight, Zap, Sparkles } from 'lucide-react';

export default function PaymentSuccess() {
    const { props } = usePage();
    const { payment, order } = props as any;
    
    const [showDetails, setShowDetails] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showBoom, setShowBoom] = useState(false);
    const [particles, setParticles] = useState([]);

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
            color: ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 4)]
        }));
        setParticles(newParticles);
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
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
                    title: 'Paiement réussi !',
                    text: `J'ai effectué un paiement de ${formatPrice(payment?.amount || 0)} avec succès !`,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        }
    };

    return (
        <>
            <Head title="Paiement Réussi - The AgencyDRC" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5"></div>
                
                {/* Explosion Particles */}
                {showBoom && (
                    <div className="absolute inset-0 pointer-events-none z-50">
                        {particles.map((particle) => (
                            <div
                                key={particle.id}
                                className="absolute w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: particle.color,
                                    left: '50%',
                                    top: '50%',
                                    transform: `translate(-50%, -50%)`,
                                    animation: `explode 1.5s ease-out forwards`,
                                    '--vx': `${particle.vx}rem`,
                                    '--vy': `${particle.vy}rem`,
                                    '--size': `${particle.size}px`,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Main Content */}
                <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                    <div className="max-w-4xl mx-auto">
                        
                        {/* Success Card */}
                        <div className={`bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 border border-white/10 p-8 sm:p-12 lg:p-16 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
                            
                            {/* Success Icon with Boom Animation */}
                            <div className="flex justify-center mb-8">
                                <div className={`relative ${showBoom ? 'animate-bounce-in' : ''}`}>
                                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                                        <CheckCircle size={48} className="text-white" />
                                    </div>
                                    {showBoom && (
                                        <div className="absolute inset-0 w-24 h-24 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
                                    )}
                                    <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-emerald-400 animate-spin" size={32} />
                                </div>
                            </div>

                            {/* Success Message */}
                            <div className="text-center mb-8">
                                <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-4 ${showBoom ? 'animate-slide-up' : ''}`}>
                                    Paiement
                                    <span className="block text-emerald-600">Réussi</span>
                                </h1>
                                <p className={`text-xl text-slate-600 max-w-2xl mx-auto ${showBoom ? 'animate-slide-up animation-delay-200' : ''}`}>
                                    Votre paiement a été traité avec succès
                                </p>
                            </div>

                            {/* Amount Display */}
                            <div className={`bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 mb-8 border border-emerald-100 ${showBoom ? 'animate-scale-in animation-delay-400' : ''}`}>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-emerald-700 mb-2 uppercase tracking-wider">Montant payé</p>
                                    <p className="text-5xl lg:text-6xl font-bold text-slate-900">
                                        {formatPrice(payment?.amount || 29.99)}
                                    </p>
                                    <div className="mt-4 flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-emerald-600">Transaction sécurisée</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="mb-8">
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200"
                                >
                                    <span className="font-semibold text-slate-800">Détails de la transaction</span>
                                    <ArrowRight className={`text-slate-600 transition-transform duration-200 ${showDetails ? 'rotate-90' : ''}`} size={20} />
                                </button>
                                
                                {showDetails && (
                                    <div className="mt-4 p-6 bg-slate-50 rounded-xl space-y-4 animate-fade-in">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Référence</span>
                                            <span className="font-mono text-slate-900">{payment?.reference || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Date</span>
                                            <span className="text-slate-900">{formatDate(payment?.created_at || new Date())}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Méthode</span>
                                            <span className="text-slate-900">{payment?.method || 'RdCard'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Statut</span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                                                <CheckCircle size={14} className="mr-1" />
                                                Complété
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <button
                                    onClick={() => window.location.href = route('dashboard')}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                                >
                                    <Home size={18} />
                                    <span>Accueil</span>
                                </button>
                                
                                <button
                                    onClick={() => copyToClipboard(payment?.reference || '')}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-medium rounded-xl transition-all duration-200 transform hover:scale-105"
                                >
                                    <Receipt size={18} />
                                    <span>{copied ? 'Copié!' : 'Copier'}</span>
                                </button>
                                
                                <button
                                    onClick={sharePayment}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium rounded-xl transition-all duration-200 transform hover:scale-105"
                                >
                                    <Share2 size={18} />
                                    <span>Partager</span>
                                </button>
                                
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-medium rounded-xl transition-all duration-200 transform hover:scale-105"
                                >
                                    <Download size={18} />
                                    <span>Télécharger</span>
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <Shield size={32} className="text-slate-600" />
                                    </div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Sécurisé</h4>
                                    <p className="text-sm text-slate-600">Paiement 100% sécurisé</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <CreditCard size={32} className="text-slate-600" />
                                    </div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Rapide</h4>
                                    <p className="text-sm text-slate-600">Transaction instantanée</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <Zap size={32} className="text-slate-600" />
                                    </div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Efficace</h4>
                                    <p className="text-sm text-slate-600">Processus optimisé</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
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