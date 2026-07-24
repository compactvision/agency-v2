import App from '@/components/layouts/Home/App';
import Counter from '@/components/section/home/Counter';
import Hero from '@/components/section/home/Hero';
import LocationProperty from '@/components/section/home/LocationProperty';
import RecentProperty from '@/components/section/home/RecentProperty';
import WhyUs from '@/components/section/home/WhyUs';
import Work from '@/components/section/home/Work';
import { useLocations } from '@/hooks/useLocations';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Home({
    properties: initialProperties,
    municipalities: initialMunicipalities,
    favorites: initialFavorites,
}: {
    properties: any[];
    municipalities: any[];
    favorites: number[];
}) {
    const { t } = useTranslation();
    const { municipalities } = useLocations(initialMunicipalities);

    // Favorites kept from prop (backend logic pending)
    const favorites = initialFavorites;

    return (
        <App>
            <Head title={t('home')} />

            {/* 1. Hero avec barre de recherche */}
            <Hero />

            {/* 2. Biens récents */}
            <RecentProperty
                favorites={favorites}
                initialProperties={initialProperties}
            />

            {/* 3. Avantages + Types de biens (fusion About + Service) */}
            <WhyUs />

            {/* 4. Compteurs */}
            <Counter />

            {/* 5. Recherche par localisation */}
            <LocationProperty municipalities={municipalities} />

            {/* 6. Comment ça marche + CTA final */}
            <Work />
        </App>
    );
}
