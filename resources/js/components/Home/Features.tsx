import { Home as HomeIcon, ShieldCheck, TrendingUp } from 'lucide-react';

export function Features() {
    const features = [
        {
            name: 'Transactions Sécurisées',
            description:
                'Toutes nos offres sont vérifiées et validées par nos experts immobiliers avant publication.',
            icon: ShieldCheck,
        },
        {
            name: 'Vaste Catalogue',
            description:
                "Accédez à des centaines d'annonces exclusives mises à jour quotidiennement.",
            icon: HomeIcon,
        },
        {
            name: 'Investissement Rentable',
            description:
                'Nous vous conseillons sur les meilleurs opportunités immobilières du marché.',
            icon: TrendingUp,
        },
    ];

    return (
        <section className="bg-zinc-50 py-24 sm:py-32 dark:bg-zinc-900/50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base leading-7 font-semibold text-emerald-600 dark:text-emerald-400">
                        Pourquoi nous choisir ?
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
                        L'excellence en immobilier
                    </p>
                    <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                        Notre priorité est de vous offrir une expérience fluide,
                        sécurisée et transparente pour tous vos projets
                        immobiliers.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base leading-7 font-semibold text-zinc-900 dark:text-zinc-100">
                                    <feature.icon
                                        className="h-5 w-5 flex-none text-emerald-600 dark:text-emerald-400"
                                        aria-hidden="true"
                                    />
                                    {feature.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-400">
                                    <p className="flex-auto">
                                        {feature.description}
                                    </p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
