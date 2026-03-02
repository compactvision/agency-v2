import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-white pt-24 pb-32 dark:bg-zinc-950">
            {/* Background Details */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-white to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50">
                        Trouvez la propriété de vos rêves au Congo
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                        Une sélection premium de maisons, appartements et
                        terrains. Achetez, vendez ou louez en toute confiance
                        avec notre agence.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button asChild size="lg" className="rounded-full">
                            <Link href="/properties">
                                Voir les biens disponibles
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="rounded-full"
                        >
                            <Link href="/contact">Nous contacter</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
