import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCheck,
    Copy,
    CreditCard,
    HelpCircle,
    LoaderCircle,
    LockKeyhole,
    RefreshCw,
    ShieldCheck,
    X,
} from 'lucide-react';
import { useState } from 'react';
import './result.css';

type Payment = {
    status: string;
    reference: string;
    plan: string;
    amount: string;
    currency: string;
    createdAt: string;
    expiresAt: string | null;
};

export default function Result({ payment }: { payment: Payment }) {
    const [copyMessage, setCopyMessage] = useState('');
    const [checking, setChecking] = useState(false);
    const success = payment.status === 'active';
    const cancelled = payment.status === 'cancelled';
    const failed = payment.status === 'failed';
    const pending = payment.status === 'pending';
    const variant = success ? 'success' : cancelled ? 'cancelled' : 'pending';
    const label = success
        ? 'Paiement confirmé'
        : cancelled
          ? 'Paiement annulé'
          : failed
            ? 'Paiement refusé'
            : pending
              ? 'Confirmation en cours'
              : 'Abonnement terminé';
    const title = success
        ? 'La suite commence ici.'
        : cancelled
          ? 'On reprend quand vous voulez.'
          : failed
            ? 'Essayons autrement.'
            : pending
              ? 'Encore un petit instant.'
              : 'Et si on continuait ?';
    const description = success
        ? 'Votre paiement est confirmé et votre abonnement est actif. Votre prochain projet immobilier vous attend.'
        : cancelled
          ? 'Vous avez quitté le paiement. Cette tentative est annulée et reste visible dans votre historique. Vous pourrez démarrer un nouveau paiement à votre rythme.'
          : failed
            ? 'Ce paiement n’a pas pu être validé. Vous pouvez revenir aux offres et démarrer une nouvelle tentative.'
            : pending
              ? 'Nous attendons la confirmation du paiement. Vérifiez son statut avant de lancer une nouvelle tentative.'
              : 'Retrouvez les détails de cette transaction dans vos abonnements ou découvrez les offres disponibles.';
    const date = (value: string) =>
        new Intl.DateTimeFormat('fr-FR', {
            dateStyle: 'long',
            timeZone: 'Africa/Kinshasa',
        }).format(new Date(value));
    const amount = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: payment.currency,
    }).format(Number(payment.amount));
    const copyReference = async () => {
        try {
            await navigator.clipboard.writeText(payment.reference);
            setCopyMessage('Référence copiée');
        } catch {
            setCopyMessage(
                'Copie indisponible : sélectionnez la référence ci-dessus.',
            );
        }
    };
    const checkStatus = () =>
        router.get(
            route('billing.return', { transaction: payment.reference }),
            {},
            {
                onStart: () => setChecking(true),
                onFinish: () => setChecking(false),
            },
        );

    return (
        <div className={`payment-result payment-result--${variant}`}>
            <Head title={label} />
            <header className="payment-header">
                <Link
                    href={route('home')}
                    className="payment-brand"
                    aria-label="The Agency — Accueil"
                >
                    THE AGENCY<span>IMMOBILIER · RDC</span>
                </Link>
                <span className="payment-secure">
                    <LockKeyhole size={14} aria-hidden="true" /> Espace de
                    paiement
                </span>
            </header>
            <main className="payment-main" id="main-content">
                <nav className="payment-steps" aria-label="Étapes du paiement">
                    <span>
                        <Check size={13} aria-hidden="true" /> Votre offre
                    </span>
                    <i aria-hidden="true" />
                    <span>
                        <Check size={13} aria-hidden="true" /> Paiement
                    </span>
                    <i aria-hidden="true" />
                    <span aria-current="step">03 · Résultat</span>
                </nav>
                <div className="payment-grid">
                    <section
                        className="payment-story"
                        aria-labelledby="payment-title"
                    >
                        <div className="payment-emblem" aria-hidden="true">
                            <div className="payment-orbit" />
                            <div className="payment-orbit payment-orbit--outer" />
                            <div className="payment-symbol">
                                {success ? (
                                    <svg viewBox="0 0 64 64">
                                        <path d="m17 33 10 10 21-23" />
                                    </svg>
                                ) : cancelled || failed ? (
                                    <X size={40} strokeWidth={1.5} />
                                ) : (
                                    <LoaderCircle size={38} strokeWidth={1.5} />
                                )}
                            </div>
                            {success && (
                                <div className="payment-sparks">
                                    {Array.from({ length: 8 }, (_, i) => (
                                        <i
                                            key={i}
                                            style={{
                                                transform: `rotate(${i * 45}deg) translateY(-83px)`,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <span className="payment-eyebrow">{label}</span>
                        <h1 id="payment-title">{title}</h1>
                        <p className="payment-description">{description}</p>
                        <div className="payment-actions">
                            {pending ? (
                                <button
                                    className="payment-button payment-button--primary"
                                    onClick={checkStatus}
                                    disabled={checking}
                                >
                                    {checking ? (
                                        <LoaderCircle
                                            className="payment-spinner"
                                            size={18}
                                        />
                                    ) : (
                                        <RefreshCw size={18} />
                                    )}{' '}
                                    {checking
                                        ? 'Vérification…'
                                        : 'Vérifier le statut'}
                                </button>
                            ) : (
                                <Link
                                    className="payment-button payment-button--primary"
                                    href={route(
                                        success
                                            ? 'dashboard.subscriptions.index'
                                            : 'tarifs',
                                    )}
                                >
                                    {success
                                        ? 'Voir mon abonnement'
                                        : 'Revenir aux offres'}
                                    <ArrowRight size={18} aria-hidden="true" />
                                </Link>
                            )}
                            <Link className="payment-home" href={route('home')}>
                                <ArrowLeft size={16} aria-hidden="true" />{' '}
                                Retour à l’accueil
                            </Link>
                        </div>
                        <div className="payment-next">
                            <span className="payment-next-icon">
                                {success ? (
                                    <CheckCheck size={20} />
                                ) : (
                                    <ShieldCheck size={20} />
                                )}
                            </span>
                            <div>
                                <strong>
                                    {success
                                        ? 'Tout est prêt pour vous'
                                        : 'Votre historique est conservé'}
                                </strong>
                                <p>
                                    {success
                                        ? 'Retrouvez votre formule et sa durée de validité dans votre espace personnel.'
                                        : 'Consultez vos abonnements à tout moment pour retrouver le statut de vos transactions.'}
                                </p>
                            </div>
                        </div>
                    </section>
                    <aside
                        className="payment-receipt"
                        aria-label="Récapitulatif du paiement"
                    >
                        <div className="payment-receipt-top">
                            <span className="payment-receipt-icon">
                                <CreditCard size={23} strokeWidth={1.5} />
                            </span>
                            <span className="payment-receipt-label">
                                VOTRE RÉCAPITULATIF
                            </span>
                            <span className="payment-badge">
                                <span />
                                {success
                                    ? 'Confirmé'
                                    : cancelled
                                      ? 'Annulé'
                                      : failed
                                        ? 'Refusé'
                                        : pending
                                          ? 'En attente'
                                          : 'Terminé'}
                            </span>
                        </div>
                        <h2>{payment.plan}</h2>
                        <p className="payment-amount">{amount}</p>
                        <p className="payment-amount-label">
                            {success
                                ? 'Montant du paiement confirmé'
                                : 'Montant de la tentative'}
                        </p>
                        <div className="payment-perforation" />
                        <dl className="payment-details">
                            <div>
                                <dt>Service de paiement</dt>
                                <dd>RDCard</dd>
                            </div>
                            <div>
                                <dt>Date de création</dt>
                                <dd>{date(payment.createdAt)}</dd>
                            </div>
                            {success && payment.expiresAt && (
                                <div>
                                    <dt>Valable jusqu’au</dt>
                                    <dd>{date(payment.expiresAt)}</dd>
                                </div>
                            )}
                            <div className="payment-reference">
                                <dt>Référence de transaction</dt>
                                <dd>
                                    <code>{payment.reference}</code>
                                    <button
                                        onClick={copyReference}
                                        aria-label="Copier la référence"
                                        title="Copier la référence"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </dd>
                            </div>
                        </dl>
                        <p className="payment-copy-feedback" role="status">
                            {copyMessage}
                        </p>
                        <Link
                            className="payment-history"
                            href={route('dashboard.subscriptions.index')}
                        >
                            Consulter mes abonnements{' '}
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </aside>
                </div>
                <footer className="payment-help">
                    <HelpCircle size={18} aria-hidden="true" />
                    <p>
                        Une question sur ce paiement ?{' '}
                        <Link href={route('contact')}>
                            Contactez notre équipe
                        </Link>
                        <span>
                            Pensez à communiquer votre référence de transaction.
                        </span>
                    </p>
                </footer>
            </main>
            <div className="payment-footer">
                THE AGENCY <span>Votre prochain chapitre immobilier.</span>
            </div>
        </div>
    );
}
