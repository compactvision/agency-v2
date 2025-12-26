import i18n from '@/i18n';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Link = {
    url: string | null;
    label: string;
    active: boolean;
};

export default function Pagination({ links }: { readonly links: readonly Link[] }) {
    function translateLabel(label: string): string {
        if (label.includes('Previous')) {
            return i18n.language === 'fr' ? 'Précédent' : 'Previous';
        }
        if (label.includes('Next')) {
            return i18n.language === 'fr' ? 'Suivant' : 'Next';
        }
        return label;
    }

    function getIcon(label: string) {
        if (label.includes('Previous')) {
            return <ChevronLeft size={18} />;
        }
        if (label.includes('Next')) {
            return <ChevronRight size={18} />;
        }
        return null;
    }

    return (
        <nav aria-label="Pagination navigation" className="flex justify-center items-center mt-8">
            <ul className="flex items-center space-x-1">
                {links.map((link) => {
                    const isDisabled = !link.url;
                    const isActive = link.active;
                    const hasIcon = link.label.includes('Previous') || link.label.includes('Next');
                    
                    return (
                        <li key={link.label + (link.url ?? '')}>
                            {link.url ? (
                                <button
                                    type="button"
                                    className={`
                                        relative inline-flex items-center justify-center
                                        min-w-[40px] h-10 px-3 py-2 text-sm font-medium
                                        rounded-lg transition-all duration-200
                                        ${isActive 
                                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105' 
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600'
                                        }
                                        ${hasIcon ? 'px-2' : 'px-3'}
                                    `}
                                    aria-current={isActive ? 'page' : undefined}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.get(link.url!, {}, { preserveScroll: true, preserveState: true });
                                    }}
                                    disabled={isDisabled}
                                >
                                    <span className="flex items-center gap-1">
                                        {getIcon(link.label)}
                                        {!hasIcon && (
                                            <span dangerouslySetInnerHTML={{ __html: translateLabel(link.label) }} />
                                        )}
                                        {hasIcon && (
                                            <span className="sr-only">{translateLabel(link.label)}</span>
                                        )}
                                    </span>
                                </button>
                            ) : (
                                <span
                                    className={`
                                        relative inline-flex items-center justify-center
                                        min-w-[40px] h-10 px-3 py-2 text-sm font-medium
                                        rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed
                                        ${hasIcon ? 'px-2' : 'px-3'}
                                    `}
                                >
                                    <span className="flex items-center gap-1">
                                        {getIcon(link.label)}
                                        {!hasIcon && (
                                            <span dangerouslySetInnerHTML={{ __html: translateLabel(link.label) }} />
                                        )}
                                        {hasIcon && (
                                            <span className="sr-only">{translateLabel(link.label)}</span>
                                        )}
                                    </span>
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}