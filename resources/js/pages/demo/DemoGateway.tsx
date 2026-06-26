import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, XCircle, ShieldCheck } from 'lucide-react';

export default function DemoGateway({ transactionId }: { transactionId: string }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Head title="Acoriss Pay - Simulation" />
            
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-orange-600 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <ShieldCheck size={28} />
                        <span className="text-xl font-bold tracking-tight">Acoriss Pay</span>
                    </div>
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">DEMO MODE</span>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Simulation de Paiement</h1>
                        <p className="text-gray-500">Transaction: <span className="font-mono text-sm">{transactionId}</span></p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                        <p className="text-sm text-amber-800 leading-relaxed font-medium">
                            Ceci est une page de simulation. Dans un environnement de production, vous seriez sur la passerelle sécurisée Acoriss.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link 
                            href={route('billing.success')}
                            className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-200"
                        >
                            <CheckCircle size={20} />
                            Simuler un Paiement Réussi
                        </Link>

                        <Link 
                            href={route('billing.cancel')}
                            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-700 font-bold py-4 rounded-xl transition-all"
                        >
                            <XCircle size={20} className="text-red-500" />
                            Simuler une Annulation
                        </Link>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-center gap-6">
                    <div className="flex items-center gap-1 text-gray-400 grayscale opacity-50">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 grayscale opacity-50">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                    </div>
                </div>
            </div>
            
            <p className="mt-8 text-gray-400 text-sm">Sécurisé par Acoriss Technology Group</p>
        </div>
    );
}
