import { CallToAction } from '@/components/Home/CallToAction';
import { Features } from '@/components/Home/Features';
import { Hero } from '@/components/Home/Hero';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Accueil - Agence Immobilière">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
                {/* Navbar Minimale (Top Right) */}
                <header className="absolute top-0 right-0 z-50 flex w-full justify-end p-6">
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-md border border-zinc-200 px-5 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
                            >
                                Mon Espace
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block px-5 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                >
                                    Connexion
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                                    >
                                        Créer un compte
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                <main className="flex-1">
                    <Hero />
                    <Features />
                    <CallToAction />
                </main>

                <footer className="border-t border-zinc-200 bg-white py-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                    <p>
                        &copy; {new Date().getFullYear()} Agence Immobilière
                        Congo. Tous droits réservés.
                    </p>
                </footer>
            </div>
        </>
    );
}
