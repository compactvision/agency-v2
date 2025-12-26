import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';

export default function Checkout() {
    return (
        <App>
            <Breadcumb title="Checkout" homeLink={route('home')} />

            <section className="checkout padding-y-120">
                <div className="container-two container">
                    <form action="#">
                        <div className="row gy-4">
                            <div className="col-lg-8 pe-lg-5">
                                <div className="card common-card">
                                    <div className="card-body">
                                        <h6 className="title mb-4">Shipping Address</h6>
                                        <div className="row gy-4">
                                            <div className="col-sm-6 col-xs-6">
                                                <label htmlFor="FirstName" className="form-label">
                                                    First Name
                                                </label>
                                                <input type="text" className="common-input" id="FirstName" placeholder="First Name" />
                                            </div>
                                            <div className="col-sm-6 col-xs-6">
                                                <label htmlFor="LastName" className="form-label">
                                                    Last Name
                                                </label>
                                                <input type="text" className="common-input" id="LastName" placeholder="Last Name" />
                                            </div>
                                            <div className="col-sm-6 col-xs-6">
                                                <label htmlFor="EmailAddress" className="form-label">
                                                    Email Address
                                                </label>
                                                <input type="email" className="common-input" id="EmailAddress" placeholder="Email Address" />
                                            </div>
                                            <div className="col-sm-6 col-xs-6">
                                                <label htmlFor="PhoneNumber" className="form-label">
                                                    Phone Number
                                                </label>
                                                <input type="tel" className="common-input" id="PhoneNumber" placeholder="Phone Number" />
                                            </div>
                                            <div className="col-sm-6 col-xs-6">
                                                <label htmlFor="Address" className="form-label">
                                                    Address
                                                </label>
                                                <input type="text" className="common-input" id="Address" placeholder="Address" />
                                            </div>
                                            <div className="col-sm-6 col-xs-6">
                                                <label htmlFor="Country" className="form-label">
                                                    Country
                                                </label>
                                                <div className="select-has-icon icon-black">
                                                    <select className="select common-input" id="Country">
                                                        <option value={1} disabled>
                                                            {' '}
                                                            Country
                                                        </option>
                                                        <option value={1}>Australia</option>
                                                        <option value={1}>Canada</option>
                                                        <option value={1}>Europe</option>
                                                        <option value={1}>Bangladesh</option>
                                                        <option value={1}>India</option>
                                                        <option value={1}>Pakistan</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 col-xs-6">
                                                <label htmlFor="City" className="form-label">
                                                    City
                                                </label>
                                                <input type="text" className="common-input" id="City" placeholder="City" />
                                            </div>
                                            <div className="col-sm-6 col-xs-6">
                                                <label htmlFor="State" className="form-label">
                                                    State
                                                </label>
                                                <input type="text" className="common-input" id="State" placeholder="State" />
                                            </div>
                                            <div className="col-sm-6 col-xs-6">
                                                <label htmlFor="Region" className="form-label">
                                                    Region
                                                </label>
                                                <input type="text" className="common-input" id="Region" placeholder="Region" />
                                            </div>
                                            <div className="col-sm-6 col-xs-6">
                                                <label htmlFor="ZipCode" className="form-label">
                                                    ZipCode
                                                </label>
                                                <input type="text" className="common-input" id="ZipCode" placeholder="ZipCode" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="card common-card mb-4">
                                    <div className="card-body">
                                        <h6 className="title mb-4">Payment Method</h6>
                                        <div className="d-flex flex-column gap-3">
                                            <div className="payment-method">
                                                <div className="common-radio">
                                                    <input className="form-check-input" type="radio" name="payment" id="DebitCard" />
                                                    <label className="form-check-label" htmlFor="DebitCard">
                                                        Debit card / Credit card
                                                        <img src="assets/images/thumbs/paypal.png" alt="paypal" />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="payment-method">
                                                <div className="common-radio">
                                                    <input className="form-check-input" type="radio" name="payment" id="payPal" />
                                                    <label className="form-check-label" htmlFor="payPal">
                                                        Paypal
                                                        <img src="assets/images/thumbs/visa.png" alt="visa" />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card common-card">
                                    <div className="card-body">
                                        <h6 className="title mb-4">Cart Totals</h6>
                                        <ul className="billing-list">
                                            <li className="billing-list__item flx-between">
                                                <span className="text text-poppins font-15">3 Rooms Manhattan × 2</span>
                                                <span className="amount fw-semibold text-heading text-poppins">$321.95</span>
                                            </li>
                                            <li className="billing-list__item flx-between">
                                                <span className="text text-poppins font-15">OE Replica Wheels × 2</span>
                                                <span className="amount fw-semibold text-heading text-poppins"> $185.00 </span>
                                            </li>
                                            <li className="billing-list__item flx-between">
                                                <span className="text text-poppins font-15">Wheel Bearing Retainer × 2</span>
                                                <span className="amount fw-semibold text-heading text-poppins"> $130.00</span>
                                            </li>
                                            <li className="billing-list__item flx-between">
                                                <span className="text text-poppins font-15">Shipping and Handing</span>
                                                <span className="amount fw-semibold text-heading text-poppins"> $15.00</span>
                                            </li>
                                            <li className="billing-list__item flx-between">
                                                <span className="text text-poppins font-15">Vat</span>
                                                <span className="amount fw-semibold text-heading text-poppins"> $10.00</span>
                                            </li>
                                            <li className="billing-list__item flx-between">
                                                <span className="text text-poppins fw-semibold text-heading">Order Total</span>
                                                <span className="amount fw-semibold text-heading text-poppins"> $661.95</span>
                                            </li>
                                        </ul>
                                        <button type="submit" className="btn btn-main mt-4 w-100">
                                            Pay Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </App>
    );
}
