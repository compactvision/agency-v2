import { useForm } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    CreditCard,
    Globe,
    Phone,
    X,
} from 'lucide-react';
import { useEffect } from 'react';

type Plan = {
    id: number;
    name: string;
    price: string;
    duration: string;
    payment_method: 'manual' | 'automatic';
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

    const selectedPlan = plans.find((p) => p.id.toString() === data.plan_id);
    const isManual = !selectedPlan || selectedPlan.payment_method === 'manual';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Overlay avec effet de flou */}
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal content */}
                <div className="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl transition-all">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isSubscribing
                                ? "Changer d'abonnement"
                                : 'Sélectionner un abonnement'}
                        </h2>
                        <button
                            type="button"
                            className="rounded-full p-2 transition-colors hover:bg-gray-100"
                            onClick={onClose}
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Champ du numéro de téléphone - Conditionnel */}
                        {isManual && (
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Numéro de téléphone
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center">
                                        <div className="flex items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-3 py-3">
                                            <Globe
                                                size={18}
                                                className="mr-2 text-gray-500"
                                            />
                                            <span className="font-medium text-gray-700">
                                                +243
                                            </span>
                                        </div>
                                    </div>

                                    <input
                                        id="phone"
                                        type="tel"
                                        className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-24 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                                        value={data.phone_number}
                                        onChange={handlePhoneChange}
                                        required={isManual}
                                        disabled={processing}
                                        maxLength={9}
                                        pattern="\d{9}"
                                        placeholder="85 362 12 83"
                                    />

                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <Phone
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                </div>

                                <p className="mt-2 text-xs text-gray-500">
                                    Entrez les 9 chiffres de votre numéro de
                                    téléphone congolais
                                </p>

                                {errors.phone_number && (
                                    <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                        <AlertCircle size={16} />
                                        {errors.phone_number}
                                    </div>
                                )}
                            </div>
                        )}

                        {!isManual && (
                            <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                                <CheckCircle
                                    className="mt-0.5 shrink-0 text-blue-500"
                                    size={18}
                                />
                                <p className="text-sm text-blue-700">
                                    Ce plan sera activé automatiquement après le
                                    paiement via la passerelle sécurisée.
                                </p>
                            </div>
                        )}

                        {/* Sélection du plan */}
                        <div>
                            <label
                                htmlFor="subscription-select"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Choisir un plan
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <CreditCard
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </div>
                                <select
                                    id="subscription-select"
                                    name="subscription"
                                    value={data.plan_id}
                                    onChange={handleChange}
                                    required
                                    disabled={processing}
                                    className={`w-full appearance-none rounded-lg border bg-white py-3 pr-4 pl-10 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 ${
                                        errors.plan_id
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                >
                                    <option value="" disabled>
                                        Sélectionner une option
                                    </option>
                                    {plans.length > 0 ? (
                                        plans.map((p) => (
                                            <option
                                                key={p.id}
                                                value={p.id.toString()}
                                            >
                                                {p.name} — {p.price} $ /{' '}
                                                {p.duration}{' '}
                                                {currentPlanId === p.id &&
                                                    '(actuel)'}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>
                                            Aucun plan disponible
                                        </option>
                                    )}
                                </select>
                            </div>

                            {/* Message d'erreur */}
                            {errors.plan_id && (
                                <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    <AlertCircle size={16} />
                                    {errors.plan_id}
                                </div>
                            )}
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                className="flex-1 rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                                onClick={onClose}
                                disabled={processing}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className={`flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-3 font-medium text-white transition-all hover:from-amber-500 hover:to-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 ${
                                    !data.plan_id
                                        ? 'cursor-not-allowed opacity-50'
                                        : ''
                                }`}
                                disabled={processing || !data.plan_id}
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            className="h-5 w-5 animate-spin text-white"
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
                                        Traitement...
                                    </>
                                ) : (
                                    <>
                                        {isManual
                                            ? isSubscribing
                                                ? 'Changer de plan'
                                                : 'Envoyer la demande'
                                            : 'Procéder au paiement'}
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
