import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';
import 'chart.js/auto';
import {
    BarChart3,
    Building,
    CheckCircle,
    Clock,
    CreditCard,
    Eye,
    Home,
    Phone,
    Star,
    TrendingUp,
    Users,
    XCircle,
} from 'lucide-react';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
);

export default function Index({
    viewsPerDay = [],
    contactsPerMethod = [],
    mostViewedProperties = [],
    userStats = { sellers: 0, agencies: 0, buyers: 0 },
    propertyStats = { total: 0, published: 0, approved: 0, featured: 0 },
    subscriptionStats = { active: 0, expired: 0, total: 0 },
    paymentRequestStats = { pending: 0, approved: 0, rejected: 0 },
    isAdmin = false,
}: any) {
    const lineData = {
        labels: viewsPerDay.map((v: any) => v.date).reverse(),
        datasets: [
            {
                label: 'Vues par jour',
                data: viewsPerDay.map((v: any) => v.total).reverse(),
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

    const doughnutData = {
        labels: contactsPerMethod.map((c: any) => c.method),
        datasets: [
            {
                data: contactsPerMethod.map((c: any) => c.total),
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(250, 204, 21, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(250, 204, 21, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 2,
                hoverOffset: 10,
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
                    color: 'rgba(148, 163, 184, 0.2)',
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
                    color: 'rgba(148, 163, 184, 0.2)',
                },
            },
        },
    };

    const getStatIcon = (type: string) => {
        const iconMap = {
            sellers: Users,
            agencies: Building,
            buyers: Users,
            total: TrendingUp,
            properties: Home,
            published: CheckCircle,
            approved: CheckCircle,
            featured: Star,
            active: CheckCircle,
            expired: XCircle,
            pending: Clock,
            rejected: XCircle,
            credit: CreditCard,
        };
        return iconMap[type] || TrendingUp;
    };

    const getStatModifier = (type: string): string => {
        const modifierMap = {
            sellers: 'blue',
            agencies: 'green',
            buyers: 'purple',
            total: 'orange',
            properties: 'cyan',
            published: 'emerald',
            approved: 'teal',
            featured: 'yellow',
            active: 'success',
            expired: 'danger',
            pending: 'warning',
            rejected: 'danger',
            credit: 'indigo',
        };
        return modifierMap[type] || 'default';
    };

    const StatCard = ({ title, value, type, delay = 0 }) => {
        const Icon = getStatIcon(type);
        const modifier = getStatModifier(type);

        const colorClasses = {
            blue: 'from-blue-400 to-blue-600',
            green: 'from-emerald-400 to-emerald-600',
            purple: 'from-purple-400 to-purple-600',
            orange: 'from-amber-400 to-amber-600',
            cyan: 'from-cyan-400 to-cyan-600',
            emerald: 'from-emerald-400 to-emerald-600',
            teal: 'from-teal-400 to-teal-600',
            yellow: 'from-yellow-400 to-yellow-600',
            success: 'from-green-400 to-green-600',
            danger: 'from-red-400 to-red-600',
            warning: 'from-amber-400 to-amber-600',
            indigo: 'from-indigo-400 to-indigo-600',
            default: 'from-gray-400 to-gray-600',
        };

        return (
            <article
                className="transform overflow-hidden rounded-2xl border border-amber-200/30 bg-white shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/20"
                style={{ animationDelay: `${delay}ms` }}
            >
                <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex-1">
                            <h4 className="mb-1 text-sm font-medium text-gray-600">
                                {title}
                            </h4>
                            <p className="text-2xl font-bold text-gray-900">
                                {value?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div
                            className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colorClasses[modifier]} flex items-center justify-center shadow-lg`}
                        >
                            <Icon size={24} className="text-white" />
                        </div>
                    </div>
                    <div
                        className={`h-1 bg-gradient-to-r ${colorClasses[modifier]} rounded-full`}
                    ></div>
                </div>
            </article>
        );
    };

    const ChartIcon = ({ type, size = 20 }) => {
        const iconMap = {
            line: TrendingUp,
            doughnut: Phone,
        };
        const Icon = iconMap[type];
        return Icon ? <Icon size={size} className="text-amber-500" /> : null;
    };

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <BackButton />
                        <div className="mt-6 text-center">
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">
                                Statistiques globales
                            </h1>
                            <p className="text-gray-600">
                                Vue d'ensemble des performances en temps réel
                            </p>
                        </div>
                    </div>

                    {/* User Stats - Admin only */}
                    {isAdmin && (
                        <section className="mb-8">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <StatCard
                                    title="Vendeurs"
                                    value={userStats.sellers}
                                    type="sellers"
                                    delay={0}
                                />
                                <StatCard
                                    title="Agences"
                                    value={userStats.agencies}
                                    type="agencies"
                                    delay={100}
                                />
                                <StatCard
                                    title="Acheteurs"
                                    value={userStats.buyers}
                                    type="buyers"
                                    delay={200}
                                />
                                <StatCard
                                    title="Total utilisateurs"
                                    value={
                                        userStats.sellers +
                                        userStats.agencies +
                                        userStats.buyers
                                    }
                                    type="total"
                                    delay={300}
                                />
                            </div>
                        </section>
                    )}

                    {/* Property Stats */}
                    <section className="mb-8">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title="Annonces"
                                value={propertyStats.total}
                                type="properties"
                                delay={0}
                            />
                            <StatCard
                                title="Publiées"
                                value={propertyStats.published}
                                type="published"
                                delay={100}
                            />
                            <StatCard
                                title="Approuvées"
                                value={propertyStats.approved}
                                type="approved"
                                delay={200}
                            />
                            <StatCard
                                title="En vedette"
                                value={propertyStats.featured}
                                type="featured"
                                delay={300}
                            />
                        </div>
                    </section>

                    {/* Subscription Stats */}
                    <section className="mb-8">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title="Abonnements actifs"
                                value={subscriptionStats.active}
                                type="active"
                                delay={0}
                            />
                            {isAdmin && (
                                <>
                                    <StatCard
                                        title="Abonnements expirés"
                                        value={subscriptionStats.expired}
                                        type="expired"
                                        delay={100}
                                    />
                                    <StatCard
                                        title="Total abonnements"
                                        value={subscriptionStats.total}
                                        type="total"
                                        delay={200}
                                    />
                                </>
                            )}
                        </div>
                    </section>

                    {/* Payment Stats */}
                    <section className="mb-8">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <StatCard
                                title="Paiements en attente"
                                value={paymentRequestStats.pending}
                                type="pending"
                                delay={0}
                            />
                            <StatCard
                                title="Paiements approuvés"
                                value={paymentRequestStats.approved}
                                type="credit"
                                delay={100}
                            />
                            <StatCard
                                title="Paiements rejetés"
                                value={paymentRequestStats.rejected}
                                type="rejected"
                                delay={200}
                            />
                        </div>
                    </section>

                    {/* Charts Section */}
                    <section className="mb-8">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="overflow-hidden rounded-2xl border border-amber-200/30 bg-white shadow-lg shadow-amber-500/10">
                                <div className="p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
                                            <BarChart3
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
                                            data={lineData}
                                            options={chartOptions}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-amber-200/30 bg-white shadow-lg shadow-amber-500/10">
                                <div className="p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600">
                                            <Phone
                                                size={20}
                                                className="text-white"
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Méthodes de contact
                                        </h2>
                                    </div>
                                    <div className="h-64">
                                        <Doughnut
                                            data={doughnutData}
                                            options={{
                                                ...chartOptions,
                                                cutout: '60%',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Top Properties Table */}
                    <section>
                        <div className="overflow-hidden rounded-2xl border border-amber-200/30 bg-white shadow-lg shadow-amber-500/10">
                            <div className="p-6">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600">
                                        <Eye size={20} className="text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Top 10 des annonces les plus vues
                                    </h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-amber-50/30">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                                    ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                                    Titre
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                                    Municipalité
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                                    Vues
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-amber-200/30">
                                            {mostViewedProperties.map(
                                                (
                                                    property: any,
                                                    index: number,
                                                ) => (
                                                    <tr
                                                        key={property.id}
                                                        className="transition-colors hover:bg-amber-50/30"
                                                        style={{
                                                            animationDelay: `${index * 50}ms`,
                                                        }}
                                                    >
                                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                            #{property.id}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                            {property.title}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                            {property
                                                                .municipality
                                                                ?.name || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                            <div className="flex items-center gap-2">
                                                                <Eye
                                                                    size={16}
                                                                    className="text-amber-500"
                                                                />
                                                                {property.views_count?.toLocaleString() ||
                                                                    0}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                    {mostViewedProperties.length < 1 && (
                                        <div className="py-8 text-center text-gray-500">
                                            Aucune annonce trouvée.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Dashboard>
    );
}
