import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Section {
    id: number;
    heading: string | null;
    paragraph: string | null;
}

interface PageProps {
    page: {
        title: string;
        sections: Section[];
    };
}

export default function Page({ page }: PageProps) {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-white">
            <Head title={page.title} />

            {/* Simple Hero Header */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 px-4 py-16">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                        {page.title}
                    </h1>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="space-y-12">
                    {page.sections.map((section) => (
                        <section
                            key={section.id}
                            className="prose prose-amber max-w-none"
                        >
                            {section.heading && (
                                <h2 className="mb-6 border-b border-amber-200 pb-2 text-3xl font-bold text-slate-900">
                                    {section.heading}
                                </h2>
                            )}
                            {section.paragraph && (
                                <div className="text-lg leading-relaxed whitespace-pre-wrap text-slate-700">
                                    {section.paragraph}
                                </div>
                            )}
                        </section>
                    ))}

                    {page.sections.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-slate-500 italic">
                                {t('content_coming_soon')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Simple Footer/CTA if needed */}
            <div className="mt-20 border-t border-slate-200 bg-slate-50 px-4 py-12 text-center">
                <p className="text-slate-600">
                    &copy; {new Date().getFullYear()} The Agency.{' '}
                    {t('all_rights_reserved')}
                </p>
            </div>
        </div>
    );
}
