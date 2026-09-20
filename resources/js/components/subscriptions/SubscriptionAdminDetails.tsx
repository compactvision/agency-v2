import { useForm } from '@inertiajs/react';

export type Notice = {
    id: number;
    kind: string;
    sent_at: string | null;
    skipped_at: string | null;
    attempts: number;
    error: string | null;
};
export default function SubscriptionAdminDetails({
    id,
    notices = [],
    transaction,
    hidden = 0,
}: {
    id: number;
    notices?: Notice[];
    transaction?: string;
    hidden?: number;
}) {
    const form = useForm({ action: 'extend', expires_at: '', reason: '' });
    return (
        <details className="mt-3 max-w-md text-sm whitespace-normal">
            <summary className="cursor-pointer font-medium text-[#1E3A5F]">
                Suivi et gestion · {hidden} bien(s) masqué(s)
            </summary>
            <p className="mt-2 break-all">Transaction : {transaction || '—'}</p>
            <ul className="my-3 space-y-1">
                {notices.map((notice) => (
                    <li key={notice.id}>
                        {notice.kind} :{' '}
                        {notice.sent_at
                            ? `envoyé le ${new Date(notice.sent_at).toLocaleString('fr-FR')}`
                            : notice.skipped_at
                              ? 'annulé car devenu inutile'
                              : notice.error
                                ? `échec (${notice.error}), ${notice.attempts} tentative(s)`
                                : 'en attente'}
                    </li>
                ))}
            </ul>
            <form
                className="space-y-3"
                onSubmit={(event) => {
                    event.preventDefault();
                    form.transform((data) => ({
                        ...data,
                        expires_at: data.expires_at
                            ? new Date(data.expires_at).toISOString()
                            : '',
                    }));
                    form.patch(route('dashboard.subscriptions.update', id), {
                        preserveScroll: true,
                    });
                }}
            >
                <label className="block">
                    Action
                    <select
                        className="mt-1 block w-full rounded border p-2"
                        value={form.data.action}
                        onChange={(e) => form.setData('action', e.target.value)}
                    >
                        <option value="extend">
                            Prolonger un abonnement actif
                        </option>
                        <option value="cancel_at_end">
                            Annuler à l’échéance
                        </option>
                        <option value="cancel_now">
                            Annuler immédiatement
                        </option>
                    </select>
                </label>
                {form.data.action === 'extend' && (
                    <label className="block">
                        Nouvelle échéance
                        <input
                            className="mt-1 block w-full rounded border p-2"
                            type="datetime-local"
                            required
                            value={form.data.expires_at}
                            onChange={(e) =>
                                form.setData('expires_at', e.target.value)
                            }
                        />
                    </label>
                )}
                <label className="block">
                    Motif obligatoire
                    <textarea
                        className="mt-1 block w-full rounded border p-2"
                        minLength={5}
                        maxLength={1000}
                        required
                        value={form.data.reason}
                        onChange={(e) => form.setData('reason', e.target.value)}
                    />
                </label>
                {Object.values(form.errors).map((error) => (
                    <p key={error} role="alert" className="text-red-700">
                        {error}
                    </p>
                ))}
                <button
                    type="submit"
                    disabled={form.processing}
                    className="rounded bg-[#1E3A5F] px-3 py-2 text-white disabled:opacity-50"
                >
                    Appliquer et journaliser
                </button>
            </form>
        </details>
    );
}
