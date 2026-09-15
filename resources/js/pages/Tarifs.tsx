import App from '@/components/layouts/Home/App';
import Pricing from '@/components/section/home/Pricing';
import Breadcumb from '@/components/ui/Breadcumb';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Tarifs({
    plans = [],
    currentPlanId,
}: {
    plans: any[];
    currentPlanId: number | null;
}) {
    const { t } = useTranslation();

    return (
        <App>
            <Head title="Tarifs" />
            <Breadcumb title={t('pricing')} homeLink={route('home')} />
            <Pricing plans={plans} currentPlanId={currentPlanId} />
        </App>
    );
}
