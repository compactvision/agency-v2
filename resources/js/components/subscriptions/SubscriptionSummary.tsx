import { Link } from '@inertiajs/react';
import { CreditCard } from 'lucide-react';

export type SubscriptionSummaryData = {
    plan_name: string | null;
    status: string;
    started_at: string | null;
    expires_at: string | null;
    days_remaining: number;
    published: number;
    limit: number | null;
    hidden: number;
};

export default function SubscriptionSummary({
    summary,
    onRenew,
}: {
    summary: SubscriptionSummaryData;
    onRenew?: () => void;
}) {
    const active = summary.status === 'active';
    const hasSubscription = summary.status !== 'none';
    const date = (value: string | null) =>
        value
            ? new Intl.DateTimeFormat('fr-FR', {
                  dateStyle: 'long',
                  timeStyle: 'short',
              }).format(new Date(value))
            : '—';
    const labels: Record<string, string> = {
        active: 'Actif',
        expired: 'Expiré',
        pending: 'Paiement en attente',
        failed: 'Paiement échoué',
        cancelled: 'Annulé',
        refunded: 'Remboursé',
        none: 'Aucun abonnement',
    };
    const descriptions: Record<string, string> = {
        active: 'Votre abonnement est actif. Vous pouvez publier des biens dans la limite de votre formule.',
        pending:
            'Votre demande est en attente de confirmation du paiement ou de validation. Votre abonnement n’est pas encore actif.',
        expired:
            'Votre abonnement a expiré. Vos annonces et photos sont conservées dans votre espace personnel.',
        cancelled:
            'Cet abonnement ou cette tentative de paiement a été annulé. Vous pouvez choisir une nouvelle formule.',
        failed: 'Le paiement n’a pas abouti. Votre abonnement n’est pas actif ; vous pouvez réessayer depuis vos abonnements.',
        refunded:
            'Ce paiement a été remboursé. Cet abonnement ne donne plus accès à la publication.',
        none: 'Vous n’avez pas encore d’abonnement. Choisissez une formule si vous souhaitez publier vos biens.',
    };
    const badgeColor = active
        ? 'bg-emerald-100 text-emerald-800'
        : ['expired', 'failed'].includes(summary.status)
          ? 'bg-red-100 text-red-800'
          : summary.status === 'pending'
            ? 'bg-amber-100 text-amber-900'
            : 'bg-slate-100 text-slate-700';
    return (
        <section
            className="mb-6 rounded-xl border border-t-4 border-slate-200 border-t-[#C9A84C] bg-white p-5 shadow-sm sm:p-6"
            aria-labelledby="subscription-summary-title"
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2
                    id="subscription-summary-title"
                    className="flex items-center gap-3 text-xl font-bold text-gray-900"
                >
                    <CreditCard
                        className="h-6 w-6 shrink-0 text-[#1E3A5F]"
                        aria-hidden="true"
                    />
                    État de mon abonnement
                </h2>
                <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${badgeColor}`}
                >
                    {labels[summary.status] || summary.status}
                </span>
            </div>
            <p className="mt-2 font-semibold text-[#1E3A5F]">
                {summary.plan_name ||
                    'Choisissez une formule pour publier vos biens'}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {descriptions[summary.status] ??
                    'Consultez vos abonnements pour retrouver les détails de votre formule.'}
            </p>
            {hasSubscription && (
                <dl className="mt-4 grid gap-4 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <dt className="text-gray-500">Début</dt>
                        <dd>{date(summary.started_at)}</dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">Expiration</dt>
                        <dd>{date(summary.expires_at)}</dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">Jours restants</dt>
                        <dd className="font-semibold">
                            {summary.days_remaining}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">Biens publiés</dt>
                        <dd className="font-semibold">
                            {summary.published} /{' '}
                            {summary.limit === null
                                ? 'Illimité'
                                : summary.limit}
                        </dd>
                    </div>
                </dl>
            )}
            {active && summary.days_remaining <= 7 && (
                <p
                    role="status"
                    className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900"
                >
                    Votre abonnement expire bientôt. Renouvelez-le pour
                    conserver vos biens en ligne.
                </p>
            )}
            {summary.hidden > 0 && (
                <p className="mt-3 text-sm text-gray-700">
                    {summary.hidden} bien(s) masqué(s). Renouvelez ou choisissez
                    une formule adaptée pour remettre en ligne les biens
                    admissibles.
                </p>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
                {onRenew ? (
                    <button
                        type="button"
                        onClick={onRenew}
                        className="rounded-lg bg-[#1E3A5F] px-4 py-2 text-sm font-semibold text-white"
                    >
                        {hasSubscription
                            ? 'Renouveler mon abonnement'
                            : 'Choisir une formule'}
                    </button>
                ) : (
                    <Link
                        href={route(
                            hasSubscription
                                ? 'dashboard.subscriptions.index'
                                : 'tarifs',
                        )}
                        className="rounded-lg bg-[#1E3A5F] px-4 py-2 text-sm font-semibold text-white"
                    >
                        {hasSubscription
                            ? 'Gérer mon abonnement'
                            : 'Voir les formules'}
                    </Link>
                )}
                {hasSubscription && (
                    <Link
                        href={route('tarifs')}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-[#1E3A5F]"
                    >
                        Changer de formule
                    </Link>
                )}
            </div>
        </section>
    );
}
