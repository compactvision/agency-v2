import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Declare route for Ziggy if not already available in global scope
declare const route: any;

interface UseSubscriptionProps {
    currentPlanId: number | null | undefined;
}

export function useSubscription({ currentPlanId }: UseSubscriptionProps) {
    const { t } = useTranslation();
    const [submittingPlan, setSubmittingPlan] = useState<number | null>(null);
    const [serverErrors, setServerErrors] = useState<Record<string, any>>({});
    const [globalError, setGlobalError] = useState<string | null>(null);

    const subscribe = async (planId: number) => {
        if (!planId) {
            setGlobalError(t('invalid_plan'));
            return;
        }

        if (planId === currentPlanId) {
            setGlobalError(
                t('already_on_this_plan') || 'Vous avez déjà ce plan.',
            );
            return;
        }

        // Reset errors
        setServerErrors({});
        setGlobalError(null);
        setSubmittingPlan(planId);

        try {
            const response = await axios.post(
                route('subscriptions.checkAccess'),
                {
                    plan_id: planId,
                },
            );

            const data = response.data.data || response.data;
            const checkoutUrl = data?.checkoutUrl;

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setServerErrors(error.response.data.errors);
            }
            if (error.response?.data?.message) {
                setGlobalError(error.response.data.message);
            } else {
                setGlobalError(
                    t('error_occurred') || 'Une erreur est survenue.',
                );
            }
        } finally {
            setSubmittingPlan(null);
        }
    };

    return {
        subscribe,
        submittingPlan,
        serverErrors,
        globalError,
        isSubmitting: submittingPlan !== null,
    };
}
