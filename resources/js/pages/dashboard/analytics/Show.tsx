import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    type ChartOptions,
} from 'chart.js';
import {
    Activity,
    Calendar,
    Clock,
    Eye,
    Mail,
    MessageSquare,
    Phone,
    TrendingUp,
    User,
    Users,
} from 'lucide-react';
import React from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
);

type StatType = 'views' | 'first' | 'last' | 'contacts';

interface AnalyticsShowProps {
    propertyTitle: string;
    views: {
        total: number;
        first?: string;
        last?: string;
        chart?: Array<{ date: string; total: number }>;
        topViewers?: Array<{
            user: { id: number; name: string };
            total: number;
        }>;
        data?: Array<{
            user?: { name?: string };
            viewed_at: string;
        }>;
    };
    contacts: {
        total: number;
        chart?: Array<{
            date: string;
            total_email: number;
            total_whatsapp: number;
        }>;
        byMethod?: Array<{ method: string; total: number }>;
        data?: Array<{
            user?: { name?: string };
            method: string;
            clicked_at: string;
        }>;
    };
}

export default function Show({
    propertyTitle,
    views,
    contacts,
}: AnalyticsShowProps) {
    const viewsChartData = {
        labels: views?.chart?.map((item) => item.date) || [],
        datasets: [
            {
                label: 'Vues',
                data: views?.chart?.map((item) => item.total) || [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
            },
        ],
    };

    const contactsChartData = {
        labels: contacts?.chart?.map((item) => item.date) || [],
        datasets: [
            {
                label: 'Email',
                data: contacts?.chart?.map((item) => item.total_email) || [],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: 'WhatsApp',
                data: contacts?.chart?.map((item) => item.total_whatsapp) || [],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#64748b',
                    font: { size: 12, weight: '500' },
                    usePointStyle: true,
                    padding: 20,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#f1f5f9',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(148, 163, 184, 0.2)',
                borderWidth: 1,
                cornerRadius: 12,
                padding: 12,
                titleFont: { size: 13, weight: '600' },
                bodyFont: { size: 12 },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#64748b',
                    font: { size: 11, weight: '500' },
                    padding: 8,
                },
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                    lineWidth: 1,
                },
                border: {
                    display: false,
                },
            },
            y: {
                ticks: {
                    color: '#64748b',
                    font: { size: 11, weight: '500' },
                    padding: 8,
                },
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                    lineWidth: 1,
                },
                border: {
                    display: false,
                },
            },
        },
    };

    const getStatIcon = (type: StatType) => {
        const iconMap = {
            views: Eye,
            first: Calendar,
            last: Clock,
            contacts: MessageSquare,
        };
        return iconMap[type] || Eye;
    };

    const getStatColor = (type: StatType) => {
        const colorMap = {
            views: 'from-blue-400 to-blue-600',
            first: 'from-emerald-400 to-emerald-600',
            last: 'from-purple-400 to-purple-600',
            contacts: 'from-slate-100 to-slate-100',
        };
        return colorMap[type] || 'from-gray-400 to-gray-600';
    };

    const StatCard = ({
        title,
        value,
        type,
        delay = 0,
    }: {
        title: string;
        value: string | number | undefined;
        type: StatType;
        delay?: number;
    }) => {
        const Icon = getStatIcon(type);
        const colorClass = getStatColor(type);

        return (
            <div
                className="transform overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm hover:shadow-xl"
                style={{ animationDelay: `${delay}ms` }}
            >
                <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h4 className="mb-1 text-sm font-medium text-gray-600">
                                {title}
                            </h4>
                            <p className="text-2xl font-bold text-gray-900">
                                {value || '-'}
                            </p>
                        </div>
                        <div
                            className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}
                        >
                            <Icon size={24} className="text-white" />
                        </div>
                    </div>
                    <div
                        className={`h-1 bg-gradient-to-r ${colorClass} rounded-full`}
                    ></div>
                </div>
            </div>
        );
    };

    const getContactIcon = (method: string) => {
        return method === 'email' ? Mail : Phone;
    };

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <BackButton />
                        <div className="mt-6 text-center">
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">
                                Statistiques de l'annonce : {propertyTitle}
                            </h1>
                            <p className="text-gray-600">
                                Analysez les performances de votre annonce
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <section className="mb-8">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title="Total vues"
                                value={views.total}
                                type="views"
                                delay={0}
                            />
                            <StatCard
                                title="Première vue"
                                value={views.first}
                                type="first"
                                delay={100}
                            />
                            <StatCard
                                title="Dernière vue"
                                value={views.last}
                                type="last"
                                delay={200}
                            />
                            <StatCard
                                title="Total contacts"
                                value={contacts.total}
                                type="contacts"
                                delay={300}
                            />
                        </div>
                    </section>

                    {/* Charts */}
                    <section className="mb-8">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-sm">
                                <div className="p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
                                            <TrendingUp
                                                size={20}
                                                className="text-white"
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Évolution des vues
                                        </h2>
                                    </div>
                                    <div className="h-64">
                                        <Line
                                            data={viewsChartData}
                                            options={
                                                chartOptions as ChartOptions<'line'>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-sm">
                                <div className="p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600">
                                            <Activity
                                                size={20}
                                                className="text-white"
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Contacts par méthode
                                        </h2>
                                    </div>
                                    <div className="h-64">
                                        <Line
                                            data={contactsChartData}
                                            options={
                                                chartOptions as ChartOptions<'line'>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Details */}
                    <section className="mb-8">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Contact Methods */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-sm">
                                <div className="p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#A8882E]">
                                            <Phone
                                                size={20}
                                                className="text-white"
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Répartition des contacts
                                        </h2>
                                    </div>
                                    <div className="space-y-4">
                                        {contacts?.byMethod?.map((method) => (
                                            <div
                                                key={method.method}
                                                className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {React.createElement(
                                                        getContactIcon(
                                                            method.method,
                                                        ),
                                                        {
                                                            size: 20,
                                                            className:
                                                                'text-[#C9A84C]',
                                                        },
                                                    )}
                                                    <span className="font-medium text-gray-900 capitalize">
                                                        {method.method}
                                                    </span>
                                                </div>
                                                <span className="text-xl font-bold text-gray-900">
                                                    {method.total}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Top Viewers */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-sm">
                                <div className="p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-purple-600">
                                            <Users
                                                size={20}
                                                className="text-white"
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Top visiteurs
                                        </h2>
                                    </div>
                                    <div className="space-y-4">
                                        {views?.topViewers?.map((viewer) => (
                                            <div
                                                key={viewer.user.id}
                                                className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <User
                                                        size={20}
                                                        className="text-purple-500"
                                                    />
                                                    <span className="font-medium text-gray-900">
                                                        {viewer.user.name}
                                                    </span>
                                                </div>
                                                <span className="text-xl font-bold text-gray-900">
                                                    {viewer.total} vue
                                                    {viewer.total > 1
                                                        ? 's'
                                                        : ''}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* History */}
                    <section>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Views History */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-sm">
                                <div className="p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600">
                                            <Eye
                                                size={20}
                                                className="text-white"
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Historique des vues
                                        </h2>
                                    </div>
                                    <div className="max-h-96 space-y-3 overflow-y-auto">
                                        {views?.data?.map((view, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                                            >
                                                <span className="text-sm text-gray-900">
                                                    {view.user?.name ||
                                                        'Visiteur anonyme'}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {view.viewed_at}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Contacts History */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-sm">
                                <div className="p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600">
                                            <MessageSquare
                                                size={20}
                                                className="text-white"
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Historique des contacts
                                        </h2>
                                    </div>
                                    <div className="max-h-96 space-y-3 overflow-y-auto">
                                        {contacts?.data?.map(
                                            (contact, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                                                >
                                                    <span className="text-sm text-gray-900">
                                                        {contact.user?.name ||
                                                            'Anonyme'}{' '}
                                                        -{' '}
                                                        <strong className="capitalize">
                                                            {contact.method}
                                                        </strong>
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {contact.clicked_at}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Dashboard>
    );
}
