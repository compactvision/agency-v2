import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export function CallToAction() {
    return (
        <section className="border-y border-emerald-500 bg-emerald-600 dark:bg-emerald-900">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Prêt à commencer l'aventure ?
                    <br />
                    Consultez nos opportunités dès maintenant.
                </h2>
                <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
                    <Button
                        asChild
                        size="lg"
                        variant="secondary"
                        className="rounded-full bg-white text-emerald-600 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-emerald-400"
                    >
                        <Link href="/register">Créer un compte gratuit</Link>
                    </Button>
                    <Link
                        href="/about"
                        className="text-sm leading-6 font-semibold text-white hover:text-emerald-100 dark:text-zinc-200"
                    >
                        En savoir plus <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
