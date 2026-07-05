import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { useForm } from '@inertiajs/react';
import {
    AlertCircle,
    AlignLeft,
    FileText,
    Plus,
    Trash2,
    Type,
} from 'lucide-react';
import React from 'react';

interface Section {
    id: number | null;
    heading: string;
    paragraph: string;
}

interface Page {
    id?: number;
    title: string;
    sections: Section[];
}

export default function PageEditor({ page }: { page?: Page }) {
    const { data, setData, post, put, errors, processing } = useForm({
        title: page?.title ?? '',
        sections: page?.sections ?? [],
    });

    const handleChangeSection = (
        index: number,
        field: 'heading' | 'paragraph',
        value: string,
    ) => {
        const updated = [...data.sections];
        updated[index][field] = value;
        setData('sections', updated);
    };

    const handleAddSection = () => {
        setData('sections', [
            ...data.sections,
            { id: null, heading: '', paragraph: '' },
        ]);
    };

    const handleRemoveSection = (index: number) => {
        const updated = [...data.sections];
        updated.splice(index, 1);
        setData('sections', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const method = page?.id ? put : post;
        const url = page?.id
            ? route('dashboard.pages.update', page.id)
            : route('dashboard.pages.store');
        method(url);
    };

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                {/* Header Section */}
                <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 shadow-lg shadow-sm backdrop-blur-xl">
                    <div className="px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <BackButton />

                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="bg-gradient-to-r from-slate-100 to-slate-100 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                                    {page?.id
                                        ? 'Modifier une page'
                                        : 'Créer une page'}
                                </h1>
                                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                                    {page?.id
                                        ? 'Modifiez le contenu et la structure de votre page'
                                        : 'Créez une nouvelle page avec du contenu personnalisé'}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <div className="min-w-[80px] rounded-xl border border-slate-200 bg-white p-3 text-center shadow-md">
                                    <div className="text-xl font-bold text-slate-900">
                                        {data.sections.length}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        Sections
                                    </div>
                                </div>
                                <div className="min-w-[80px] rounded-xl border border-slate-200 bg-white p-3 text-center shadow-md">
                                    <div className="text-xl font-bold text-slate-900">
                                        {data.title.length}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        Caractères
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8"
                >
                    {/* Title Section */}
                    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-sm">
                        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#A8882E] shadow-md">
                                    <FileText
                                        size={20}
                                        className="text-white"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Titre de la page
                                </h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`w-full rounded-xl border px-4 py-3 ${errors.title ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-slate-200'} bg-white/80 text-sm shadow-sm backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:outline-none`}
                                    placeholder="Entrez le titre de votre page..."
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                />
                                {errors.title && (
                                    <div className="mt-2 flex items-center text-sm text-red-600">
                                        <AlertCircle
                                            size={14}
                                            className="mr-1"
                                        />
                                        <span>{errors.title}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-sm">
                        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4">
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#A8882E] shadow-md">
                                        <AlignLeft
                                            size={20}
                                            className="text-white"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        Contenu de la page
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-slate-100 to-slate-100 px-4 py-2 font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-slate-100 hover:to-slate-100 hover:shadow-lg"
                                    onClick={handleAddSection}
                                >
                                    <Plus size={16} />
                                    <span>Ajouter une section</span>
                                </button>
                            </div>
                        </div>

                        {data.sections.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#1E3A5F]/10">
                                    <AlignLeft
                                        size={32}
                                        className="text-[#C9A84C]"
                                    />
                                </div>
                                <h4 className="mb-2 text-xl font-semibold text-slate-800">
                                    Aucune section
                                </h4>
                                <p className="mx-auto mb-6 max-w-md text-slate-600">
                                    Commencez par ajouter votre première section
                                    de contenu
                                </p>
                                <button
                                    type="button"
                                    className="inline-flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-slate-100 to-slate-100 px-6 py-3 font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-slate-100 hover:to-slate-100 hover:shadow-lg"
                                    onClick={handleAddSection}
                                >
                                    <Plus size={18} />
                                    Ajouter une section
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 p-6">
                                {data.sections.map((section, index) => (
                                    <div
                                        key={index}
                                        className="animate-fadeInUp overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all duration-300 hover:shadow-md"
                                        style={{
                                            animationDelay: `${index * 0.1}s`,
                                        }}
                                    >
                                        <div className="border-b border-slate-200 bg-white/80 px-5 py-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#A8882E] shadow-sm">
                                                        <span className="text-sm font-bold text-white">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-medium text-slate-800">
                                                        Section {index + 1}
                                                    </h4>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="flex h-9 w-9 transform items-center justify-center rounded-lg bg-gradient-to-br from-red-400 to-red-600 text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:from-red-500 hover:to-red-700 hover:shadow-md"
                                                    onClick={() =>
                                                        handleRemoveSection(
                                                            index,
                                                        )
                                                    }
                                                    title="Supprimer cette section"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4 p-5">
                                            <div>
                                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                                                    <Type
                                                        size={16}
                                                        className="text-[#C9A84C]"
                                                    />
                                                    Titre de la section
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`w-full rounded-lg border px-4 py-3 ${errors.sections?.[index]?.heading ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-slate-200'} bg-white/80 text-sm shadow-sm backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:outline-none`}
                                                    placeholder="Titre de cette section..."
                                                    value={section.heading}
                                                    onChange={(e) =>
                                                        handleChangeSection(
                                                            index,
                                                            'heading',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {errors.sections?.[index]
                                                    ?.heading && (
                                                    <div className="mt-2 flex items-center text-sm text-red-600">
                                                        <AlertCircle
                                                            size={14}
                                                            className="mr-1"
                                                        />
                                                        <span>
                                                            {
                                                                errors.sections[
                                                                    index
                                                                ].heading
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                                                    <AlignLeft
                                                        size={16}
                                                        className="text-[#C9A84C]"
                                                    />
                                                    Contenu du paragraphe
                                                </label>
                                                <textarea
                                                    className={`w-full rounded-lg border px-4 py-3 ${errors.sections?.[index]?.paragraph ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-slate-200'} resize-vertical bg-white/80 text-sm shadow-sm backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:outline-none`}
                                                    rows={4}
                                                    placeholder="Rédigez le contenu de cette section..."
                                                    value={section.paragraph}
                                                    onChange={(e) =>
                                                        handleChangeSection(
                                                            index,
                                                            'paragraph',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {errors.sections?.[index]
                                                    ?.paragraph && (
                                                    <div className="mt-2 flex items-center text-sm text-red-600">
                                                        <AlertCircle
                                                            size={14}
                                                            className="mr-1"
                                                        />
                                                        <span>
                                                            {
                                                                errors.sections[
                                                                    index
                                                                ].paragraph
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Section */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="inline-flex min-w-[220px] transform items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-slate-100 to-slate-100 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-slate-100 hover:to-slate-100 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={processing}
                        >
                            {processing ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            ) : (
                                <FileText size={20} />
                            )}
                            <span>
                                {processing
                                    ? 'En cours...'
                                    : page?.id
                                      ? 'Mettre à jour la page'
                                      : 'Créer la page'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out;
                    animation-fill-mode: both;
                }
            `}</style>
        </Dashboard>
    );
}
