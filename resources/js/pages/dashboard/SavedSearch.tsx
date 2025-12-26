import Dashboard from '@/components/layouts/Dashboard/Dashboard';

export default function SavedSearch() {
    return (
        <Dashboard>
            <div className="dashboard__container dashboard__reviews--container">
                <div className="reviews__heading mb-30">
                    <h2 className="reviews__heading--title">Saved Search</h2>
                    <p className="reviews__heading--desc">We are glad to see you again!</p>
                </div>
                <div className="dashboard__reviews--wrapper">
                    <div className="reviews__table table-responsive">
                        <table className="reviews__table--wrapper">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Posted Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <span className="saved__search--name">Property List New York</span>
                                    </td>
                                    <td>
                                        <span className="reviews__date">Thu Jun 2021</span>
                                    </td>
                                    <td>
                                        <div className="reviews__action--wrapper position-relative">
                                            <button
                                                className="reviews__action--btn"
                                                aria-label="action button"
                                                type="button"
                                                aria-expanded="true"
                                                data-bs-toggle="dropdown"
                                            >
                                                <svg width={3} height={17} viewBox="0 0 3 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="8.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="15.5" r="1.5" fill="currentColor" />
                                                </svg>
                                            </button>
                                            <ul className="dropdown-menu sold-out__user--dropdown" data-popper-placement="bottom-start">
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Edit
                                                    </a>
                                                </li>
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Remove
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="saved__search--name">London 3 beds</span>
                                    </td>
                                    <td>
                                        <span className="reviews__date">Thu Jun 2021</span>
                                    </td>
                                    <td>
                                        <div className="reviews__action--wrapper position-relative">
                                            <button
                                                className="reviews__action--btn"
                                                aria-label="action button"
                                                type="button"
                                                aria-expanded="true"
                                                data-bs-toggle="dropdown"
                                            >
                                                <svg width={3} height={17} viewBox="0 0 3 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="8.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="15.5" r="1.5" fill="currentColor" />
                                                </svg>
                                            </button>
                                            <ul className="dropdown-menu sold-out__user--dropdown" data-popper-placement="bottom-start">
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Edit
                                                    </a>
                                                </li>
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Remove
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="saved__search--name">Marie Prohaska</span>
                                    </td>
                                    <td>
                                        <span className="reviews__date">Thu Jun 2021</span>
                                    </td>
                                    <td>
                                        <div className="reviews__action--wrapper position-relative">
                                            <button
                                                className="reviews__action--btn"
                                                aria-label="action button"
                                                type="button"
                                                aria-expanded="true"
                                                data-bs-toggle="dropdown"
                                            >
                                                <svg width={3} height={17} viewBox="0 0 3 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="8.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="15.5" r="1.5" fill="currentColor" />
                                                </svg>
                                            </button>
                                            <ul className="dropdown-menu sold-out__user--dropdown" data-popper-placement="bottom-start">
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Edit
                                                    </a>
                                                </li>
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Remove
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="saved__search--name">Paris $100-$100</span>
                                    </td>
                                    <td>
                                        <span className="reviews__date">Thu Jun 2021</span>
                                    </td>
                                    <td>
                                        <div className="reviews__action--wrapper position-relative">
                                            <button
                                                className="reviews__action--btn"
                                                aria-label="action button"
                                                type="button"
                                                aria-expanded="true"
                                                data-bs-toggle="dropdown"
                                            >
                                                <svg width={3} height={17} viewBox="0 0 3 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="8.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="15.5" r="1.5" fill="currentColor" />
                                                </svg>
                                            </button>
                                            <ul className="dropdown-menu sold-out__user--dropdown" data-popper-placement="bottom-start">
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Edit
                                                    </a>
                                                </li>
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Remove
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="saved__search--name">Small Houses</span>
                                    </td>
                                    <td>
                                        <span className="reviews__date">Thu Jun 2021</span>
                                    </td>
                                    <td>
                                        <div className="reviews__action--wrapper position-relative">
                                            <button
                                                className="reviews__action--btn"
                                                aria-label="action button"
                                                type="button"
                                                aria-expanded="true"
                                                data-bs-toggle="dropdown"
                                            >
                                                <svg width={3} height={17} viewBox="0 0 3 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="8.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="15.5" r="1.5" fill="currentColor" />
                                                </svg>
                                            </button>
                                            <ul className="dropdown-menu sold-out__user--dropdown" data-popper-placement="bottom-start">
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Edit
                                                    </a>
                                                </li>
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Remove
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="saved__search--name">Apartments Near Market</span>
                                    </td>
                                    <td>
                                        <span className="reviews__date">Thu Jun 2021</span>
                                    </td>
                                    <td>
                                        <div className="reviews__action--wrapper position-relative">
                                            <button
                                                className="reviews__action--btn"
                                                aria-label="action button"
                                                type="button"
                                                aria-expanded="true"
                                                data-bs-toggle="dropdown"
                                            >
                                                <svg width={3} height={17} viewBox="0 0 3 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="8.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="15.5" r="1.5" fill="currentColor" />
                                                </svg>
                                            </button>
                                            <ul className="dropdown-menu sold-out__user--dropdown" data-popper-placement="bottom-start">
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Edit
                                                    </a>
                                                </li>
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Remove
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="saved__search--name">Villa in California with pool</span>
                                    </td>
                                    <td>
                                        <span className="reviews__date">Thu Jun 2021</span>
                                    </td>
                                    <td>
                                        <div className="reviews__action--wrapper position-relative">
                                            <button
                                                className="reviews__action--btn"
                                                aria-label="action button"
                                                type="button"
                                                aria-expanded="true"
                                                data-bs-toggle="dropdown"
                                            >
                                                <svg width={3} height={17} viewBox="0 0 3 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="8.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="15.5" r="1.5" fill="currentColor" />
                                                </svg>
                                            </button>
                                            <ul className="dropdown-menu sold-out__user--dropdown" data-popper-placement="bottom-start">
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Edit
                                                    </a>
                                                </li>
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Remove
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="saved__search--name">Home for Rent</span>
                                    </td>
                                    <td>
                                        <span className="reviews__date">Thu Jun 2021</span>
                                    </td>
                                    <td>
                                        <div className="reviews__action--wrapper position-relative">
                                            <button
                                                className="reviews__action--btn"
                                                aria-label="action button"
                                                type="button"
                                                aria-expanded="true"
                                                data-bs-toggle="dropdown"
                                            >
                                                <svg width={3} height={17} viewBox="0 0 3 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="8.5" r="1.5" fill="currentColor" />
                                                    <circle cx="1.5" cy="15.5" r="1.5" fill="currentColor" />
                                                </svg>
                                            </button>
                                            <ul className="dropdown-menu sold-out__user--dropdown" data-popper-placement="bottom-start">
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Edit
                                                    </a>
                                                </li>
                                                <li>
                                                    <a data-bs-toggle="modal" href="#">
                                                        Remove
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination__area">
                        <nav className="pagination justify-content-center">
                            <ul className="pagination__menu d-flex align-items-center justify-content-center">
                                <li className="pagination__menu--items pagination__arrow d-flex">
                                    <a href="#" className="pagination__arrow-icon link">
                                        <svg width={12} height={22} viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.583 20.5832L0.999675 10.9998L10.583 1.4165" stroke="currentColor" strokeWidth={2} />
                                        </svg>
                                        <span className="visually-hidden">page left arrow</span>
                                    </a>
                                    <span className="pagination__arrow-icon">
                                        <svg width={3} height={22} viewBox="0 0 3 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.50098 1L1.50098 21" stroke="currentColor" strokeWidth={2} />
                                        </svg>
                                    </span>
                                    <a href="#" className="pagination__arrow-icon link">
                                        <svg width={12} height={22} viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.001 20.5832L1.41764 10.9998L11.001 1.4165" stroke="currentColor" strokeWidth={2} />
                                        </svg>
                                        <span className="visually-hidden">page left arrow</span>
                                    </a>
                                </li>
                                <li className="pagination__menu--items">
                                    <a href="#" className="pagination__menu--link">
                                        01
                                    </a>
                                </li>
                                <li className="pagination__menu--items">
                                    <a href="#" className="pagination__menu--link active color-accent-1">
                                        02
                                    </a>
                                </li>
                                <li className="pagination__menu--items">
                                    <a href="#" className="pagination__menu--link">
                                        03
                                    </a>
                                </li>
                                <li className="pagination__menu--items pagination__arrow d-flex">
                                    <a href="#" className="pagination__arrow-icon link">
                                        <svg width={12} height={22} viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.00098 20.5832L10.5843 10.9998L1.00098 1.4165" stroke="currentColor" strokeWidth={2} />
                                        </svg>
                                        <span className="visually-hidden">page right arrow</span>
                                    </a>
                                    <span className="pagination__arrow-icon">
                                        <svg width={3} height={22} viewBox="0 0 3 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.50098 1L1.50098 21" stroke="currentColor" strokeWidth={2} />
                                        </svg>
                                    </span>
                                    <a href="#" className="pagination__arrow-icon link">
                                        <svg width={12} height={22} viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.41895 20.5832L11.0023 10.9998L1.41895 1.4165" stroke="currentColor" strokeWidth={2} />
                                        </svg>
                                        <span className="visually-hidden">page right arrow</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
