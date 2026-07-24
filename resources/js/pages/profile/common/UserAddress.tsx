type User = {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
};

export default function UserAddress({ user }: { user: User }) {
    const { t } = useTranslation();

    return (
        <div className="tab-pane fade show active">
            <p className="account-alert">{t('checkout_address_description')}</p>

            <div className="row gy-4">
                <div className="col-sm-12 col-md-8 col-lg-6 mx-auto">
                    <div className="card common-card shadow-sm">
                        <div className="card-body">
                            <h5 className="text-poppins fw-bold mb-3 text-primary">
                                {t('address')}
                            </h5>

                            <div className="mb-3">
                                <span className="d-block fw-semibold text-poppins font-14 text-secondary">
                                    {user.name}
                                </span>
                            </div>

                            {user.address ? (
                                <div className="contact-info d-flex align-items-start mb-2 gap-2">
                                    <strong className="text-dark">
                                        {t('location')}:
                                    </strong>
                                    <span className="text-muted">
                                        {user.address}
                                    </span>
                                </div>
                            ) : (
                                <div className="contact-info d-flex align-items-start mb-2 gap-2">
                                    <strong className="text-dark">
                                        {t('location')}:
                                    </strong>
                                    <span className="text-muted">
                                        {t('no_address_provided')}
                                    </span>
                                </div>
                            )}

                            {user.phone ? (
                                <div className="contact-info d-flex align-items-start mb-2 gap-2">
                                    <strong className="text-dark">
                                        {t('phone')}:
                                    </strong>
                                    <span className="text-muted">
                                        {user.phone}
                                    </span>
                                </div>
                            ) : (
                                <div className="contact-info d-flex align-items-start mb-2 gap-2">
                                    <strong className="text-dark">
                                        {t('phone')}:
                                    </strong>
                                    <span className="text-muted">
                                        {t('no_phone_provided')}
                                    </span>
                                </div>
                            )}

                            {user.email ? (
                                <div className="contact-info d-flex align-items-start gap-2">
                                    <strong className="text-dark">
                                        {t('email')}:
                                    </strong>
                                    <span className="text-muted">
                                        {user.email}
                                    </span>
                                </div>
                            ) : (
                                <div className="contact-info d-flex align-items-start gap-2">
                                    <strong className="text-dark">
                                        {t('email')}:
                                    </strong>
                                    <span className="text-muted">
                                        {t('no_email_provided')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
import { useTranslation } from 'react-i18next';
