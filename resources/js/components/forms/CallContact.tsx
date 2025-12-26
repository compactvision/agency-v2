export default function CallContact() {
    return (
        <div className="modal fade" id="modaladdcalls" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content modal__contact--main__content">
                    <div className="modal-body modal__contact--body">
                        <div className="modal__calling--wrapper">
                            <div className="modal__calling--author">
                                <img className="modal__calling--author__thumb" src="./assets/img/dashboard/calling-author.png" alt="img" />
                                <h3 className="modal__calling--author__name">William Heineman</h3>
                                <span className="modal__calling--author__subtitle">Calling...</span>
                            </div>
                            <div className="modal__calls--footer d-flex justify-content-center">
                                <button className="call__receive border-0">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        data-lucide="phone-call"
                                        className="lucide lucide-phone-call"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        <path d="M14.05 2a9 9 0 0 1 8 7.94" />
                                        <path d="M14.05 6A5 5 0 0 1 18 10" />
                                    </svg>
                                </button>
                                <button className="call__cancel color-accent-2 border-0" data-bs-dismiss="modal">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        data-lucide="phone"
                                        className="lucide lucide-phone"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
