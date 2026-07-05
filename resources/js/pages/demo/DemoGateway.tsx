import { Head, Link } from '@inertiajs/react';
import { CheckCircle, ShieldCheck, XCircle } from 'lucide-react';

export default function DemoGateway({
    transactionId,
}: {
    transactionId: string;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <Head title="Acoriss Pay - Simulation" />

            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between bg-orange-600 p-6">
                    <div className="flex items-center gap-2 text-white">
                        <ShieldCheck size={28} />
                        <span className="text-xl font-bold tracking-tight">
                            Acoriss Pay
                        </span>
                    </div>
                    <span className="rounded bg-orange-500 px-2 py-1 text-[10px] font-bold text-white">
                        DEMO MODE
                    </span>
                </div>

                <div className="p-8">
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-2xl font-bold text-gray-900">
                            Simulation de Paiement
                        </h1>
                        <p className="text-gray-500">
                            Transaction:{' '}
                            <span className="font-mono text-sm">
                                {transactionId}
                            </span>
                        </p>
                    </div>

                    <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm leading-relaxed font-medium text-amber-800">
                            Ceci est une page de simulation. Dans un
                            environnement de production, vous seriez sur la
                            passerelle sécurisée Acoriss.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            href={route('billing.success')}
                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700"
                        >
                            <CheckCircle size={20} />
                            Simuler un Paiement Réussi
                        </Link>

                        <Link
                            href={route('billing.cancel')}
                            className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white py-4 font-bold text-gray-700 transition-all hover:border-red-200 hover:bg-red-50"
                        >
                            <XCircle size={20} className="text-red-500" />
                            Simuler une Annulation
                        </Link>
                    </div>
                </div>

                <div className="flex justify-center gap-6 border-t border-gray-100 bg-gray-50 p-6">
                    <div className="flex items-center gap-1 text-gray-400 opacity-50 grayscale">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                            alt="Visa"
                            className="h-4"
                        />
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 opacity-50 grayscale">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                            alt="Mastercard"
                            className="h-6"
                        />
                    </div>
                </div>
            </div>

            <p className="mt-8 text-sm text-gray-400">
                Sécurisé par Acoriss Technology Group
            </p>
        </div>
    );
}
