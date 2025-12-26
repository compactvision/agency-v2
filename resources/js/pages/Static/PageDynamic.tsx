import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import { Head } from '@inertiajs/react';
import { Calendar, FileText, Clock, ChevronRight, BookOpen, ArrowRight } from 'lucide-react';

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
      year: 'numeric' 
    });
  };

  return (
    <App>
      <Head title={title} />
      <Breadcumb title={title} homeLink={route('home')} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6">
              <BookOpen size={16} />
              <span>Documentation</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent mb-6">
              {title}
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Explorez notre documentation complète pour trouver toutes les réponses à vos questions
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
        <div className="absolute top-10 right-10 w-20 h-20 bg-amber-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-amber-300/20 rounded-full blur-3xl"></div>
      </section>

      {/* Content Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Table of Contents */}
            <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-6 sm:p-8 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <BookOpen size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Sommaire</h2>
              </div>
              
              <nav className="grid sm:grid-cols-2 gap-3">
                {sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#section-${section.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50/50 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-semibold text-sm group-hover:bg-amber-200 transition-colors">
                      {index + 1}
                    </div>
                    <span className="text-sm sm:text-base text-slate-700 group-hover:text-amber-700 transition-colors line-clamp-2">
                      {section.heading}
                    </span>
                    <ChevronRight size={16} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-auto" />
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
                  className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300"
                >
                  <div className="p-6 sm:p-8 lg:p-10">
                    {/* Section Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                          {section.heading}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            Section {index + 1}
                          </span>
                          <span>•</span>
                          <span>Environ {Math.ceil(section.paragraph.length / 100)} min de lecture</span>
                        </div>
                      </div>
                    </div>

                    {/* Section Content */}
                    <div className="prose prose-slate max-w-none">
                      <div className="bg-amber-50/30 rounded-xl p-6 border border-amber-200/30">
                        <p className="text-base sm:text-lg leading-relaxed text-slate-700 whitespace-pre-wrap">
                          {section.paragraph}
                        </p>
                      </div>
                    </div>

                    {/* Section Footer */}
                    <div className="mt-6 pt-6 border-t border-amber-200/30">
                      <div className="flex items-center justify-between">
                        <a
                          href="#top"
                          className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                        >
                          <ArrowRight size={16} className="rotate-270" />
                          Retour en haut
                        </a>
                        {index < sections.length - 1 && (
                          <a
                            href={`#section-${sections[index + 1].id}`}
                            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
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
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-amber-50/50 rounded-2xl border border-amber-200/30">
                <Clock size={20} className="text-amber-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">Dernière mise à jour</p>
                  <p className="text-sm text-slate-600">{formatDate()} 2025</p>
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