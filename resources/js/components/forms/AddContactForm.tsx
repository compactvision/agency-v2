import ErrorText from "../ui/ErrorText";

export default function AddContactForm() {
    return (
        <div className="modal fade" id="modaladdcontact" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content modal__contact--main__content">
                    <div className="modal__contact--header d-flex align-items-center justify-content-between">
                        <h3 className="modal__contact--header__title">Add Contact</h3>
                        <button type="button" className="modal__contact--close__btn" data-bs-dismiss="modal" aria-label="Close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12.711" height="12.711" viewBox="0 0 12.711 12.711">
                                <g id="Group_7205" data-name="Group 7205" transform="translate(-113.644 -321.644)">
                                    <path
                                        id="Vector"
                                        d="M0,9.883,9.883,0"
                                        transform="translate(115.059 323.059)"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                    <path
                                        id="Vector-2"
                                        data-name="Vector"
                                        d="M9.883,9.883,0,0"
                                        transform="translate(115.059 323.059)"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </g>
                            </svg>
                        </button>
                    </div>
                    <div className="modal-body modal__contact--body">
                        <div className="modal__contact--form">
                            <form action="#">
                                <div className="modal__contact--form__input mb-20">
                                    <label className="modal__contact--input__label" htmlFor="name">
                                        Contact Name
                                    </label>
                                    <input className="modal__contact--input__field" placeholder="Enter Name" id="name" type="text" />
                                </div>
                                <div className="modal__contact--form__input mb-20">
                                    <label className="modal__contact--input__label">Description</label>
                                    <textarea className="modal__contact--textarea__field" placeholder="Description" defaultValue={''} />
                                </div>
                                <div className="modal__contact--footer">
                                    <button className="solid__btn border-0" type="submit">
                                        Contact
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
