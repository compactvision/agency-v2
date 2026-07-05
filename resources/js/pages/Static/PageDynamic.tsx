import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Calendar,
    ChevronRight,
    Clock,
    FileText,
} from 'lucide-react';

interface Section {
    id: number;
    order: number;
    heading: string;
    paragraph: string;
}

interface Props {
    title: string;
    sections: Section[];
}

export default function PageDynamic({ title, sections }: Props) {
    const formatDate = () => {
        const date = new Date();
        return date.toLocaleDateString('fr-FR', {
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <App>
            <Head title={title} />
            <Breadcumb title={title} homeLink={route('home')} />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5"></div>
                <div className="relative container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
                            <BookOpen size={16} />
                            <span>Documentation</span>
                        </div>

                        <h1 className="mb-6 bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl lg:text-6xl">
                            {title}
                        </h1>

                        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 sm:text-xl">
                            Explorez notre documentation complète pour trouver
                            toutes les réponses à vos questions
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <FileText size={16} />
                                <span>{sections.length} sections</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Clock size={16} />
                                <span>Mis à jour : {formatDate()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 h-20 w-20 rounded-full bg-amber-200/20 blur-2xl"></div>
                <div className="absolute bottom-10 left-10 h-32 w-32 rounded-full bg-amber-300/20 blur-3xl"></div>
            </section>

            {/* Content Section */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        {/* Table of Contents */}
                        <div className="mb-12 rounded-2xl border border-amber-200/30 bg-white p-6 shadow-lg shadow-amber-500/10 sm:p-8">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
                                    <BookOpen
                                        size={20}
                                        className="text-white"
                                    />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Sommaire
                                </h2>
                            </div>

                            <nav className="grid gap-3 sm:grid-cols-2">
                                {sections.map((section, index) => (
                                    <a
                                        key={section.id}
                                        href={`#section-${section.id}`}
                                        className="group flex items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:bg-amber-50/50"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-semibold text-amber-700 transition-colors group-hover:bg-amber-200">
                                            {index + 1}
                                        </div>
                                        <span className="line-clamp-2 text-sm text-slate-700 transition-colors group-hover:text-amber-700 sm:text-base">
                                            {section.heading}
                                        </span>
                                        <ChevronRight
                                            size={16}
                                            className="ml-auto text-amber-500 opacity-0 transition-all duration-300 group-hover:opacity-100"
                                        />
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-12">
                            {sections.map((section, index) => (
                                <article
                                    key={section.id}
                                    id={`section-${section.id}`}
                                    className="overflow-hidden rounded-2xl border border-amber-200/30 bg-white shadow-lg shadow-amber-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20"
                                >
                                    <div className="p-6 sm:p-8 lg:p-10">
                                        {/* Section Header */}
                                        <div className="mb-6 flex items-start gap-4">
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
                                                <span className="text-lg font-bold text-white">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                                                    {section.heading}
                                                </h2>
                                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        Section {index + 1}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        Environ{' '}
                                                        {Math.ceil(
                                                            section.paragraph
                                                                .length / 100,
                                                        )}{' '}
                                                        min de lecture
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section Content */}
                                        <div className="prose prose-slate max-w-none">
                                            <div className="rounded-xl border border-amber-200/30 bg-amber-50/30 p-6">
                                                <p className="text-base leading-relaxed whitespace-pre-wrap text-slate-700 sm:text-lg">
                                                    {section.paragraph}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Section Footer */}
                                        <div className="mt-6 border-t border-amber-200/30 pt-6">
                                            <div className="flex items-center justify-between">
                                                <a
                                                    href="#top"
                                                    className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 transition-colors hover:text-amber-700"
                                                >
                                                    <ArrowRight
                                                        size={16}
                                                        className="rotate-270"
                                                    />
                                                    Retour en haut
                                                </a>
                                                {index <
                                                    sections.length - 1 && (
                                                    <a
                                                        href={`#section-${sections[index + 1].id}`}
                                                        className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 transition-colors hover:text-amber-700"
                                                    >
                                                        Section suivante
                                                        <ArrowRight size={16} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Last Update Info */}
                        <div className="mt-16 text-center">
                            <div className="inline-flex items-center gap-3 rounded-2xl border border-amber-200/30 bg-amber-50/50 px-6 py-4">
                                <Clock size={20} className="text-amber-600" />
                                <div className="text-left">
                                    <p className="text-sm font-medium text-slate-900">
                                        Dernière mise à jour
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {formatDate()} 2025
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .prose {
          color: inherit;
        }
        
        .prose p {
          margin: 0;
        }
      `}</style>
        </App>
    );
}
