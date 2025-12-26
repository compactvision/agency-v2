import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import { useSubscription } from '@/hooks/useSubscription';
import { Head, Link } from '@inertiajs/react';
import { Check, Crown, Shield, Star, TrendingUp, Zap } from 'lucide-react';
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
    const {
        subscribe,
        submittingPlan,
        serverErrors,
        globalError,
        isSubmitting,
    } = useSubscription({ currentPlanId });

    const handleGetStarted = (planId: number) => {
        subscribe(planId);
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

            <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 py-20">
                <div className="absolute top-0 left-0 h-full w-full opacity-5">
                    <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-orange-500 blur-3xl filter"></div>
                    <div className="absolute right-10 bottom-10 h-96 w-96 rounded-full bg-blue-500 blur-3xl filter"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4">
                    <div className="mx-auto mb-16 max-w-3xl text-center">
                        <span className="mb-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-md">
                            {t('pricing_plan')}
                        </span>
                        <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
                            {t('pricing_plan_better')}
                        </h2>
                        <p className="text-lg text-gray-600">
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
                                    className={`relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                                        isPopular
                                            ? 'scale-105 transform ring-2 ring-orange-500'
                                            : ''
                                    }`}
                                >
                                    {isPopular && (
                                        <div className="absolute top-0 right-0 flex items-center gap-1 rounded-bl-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1 text-sm font-semibold text-white">
                                            <Star size={16} />
                                            Populaire
                                        </div>
                                    )}

                                    <div className="p-8 pb-6">
                                        <div className="mb-4 flex items-start justify-between">
                                            <div
                                                className={`rounded-full p-3 ${
                                                    isPopular
                                                        ? 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {getPlanIcon(plan.name)}
                                            </div>
                                        </div>

                                        <h3 className="mb-2 text-2xl font-bold text-gray-900">
                                            {plan.name}
                                        </h3>

                                        <div className="mb-4 flex items-baseline">
                                            <span className="text-4xl font-bold text-gray-900">
                                                {plan.price}$
                                            </span>
                                            <span className="ml-2 text-gray-500">
                                                /mois
                                            </span>
                                        </div>

                                        <p className="mb-6 text-gray-600">
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
                                                    ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                                                    : isPopular
                                                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:from-orange-600 hover:to-orange-700 hover:shadow-xl'
                                                      : 'border-2 border-orange-500 bg-white text-orange-500 hover:bg-orange-50'
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
                                                        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                                                            <Check
                                                                size={16}
                                                                className="text-green-600"
                                                            />
                                                        </div>
                                                        <span className="text-gray-700">
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
                            <div className="rounded border border-red-100 bg-red-50 p-4 text-red-700">
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
                        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
                            <h3 className="mb-4 text-2xl font-bold text-gray-900">
                                Vous avez des questions ?
                            </h3>
                            <p className="mb-6 text-gray-600">
                                Notre équipe d'experts est là pour vous aider à
                                choisir le plan qui vous convient le mieux.
                            </p>
                            <Link
                                href={route('contact')}
                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
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
