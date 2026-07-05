import i18n from '@/i18n';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Link = {
    url: string | null;
    label: string;
    active: boolean;
};

export default function Pagination({
    links,
}: {
    readonly links: readonly Link[];
}) {
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
        <nav
            aria-label="Pagination navigation"
            className="mt-8 flex items-center justify-center"
        >
            <ul className="flex items-center space-x-1">
                {links.map((link) => {
                    const isDisabled = !link.url;
                    const isActive = link.active;
                    const hasIcon =
                        link.label.includes('Previous') ||
                        link.label.includes('Next');

                    return (
                        <li key={link.label + (link.url ?? '')}>
                            {link.url ? (
                                <button
                                    type="button"
                                    className={`relative inline-flex h-10 min-w-[40px] items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? 'scale-105 transform bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                            : 'border border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600'
                                    } ${hasIcon ? 'px-2' : 'px-3'} `}
                                    aria-current={isActive ? 'page' : undefined}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.get(
                                            link.url!,
                                            {},
                                            {
                                                preserveScroll: true,
                                                preserveState: true,
                                            },
                                        );
                                    }}
                                    disabled={isDisabled}
                                >
                                    <span className="flex items-center gap-1">
                                        {getIcon(link.label)}
                                        {!hasIcon && (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: translateLabel(
                                                        link.label,
                                                    ),
                                                }}
                                            />
                                        )}
                                        {hasIcon && (
                                            <span className="sr-only">
                                                {translateLabel(link.label)}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            ) : (
                                <span
                                    className={`relative inline-flex h-10 min-w-[40px] cursor-not-allowed items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-400 ${hasIcon ? 'px-2' : 'px-3'} `}
                                >
                                    <span className="flex items-center gap-1">
                                        {getIcon(link.label)}
                                        {!hasIcon && (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: translateLabel(
                                                        link.label,
                                                    ),
                                                }}
                                            />
                                        )}
                                        {hasIcon && (
                                            <span className="sr-only">
                                                {translateLabel(link.label)}
                                            </span>
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
