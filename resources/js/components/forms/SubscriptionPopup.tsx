import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ErrorText from '../ui/ErrorText';
import { X, Phone, CreditCard, CheckCircle, AlertCircle, Globe } from 'lucide-react';

type Plan = {
    id: number;
    name: string;
    price: string;
    duration: string;
};

export default function SubscriptionPopup({
    plans = [],
    onClose,
    isSubscribing,
    currentPlanId,
}: {
    plans?: Plan[];
    onClose: () => void;
    isSubscribing: boolean;
    currentPlanId?: number | null;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        plan_id: '',
        phone_number: '', // seulement les 9 chiffres locaux
        type: isSubscribing ? 'switch' : 'new',
    });

    useEffect(() => {
        setData('type', isSubscribing ? 'switch' : 'new');
    }, [isSubscribing]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, ''); // garder que les chiffres
        const local = digits.slice(0, 9); // max 9 chiffres
        setData('phone_number', local);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // On ne rajoute plus `243` ici
        post(route('dashboard.payment-requests.store'), {
            data: {
                ...data, // on envoie juste les 9 chiffres locaux
            },
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData('plan_id', e.target.value);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Overlay avec effet de flou */}
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>
                
                {/* Modal content */}
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isSubscribing ? 'Changer d\'abonnement' : 'Sélectionner un abonnement'}
                        </h2>
                        <button
                            type="button"
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={onClose}
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Champ du numéro de téléphone amélioré */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Numéro de téléphone
                            </label>
                            <div className="relative">
                                {/* Indicatif du pays */}
                                <div className="absolute inset-y-0 left-0 flex items-center">
                                    <div className="flex items-center border-r border-gray-300 bg-gray-50 rounded-l-lg px-3 py-3">
                                        <Globe size={18} className="text-gray-500 mr-2" />
                                        <span className="text-gray-700 font-medium">+243</span>
                                    </div>
                                </div>
                                
                                {/* Champ de saisie du numéro */}
                                <input
                                    id="phone"
                                    type="tel"
                                    className="w-full pl-24 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500"
                                    value={data.phone_number}
                                    onChange={handlePhoneChange}
                                    required
                                    disabled={processing}
                                    maxLength={9}
                                    pattern="\d{9}"
                                    placeholder="85 362 12 83"
                                />
                                
                                {/* Icône de téléphone */}
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <Phone size={18} className="text-gray-400" />
                                </div>
                            </div>
                            
                            {/* Message d'aide */}
                            <p className="mt-2 text-xs text-gray-500">
                                Entrez les 9 chiffres de votre numéro de téléphone congolais
                            </p>
                            
                            {/* Message d'erreur */}
                            {errors.phone_number && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                    <AlertCircle size={16} />
                                    {errors.phone_number}
                                </div>
                            )}
                        </div>

                        {/* Sélection du plan */}
                        <div>
                            <label htmlFor="subscription-select" className="block text-sm font-medium text-gray-700 mb-2">
                                Choisir un plan
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <CreditCard size={18} className="text-gray-400" />
                                </div>
                                <select
                                    id="subscription-select"
                                    name="subscription"
                                    value={data.plan_id}
                                    onChange={handleChange}
                                    required
                                    disabled={processing}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900 appearance-none ${
                                        errors.plan_id ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="" disabled>
                                        Sélectionner une option
                                    </option>
                                    {plans.length > 0 ? (
                                        plans.map((p) => (
                                            <option key={p.id} value={p.id.toString()}>
                                                {p.name} — {p.price} $ / {p.duration} {currentPlanId === p.id && '(actuel)'}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Aucun plan disponible</option>
                                    )}
                                </select>
                            </div>
                            
                            {/* Message d'erreur */}
                            {errors.plan_id && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                    <AlertCircle size={16} />
                                    {errors.plan_id}
                                </div>
                            )}
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                onClick={onClose}
                                disabled={processing}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className={`flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-lg font-medium hover:from-amber-500 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                                    !data.plan_id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={processing || !data.plan_id}
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Traitement...
                                    </>
                                ) : (
                                    <>
                                        {isSubscribing ? 'Changer de plan' : 'Envoyer la demande'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}