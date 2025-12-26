type User = {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
};

export default function UserAddress({ user }: { user: User }) {
    return (
        <div className="tab-pane fade  show active">
            <p className="account-alert">The following address details will be used on the checkout page by default.</p>

            <div className="row gy-4">
                <div className="col-sm-12 col-md-8 col-lg-6 mx-auto">
                    <div className="card common-card shadow-sm">
                        <div className="card-body">
                            <h5 className="text-poppins fw-bold text-primary mb-3">Address</h5>

                            <div className="mb-3">
                                <span className="d-block fw-semibold text-poppins font-14 text-secondary">{user.name}</span>
                            </div>

                            {user.address ? (
                                <div className="contact-info d-flex align-items-start mb-2 gap-2">
                                    <strong className="text-dark">Location:</strong>
                                    <span className="text-muted">{user.address}</span>
                                </div>
                            ): (
                                <div className="contact-info d-flex align-items-start mb-2 gap-2">
                                    <strong className="text-dark">Location:</strong>
                                    <span className="text-muted">No address provided</span>
                                </div>
                            )}

                            {user.phone ? (
                                <div className="contact-info d-flex align-items-start mb-2 gap-2">
                                    <strong className="text-dark">Phone:</strong>
                                    <span className="text-muted">{user.phone}</span>
                                </div>
                            ): (
                                <div className="contact-info d-flex align-items-start mb-2 gap-2">
                                    <strong className="text-dark">Phone:</strong>
                                    <span className="text-muted">No phone provided</span>
                                </div>
                            )}

                            {user.email ? (
                                <div className="contact-info d-flex align-items-start gap-2">
                                    <strong className="text-dark">Email:</strong>
                                    <span className="text-muted">{user.email}</span>
                                </div>
                            ): (
                                <div className="contact-info d-flex align-items-start gap-2">
                                    <strong className="text-dark">Email:</strong>
                                    <span className="text-muted">No email provided</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
