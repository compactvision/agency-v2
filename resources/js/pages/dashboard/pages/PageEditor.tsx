import React from 'react';
import { ArrowLeft, Plus, Trash2, FileText, Type, AlignLeft, AlertCircle } from 'lucide-react';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import { useForm, router } from '@inertiajs/react';
import BackButton from '@/components/ui/BackButton';

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

    const handleChangeSection = (index: number, field: 'heading' | 'paragraph', value: string) => {
        const updated = [...data.sections];
        updated[index][field] = value;
        setData('sections', updated);
    };

    const handleAddSection = () => {
        setData('sections', [...data.sections, { id: null, heading: '', paragraph: '' }]);
    };

    const handleRemoveSection = (index: number) => {
        const updated = [...data.sections];
        updated.splice(index, 1);
        setData('sections', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const method = page?.id ? put : post;
        const url = page?.id ? route('dashboard.pages.update', page.id) : route('dashboard.pages.store');
        method(url);
    };

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                {/* Header Section */}
                <div className="bg-white/80 backdrop-blur-xl shadow-lg shadow-amber-500/5 border-b border-amber-200/30 sticky top-0 z-10">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <BackButton />
                            
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                                    {page?.id ? 'Modifier une page' : 'Créer une page'}
                                </h1>
                                <p className="text-sm sm:text-base text-slate-600 mt-1">
                                    {page?.id
                                        ? 'Modifiez le contenu et la structure de votre page'
                                        : 'Créez une nouvelle page avec du contenu personnalisé'
                                    }
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <div className="bg-white rounded-xl shadow-md border border-amber-200/30 p-3 text-center min-w-[80px]">
                                    <div className="text-xl font-bold text-slate-900">{data.sections.length}</div>
                                    <div className="text-xs text-slate-500">Sections</div>
                                </div>
                                <div className="bg-white rounded-xl shadow-md border border-amber-200/30 p-3 text-center min-w-[80px]">
                                    <div className="text-xl font-bold text-slate-900">{data.title.length}</div>
                                    <div className="text-xs text-slate-500">Caractères</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">
                    {/* Title Section */}
                    <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden mb-6">
                        <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 px-6 py-4 border-b border-amber-200/30">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
                                    <FileText size={20} className="text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800">Titre de la page</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-300 focus:ring-red-500' : 'border-amber-200/50 focus:ring-amber-500'} focus:outline-none focus:ring-2 bg-white/80 backdrop-blur-sm text-sm shadow-sm transition-all duration-300`}
                                    placeholder="Entrez le titre de votre page..."
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && (
                                    <div className="mt-2 flex items-center text-red-600 text-sm">
                                        <AlertCircle size={14} className="mr-1" />
                                        <span>{errors.title}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden mb-6">
                        <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 px-6 py-4 border-b border-amber-200/30">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
                                        <AlignLeft size={20} className="text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800">Contenu de la page</h3>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                                    onClick={handleAddSection}
                                >
                                    <Plus size={16} />
                                    <span>Ajouter une section</span>
                                </button>
                            </div>
                        </div>

                        {data.sections.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100/50 flex items-center justify-center">
                                    <AlignLeft size={32} className="text-amber-500" />
                                </div>
                                <h4 className="text-xl font-semibold text-slate-800 mb-2">Aucune section</h4>
                                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                    Commencez par ajouter votre première section de contenu
                                </p>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                                    onClick={handleAddSection}
                                >
                                    <Plus size={18} />
                                    Ajouter une section
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 space-y-4">
                                {data.sections.map((section, index) => (
                                    <div
                                        key={index}
                                        className="bg-amber-50/30 rounded-xl border border-amber-200/30 overflow-hidden animate-fadeInUp hover:shadow-md transition-all duration-300"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="bg-white/80 px-5 py-3 border-b border-amber-200/30">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
                                                        <span className="text-white font-bold text-sm">{index + 1}</span>
                                                    </div>
                                                    <h4 className="font-medium text-slate-800">Section {index + 1}</h4>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                                                    onClick={() => handleRemoveSection(index)}
                                                    title="Supprimer cette section"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-5 space-y-4">
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                                    <Type size={16} className="text-amber-500" />
                                                    Titre de la section
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`w-full px-4 py-3 rounded-lg border ${errors.sections?.[index]?.heading ? 'border-red-300 focus:ring-red-500' : 'border-amber-200/50 focus:ring-amber-500'} focus:outline-none focus:ring-2 bg-white/80 backdrop-blur-sm text-sm shadow-sm transition-all duration-300`}
                                                    placeholder="Titre de cette section..."
                                                    value={section.heading}
                                                    onChange={(e) => handleChangeSection(index, 'heading', e.target.value)}
                                                />
                                                {errors.sections?.[index]?.heading && (
                                                    <div className="mt-2 flex items-center text-red-600 text-sm">
                                                        <AlertCircle size={14} className="mr-1" />
                                                        <span>{errors.sections[index].heading}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                                    <AlignLeft size={16} className="text-amber-500" />
                                                    Contenu du paragraphe
                                                </label>
                                                <textarea
                                                    className={`w-full px-4 py-3 rounded-lg border ${errors.sections?.[index]?.paragraph ? 'border-red-300 focus:ring-red-500' : 'border-amber-200/50 focus:ring-amber-500'} focus:outline-none focus:ring-2 bg-white/80 backdrop-blur-sm text-sm shadow-sm transition-all duration-300 resize-vertical`}
                                                    rows={4}
                                                    placeholder="Rédigez le contenu de cette section..."
                                                    value={section.paragraph}
                                                    onChange={(e) => handleChangeSection(index, 'paragraph', e.target.value)}
                                                />
                                                {errors.sections?.[index]?.paragraph && (
                                                    <div className="mt-2 flex items-center text-red-600 text-sm">
                                                        <AlertCircle size={14} className="mr-1" />
                                                        <span>{errors.sections[index].paragraph}</span>
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
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[220px] justify-center"
                            disabled={processing}
                        >
                            {processing ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <FileText size={20} />
                            )}
                            <span>
                                {processing
                                    ? 'En cours...'
                                    : page?.id
                                        ? 'Mettre à jour la page'
                                        : 'Créer la page'
                                }
                            </span>
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
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