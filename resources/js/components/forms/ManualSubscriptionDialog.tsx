import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    Clock3,
    FileText,
    LoaderCircle,
    ShieldCheck,
} from 'lucide-react';

type Props = {
    plan: { name: string; price: string | number; duration?: string } | null;
    sent: boolean;
    busy: boolean;
    error: string | null;
    onClose: () => void;
    onConfirm: () => void;
};

export default function ManualSubscriptionDialog({
    plan,
    sent,
    busy,
    error,
    onClose,
    onConfirm,
}: Props) {
    return (
        <Dialog
            open={!!plan}
            onOpenChange={(open) => {
                if (!open && !busy) onClose();
            }}
        >
            <DialogContent
                className="max-h-[90svh] overflow-y-auto rounded-2xl border-stone-200 bg-white p-0 text-stone-800 motion-reduce:animate-none sm:max-w-lg dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                onEscapeKeyDown={(event) => {
                    if (busy) event.preventDefault();
                }}
                onPointerDownOutside={(event) => {
                    if (busy) event.preventDefault();
                }}
            >
                <div className="border-b border-stone-200 bg-amber-50/70 px-6 pt-7 pb-5 dark:border-stone-700 dark:bg-amber-950/20">
                    <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                        {sent ? <Check size={26} /> : <ShieldCheck size={26} />}
                    </span>
                    <p className="mb-2 text-xs font-bold tracking-widest text-amber-800 uppercase dark:text-amber-300">
                        Validation manuelle
                    </p>
                    <DialogTitle className="text-2xl">
                        {sent
                            ? 'Votre demande est envoyée'
                            : 'Votre abonnement, étape par étape'}
                    </DialogTitle>
                    <DialogDescription className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">
                        {sent
                            ? 'Elle est en attente de validation par un administrateur. Votre nouvel abonnement n’est pas encore actif.'
                            : 'Ce plan nécessite une validation par notre équipe. Envoyer votre demande n’active pas immédiatement l’abonnement.'}
                    </DialogDescription>
                </div>
                <div className="space-y-5 px-6 pb-6">
                    <div className="flex items-center justify-between gap-4 rounded-xl bg-stone-100 p-4 dark:bg-stone-800">
                        <div>
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                                Plan sélectionné
                            </p>
                            <p className="font-semibold">{plan?.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">
                                {Number(plan?.price ?? 0).toLocaleString(
                                    'fr-FR',
                                )}{' '}
                                $
                            </p>
                            {plan?.duration && (
                                <p className="text-xs text-stone-500 dark:text-stone-400">
                                    {plan.duration === 'monthly'
                                        ? '1 mois'
                                        : plan.duration === 'yearly'
                                          ? '1 an'
                                          : plan.duration}
                                </p>
                            )}
                        </div>
                    </div>
                    <ol className="space-y-4">
                        {[
                            {
                                icon: FileText,
                                title: sent
                                    ? 'Demande reçue'
                                    : 'Vous envoyez votre demande',
                                text: 'Le plan choisi est enregistré dans vos abonnements.',
                            },
                            {
                                icon: Clock3,
                                title: 'Un administrateur vérifie',
                                text: 'Notre équipe examine votre souscription et valide le paiement manuel.',
                            },
                            {
                                icon: ShieldCheck,
                                title: 'Votre abonnement devient actif',
                                text: 'Après approbation, les avantages du plan sont disponibles dans votre espace.',
                            },
                        ].map((step, index) => (
                            <li key={step.title} className="flex gap-3">
                                <span
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${sent && index === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-300'}`}
                                >
                                    <step.icon size={17} aria-hidden="true" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold">
                                        {step.title}
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                                        {step.text}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                        {sent
                            ? 'Inutile de renvoyer la demande : vous pouvez suivre son statut dans « Mes abonnements ».'
                            : 'Les avantages de ce nouveau plan seront accessibles uniquement après validation. Cette demande ne déclenche aucun paiement automatique.'}
                    </div>
                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200"
                        >
                            {error}
                        </p>
                    )}
                    {sent ? (
                        <>
                            <Link
                                href={route('dashboard.subscriptions.index')}
                                className="flex items-center justify-center gap-2 rounded-xl bg-[#1E3A5F] px-4 py-3 text-sm font-semibold text-white"
                            >
                                Suivre ma demande <ArrowRight size={17} />
                            </Link>
                            <button
                                onClick={onClose}
                                className="w-full py-2 text-sm text-stone-600 dark:text-stone-300"
                            >
                                Fermer
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col-reverse gap-3 sm:flex-row">
                            <button
                                onClick={onClose}
                                disabled={busy}
                                className="rounded-xl border border-stone-300 px-4 py-3 text-sm disabled:opacity-50 dark:border-stone-600"
                            >
                                Pas maintenant
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={busy}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1E3A5F] px-4 py-3 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
                            >
                                {busy ? (
                                    <LoaderCircle
                                        size={17}
                                        className="animate-spin motion-reduce:animate-none"
                                    />
                                ) : (
                                    <ArrowRight size={17} />
                                )}
                                {busy
                                    ? 'Envoi en cours…'
                                    : 'Envoyer ma demande'}
                            </button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
