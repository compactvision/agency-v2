import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import { useSubscription } from '@/hooks/useSubscription';
import { Head, Link, usePage } from '@inertiajs/react';
import { Check, Crown, Shield, Star, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

declare const route: any;

export default function Tarifs({
    plans = [],
    currentPlanId,
}: {
    plans: any[];
    currentPlanId: number | null;
}) {
    const { t } = useTranslation();
    const { auth } = (usePage().props as unknown as any) || {};
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingPlanId, setPendingPlanId] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        subscribe,
        submittingPlan,
        serverErrors,
        globalError,
        isSubmitting,
    } = useSubscription({ currentPlanId });

    const handleGetStarted = (planId: number, force = false) => {
        if (!auth?.user) {
            alert('Vous devez être connecté pour vous abonner.');
            window.location.href = route('login');
            return;
        }

        if (currentPlanId && !force) {
            setPendingPlanId(planId);
            setShowConfirmModal(true);
            return;
        }

        subscribe(planId).then((result) => {
            if (result?.status === 'manual_pending') {
                setSuccessMessage(result.message);
                setShowConfirmModal(false);
                setPendingPlanId(null);
            } else if (result?.error_code === 'ALREADY_HAS_SUBSCRIPTION') {
                setPendingPlanId(planId);
                setShowConfirmModal(true);
            }
        });
    };

    const confirmSwitch = () => {
        if (pendingPlanId) {
            handleGetStarted(pendingPlanId, true);
        }
    };

    const getPlanIcon = (planName: string) => {
        const name = planName.toLowerCase();
        if (name.includes('basic') || name.includes('starter'))
            return <Shield size={24} />;
        if (name.includes('pro') || name.includes('premium'))
            return <Crown size={24} />;
        if (name.includes('enterprise') || name.includes('business'))
            return <TrendingUp size={24} />;
        return <Zap size={24} />;
    };

    const isPopularPlan = (planId: number, index: number) => {
        const planCount = plans.length;
        const middleIndex = Math.floor(planCount / 2);
        return index === middleIndex;
    };

    return (
        <App>
            <Head title="Tarifs" />
            <Breadcumb title={t('pricing')} homeLink={route('home')} />

            {/* Modal de confirmation */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-[#D8D7CE] bg-white p-6 shadow-2xl dark:border-[#4C4643] dark:bg-[#2B2827]">
                        <h3 className="mb-4 text-xl font-bold text-[#413D3C] dark:text-[#F3F1E8]">
                            Confirmation
                        </h3>
                        <p className="mb-6 text-[#625E5B] dark:text-[#C8C2BA]">
                            Vous avez déjà un abonnement actif. Voulez-vous
                            passer à ce nouveau plan ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setPendingPlanId(null);
                                }}
                                className="rounded-lg px-4 py-2 font-semibold text-[#625E5B] transition-colors hover:bg-[#EEEFE6] hover:text-[#292625] dark:text-[#C8C2BA] dark:hover:bg-[#403B39] dark:hover:text-[#F3F1E8]"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmSwitch}
                                className="rounded-lg bg-[#CF8E19] px-4 py-2 font-semibold text-[#292625] transition-colors hover:bg-[#E0A43A]"
                            >
                                Confirmer le changement
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Message de succès */}
            {successMessage && (
                <div className="fixed top-24 right-4 z-[100] max-w-sm rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-xl dark:border-emerald-800 dark:bg-[#173D34]">
                    <div className="flex items-start gap-3">
                        <Check className="mt-1 h-5 w-5 text-green-600" />
                        <div>
                            <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                                Demande envoyée
                            </p>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                {successMessage}
                            </p>
                            <button
                                onClick={() => setSuccessMessage(null)}
                                className="mt-2 text-xs font-bold text-emerald-800 uppercase underline dark:text-emerald-200"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <section className="relative overflow-hidden bg-gradient-to-br from-[#F7F7F2] via-[#EEEFE6] to-[#E4E5DC] py-20 dark:from-[#211F1E] dark:via-[#292625] dark:to-[#211F1E]">
                <div className="pointer-events-none absolute top-0 left-0 h-full w-full opacity-10 dark:opacity-20">
                    <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-[#CF8E19] blur-3xl filter"></div>
                    <div className="absolute right-10 bottom-10 h-96 w-96 rounded-full bg-[#57514F] blur-3xl filter"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4">
                    <div className="mx-auto mb-16 max-w-3xl text-center">
                        <span className="mb-4 inline-block rounded-full border border-[#D8D7CE] bg-white/90 px-4 py-2 text-sm font-semibold text-[#A66E0A] shadow-md backdrop-blur-sm dark:border-[#57514F] dark:bg-[#353130] dark:text-[#E0A43A]">
                            {t('pricing_plan')}
                        </span>
                        <h2 className="mb-4 text-4xl font-bold text-[#413D3C] md:text-5xl dark:text-[#F3F1E8]">
                            {t('pricing_plan_better')}
                        </h2>
                        <p className="text-lg text-[#625E5B] dark:text-[#C8C2BA]">
                            Choisissez le plan qui correspond le mieux à vos
                            besoins et développez votre activité immobilière
                        </p>
                    </div>

                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan: any, index: number) => {
                            const isCurrentPlan = plan.id === currentPlanId;
                            const isPopular = isPopularPlan(plan.id, index);
                            const isSubmitting = submittingPlan === plan.id;

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative overflow-hidden rounded-2xl border border-[#D8D7CE] bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#CF8E19]/70 hover:shadow-2xl dark:border-[#4C4643] dark:bg-[#2B2827] dark:shadow-black/30 dark:hover:border-[#CF8E19] ${
                                        isPopular
                                            ? 'transform ring-2 ring-[#CF8E19] lg:scale-105'
                                            : ''
                                    }`}
                                >
                                    {isPopular && (
                                        <div className="absolute top-0 right-0 flex items-center gap-1 rounded-bl-lg bg-[#CF8E19] px-4 py-1 text-sm font-semibold text-[#292625]">
                                            <Star size={16} />
                                            Populaire
                                        </div>
                                    )}

                                    <div className="p-8 pb-6">
                                        <div className="mb-4 flex items-start justify-between">
                                            <div
                                                className={`rounded-full p-3 ${
                                                    isPopular
                                                        ? 'bg-[#CF8E19]/15 text-[#A66E0A] dark:bg-[#CF8E19]/20 dark:text-[#E0A43A]'
                                                        : 'bg-[#EEEFE6] text-[#625E5B] dark:bg-[#403B39] dark:text-[#C8C2BA]'
                                                }`}
                                            >
                                                {getPlanIcon(plan.name)}
                                            </div>
                                        </div>

                                        <h3 className="mb-2 text-2xl font-bold text-[#413D3C] dark:text-[#F3F1E8]">
                                            {plan.name}
                                        </h3>

                                        <div className="mb-4 flex items-baseline">
                                            <span className="text-4xl font-bold text-[#292625] dark:text-[#F3F1E8]">
                                                {plan.price}$
                                            </span>
                                            <span className="ml-2 text-[#736E69] dark:text-[#BBB5AD]">
                                                /mois
                                            </span>
                                        </div>

                                        <p className="mb-6 text-[#625E5B] dark:text-[#C8C2BA]">
                                            {t(
                                                'essential_services_to_start_your_journey',
                                            )}
                                        </p>

                                        <button
                                            onClick={() =>
                                                handleGetStarted(plan.id)
                                            }
                                            disabled={
                                                isCurrentPlan || isSubmitting
                                            }
                                            aria-disabled={
                                                isCurrentPlan || isSubmitting
                                            }
                                            aria-busy={isSubmitting}
                                            className={`w-full rounded-lg px-6 py-3 font-semibold transition-all duration-300 ${
                                                isCurrentPlan
                                                    ? 'cursor-not-allowed bg-[#E4E5DC] text-[#85807B] dark:bg-[#403B39] dark:text-[#9F9992]'
                                                    : isPopular
                                                      ? 'bg-[#CF8E19] text-[#292625] shadow-lg shadow-[#CF8E19]/20 hover:bg-[#E0A43A] hover:shadow-xl'
                                                      : 'border-2 border-[#CF8E19] bg-white text-[#8A5B08] hover:bg-[#CF8E19]/10 dark:bg-transparent dark:text-[#E0A43A] dark:hover:bg-[#CF8E19]/15'
                                            } flex items-center justify-center gap-3`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg
                                                        className="h-5 w-5 animate-spin"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        aria-hidden
                                                    >
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            strokeOpacity="0.25"
                                                        />
                                                        <path
                                                            d="M22 12a10 10 0 00-10-10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                    </svg>
                                                    <span>
                                                        {t('processing') ||
                                                            'En cours...'}
                                                    </span>
                                                </>
                                            ) : (
                                                <span>
                                                    {isCurrentPlan
                                                        ? t('current_plan')
                                                        : t('get_started')}
                                                </span>
                                            )}
                                        </button>
                                    </div>

                                    <div className="px-8 pb-8">
                                        <ul className="space-y-3">
                                            {plan.features.map(
                                                (feature: any) => (
                                                    <li
                                                        key={feature.id}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-[#173D34]">
                                                            <Check
                                                                size={16}
                                                                className="text-emerald-600 dark:text-emerald-300"
                                                            />
                                                        </div>
                                                        <span className="text-[#514D4A] dark:text-[#D1CCC4]">
                                                            {feature.name}
                                                        </span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* global error / server validation summary */}
                    {(globalError || Object.keys(serverErrors).length > 0) && (
                        <div className="mx-auto mt-6 max-w-3xl">
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-[#482626] dark:text-red-200">
                                {globalError && (
                                    <p className="font-medium">{globalError}</p>
                                )}
                                {Object.keys(serverErrors).length > 0 && (
                                    <ul className="mt-2 list-inside list-disc text-sm">
                                        {Object.entries(serverErrors).map(
                                            ([field, msgs]) => (
                                                <li key={field}>
                                                    <strong className="capitalize">
                                                        {field}:
                                                    </strong>{' '}
                                                    {(msgs || []).join(' ')}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-20 text-center">
                        <div className="mx-auto max-w-4xl rounded-2xl border border-[#D8D7CE] bg-white/90 p-8 shadow-lg backdrop-blur-sm dark:border-[#4C4643] dark:bg-[#2B2827] dark:shadow-black/30">
                            <h3 className="mb-4 text-2xl font-bold text-[#413D3C] dark:text-[#F3F1E8]">
                                Vous avez des questions ?
                            </h3>
                            <p className="mb-6 text-[#625E5B] dark:text-[#C8C2BA]">
                                Notre équipe d'experts est là pour vous aider à
                                choisir le plan qui vous convient le mieux.
                            </p>
                            <Link
                                href={route('contact')}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#CF8E19] px-6 py-3 font-semibold text-[#292625] shadow-md transition-all duration-300 hover:bg-[#E0A43A] hover:shadow-lg"
                            >
                                Contacter le support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </App>
    );
}
