import React from 'react'
import Dashboard from '@/components/layouts/Dashboard/Dashboard'
import { Line } from 'react-chartjs-2'
import {
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js'
import { Eye, Calendar, MessageSquare, Users, Mail, Phone, Clock, User, TrendingUp, Activity, BarChart3 } from 'lucide-react'
import BackButton from '@/components/ui/BackButton'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function Show({ propertyTitle, views, contacts }) {
    const viewsChartData = {
        labels: views.chart.map((item) => item.date),
        datasets: [
            {
                label: 'Vues',
                data: views.chart.map((item) => item.total),
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
    }

    const contactsChartData = {
        labels: contacts.chart.map((item) => item.date),
        datasets: [
            {
                label: 'Email',
                data: contacts.chart.map((item) => item.total_email),
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
                data: contacts.chart.map((item) => item.total_whatsapp),
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
    }

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
                }
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
                }
            },
        },
    }

    const getStatIcon = (type) => {
        const iconMap = {
            views: Eye,
            first: Calendar,
            last: Clock,
            contacts: MessageSquare
        }
        return iconMap[type] || Eye
    }

    const getStatColor = (type) => {
        const colorMap = {
            views: 'from-blue-400 to-blue-600',
            first: 'from-emerald-400 to-emerald-600',
            last: 'from-purple-400 to-purple-600',
            contacts: 'from-amber-400 to-amber-600'
        }
        return colorMap[type] || 'from-gray-400 to-gray-600'
    }

    const StatCard = ({ title, value, type, delay = 0 }) => {
        const Icon = getStatIcon(type)
        const colorClass = getStatColor(type)

        return (
            <div
                className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${delay}ms` }}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-600 mb-1">{title}</h4>
                            <p className="text-2xl font-bold text-gray-900">{value || '-'}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}>
                            <Icon size={24} className="text-white" />
                        </div>
                    </div>
                    <div className={`h-1 bg-gradient-to-r ${colorClass} rounded-full`}></div>
                </div>
            </div>
        )
    }

    const getContactIcon = (method) => {
        return method === 'email' ? Mail : Phone
    }

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Header */}
                    <div className="mb-8">
                        <BackButton />
                        <div className="mt-6 text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Statistiques de l'annonce : {propertyTitle}
                            </h1>
                            <p className="text-gray-600">Analysez les performances de votre annonce</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <section className="mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total vues" value={views.total} type="views" delay={0} />
                            <StatCard title="Première vue" value={views.first} type="first" delay={100} />
                            <StatCard title="Dernière vue" value={views.last} type="last" delay={200} />
                            <StatCard title="Total contacts" value={contacts.total} type="contacts" delay={300} />
                        </div>
                    </section>

                    {/* Charts */}
                    <section className="mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                            <TrendingUp size={20} className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Évolution des vues</h2>
                                    </div>
                                    <div className="h-64">
                                        <Line data={viewsChartData} options={chartOptions} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                                            <Activity size={20} className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Contacts par méthode</h2>
                                    </div>
                                    <div className="h-64">
                                        <Line data={contactsChartData} options={chartOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Details */}
                    <section className="mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Contact Methods */}
                            <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                            <Phone size={20} className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Répartition des contacts</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {contacts.byMethod.map((method) => (
                                            <div key={method.method} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    {React.createElement(
                                                        getContactIcon(method.method),
                                                        {
                                                            size: 20,
                                                            className: 'text-amber-500'
                                                        }
                                                    )}
                                                    <span className="font-medium text-gray-900 capitalize">{method.method}</span>
                                                </div>
                                                <span className="text-xl font-bold text-gray-900">{method.total}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Top Viewers */}
                            <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                                            <Users size={20} className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Top visiteurs</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {views.topViewers.map((viewer) => (
                                            <div key={viewer.user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <User size={20} className="text-purple-500" />
                                                    <span className="font-medium text-gray-900">{viewer.user.name}</span>
                                                </div>
                                                <span className="text-xl font-bold text-gray-900">
                                                    {viewer.total} vue{viewer.total > 1 ? 's' : ''}
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Views History */}
                            <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                                            <Eye size={20} className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Historique des vues</h2>
                                    </div>
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {views.data.map((view, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-sm text-gray-900">
                                                    {view.user?.name || 'Visiteur anonyme'}
                                                </span>
                                                <span className="text-sm text-gray-500">{view.viewed_at}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Contacts History */}
                            <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                                            <MessageSquare size={20} className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Historique des contacts</h2>
                                    </div>
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {contacts.data.map((contact, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-sm text-gray-900">
                                                    {contact.user?.name || 'Anonyme'} - <strong className="capitalize">{contact.method}</strong>
                                                </span>
                                                <span className="text-sm text-gray-500">{contact.clicked_at}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Dashboard>
    )
}