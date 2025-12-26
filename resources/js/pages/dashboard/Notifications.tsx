import DashboardLayout from '@/components/layouts/Dashboard/Dashboard';
import { Head, router } from '@inertiajs/react';
import { Bell, CheckCircle, Clock } from 'lucide-react';

interface Notification {
    id: string;
    type: string;
    data: {
        title: string;
        message: string;
        action_url?: string;
    };
    read_at: string | null;
    created_at: string;
}

interface Props {
    notifications: {
        data: Notification[];
        links: any[];
        meta: any;
    };
}

export default function Notifications({ notifications }: Props) {
    const markAsRead = (id: string) => {
        router.post(
            route('dashboard.notifications.mark-read', id),
            {},
            { preserveScroll: true },
        );
    };

    const markAllAsRead = () => {
        router.post(
            route('dashboard.notifications.mark-all-read'),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <DashboardLayout>
            <Head title="Notifications" />

            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Notifications
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Gérez vos alertes et mises à jour système.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50"
                    >
                        <CheckCircle size={18} className="text-amber-500" />
                        Tout marquer comme lu
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
                <div className="divide-y divide-slate-100">
                    {notifications.data.length > 0 ? (
                        notifications.data.map((notif) => (
                            <div
                                key={notif.id}
                                className={`flex gap-4 p-6 transition-colors hover:bg-slate-50/50 ${!notif.read_at ? 'bg-amber-50/20' : ''}`}
                            >
                                <div
                                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${!notif.read_at ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}
                                >
                                    <Bell size={24} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex items-start justify-between gap-4">
                                        <h3 className="truncate text-lg font-bold text-slate-800">
                                            {notif.data.title}
                                        </h3>
                                        <span className="flex items-center gap-1 text-xs font-medium whitespace-nowrap text-slate-400">
                                            <Clock size={12} />
                                            {new Date(
                                                notif.created_at,
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="mb-4 leading-relaxed text-slate-600">
                                        {notif.data.message}
                                    </p>

                                    <div className="flex items-center gap-4">
                                        {notif.data.action_url && (
                                            <button
                                                onClick={() =>
                                                    router.visit(
                                                        notif.data.action_url!,
                                                    )
                                                }
                                                className="text-sm font-bold text-amber-600 hover:text-amber-700"
                                            >
                                                Voir les détails
                                            </button>
                                        )}
                                        {!notif.read_at && (
                                            <button
                                                onClick={() =>
                                                    markAsRead(notif.id)
                                                }
                                                className="text-sm font-bold text-slate-400 hover:text-slate-600"
                                            >
                                                Marquer comme lu
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                                <Bell size={40} className="text-slate-200" />
                            </div>
                            <h2 className="mb-2 text-xl font-bold text-slate-800">
                                Aucune notification
                            </h2>
                            <p className="text-slate-500">
                                Vous êtes à jour ! Toutes vos notifications
                                apparaîtront ici.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {notifications.links && notifications.links.length > 3 && (
                    <div className="flex justify-center border-t border-slate-100 bg-slate-50 p-6">
                        <div className="flex gap-1">
                            {notifications.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() =>
                                        link.url && router.visit(link.url)
                                    }
                                    disabled={!link.url}
                                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                                        link.active
                                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                            : 'border border-slate-200 bg-white text-slate-600 hover:border-amber-400 hover:text-amber-600'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
