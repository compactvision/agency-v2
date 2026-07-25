import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

const readableLabel = (label: string) =>
    label
        .replace(/&laquo;|&raquo;/g, '')
        .replace(/&hellip;/g, '…')
        .replace(/<[^>]*>/g, '')
        .trim();

export default function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length < 3) return null;

    const previous = links[0];
    const next = links[links.length - 1];
    const pages = links.slice(1, -1);

    const visit = (url: string | null) => {
        if (!url) return;

        router.visit(url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <nav
            aria-label="Pagination"
            className="flex w-full items-center justify-between gap-2 sm:justify-center sm:gap-3"
        >
            <button
                type="button"
                onClick={() => visit(previous.url)}
                disabled={!previous.url}
                aria-label="Page précédente"
                className="inline-flex h-10 shrink-0 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/10 hover:text-[#8A6C22] focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 dark:border-white/10 dark:bg-[#353130] dark:text-[#EEEFE6] dark:hover:bg-[#C9A84C]/15"
            >
                <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                <span className="hidden sm:inline">Précédent</span>
            </button>

            <div className="flex min-w-0 items-center gap-1 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {pages.map((link, index) => {
                    const label = readableLabel(link.label);
                    const isEllipsis = !link.url && !link.active;

                    if (isEllipsis) {
                        return (
                            <span
                                key={`${label}-${index}`}
                                aria-hidden="true"
                                className="flex h-10 min-w-8 items-center justify-center px-1 text-slate-400"
                            >
                                {label}
                            </span>
                        );
                    }

                    return (
                        <button
                            key={`${label}-${index}`}
                            type="button"
                            onClick={() => visit(link.url)}
                            disabled={!link.url && !link.active}
                            aria-label={`Page ${label}`}
                            aria-current={link.active ? 'page' : undefined}
                            className={`flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl px-3 text-sm font-bold transition focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:outline-none ${
                                link.active
                                    ? 'bg-[#1E3A5F] text-white shadow-sm dark:bg-[#C9A84C] dark:text-[#292625]'
                                    : 'border border-slate-200 bg-white text-slate-700 hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/10 dark:border-white/10 dark:bg-[#353130] dark:text-[#EEEFE6] dark:hover:bg-[#C9A84C]/15'
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={() => visit(next.url)}
                disabled={!next.url}
                aria-label="Page suivante"
                className="inline-flex h-10 shrink-0 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/10 hover:text-[#8A6C22] focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 dark:border-white/10 dark:bg-[#353130] dark:text-[#EEEFE6] dark:hover:bg-[#C9A84C]/15"
            >
                <span className="hidden sm:inline">Suivant</span>
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
        </nav>
    );
}
