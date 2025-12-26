import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { router, usePage } from '@inertiajs/react';
import { Ban, CheckCircle, Edit3, ImageOff, Search, Trash2, XCircle, Calendar, CreditCard, TrendingUp, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

// ===== Types =====
type RoleUser = { roles?: string[] };

type PaymentPlan = {
  name?: string;
  price?: number | string;
};

type PaymentRequestModel = {
  id: number;
  plan?: PaymentPlan | null;
  payment_method?: string | null;
  payment_reference?: string | null;
  status: 'pending' | 'completed' | 'cancelled' | string;
  type: 'switch' | 'new' | string;
  created_at: string; // ISO date
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type Paginator<T> = {
  data: T[];
  meta: { current_page: number; last_page: number; total: number };
  links: PaginationLink[];
};

type PageProps = {
  auth: { user?: RoleUser } | any;
  paymentRequests: Paginator<PaymentRequestModel>;
  filters?: { search?: string };
};

// ===== Component =====
export default function Transactions() {
  const { auth, paymentRequests, filters } = usePage<PageProps>().props;

  // Admin?
  const isAdmin = !!auth?.user?.roles?.includes?.('Admin');

  // Recherche
  const [searchQuery, setSearchQuery] = useState<string>(filters?.search ?? '');
  const [isSearching, setIsSearching] = useState(false);

  // Notes admin (conserve ton state)
  const [adminNote, setAdminNote] = useState<{ [key: number]: string }>({});

  // Debounce 300ms + reload partiel
  useEffect(() => {
    const t = setTimeout(() => {
      router.get(
        route('dashboard.payment-requests.index'), // ← adapte si ton nom de route diffère
        { search: searchQuery || undefined },
        {
          only: ['paymentRequests', 'filters'], // reload ultra rapide
          preserveState: true,
          preserveScroll: true,
          replace: true,
          onStart: () => setIsSearching(true),
          onFinish: () => setIsSearching(false),
        }
      );
    }, 300);

    return () => clearTimeout(t);
  }, [searchQuery]);

  // Pagination qui conserve le "search"
  const goTo = (url: string | null) => {
    if (!url) return;
    const u = new URL(url, window.location.origin);
    if (searchQuery) u.searchParams.set('search', searchQuery);
    else u.searchParams.delete('search');

    router.visit(u.toString(), {
      only: ['paymentRequests', 'filters'],
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onStart: () => setIsSearching(true),
      onFinish: () => setIsSearching(false),
    });
  };

  // Actions
  const handleApprove = (id: number) => {
    if (confirm('Confirmer l\'approbation de cette demande ?')) {
      router.put(route('dashboard.payment-requests.approve', id));
    }
  };

  const handleReject = (id: number) => {
    const note = adminNote[id] || '';
    if (confirm('Confirmer le rejet de cette demande ?')) {
      router.put(route('dashboard.payment-requests.reject', id), { admin_note: note });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
            <Clock size={12} className="mr-1" />
            En attente
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
            <CheckCircle size={12} className="mr-1" />
            Validé
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 shadow-sm">
            <XCircle size={12} className="mr-1" />
            Annulé
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 shadow-sm">
            <AlertCircle size={12} className="mr-1" />
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Dashboard>
      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl shadow-lg shadow-amber-500/5 border-b border-amber-200/30 sticky top-0 z-1">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <BackButton />
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                  Transactions
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mt-1">
                  Gérez vos transactions et leurs informations
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-4">
              <div className="relative max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                <input
                  type="text"
                  placeholder="Rechercher une transaction..."
                  className={`w-full pl-10 pr-4 py-3 border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm text-sm shadow-sm ${isSearching ? 'opacity-70' : ''}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600 transition-colors"
                    aria-label="Effacer"
                  >
                    <XCircle size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <CreditCard size={24} className="text-white" />
                </div>
                <div className="flex items-center text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">
                  <TrendingUp size={16} className="mr-1" />
                  +12%
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{paymentRequests.data.length}</div>
              <div className="text-sm text-slate-600">Total transactions</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div className="flex items-center text-amber-600 text-sm font-medium bg-amber-50 px-2 py-1 rounded-lg">
                  <Clock size={16} className="mr-1" />
                  En attente
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {paymentRequests.data.filter((p) => p.status === 'pending').length}
              </div>
              <div className="text-sm text-slate-600">En validation</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 p-5 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <XCircle size={24} className="text-white" />
                </div>
                <div className="flex items-center text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">
                  <TrendingUp size={16} className="mr-1" />
                  +8%
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {paymentRequests.data.filter((p) => p.status === 'cancelled').length}
              </div>
              <div className="text-sm text-slate-600">Annulées</div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden">
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="w-full hidden md:table">
                <thead className="bg-amber-50/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">#ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Montant</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Méthode</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Référence</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200/30">
                  {paymentRequests.data.map((pay, index) => (
                    <tr 
                      key={pay.id} 
                      className="hover:bg-amber-50/30 transition-colors"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">#{pay.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-900">{pay.plan?.name || 'Sans plan'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {pay.plan?.price ? `${pay.plan.price} $` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {pay.payment_method ?? 'Manuel'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {pay.payment_reference || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(pay.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {pay.type === 'switch' ? 'Changement de plan' : 'Nouvel abonnement'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {formatDate(pay.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {isAdmin ? (
                          <div className="flex space-x-2">
                            {pay.status === 'pending' ? (
                              <>
                                <button
                                  className="text-emerald-600 hover:text-emerald-900 p-1 rounded hover:bg-emerald-50 transition-colors"
                                  onClick={() => handleApprove(pay.id)}
                                  title="Approuver"
                                >
                                  <CheckCircle size={18} />
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                  onClick={() => handleReject(pay.id)}
                                  title="Rejeter"
                                >
                                  <XCircle size={18} />
                                </button>
                              </>
                            ) : (
                              <button 
                                className="text-slate-400 p-1 rounded" 
                                disabled 
                                title={pay.status === 'completed' ? 'Validé' : pay.status === 'cancelled' ? 'Annulé' : 'En attente'}
                              >
                                {pay.status === 'completed' ? <CheckCircle size={18} /> : pay.status === 'cancelled' ? <XCircle size={18} /> : <Ban size={18} />}
                              </button>
                            )}
                          </div>
                        ) : (
                          <button 
                            className="text-slate-400 p-1 rounded" 
                            disabled 
                            title={pay.status === 'completed' ? 'Validé' : pay.status === 'cancelled' ? 'Annulé' : 'En attente'}
                          >
                            {pay.status === 'pending' ? <Ban size={18} /> : pay.status === 'cancelled' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden">
                {paymentRequests.data.map((pay, index) => (
                  <div
                    key={pay.id}
                    className="p-4 border-b border-amber-200/30 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-base font-medium text-slate-900">{pay.plan?.name || 'Sans plan'}</h3>
                        <p className="text-sm text-slate-500">#{pay.id}</p>
                      </div>
                      {getStatusBadge(pay.status)}
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Montant</span>
                        <span className="text-sm text-slate-900">
                          {pay.plan?.price ? `${pay.plan.price} $` : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Méthode</span>
                        <span className="text-sm text-slate-900">{pay.payment_method ?? 'Manuel'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Référence</span>
                        <span className="text-sm text-slate-900">{pay.payment_reference || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Type</span>
                        <span className="text-sm text-slate-900">
                          {pay.type === 'switch' ? 'Changement de plan' : 'Nouvel abonnement'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Date</span>
                        <span className="text-sm text-slate-900">{formatDate(pay.created_at)}</span>
                      </div>
                    </div>

                    {isAdmin && pay.status === 'pending' && (
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-emerald-600 hover:text-emerald-900 p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                          onClick={() => handleApprove(pay.id)}
                          title="Approuver"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                          onClick={() => handleReject(pay.id)}
                          title="Rejeter"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {paymentRequests.data.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-amber-100/50 flex items-center justify-center">
                      <CreditCard size={32} className="text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucune transaction</h3>
                    <p className="text-slate-600">Aucun enregistrement de transaction pour le moment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              {paymentRequests.data.length > 0 ? (
                <>
                  Affichage de {paymentRequests.data.length} sur {paymentRequests.meta?.total} transactions
                </>
              ) : (
                'Aucune transaction'
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {paymentRequests.links.map((link, index) => (
                <button
                  key={index}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    link.active 
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                      : 'text-slate-600 hover:bg-amber-100 hover:text-amber-700'
                  } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!link.url}
                  onClick={() => goTo(link.url)}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}