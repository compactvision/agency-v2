import App from "@/components/layouts/Home/App";
import Hero from "@/components/section/home/Hero";
import About from "@/components/section/home/About";
import Service from "@/components/section/home/Service";
import RecentProperty from "@/components/section/home/RecentProperty";
import PopularProperty from "@/components/section/home/PopularProperty";
import Counter from "@/components/section/home/Counter";
import LocationProperty from "@/components/section/home/LocationProperty";
import Work from "@/components/section/home/Work";
import { Head } from "@inertiajs/react";

export default function Home({ properties, municipalities, favorites }: { properties: any[]; municipalities: any[]; favorites: number[] }) {
    return <App>
        <Head title="Accueil" />
        <Hero />
        <About />
        <Service />
        <RecentProperty properties={properties} favorites={favorites}/>
        <PopularProperty properties={properties} favorites={favorites}/>
        <Counter />
        <LocationProperty municipalities={municipalities}/>
        <Work />
        {/* <Testimonial /> */}
        {/* <Brand /> */}
    </App>
}
