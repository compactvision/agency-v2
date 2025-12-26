import AddContactForm from '@/components/forms/AddContactForm';
import CallContact from '@/components/forms/CallContact';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';

export default function Message() {
    return (
        <Dashboard>
            <div className="dashboard__container dashboard__chat--container d-flex">
                <div className="chat__sidebar">
                    <ul className="nav chat__sidebar--btn top">
                        <li className="nav-item chat__sidebar--btn__list">
                            <button className="chat__sidebar--btn__field active" data-bs-toggle="tab" data-bs-target="#chat" type="button">
                                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M14.1665 7.50008C14.1665 10.7251 11.3665 13.3334 7.9165 13.3334L7.14151 14.2667L6.68317 14.8168C6.29151 15.2834 5.5415 15.1834 5.28317 14.6251L4.1665 12.1667C2.64984 11.1001 1.6665 9.40842 1.6665 7.50008C1.6665 4.27508 4.4665 1.66675 7.9165 1.66675C10.4332 1.66675 12.6082 3.05842 13.5832 5.05842C13.9582 5.80009 14.1665 6.62508 14.1665 7.50008Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M18.3333 10.7167C18.3333 12.625 17.3499 14.3167 15.8333 15.3834L14.7166 17.8417C14.4583 18.4 13.7083 18.5084 13.3166 18.0334L12.0833 16.55C10.0666 16.55 8.2666 15.6583 7.1416 14.2667L7.9166 13.3333C11.3666 13.3333 14.1666 10.725 14.1666 7.50001C14.1666 6.62501 13.9583 5.80002 13.5833 5.05835C16.3083 5.68335 18.3333 7.98333 18.3333 10.7167Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path d="M5.8335 7.5H10.0002" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </li>
                        <li className="nav-item chat__sidebar--btn__list">
                            <button className="chat__sidebar--btn__field" data-bs-toggle="tab" data-bs-target="#calls" type="button">
                                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M18.3082 15.2751C18.3082 15.5751 18.2415 15.8834 18.0998 16.1834C17.9582 16.4834 17.7748 16.7667 17.5332 17.0334C17.1248 17.4834 16.6748 17.8084 16.1665 18.0167C15.6665 18.2251 15.1248 18.3334 14.5415 18.3334C13.6915 18.3334 12.7832 18.1334 11.8248 17.7251C10.8665 17.3167 9.90817 16.7667 8.95817 16.0751C7.99984 15.3751 7.0915 14.6001 6.22484 13.7417C5.3665 12.8751 4.5915 11.9667 3.89984 11.0167C3.2165 10.0667 2.6665 9.11675 2.2665 8.17508C1.8665 7.22508 1.6665 6.31675 1.6665 5.45008C1.6665 4.88341 1.7665 4.34175 1.9665 3.84175C2.1665 3.33341 2.48317 2.86675 2.92484 2.45008C3.45817 1.92508 4.0415 1.66675 4.65817 1.66675C4.8915 1.66675 5.12484 1.71675 5.33317 1.81675C5.54984 1.91675 5.7415 2.06675 5.8915 2.28341L7.82484 5.00842C7.97484 5.21675 8.08317 5.40841 8.15817 5.59175C8.23317 5.76675 8.27484 5.94175 8.27484 6.10008C8.27484 6.30008 8.2165 6.50008 8.09984 6.69175C7.9915 6.88341 7.83317 7.08341 7.63317 7.28341L6.99984 7.94175C6.90817 8.03341 6.8665 8.14175 6.8665 8.27508C6.8665 8.34175 6.87484 8.40008 6.8915 8.46675C6.9165 8.53341 6.9415 8.58341 6.95817 8.63341C7.10817 8.90841 7.3665 9.26675 7.73317 9.70008C8.10817 10.1334 8.50817 10.5751 8.9415 11.0167C9.3915 11.4584 9.82484 11.8667 10.2665 12.2417C10.6998 12.6084 11.0582 12.8584 11.3415 13.0084C11.3832 13.0251 11.4332 13.0501 11.4915 13.0751C11.5582 13.1001 11.6248 13.1084 11.6998 13.1084C11.8415 13.1084 11.9498 13.0584 12.0415 12.9667L12.6748 12.3417C12.8832 12.1334 13.0832 11.9751 13.2748 11.8751C13.4665 11.7584 13.6582 11.7001 13.8665 11.7001C14.0248 11.7001 14.1915 11.7334 14.3748 11.8084C14.5582 11.8834 14.7498 11.9917 14.9582 12.1334L17.7165 14.0917C17.9332 14.2417 18.0832 14.4167 18.1748 14.6251C18.2582 14.8334 18.3082 15.0417 18.3082 15.2751Z"
                                        stroke="currentColor"
                                        strokeMiterlimit={10}
                                    />
                                </svg>
                            </button>
                        </li>
                        <li className="nav-item chat__sidebar--btn__list">
                            <button className="chat__sidebar--btn__field" data-bs-toggle="tab" data-bs-target="#contact" type="button">
                                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1.8335 11.6833C2.6085 15.4833 5.96683 18.3334 10.0002 18.3334C14.0168 18.3334 17.3668 15.4917 18.1585 11.7083"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M18.1752 8.38341C17.4252 4.55008 14.0502 1.66675 10.0002 1.66675C5.97517 1.66675 2.61683 4.52509 1.8335 8.31676"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M10 11.25C10.6904 11.25 11.25 10.6904 11.25 10C11.25 9.30964 10.6904 8.75 10 8.75C9.30964 8.75 8.75 9.30964 8.75 10C8.75 10.6904 9.30964 11.25 10 11.25Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </li>
                    </ul>
                    <ul className="nav chat__sidebar--btn bottom">
                        <li className="chat__sidebar--btn__list">
                            <button className="chat__sidebar--btn__field" type="button">
                                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M11.4416 2.92495L12.9083 5.85828C13.1083 6.26662 13.6416 6.65828 14.0916 6.73328L16.7499 7.17495C18.4499 7.45828 18.8499 8.69162 17.6249 9.90828L15.5583 11.975C15.2083 12.325 15.0166 13 15.1249 13.4833L15.7166 16.0416C16.1833 18.0666 15.1083 18.85 13.3166 17.7916L10.8249 16.3166C10.3749 16.05 9.63326 16.05 9.17492 16.3166L6.68326 17.7916C4.89992 18.85 3.81659 18.0583 4.28326 16.0416L4.87492 13.4833C4.98326 13 4.79159 12.325 4.44159 11.975L2.37492 9.90828C1.15826 8.69162 1.54992 7.45828 3.24992 7.17495L5.90826 6.73328C6.34992 6.65828 6.88326 6.26662 7.08326 5.85828L8.54992 2.92495C9.34992 1.33328 10.6499 1.33328 11.4416 2.92495Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </li>
                        <li className="chat__sidebar--btn__list">
                            <button className="chat__sidebar--btn__field" type="button">
                                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7.7085 7.54175C9.19183 8.08341 10.8085 8.08341 12.2918 7.54175"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M14.0166 1.66675H5.98327C4.20827 1.66675 2.7666 3.11675 2.7666 4.88341V16.6251C2.7666 18.1251 3.8416 18.7584 5.15827 18.0334L9.22493 15.7751C9.65827 15.5334 10.3583 15.5334 10.7833 15.7751L14.8499 18.0334C16.1666 18.7667 17.2416 18.1334 17.2416 16.6251V4.88341C17.2333 3.11675 15.7916 1.66675 14.0166 1.66675Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M14.0166 1.66675H5.98327C4.20827 1.66675 2.7666 3.11675 2.7666 4.88341V16.6251C2.7666 18.1251 3.8416 18.7584 5.15827 18.0334L9.22493 15.7751C9.65827 15.5334 10.3583 15.5334 10.7833 15.7751L14.8499 18.0334C16.1666 18.7667 17.2416 18.1334 17.2416 16.6251V4.88341C17.2333 3.11675 15.7916 1.66675 14.0166 1.66675Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </li>
                        <li className="chat__sidebar--btn__list">
                            <a className="chat__sidebar--btn__field" href="./settings.html">
                                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                                        stroke="currentColor"
                                        strokeMiterlimit={10}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M1.6665 10.7334V9.26669C1.6665 8.40003 2.37484 7.68336 3.24984 7.68336C4.75817 7.68336 5.37484 6.6167 4.6165 5.30836C4.18317 4.55836 4.4415 3.58336 5.19984 3.15003L6.6415 2.32503C7.29984 1.93336 8.14984 2.1667 8.5415 2.82503L8.63317 2.98336C9.38317 4.2917 10.6165 4.2917 11.3748 2.98336L11.4665 2.82503C11.8582 2.1667 12.7082 1.93336 13.3665 2.32503L14.8082 3.15003C15.5665 3.58336 15.8248 4.55836 15.3915 5.30836C14.6332 6.6167 15.2498 7.68336 16.7582 7.68336C17.6248 7.68336 18.3415 8.39169 18.3415 9.26669V10.7334C18.3415 11.6 17.6332 12.3167 16.7582 12.3167C15.2498 12.3167 14.6332 13.3834 15.3915 14.6917C15.8248 15.45 15.5665 16.4167 14.8082 16.85L13.3665 17.675C12.7082 18.0667 11.8582 17.8334 11.4665 17.175L11.3748 17.0167C10.6248 15.7084 9.3915 15.7084 8.63317 17.0167L8.5415 17.175C8.14984 17.8334 7.29984 18.0667 6.6415 17.675L5.19984 16.85C4.4415 16.4167 4.18317 15.4417 4.6165 14.6917C5.37484 13.3834 4.75817 12.3167 3.24984 12.3167C2.37484 12.3167 1.6665 11.6 1.6665 10.7334Z"
                                        stroke="currentColor"
                                        strokeMiterlimit={10}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="visually-hidden">Setting</span>
                            </a>
                        </li>
                        <li className="chat__sidebar--btn__list profile">
                            <a className="chat__sidebar--btn__field" href="./profile.html">
                                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M10.0999 10.65C10.0416 10.6417 9.9666 10.6417 9.89993 10.65C8.43327 10.6 7.2666 9.39998 7.2666 7.92498C7.2666 6.41665 8.48327 5.19165 9.99993 5.19165C11.5083 5.19165 12.7333 6.41665 12.7333 7.92498C12.7249 9.39998 11.5666 10.6 10.0999 10.65Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M15.6166 16.15C14.1333 17.5084 12.1666 18.3334 9.99997 18.3334C7.8333 18.3334 5.86663 17.5084 4.3833 16.15C4.46663 15.3667 4.96663 14.6 5.8583 14C8.14163 12.4834 11.875 12.4834 14.1416 14C15.0333 14.6 15.5333 15.3667 15.6166 16.15Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M9.99984 18.3334C14.6022 18.3334 18.3332 14.6025 18.3332 10.0001C18.3332 5.39771 14.6022 1.66675 9.99984 1.66675C5.39746 1.66675 1.6665 5.39771 1.6665 10.0001C1.6665 14.6025 5.39746 18.3334 9.99984 18.3334Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="visually-hidden">Profile</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="chat__inbox">
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="chat">
                            <div className="chat__inbox--content">
                                <div className="chat__inbox--header d-flex align-items-center justify-content-between">
                                    <h2 className="chat__inbox--header__title">Chats</h2>
                                    <button
                                        className="chat__inbox--popup__btn"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modaladdcontact"
                                        aria-label="popup button"
                                    >
                                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M9.99984 18.3334C14.5832 18.3334 18.3332 14.5834 18.3332 10.0001C18.3332 5.41675 14.5832 1.66675 9.99984 1.66675C5.4165 1.66675 1.6665 5.41675 1.6665 10.0001C1.6665 14.5834 5.4165 18.3334 9.99984 18.3334Z"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path d="M6.6665 10H13.3332" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10 13.3334V6.66675" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="chat__inbox--search">
                                    <form action="#">
                                        <input className="chat__inbox--search__input" placeholder="Search Chat ...." type="text" />
                                        <button className="chat__inbox--search__btn" aria-label="search button" type="submit">
                                            <svg width={12} height={12} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M4.79171 8.74992C6.97783 8.74992 8.75004 6.97771 8.75004 4.79159C8.75004 2.60546 6.97783 0.833252 4.79171 0.833252C2.60558 0.833252 0.833374 2.60546 0.833374 4.79159C0.833374 6.97771 2.60558 8.74992 4.79171 8.74992Z"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M9.16671 9.16659L8.33337 8.33325"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                                <div className="chat__inbox--wrapper">
                                    <ul className="chat__inbox--menu">
                                        <li className="chat__inbox--menu__list">
                                            <span className="chat__inbox--menu__title">Recent Chats</span>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link active" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author1.png" alt="img" />
                                                            <span className="chat__inbox--author__badge active" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Marie Prohaska</h3>
                                                            <p className="chat__inbox--author__desc">I will purchase it for support</p>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">2 min ago</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author2.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Kara Miller</h3>
                                                            <p className="chat__inbox--author__desc">Hey, how's it going?</p>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">1:32PM</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author3.png" alt="img" />
                                                            <span className="chat__inbox--author__badge active" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Jaqueline Hammes</h3>
                                                            <p className="chat__inbox--author__desc active">Typing...</p>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">14/06/2024</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <span className="chat__inbox--menu__title">All Conversion</span>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author4.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Marie Prohaska</h3>
                                                            <p className="chat__inbox--author__desc">Chat with you later,bye</p>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">9:45AM</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author5.png" alt="img" />
                                                            <span className="chat__inbox--author__badge active" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Jaqueline Hammes</h3>
                                                            <p className="chat__inbox--author__desc">Nice to meet you 😊</p>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">48 min ago</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author6.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Daniel Miller</h3>
                                                            <p className="chat__inbox--author__desc active">Congratulations on your new</p>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">8:31AM</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author7.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Megan Fox</h3>
                                                            <p className="chat__inbox--author__desc active">Great work keep it up :-)</p>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">Tues</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author8.png" alt="img" />
                                                            <span className="chat__inbox--author__badge active" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Nicholas Sams</h3>
                                                            <p className="chat__inbox--author__desc active">Hike management fixed</p>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">25 min ago</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author9.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Pope Johnson</h3>
                                                            <p className="chat__inbox--author__desc active">You are need to be appreacia</p>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">15 Jan</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author2.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Kara Miller</h3>
                                                            <p className="chat__inbox--author__desc">Hey, how's it going?</p>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">1:32PM</span>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="calls">
                            <div className="chat__inbox--content">
                                <div className="chat__inbox--header">
                                    <h2 className="chat__inbox--header__title">Calls</h2>
                                </div>
                                <div className="chat__inbox--search">
                                    <form action="#">
                                        <input className="chat__inbox--search__input" placeholder="Search Chat ...." type="text" />
                                        <button className="chat__inbox--search__btn" aria-label="search button" type="submit">
                                            <svg width={12} height={12} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M4.79171 8.74992C6.97783 8.74992 8.75004 6.97771 8.75004 4.79159C8.75004 2.60546 6.97783 0.833252 4.79171 0.833252C2.60558 0.833252 0.833374 2.60546 0.833374 4.79159C0.833374 6.97771 2.60558 8.74992 4.79171 8.74992Z"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M9.16671 9.16659L8.33337 8.33325"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                                <div className="chat__inbox--wrapper">
                                    <ul className="chat__inbox--menu">
                                        <li className="chat__inbox--menu__list">
                                            <span className="chat__inbox--menu__title">Recent Calls</span>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link active" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author1.png" alt="img" />
                                                            <span className="chat__inbox--author__badge active" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Marie Prohaska</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">2 min ago</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author2.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Kara Miller</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">1:32PM</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author3.png" alt="img" />
                                                            <span className="chat__inbox--author__badge active" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Jaqueline Hammes</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">14/06/2024</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author4.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Marie Prohaska</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">9:45AM</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author5.png" alt="img" />
                                                            <span className="chat__inbox--author__badge active" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Jaqueline Hammes</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">48 min ago</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author6.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Daniel Miller</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">8:31AM</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author7.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Megan Fox</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">Tues</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author8.png" alt="img" />
                                                            <span className="chat__inbox--author__badge active" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Nicholas Sams</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">25 min ago</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author9.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Pope Johnson</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">15 Jan</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author2.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Kara Miller</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">1:32PM</span>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="contact">
                            <div className="chat__inbox--content">
                                <div className="chat__inbox--header">
                                    <h2 className="chat__inbox--header__title">Contacts</h2>
                                </div>
                                <div className="chat__inbox--search">
                                    <form action="#">
                                        <input className="chat__inbox--search__input" placeholder="Search Chat ...." type="text" />
                                        <button className="chat__inbox--search__btn" aria-label="search button" type="submit">
                                            <svg width={12} height={12} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M4.79171 8.74992C6.97783 8.74992 8.75004 6.97771 8.75004 4.79159C8.75004 2.60546 6.97783 0.833252 4.79171 0.833252C2.60558 0.833252 0.833374 2.60546 0.833374 4.79159C0.833374 6.97771 2.60558 8.74992 4.79171 8.74992Z"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M9.16671 9.16659L8.33337 8.33325"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                                <div className="chat__inbox--wrapper">
                                    <ul className="chat__inbox--menu">
                                        <li className="chat__inbox--menu__list">
                                            <span className="chat__inbox--menu__title">My Contacts</span>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link active" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author1.png" alt="img" />
                                                            <span className="chat__inbox--author__badge active" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Marie Prohaska</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">2 min ago</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author2.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Kara Miller</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">1:32PM</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author3.png" alt="img" />
                                                            <span className="chat__inbox--author__badge active" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Jaqueline Hammes</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">14/06/2024</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author4.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Marie Prohaska</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">9:45AM</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author5.png" alt="img" />
                                                            <span className="chat__inbox--author__badge active" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Jaqueline Hammes</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">48 min ago</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author6.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Daniel Miller</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">8:31AM</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author7.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Megan Fox</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">Tues</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author8.png" alt="img" />
                                                            <span className="chat__inbox--author__badge active" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Nicholas Sams</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">25 min ago</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author9.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Pope Johnson</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">15 Jan</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="chat__inbox--menu__list">
                                            <a className="chat__inbox--menu__link" href="#">
                                                <div className="chat__inbox--menu__wrapper d-flex justify-content-between">
                                                    <div className="chat__inbox--author d-flex align-items-center">
                                                        <div className="chat__inbox--author__thumbnail">
                                                            <img src="./assets/img/dashboard/inbox-author2.png" alt="img" />
                                                            <span className="chat__inbox--author__badge" />
                                                        </div>
                                                        <div className="chat__inbox--author__content">
                                                            <h3 className="chat__inbox--author--name">Kara Miller</h3>
                                                        </div>
                                                    </div>
                                                    <span className="chat__inbox--date-time">1:32PM</span>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="chat__message--box">
                    <div className="chat__message--header d-flex align-items-center justify-content-between">
                        <div className="chat__message--author d-flex align-items-center">
                            <div className="chat__message--author__thumbnail">
                                <img src="./assets/img/dashboard/message-author.png" alt="img" />
                                <span className="chat__message--author__badge" />
                            </div>
                            <div className="chat__message--author__text">
                                <h3 className="chat__message--author__title">Marie Prohaska</h3>
                                <span className="chat__message--author__subtitle">Online</span>
                            </div>
                        </div>
                        <ul className="chat__message--account d-flex">
                            <li className="chat__message--account__items">
                                <a className="chat__message--account__btn" data-bs-toggle="modal" data-bs-target="#modaladdcalls" href="#">
                                    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M16.4775 13.7475C16.4775 14.0175 16.4175 14.295 16.29 14.565C16.1625 14.835 15.9975 15.09 15.78 15.33C15.4125 15.735 15.0075 16.0275 14.55 16.215C14.1 16.4025 13.6125 16.5 13.0875 16.5C12.3225 16.5 11.505 16.32 10.6425 15.9525C9.78 15.585 8.9175 15.09 8.0625 14.4675C7.2 13.8375 6.3825 13.14 5.6025 12.3675C4.83 11.5875 4.1325 10.77 3.51 9.915C2.895 9.06 2.4 8.205 2.04 7.3575C1.68 6.5025 1.5 5.685 1.5 4.905C1.5 4.395 1.59 3.9075 1.77 3.4575C1.95 3 2.235 2.58 2.6325 2.205C3.1125 1.7325 3.6375 1.5 4.1925 1.5C4.4025 1.5 4.6125 1.545 4.8 1.635C4.995 1.725 5.1675 1.86 5.3025 2.055L7.0425 4.5075C7.1775 4.695 7.275 4.8675 7.3425 5.0325C7.41 5.19 7.4475 5.3475 7.4475 5.49C7.4475 5.67 7.395 5.85 7.29 6.0225C7.1925 6.195 7.05 6.375 6.87 6.555L6.3 7.1475C6.2175 7.23 6.18 7.3275 6.18 7.4475C6.18 7.5075 6.1875 7.56 6.2025 7.62C6.225 7.68 6.2475 7.725 6.2625 7.77C6.3975 8.0175 6.63 8.34 6.96 8.73C7.2975 9.12 7.6575 9.5175 8.0475 9.915C8.4525 10.3125 8.8425 10.68 9.24 11.0175C9.63 11.3475 9.9525 11.5725 10.2075 11.7075C10.245 11.7225 10.29 11.745 10.3425 11.7675C10.4025 11.79 10.4625 11.7975 10.53 11.7975C10.6575 11.7975 10.755 11.7525 10.8375 11.67L11.4075 11.1075C11.595 10.92 11.775 10.7775 11.9475 10.6875C12.12 10.5825 12.2925 10.53 12.48 10.53C12.6225 10.53 12.7725 10.56 12.9375 10.6275C13.1025 10.695 13.275 10.7925 13.4625 10.92L15.945 12.6825C16.14 12.8175 16.275 12.975 16.3575 13.1625C16.4325 13.35 16.4775 13.5375 16.4775 13.7475Z"
                                            stroke="currentColor"
                                            strokeMiterlimit={10}
                                        />
                                    </svg>
                                </a>
                            </li>
                            <li className="chat__message--account__items">
                                <a className="chat__message--account__btn" href="#">
                                    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9.3975 15.3151H4.6575C2.2875 15.3151 1.5 13.7401 1.5 12.1576V5.84256C1.5 3.47256 2.2875 2.68506 4.6575 2.68506H9.3975C11.7675 2.68506 12.555 3.47256 12.555 5.84256V12.1576C12.555 14.5276 11.76 15.3151 9.3975 15.3151Z"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M14.6402 12.8251L12.5552 11.3626V6.6301L14.6402 5.1676C15.6602 4.4551 16.5002 4.8901 16.5002 6.1426V11.8576C16.5002 13.1101 15.6602 13.5451 14.6402 12.8251Z"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M8.625 8.25C9.24632 8.25 9.75 7.74632 9.75 7.125C9.75 6.50368 9.24632 6 8.625 6C8.00368 6 7.5 6.50368 7.5 7.125C7.5 7.74632 8.00368 8.25 8.625 8.25Z"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </a>
                            </li>
                            <li className="chat__message--account__items">
                                <a className="chat__message--account__btn" href="#">
                                    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.625 15.75C12.56 15.75 15.75 12.56 15.75 8.625C15.75 4.68997 12.56 1.5 8.625 1.5C4.68997 1.5 1.5 4.68997 1.5 8.625C1.5 12.56 4.68997 15.75 8.625 15.75Z"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path d="M16.5 16.5L15 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="chat__message--wrapper">
                        <div className="chat__message--list message__in">
                            <span className="chatting__message--date">Tues 23:14</span>
                            <div className="chat__message--list__inner">
                                <div className="chatting__message--thumb">
                                    <img src="./assets/img/dashboard/message-author.png" alt="img" />
                                </div>
                                <div className="chatting__message--content">
                                    <div className="chatting__message--text">
                                        <p className="chatting__message--desc">Nice to meet you</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="chat__message--list message__out">
                            <div className="chat__message--list__inner">
                                <div className="message__out--content">
                                    <div className="message__out--text">
                                        <p className="message__out--desc">
                                            It is a long established fact that a reader will be distracted by the readable content of a page when
                                            looking at its layout
                                        </p>
                                    </div>
                                    <span className="message__out--author">
                                        Sent by <span>Rïm Öń</span>
                                    </span>
                                    <span className="chatting__message--date">21:05</span>
                                </div>
                                <div className="chatting__message--thumb">
                                    <img src="./assets/img/dashboard/message-author2.png" alt="img" />
                                </div>
                            </div>
                        </div>
                        <div className="chat__message--list message__in">
                            <span className="chatting__message--date">Fri 23:14</span>
                            <div className="chat__message--list__inner">
                                <div className="chatting__message--thumb">
                                    <img src="./assets/img/dashboard/message-author.png" alt="img" />
                                </div>
                                <div className="chatting__message--content">
                                    <div className="chatting__message--text">
                                        <p className="chatting__message--desc line1">Who are you ?</p> <br />
                                        <p className="chatting__message--desc line2">I don't know anyone named jeremiah.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="chat__message--list message__out">
                            <div className="chat__message--list__inner">
                                <div className="message__out--content">
                                    <div className="message__out--text">
                                        <p className="message__out--desc">Some of the recent images taken are nice 👌</p>
                                    </div>
                                    <span className="message__out--author">
                                        Sent by <span>Rïm Öń</span>
                                    </span>
                                    <span className="chatting__message--date">17:05</span>
                                </div>
                                <div className="chatting__message--thumb">
                                    <img src="./assets/img/dashboard/message-author2.png" alt="img" />
                                </div>
                            </div>
                        </div>
                        <div className="chat__message--list message__in">
                            <span className="chatting__message--date">Sun 19:14</span>
                            <div className="chat__message--list__inner">
                                <div className="chatting__message--thumb">
                                    <img src="./assets/img/dashboard/message-author.png" alt="img" />
                                </div>
                                <div className="chatting__message--content">
                                    <div className="chatting__message--text">
                                        <p className="chatting__message--desc">Here are some of them have a look</p>
                                    </div>
                                    <div className="chatting__clint--display">
                                        <img src="./assets/img/dashboard/clint-thumbnail.png" alt="img" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="chat__message--list message__out">
                            <div className="chat__message--list__inner">
                                <div className="message__out--content">
                                    <div className="message__out--text">
                                        <p className="message__out--desc">
                                            Sorry, William. O.K. We have a few things to talk about today. would you like to give your report.
                                        </p>
                                    </div>
                                    <span className="message__out--author">
                                        Sent by <span>Rïm Öń</span>
                                    </span>
                                    <span className="chatting__message--date">15:05</span>
                                </div>
                                <div className="chatting__message--thumb">
                                    <img src="./assets/img/dashboard/message-author2.png" alt="img" />
                                </div>
                            </div>
                        </div>
                        <div className="chat__message--list message__in">
                            <span className="chatting__message--date">Tues 23:14</span>
                            <div className="chat__message--list__inner">
                                <div className="chatting__message--thumb">
                                    <img src="./assets/img/dashboard/message-author.png" alt="img" />
                                </div>
                                <div className="chatting__message--content">
                                    <div className="chatting__message--text">
                                        <p className="chatting__message--desc">
                                            Yes, thank you 🤩. I have a sales graph I would like to show everyone. This shows how well we are selling
                                            our products this year.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="chat__message--list message__out">
                            <div className="chat__message--list__inner">
                                <div className="message__out--content">
                                    <div className="message__out--text">
                                        <p className="message__out--desc">
                                            Sorry, William. O.K. We have a few things to talk about today. would you like to give your report.
                                        </p>
                                    </div>
                                    <span className="message__out--author">
                                        Sent by <span>Rïm Öń</span>
                                    </span>
                                    <span className="chatting__message--date">15:05</span>
                                </div>
                                <div className="chatting__message--thumb">
                                    <img src="./assets/img/dashboard/message-author2.png" alt="img" />
                                </div>
                            </div>
                        </div>
                        <div className="chat__message--list message__in">
                            <span className="chatting__message--date">Tues 23:14</span>
                            <div className="chat__message--list__inner">
                                <div className="chatting__message--thumb">
                                    <img src="./assets/img/dashboard/message-author.png" alt="img" />
                                </div>
                                <div className="chatting__message--content">
                                    <div className="chatting__message--text">
                                        <p className="chatting__message--desc">
                                            Yes, thank you 🤩. I have a sales graph I would like to show everyone. This shows how well we are selling
                                            our products this year.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="chat__message--footer">
                        <form className="chat__message--form" action="#">
                            <input className="chat__message--input__field" placeholder="Type a message here......." type="text" />
                            <button className="chat__message--btn__option one" aria-label="chat button">
                                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.00016 14.6666H10.0002C13.3335 14.6666 14.6668 13.3333 14.6668 9.99992V5.99992C14.6668 2.66659 13.3335 1.33325 10.0002 1.33325H6.00016C2.66683 1.33325 1.3335 2.66659 1.3335 5.99992V9.99992C1.3335 13.3333 2.66683 14.6666 6.00016 14.6666Z"
                                        stroke="currentColor"
                                        strokeOpacity="0.9"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M10.3335 6.5C10.8858 6.5 11.3335 6.05228 11.3335 5.5C11.3335 4.94772 10.8858 4.5 10.3335 4.5C9.78121 4.5 9.3335 4.94772 9.3335 5.5C9.3335 6.05228 9.78121 6.5 10.3335 6.5Z"
                                        stroke="currentColor"
                                        strokeOpacity="0.9"
                                        strokeMiterlimit={10}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M5.6665 6.5C6.21879 6.5 6.6665 6.05228 6.6665 5.5C6.6665 4.94772 6.21879 4.5 5.6665 4.5C5.11422 4.5 4.6665 4.94772 4.6665 5.5C4.6665 6.05228 5.11422 6.5 5.6665 6.5Z"
                                        stroke="currentColor"
                                        strokeOpacity="0.9"
                                        strokeMiterlimit={10}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M5.6 8.8667H10.4C10.7333 8.8667 11 9.13337 11 9.4667C11 11.1267 9.66 12.4667 8 12.4667C6.34 12.4667 5 11.1267 5 9.4667C5 9.13337 5.26667 8.8667 5.6 8.8667Z"
                                        stroke="currentColor"
                                        strokeOpacity="0.9"
                                        strokeMiterlimit={10}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            <button className="chat__message--btn__option two" aria-label="chat button">
                                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M8.22012 8.09995L6.57345 9.74661C5.66012 10.6599 5.66012 12.1333 6.57345 13.0466C7.48678 13.9599 8.96012 13.9599 9.87345 13.0466L12.4668 10.4533C14.2868 8.63328 14.2868 5.67328 12.4668 3.85328C10.6468 2.03328 7.68678 2.03328 5.86678 3.85328L3.04012 6.67995C1.48012 8.23995 1.48012 10.7733 3.04012 12.3399"
                                        stroke="currentColor"
                                        strokeOpacity="0.9"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            <button className="chat__message--btn__option three" aria-label="chat button">
                                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M8.00016 10.3333C9.4735 10.3333 10.6668 9.13992 10.6668 7.66659V3.99992C10.6668 2.52659 9.4735 1.33325 8.00016 1.33325C6.52683 1.33325 5.3335 2.52659 5.3335 3.99992V7.66659C5.3335 9.13992 6.52683 10.3333 8.00016 10.3333Z"
                                        stroke="currentColor"
                                        strokeOpacity="0.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M2.8999 6.43335V7.56668C2.8999 10.38 5.18657 12.6667 7.9999 12.6667C10.8132 12.6667 13.0999 10.38 13.0999 7.56668V6.43335"
                                        stroke="currentColor"
                                        strokeOpacity="0.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M7.07324 4.28658C7.67324 4.06658 8.32658 4.06658 8.92658 4.28658"
                                        stroke="currentColor"
                                        strokeOpacity="0.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M7.4668 5.69988C7.82013 5.60655 8.1868 5.60655 8.54013 5.69988"
                                        stroke="currentColor"
                                        strokeOpacity="0.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M8 12.6667V14.6667"
                                        stroke="currentColor"
                                        strokeOpacity="0.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
                <div className="chat__profile--box">
                    <div className="chat__profile--box__inner">
                        <div className="chat__profile--header">
                            <div className="chat__message--author d-flex align-items-center">
                                <div className="chat__message--author__thumbnail">
                                    <img src="./assets/img/dashboard/message-author.png" alt="img" />
                                    <span className="chat__message--author__badge" />
                                </div>
                                <div className="chat__message--author__text">
                                    <h3 className="chat__message--author__title">Marie Prohaska</h3>
                                    <span className="chat__message--author__subtitle">Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="chat__profile--box__wrapper">
                            <div className="chat__profile--step mb-30">
                                <div className="chat__profile--step__header d-flex align-items-center justify-content-between">
                                    <h3 className="chat__profile--step__title">Shared Files&nbsp;</h3>
                                    <a className="chat__profile--view__all" href="#">
                                        View All
                                    </a>
                                </div>
                                <ul className="chat__profile--download">
                                    <li className="chat__profile--download__list d-flex align-items-center justify-content-between">
                                        <div className="chat__profile--download__left d-flex align-items-center">
                                            <span className="chat__profile--download__file--icon">
                                                <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V6.75C16.5 3 15 1.5 11.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5Z"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M6.8252 9.00012V7.89012C6.8252 6.45762 7.8377 5.88012 9.0752 6.59262L10.0352 7.14762L10.9952 7.70262C12.2327 8.41512 12.2327 9.58511 10.9952 10.2976L10.0352 10.8526L9.0752 11.4076C7.8377 12.1201 6.8252 11.5351 6.8252 10.1101V9.00012Z"
                                                        stroke="currentColor"
                                                        strokeMiterlimit={10}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                            <div className="chat__profile--download__file--text">
                                                <h4 className="chat__profile--download__file--name">Project Details.pdf</h4>
                                                <span className="chat__profile--download__file--date">24,Oct 2022 - 14:24PM</span>
                                            </div>
                                        </div>
                                        <button className="chat__profile--download__btn" type="submit" aria-label="download button">
                                            <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12.3299 6.67505C15.0299 6.90755 16.1324 8.29505 16.1324 11.3325V11.43C16.1324 14.7825 14.7899 16.125 11.4374 16.125H6.55486C3.20236 16.125 1.85986 14.7825 1.85986 11.43V11.3325C1.85986 8.31755 2.94736 6.93005 5.60236 6.68255"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path d="M9 1.5V11.16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                <path
                                                    d="M11.5123 9.48755L8.9998 12L6.4873 9.48755"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </li>
                                    <li className="chat__profile--download__list d-flex align-items-center justify-content-between">
                                        <div className="chat__profile--download__left d-flex align-items-center">
                                            <span className="chat__profile--download__file--icon">
                                                <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V6.75C16.5 3 15 1.5 11.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5Z"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M6.75 7.5C7.57843 7.5 8.25 6.82843 8.25 6C8.25 5.17157 7.57843 4.5 6.75 4.5C5.92157 4.5 5.25 5.17157 5.25 6C5.25 6.82843 5.92157 7.5 6.75 7.5Z"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M2.00244 14.2124L5.69994 11.7299C6.29244 11.3324 7.14744 11.3774 7.67994 11.8349L7.92744 12.0524C8.51244 12.5549 9.45744 12.5549 10.0424 12.0524L13.1624 9.37492C13.7474 8.87242 14.6924 8.87242 15.2774 9.37492L16.4999 10.4249"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                            <div className="chat__profile--download__file--text">
                                                <h4 className="chat__profile--download__file--name">Img_02.Jpg</h4>
                                                <span className="chat__profile--download__file--date">24,Oct 2022 - 14:24PM</span>
                                            </div>
                                        </div>
                                        <button className="chat__profile--download__btn" type="submit" aria-label="download button">
                                            <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12.3299 6.67505C15.0299 6.90755 16.1324 8.29505 16.1324 11.3325V11.43C16.1324 14.7825 14.7899 16.125 11.4374 16.125H6.55486C3.20236 16.125 1.85986 14.7825 1.85986 11.43V11.3325C1.85986 8.31755 2.94736 6.93005 5.60236 6.68255"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path d="M9 1.5V11.16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                <path
                                                    d="M11.5123 9.48755L8.9998 12L6.4873 9.48755"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </li>
                                    <li className="chat__profile--download__list d-flex align-items-center justify-content-between">
                                        <div className="chat__profile--download__left d-flex align-items-center">
                                            <span className="chat__profile--download__file--icon">
                                                <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V6.75C16.5 3 15 1.5 11.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5Z"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M6.75 7.5C7.57843 7.5 8.25 6.82843 8.25 6C8.25 5.17157 7.57843 4.5 6.75 4.5C5.92157 4.5 5.25 5.17157 5.25 6C5.25 6.82843 5.92157 7.5 6.75 7.5Z"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M2.00244 14.2124L5.69994 11.7299C6.29244 11.3324 7.14744 11.3774 7.67994 11.8349L7.92744 12.0524C8.51244 12.5549 9.45744 12.5549 10.0424 12.0524L13.1624 9.37492C13.7474 8.87242 14.6924 8.87242 15.2774 9.37492L16.4999 10.4249"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                            <div className="chat__profile--download__file--text">
                                                <h4 className="chat__profile--download__file--name">Img_15.Jpg</h4>
                                                <span className="chat__profile--download__file--date">24,Oct 2022 - 14:24PM</span>
                                            </div>
                                        </div>
                                        <button className="chat__profile--download__btn" type="submit" aria-label="download button">
                                            <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12.3299 6.67505C15.0299 6.90755 16.1324 8.29505 16.1324 11.3325V11.43C16.1324 14.7825 14.7899 16.125 11.4374 16.125H6.55486C3.20236 16.125 1.85986 14.7825 1.85986 11.43V11.3325C1.85986 8.31755 2.94736 6.93005 5.60236 6.68255"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path d="M9 1.5V11.16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                <path
                                                    d="M11.5123 9.48755L8.9998 12L6.4873 9.48755"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </li>
                                    <li className="chat__profile--download__list d-flex align-items-center justify-content-between">
                                        <div className="chat__profile--download__left d-flex align-items-center">
                                            <span className="chat__profile--download__file--icon">
                                                <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V6.75C16.5 3 15 1.5 11.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5Z"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M6.8252 9.00012V7.89012C6.8252 6.45762 7.8377 5.88012 9.0752 6.59262L10.0352 7.14762L10.9952 7.70262C12.2327 8.41512 12.2327 9.58511 10.9952 10.2976L10.0352 10.8526L9.0752 11.4076C7.8377 12.1201 6.8252 11.5351 6.8252 10.1101V9.00012Z"
                                                        stroke="currentColor"
                                                        strokeMiterlimit={10}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                            <div className="chat__profile--download__file--text">
                                                <h4 className="chat__profile--download__file--name">Video_15_02_2022.MP4</h4>
                                                <span className="chat__profile--download__file--date">24,Oct 2022 - 14:24PM</span>
                                            </div>
                                        </div>
                                        <button className="chat__profile--download__btn" type="submit" aria-label="download button">
                                            <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12.3299 6.67505C15.0299 6.90755 16.1324 8.29505 16.1324 11.3325V11.43C16.1324 14.7825 14.7899 16.125 11.4374 16.125H6.55486C3.20236 16.125 1.85986 14.7825 1.85986 11.43V11.3325C1.85986 8.31755 2.94736 6.93005 5.60236 6.68255"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path d="M9 1.5V11.16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                <path
                                                    d="M11.5123 9.48755L8.9998 12L6.4873 9.48755"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="chat__profile--step">
                                <div className="chat__profile--step__header d-flex align-items-center justify-content-between">
                                    <h3 className="chat__profile--step__title">Shared Files&nbsp;</h3>
                                    <a className="chat__profile--view__all" href="#">
                                        View All
                                    </a>
                                </div>
                                <ul className="chat__profile--photos d-flex">
                                    <li className="chat__profile--photos__items">
                                        <a
                                            className="chat__profile--photos__link glightbox"
                                            href="./assets/img/dashboard/profile-photos1.png"
                                            data-gallery="gallery"
                                        >
                                            <img
                                                className="chat__profile--photos__media"
                                                src="./assets/img/dashboard/profile-photos1.png"
                                                alt="img"
                                            />
                                        </a>
                                    </li>
                                    <li className="chat__profile--photos__items">
                                        <a
                                            className="chat__profile--photos__link glightbox"
                                            href="./assets/img/dashboard/profile-photos2.png"
                                            data-gallery="gallery"
                                        >
                                            <img
                                                className="chat__profile--photos__media"
                                                src="./assets/img/dashboard/profile-photos2.png"
                                                alt="img"
                                            />
                                        </a>
                                    </li>
                                    <li className="chat__profile--photos__items">
                                        <a
                                            className="chat__profile--photos__link glightbox"
                                            href="./assets/img/dashboard/profile-photos3.png"
                                            data-gallery="gallery"
                                        >
                                            <img
                                                className="chat__profile--photos__media"
                                                src="./assets/img/dashboard/profile-photos3.png"
                                                alt="img"
                                            />
                                        </a>
                                    </li>
                                    <li className="chat__profile--photos__items">
                                        <a
                                            className="chat__profile--photos__link glightbox"
                                            href="./assets/img/dashboard/profile-photos3.png"
                                            data-gallery="gallery"
                                        >
                                            <img
                                                className="chat__profile--photos__media"
                                                src="./assets/img/dashboard/profile-photos4.png"
                                                alt="img"
                                            />
                                        </a>
                                    </li>
                                </ul>
                                <a className="chat__profile--see__more--btn" href="#">
                                    See more
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CallContact />
            <AddContactForm />
        </Dashboard>
    );
}
