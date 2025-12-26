import App from '@/components/layouts/Home/App';
import About from '@/components/section/home/About';
import Counter from '@/components/section/home/Counter';
import Hero from '@/components/section/home/Hero';
import LocationProperty from '@/components/section/home/LocationProperty';
import PopularProperty from '@/components/section/home/PopularProperty';
import RecentProperty from '@/components/section/home/RecentProperty';
import Service from '@/components/section/home/Service';
import Work from '@/components/section/home/Work';
import { useAds } from '@/hooks/useAds';
import { useLocations } from '@/hooks/useLocations';
import { Head } from '@inertiajs/react';

export default function Home({
    properties: initialProperties,
    municipalities: initialMunicipalities,
    favorites: initialFavorites,
}: {
    properties: any[];
    municipalities: any[];
    favorites: number[];
}) {
    const { ads: properties, loading: adsLoading } = useAds();
    const { municipalities, loading: locLoading } = useLocations();

    // Fallback to props if needed, or just usage of hooks overrides props
    // We retain props in signature to match PageController output but rely on hooks as requested.

    // Note: Favorites are currently not fetched by a specific hook as backend logic is missing,
    // so we keep the prop for now (likely empty).
    const favorites = initialFavorites;

    return (
        <App>
            <Head title="Accueil" />
            <Hero />
            <About />
            <Service />
            <RecentProperty
                properties={properties.data}
                favorites={favorites}
            />
            <PopularProperty
                properties={properties.data}
                favorites={favorites}
            />
            <Counter />
            <LocationProperty municipalities={municipalities} />
            <Work />
            {/* <Testimonial /> */}
            {/* <Brand /> */}
        </App>
    );
}
