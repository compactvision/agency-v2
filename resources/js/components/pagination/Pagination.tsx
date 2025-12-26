import { router } from '@inertiajs/react';

export default function Pagination({ links }: { links: { url: string | null; label: string; active: boolean }[] }) {
    return (
        <div className="pagination__area">
            <nav className="pagination justify-content-center">
                <ul className="pagination__menu d-flex align-items-center justify-content-center">
                    {/* Flèche gauche */}
                    <li className="pagination__menu--items pagination__arrow d-flex">
                        {links[0] && (
                            <a
                                href={links[0].url ?? '#'}
                                className="pagination__arrow-icon link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (links[0].url) router.visit(links[0].url);
                                }}
                                dangerouslySetInnerHTML={{ __html: links[0].label }}
                            />
                        )}
                        <span className="pagination__arrow-icon">
                            <svg width={3} height={22} viewBox="0 0 3 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.50098 1L1.50098 21" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                            </svg>
                        </span>
                        {links[1] && (
                            <a
                                href={links[1].url ?? '#'}
                                className="pagination__arrow-icon link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (links[1].url) router.visit(links[1].url);
                                }}
                                dangerouslySetInnerHTML={{ __html: links[1].label }}
                            />
                        )}
                    </li>

                    {/* Pages numérotées */}
                    {links.slice(2, links.length - 2).map((link, index) => (
                        <li key={index} className="pagination__menu--items">
                            <a
                                href={link.url ?? '#'}
                                className={`pagination__menu--link ${link.active ? 'active color-accent-1' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (link.url) router.visit(link.url);
                                }}
                            />
                        </li>
                    ))}

                    {/* Flèche droite */}
                    <li className="pagination__menu--items pagination__arrow d-flex">
                        {links[links.length - 2] && (
                            <a
                                href={links[links.length - 2].url ?? '#'}
                                className="pagination__arrow-icon link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (links[links.length - 2].url) router.visit(links[links.length - 2].url);
                                }}
                                dangerouslySetInnerHTML={{ __html: links[links.length - 2].label }}
                            />
                        )}
                        <span className="pagination__arrow-icon">
                            <svg width={3} height={22} viewBox="0 0 3 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.50098 1L1.50098 21" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                            </svg>
                        </span>
                        {links[links.length - 1] && (
                            <a
                                href={links[links.length - 1].url ?? '#'}
                                className="pagination__arrow-icon link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (links[links.length - 1].url) router.visit(links[links.length - 1].url);
                                }}
                                dangerouslySetInnerHTML={{ __html: links[links.length - 1].label }}
                            />
                        )}
                    </li>
                </ul>
            </nav>
        </div>
    );
}
