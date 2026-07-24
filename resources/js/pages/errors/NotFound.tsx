import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <App>
            <Head title={t('page_not_found')} />
            <Breadcumb title={t('page_not_found')} homeLink={route('home')} />
        </App>
    );
}
