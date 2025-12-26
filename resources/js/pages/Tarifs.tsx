import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Check, Star, Crown, Zap, Shield, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function Tarifs({ plans, currentPlanId }: { plans: any; currentPlanId: number | null }) {
  const { t } = useTranslation();

  // local UI state
  const [submittingPlan, setSubmittingPlan] = useState<number | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({}); // mapping field -> messages
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleGetStarted = (planId: number) => {
    // client-side sanity checks
    if (!planId || typeof planId !== 'number') {
      setGlobalError(t('invalid_plan'));
      return;
    }
    if (planId === currentPlanId) {
      // nothing to do
      setGlobalError(t('already_on_this_plan') || 'Vous avez déjà ce plan.');
      return;
    }

    // clear previous errors
    setServerErrors({});
    setGlobalError(null);

    // confirm optional (UX choice) - dé-commenter si tu veux confirmation
    // if (!confirm(t('confirm_choose_plan'))) return;

    setSubmittingPlan(planId);

    router.post(
      route('subscriptions.checkAccess'),
      { plan_id: planId },
      {
        preserveScroll: (page) => {
          // keep scroll if route doesn't change
          return true;
        },
        preserveState: false,
        onStart: () => {
          // possibilité d'ajouter un event analytics ici
        },
        onSuccess: (page) => {
          // Si le backend veut rediriger vers une URL de checkout fournie dans la réponse
          // Inertia fournit la page props en callback. Essaie de récupérer checkoutUrl.
          // selon l'implémentation du backend, checkoutUrl peut être dans page.props ou page.props.flash.
          const checkoutUrl = page.props?.checkoutUrl ?? (page.props?.flash?.checkoutUrl ?? null);
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
            return;
          }

          // Si le serveur a renvoyé une nouvelle page Inertia (ex: abonnement déjà actif), Inertia gère la navigation.
          setSubmittingPlan(null);
        },
        onError: (errors: Record<string, any>) => {
          // errors provient généralement de Laravel validation => { field: ['msg1', ...] }
          setServerErrors(errors || {});
          // extraire message global si présent
          if ((errors as any).message) setGlobalError((errors as any).message);
          setSubmittingPlan(null);
        },
        onFinish: () => {
          // cleanup si nécessaire
          setSubmittingPlan(null);
        },
      }
    );
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('basic') || name.includes('starter')) return <Shield size={24} />;
    if (name.includes('pro') || name.includes('premium')) return <Crown size={24} />;
    if (name.includes('enterprise') || name.includes('business')) return <TrendingUp size={24} />;
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

      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 bg-white rounded-full shadow-md text-orange-600 font-semibold text-sm mb-4">
              {t('pricing_plan')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('pricing_plan_better')}</h2>
            <p className="text-lg text-gray-600">
              Choisissez le plan qui correspond le mieux à vos besoins et développez votre activité immobilière
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan: any, index: number) => {
              const isCurrentPlan = plan.id === currentPlanId;
              const isPopular = isPopularPlan(plan.id, index);
              const isSubmitting = submittingPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    isPopular ? 'ring-2 ring-orange-500 transform scale-105' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold flex items-center gap-1">
                      <Star size={16} />
                      Populaire
                    </div>
                  )}

                  <div className="p-8 pb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`p-3 rounded-full ${
                          isPopular ? 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {getPlanIcon(plan.name)}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                    <div className="flex items-baseline mb-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}$</span>
                      <span className="text-gray-500 ml-2">/mois</span>
                    </div>

                    <p className="text-gray-600 mb-6">{t('essential_services_to_start_your_journey')}</p>

                    <button
                      onClick={() => handleGetStarted(plan.id)}
                      disabled={isCurrentPlan || isSubmitting}
                      aria-disabled={isCurrentPlan || isSubmitting}
                      aria-busy={isSubmitting}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                        isCurrentPlan
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : isPopular
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl'
                          : 'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
                      } flex items-center justify-center gap-3`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                            <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" />
                          </svg>
                          <span>{t('processing') || 'En cours...'}</span>
                        </>
                      ) : (
                        <span>{isCurrentPlan ? t('current_plan') : t('get_started')}</span>
                      )}
                    </button>
                  </div>

                  <div className="px-8 pb-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature: any) => (
                        <li key={feature.id} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                            <Check size={16} className="text-green-600" />
                          </div>
                          <span className="text-gray-700">{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* global error / server validation summary */}
          {(globalError || Object.keys(serverErrors).length > 0) && (
            <div className="mt-6 max-w-3xl mx-auto">
              <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded">
                {globalError && <p className="font-medium">{globalError}</p>}
                {Object.keys(serverErrors).length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm">
                    {Object.entries(serverErrors).map(([field, msgs]) => (
                      <li key={field}>
                        <strong className="capitalize">{field}:</strong> {(msgs || []).join(' ')}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="mt-20 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Vous avez des questions ?</h3>
              <p className="text-gray-600 mb-6">Notre équipe d'experts est là pour vous aider à choisir le plan qui vous convient le mieux.</p>
              <Link
                href={route('contact')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg"
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
