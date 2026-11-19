import {
  BarChart3,
  Building2,
  Calculator,
  Download,
  Edit3,
  IndianRupee,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  adminLogin,
  createAdminPartner,
  createAdminProduct,
  deleteAdminPartner,
  deleteAdminProduct,
  downloadAdminCsv,
  fetchAdminDashboard,
  getStoredAdminToken,
  setStoredAdminToken,
  updateAdminCommission,
  updateAdminEnquiry,
  updateAdminPartner,
  updateAdminProduct,
  updateAdminSettings,
} from '../services/api';
import {
  APPLICATION_STATUSES,
  type AdminDashboardResponse,
  type ApplicationStatus,
  type BankPartner,
  type CustomerEnquiry,
  type FinancialProduct,
  type ServiceCategory,
} from '../types';
import { AdminCharts } from './AdminCharts';

type AdminTab = 'overview' | 'leads' | 'catalog' | 'commission' | 'settings';

interface AdminViewProps {
  onCatalogUpdated: () => void;
}

export function AdminView({ onCatalogUpdated }: AdminViewProps) {
  const [token, setToken] = useState<string | null>(() => getStoredAdminToken());
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Lead Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);

  // Lead Edit State
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('Enquiry Received');
  const [editAssignee, setEditAssignee] = useState('Unassigned');
  const [editPartnerId, setEditPartnerId] = useState('');
  const [editCustomerUpdate, setEditCustomerUpdate] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [noteVisible, setNoteVisible] = useState(false);
  const [savingLead, setSavingLead] = useState(false);

  // Commission State
  const [commRate, setCommRate] = useState('500');
  const [varCost, setVarCost] = useState('150');
  const [fixedCost, setFixedCost] = useState('5000');
  const [targetMonthly, setTargetMonthly] = useState('30');
  const [savingCommission, setSavingCommission] = useState(false);

  // Settings State
  const [waNumber, setWaNumber] = useState('');
  const [officeLoc, setOfficeLoc] = useState('');
  const [supportHrs, setSupportHrs] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // Product Form Modal
  const [editingProduct, setEditingProduct] = useState<Partial<FinancialProduct> | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Partner Form Modal
  const [editingPartner, setEditingPartner] = useState<Partial<BankPartner> | null>(null);
  const [savingPartner, setSavingPartner] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadDashboard = useCallback(async () => {
    if (!getStoredAdminToken()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminDashboard();
      setDashboard(data);
      setCommRate(String(data.commission.referralCommission));
      setVarCost(String(data.commission.variableCostPerReferral));
      setFixedCost(String(data.commission.monthlyFixedCost));
      setTargetMonthly(String(data.commission.targetCustomersPerMonth));
      setWaNumber(data.settings.whatsappNumber);
      setOfficeLoc(data.settings.officeLocation);
      setSupportHrs(data.settings.supportHours);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load dashboard.';
      if (message.toLowerCase().includes('unauthorized')) {
        setStoredAdminToken(null);
        setToken(null);
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadDashboard();
    }
  }, [token, loadDashboard]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await adminLogin(loginEmail, loginPassword);
      setToken(res.token);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setStoredAdminToken(null);
    setToken(null);
    setDashboard(null);
  };

  const filteredEnquiries = useMemo(() => {
    if (!dashboard) return [];
    const q = searchQuery.trim().toLowerCase();
    return dashboard.enquiries.filter((e) => {
      if (serviceFilter !== 'ALL' && e.serviceRequired !== serviceFilter) return false;
      if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
      if (q) {
        const hay = `${e.enquiryId} ${e.fullName} ${e.mobile} ${e.businessName} ${e.businessLocation}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [dashboard, searchQuery, serviceFilter, statusFilter]);

  const kpis = useMemo(() => {
    const list = dashboard?.enquiries || [];
    return {
      total: list.length,
      newLeads: list.filter((e) => e.status === 'Enquiry Received' || e.status === 'Contact Pending').length,
      contacted: list.filter((e) =>
        ['Customer Contacted', 'Documents Guidance Provided'].includes(e.status)
      ).length,
      referred: list.filter((e) =>
        ['Referred to Bank', 'Application Submitted', 'Bank Decision Pending'].includes(e.status)
      ).length,
      completed: list.filter((e) => e.status === 'Completed').length,
      pending: list.filter((e) => !['Completed', 'Not Proceeding'].includes(e.status)).length,
    };
  }, [dashboard]);

  const openEnquiryModal = (enq: CustomerEnquiry) => {
    setSelectedEnquiry(enq);
    setEditStatus(enq.status);
    setEditAssignee(enq.assignedTo || 'Unassigned');
    setEditPartnerId(enq.referredPartnerId || '');
    setEditCustomerUpdate(enq.customerVisibleUpdate || '');
    setNewNoteText('');
    setNoteVisible(false);
  };

  const handleSaveEnquiry = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setSavingLead(true);
    try {
      const updated = await updateAdminEnquiry(selectedEnquiry.id, {
        status: editStatus,
        assignedTo: editAssignee,
        referredPartnerId: editPartnerId,
        customerVisibleUpdate: editCustomerUpdate,
        newNoteText: newNoteText.trim() || undefined,
        noteVisibleToCustomer: noteVisible,
      });
      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              enquiries: prev.enquiries.map((item) => (item.id === updated.id ? updated : item)),
            }
          : prev
      );
      setSelectedEnquiry(updated);
      setNewNoteText('');
      showToast('Lead updated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead.');
    } finally {
      setSavingLead(false);
    }
  };

  const handleSaveCommission = async (e: FormEvent) => {
    e.preventDefault();
    setSavingCommission(true);
    try {
      const updated = await updateAdminCommission({
        referralCommission: Number(commRate),
        variableCostPerReferral: Number(varCost),
        monthlyFixedCost: Number(fixedCost),
        targetCustomersPerMonth: Number(targetMonthly),
      });
      setDashboard((prev) => (prev ? { ...prev, commission: updated } : prev));
      showToast('Commission assumptions saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update commission settings.');
    } finally {
      setSavingCommission(false);
    }
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const updated = await updateAdminSettings({
        whatsappNumber: waNumber,
        officeLocation: officeLoc,
        supportHours: supportHrs,
      });
      setDashboard((prev) => (prev ? { ...prev, settings: updated } : prev));
      onCatalogUpdated();
      showToast('Settings updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSavingProduct(true);
    try {
      if (editingProduct.id) {
        await updateAdminProduct(editingProduct.id, editingProduct);
      } else {
        await createAdminProduct(editingProduct);
      }
      setEditingProduct(null);
      await loadDashboard();
      onCatalogUpdated();
      showToast('Financial product saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product.');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteAdminProduct(id);
      await loadDashboard();
      onCatalogUpdated();
      showToast('Product removed.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product.');
    }
  };

  const handleSavePartner = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingPartner) return;
    setSavingPartner(true);
    try {
      if (editingPartner.id) {
        await updateAdminPartner(editingPartner.id, editingPartner);
      } else {
        await createAdminPartner(editingPartner);
      }
      setEditingPartner(null);
      await loadDashboard();
      onCatalogUpdated();
      showToast('Partner saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save partner.');
    } finally {
      setSavingPartner(false);
    }
  };

  const handleDeletePartner = async (id: string) => {
    try {
      await deleteAdminPartner(id);
      await loadDashboard();
      onCatalogUpdated();
      showToast('Partner removed.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete partner.');
    }
  };

  // Unauthenticated Admin Login Gate
  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-14">
        <div className="bg-white rounded-2xl border border-slate-200 p-7">
          <div className="w-11 h-11 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-center mb-5">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-display font-bold text-2xl text-[#0B1F3A]">
            DukaanDhan Admin Sign In
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Restricted access for lead management, bank partner verification, and internal commission planning.
          </p>

          {/* Demo Mode Box */}
          <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
            <p className="font-semibold text-[#0B1F3A]">Demo Mode Administrator Credentials</p>
            <p className="font-mono">Email: admin@dukaandhan.in</p>
            <p className="font-mono">Password: DukaanDhan@2026</p>
            <button
              type="button"
              onClick={() => {
                setLoginEmail('admin@dukaandhan.in');
                setLoginPassword('DukaanDhan@2026');
              }}
              className="mt-1 px-3 py-1.5 rounded-lg bg-[#0B1F3A] text-white font-semibold text-xs hover:bg-slate-800"
            >
              Fill Demo Credentials
            </button>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {loginError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 font-medium">
                {loginError}
              </div>
            )}

            <div>
              <label htmlFor="adminEmail" className="block text-sm font-semibold text-[#0B1F3A] mb-1">
                Administrator Email
              </label>
              <input
                id="adminEmail"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@dukaandhan.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label htmlFor="adminPass" className="block text-sm font-semibold text-[#0B1F3A] mb-1">
                Password
              </label>
              <input
                id="adminPass"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
            >
              {loggingIn ? 'Verifying...' : 'Sign In to Admin Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const sidebarItems: Array<{ id: AdminTab; label: string; icon: typeof BarChart3 }> = [
    { id: 'overview', label: 'Overview & Analytics', icon: BarChart3 },
    { id: 'leads', label: 'Leads & Enquiries', icon: Users },
    { id: 'catalog', label: 'Products & Partners', icon: Building2 },
    { id: 'commission', label: 'Commission & Revenue', icon: IndianRupee },
    { id: 'settings', label: 'Settings & Firebase', icon: Settings },
  ];

  // Commission Calculations
  const parsedComm = Math.max(0, Number(commRate) || 0);
  const parsedVar = Math.max(0, Number(varCost) || 0);
  const parsedFixed = Math.max(0, Number(fixedCost) || 0);
  const parsedTarget = Math.max(1, Number(targetMonthly) || 1);
  const contributionPerReferral = parsedComm - parsedVar;
  const completedCount = kpis.completed;
  const actualRevenue = completedCount * parsedComm;
  const actualVarCost = completedCount * parsedVar;
  const actualSurplus = actualRevenue - actualVarCost - parsedFixed;
  const targetRevenue = parsedTarget * parsedComm;
  const targetVarCost = parsedTarget * parsedVar;
  const targetSurplus = targetRevenue - targetVarCost - parsedFixed;
  const breakEvenReferrals =
    contributionPerReferral > 0 ? Math.ceil(parsedFixed / contributionPerReferral) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl bg-[#0B1F3A] text-white text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 space-y-1.5">
          <div className="px-3 py-2 border-b border-slate-100 mb-2">
            <p className="text-xs font-medium text-slate-500">Internal Workspace</p>
            <p className="font-display font-bold text-base text-[#0B1F3A]">DukaanDhan Admin</p>
          </div>

          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#0B1F3A] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Breadcrumb Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">
                Admin / {sidebarItems.find((i) => i.id === activeTab)?.label}
              </p>
              <h1 className="font-display font-bold text-xl text-[#0B1F3A]">
                {sidebarItems.find((i) => i.id === activeTab)?.label}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadDashboard}
                disabled={loading}
                className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadAdminCsv({
                    service: serviceFilter,
                    status: statusFilter,
                    q: searchQuery,
                  })
                }
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800">
              {error}
            </div>
          )}

          {loading && !dashboard ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-sm text-slate-500">
              Loading dashboard data...
            </div>
          ) : dashboard ? (
            <>
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { label: 'Total Enquiries', val: kpis.total, accent: 'text-[#0B1F3A]' },
                      { label: 'New Leads', val: kpis.newLeads, accent: 'text-amber-700' },
                      { label: 'Contacted', val: kpis.contacted, accent: 'text-[#0B1F3A]' },
                      { label: 'Bank Referrals', val: kpis.referred, accent: 'text-sky-700' },
                      { label: 'Completed', val: kpis.completed, accent: 'text-emerald-700' },
                      { label: 'Pending Action', val: kpis.pending, accent: 'text-slate-700' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white rounded-xl border border-slate-200 p-4"
                      >
                        <p className="text-xs text-slate-500">{stat.label}</p>
                        <p className={`font-mono text-2xl font-bold tabular-nums mt-1 ${stat.accent}`}>
                          {stat.val}
                        </p>
                      </div>
                    ))}
                  </div>

                  <AdminCharts
                    enquiries={dashboard.enquiries}
                    partners={dashboard.partners}
                    commission={dashboard.commission}
                  />
                </div>
              )}

              {/* LEADS & ENQUIRIES TAB */}
              {activeTab === 'leads' && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, mobile, shop, or ID..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <select
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="ALL">All Services</option>
                      <option value="Business Loan">Business Loan</option>
                      <option value="Current Account">Current Account</option>
                      <option value="Insurance">Insurance</option>
                      <option value="General Banking Guidance">General Banking Guidance</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="ALL">All Statuses</option>
                      {APPLICATION_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {filteredEnquiries.length === 0 ? (
                    <div className="p-10 text-center text-sm text-slate-500">
                      No enquiries match your current filters.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                            <th className="py-3 px-4">ID</th>
                            <th className="py-3 px-4">Customer & Shop</th>
                            <th className="py-3 px-4">Mobile</th>
                            <th className="py-3 px-4">Service</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Advisor</th>
                            <th className="py-3 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {filteredEnquiries.map((enq) => (
                            <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-4 font-mono text-xs text-[#0B1F3A] font-semibold whitespace-nowrap">
                                {enq.enquiryId}
                                {enq.isSample ? ' (Sample)' : ''}
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-semibold text-[#0B1F3A]">{enq.fullName}</p>
                                <p className="text-xs text-slate-500">
                                  {enq.businessName} · {enq.businessLocation}
                                </p>
                              </td>
                              <td className="py-3 px-4 font-mono text-xs tabular-nums text-slate-700 whitespace-nowrap">
                                {enq.mobile}
                              </td>
                              <td className="py-3 px-4 text-xs text-slate-700 whitespace-nowrap">
                                {enq.serviceRequired}
                              </td>
                              <td className="py-3 px-4 text-xs font-semibold whitespace-nowrap">
                                <span
                                  className={
                                    enq.status === 'Completed'
                                      ? 'text-emerald-700'
                                      : enq.status === 'Not Proceeding'
                                      ? 'text-red-700'
                                      : 'text-[#0B1F3A]'
                                  }
                                >
                                  {enq.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-xs text-slate-600 whitespace-nowrap">
                                {enq.assignedTo}
                              </td>
                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => openEnquiryModal(enq)}
                                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-[#0B1F3A]"
                                >
                                  Manage
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* PRODUCTS & PARTNERS TAB */}
              {activeTab === 'catalog' && (
                <div className="space-y-6">
                  {/* Bank Partners Section */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <h2 className="font-display font-bold text-lg text-[#0B1F3A]">
                          Bank & Authorized Partners
                        </h2>
                        <p className="text-xs text-slate-500">
                          Mark partners as Verified only after formal agreement is signed.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingPartner({
                            name: '',
                            type: 'Public Sector Bank',
                            verificationStatus: 'Sample / Onboarding',
                            contactPerson: '',
                            branchLocation: 'Dehradun',
                            supportedCategories: ['business_loan'],
                            active: true,
                          })
                        }
                        className="px-3.5 py-2 rounded-lg bg-[#0B1F3A] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Partner</span>
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {dashboard.partners.map((partner) => (
                        <div
                          key={partner.id}
                          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <p className="font-semibold text-sm text-[#0B1F3A]">{partner.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {partner.type} · {partner.branchLocation} ·{' '}
                              <span
                                className={
                                  partner.verificationStatus === 'Verified Partner'
                                    ? 'text-emerald-700 font-semibold'
                                    : 'text-amber-700 font-medium'
                                }
                              >
                                {partner.verificationStatus}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingPartner(partner)}
                              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                              aria-label="Edit partner"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePartner(partner.id)}
                              className="p-2 rounded-lg border border-slate-200 hover:bg-red-50 text-red-700"
                              aria-label="Delete partner"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Products Section */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <h2 className="font-display font-bold text-lg text-[#0B1F3A]">
                          Financial Products Catalogue
                        </h2>
                        <p className="text-xs text-slate-500">
                          Indicative rates are shown to customers only when Marked Verified.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProduct({
                            category: 'business_loan',
                            subType: 'Small Business Loan',
                            nameEn: '',
                            nameHi: '',
                            partnerId: dashboard.partners[0]?.id || '',
                            isVerifiedPartner: false,
                            isVerifiedRate: false,
                            indicativeRate: '',
                            amountOrBalanceLabelEn: '',
                            amountOrBalanceLabelHi: '',
                            eligibilityEn: '',
                            eligibilityHi: '',
                            termsEn: '',
                            termsHi: '',
                            featuresEn: [],
                            featuresHi: [],
                            documentsEn: ['Aadhaar Card', 'PAN Card'],
                            documentsHi: ['आधार कार्ड', 'पैन कार्ड'],
                            isSampleTemplate: false,
                            active: true,
                          })
                        }
                        className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Product</span>
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {dashboard.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <p className="font-semibold text-sm text-[#0B1F3A]">{prod.nameEn}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {prod.category} · {prod.partnerName} ·{' '}
                              {prod.isVerifiedRate && prod.indicativeRate
                                ? `Verified Rate: ${prod.indicativeRate}`
                                : 'Unverified / Sample Rate'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingProduct(prod)}
                              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                              aria-label="Edit product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-2 rounded-lg border border-slate-200 hover:bg-red-50 text-red-700"
                              aria-label="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* COMMISSION & REVENUE TAB (INTERNAL ONLY) */}
              {activeTab === 'commission' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-950">
                    <strong>Internal Planning Notice:</strong> These commission, variable cost, and fixed cost values are planning assumptions for internal administration only—not confirmed bank agreements and never visible to customers.
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Editable Assumptions Form */}
                    <form
                      onSubmit={handleSaveCommission}
                      className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4"
                    >
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-emerald-700" />
                        <h2 className="font-display font-bold text-base text-[#0B1F3A]">
                          Commission & Cost Assumptions
                        </h2>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Estimated Referral Commission (₹ / completed referral)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={commRate}
                          onChange={(e) => setCommRate(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm tabular-nums"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Estimated Variable Cost (₹ / completed referral)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={varCost}
                          onChange={(e) => setVarCost(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm tabular-nums"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Monthly Fixed Cost Assumption (₹)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={fixedCost}
                          onChange={(e) => setFixedCost(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm tabular-nums"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Target Customers per Month
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={targetMonthly}
                          onChange={(e) => setTargetMonthly(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm tabular-nums"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={savingCommission}
                        className="w-full py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-slate-800 text-white text-sm font-semibold"
                      >
                        {savingCommission ? 'Saving...' : 'Save Planning Assumptions'}
                      </button>
                    </form>

                    {/* Calculated Surplus Table */}
                    <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
                      <h2 className="font-display font-bold text-base text-[#0B1F3A]">
                        Calculated Unit Economics & Monthly Surplus
                      </h2>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                          <p className="text-xs text-slate-500">Contribution / Referral</p>
                          <p className="font-mono text-xl font-bold text-emerald-700 tabular-nums mt-1">
                            ₹{contributionPerReferral.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                          <p className="text-xs text-slate-500">Completed Referrals</p>
                          <p className="font-mono text-xl font-bold text-[#0B1F3A] tabular-nums mt-1">
                            {completedCount}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                          <p className="text-xs text-slate-500">Break-Even Volume</p>
                          <p className="font-mono text-xl font-bold text-[#0B1F3A] tabular-nums mt-1">
                            {breakEvenReferrals !== null ? `${breakEvenReferrals} / mo` : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-xs text-slate-500">
                              <th className="py-2 text-left">Metric</th>
                              <th className="py-2 text-right">Current ({completedCount} Done)</th>
                              <th className="py-2 text-right">Target ({parsedTarget} / mo)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                            <tr>
                              <td className="py-2.5 font-sans text-slate-700">
                                Est. Commission Revenue
                              </td>
                              <td className="py-2.5 text-right">
                                ₹{actualRevenue.toLocaleString('en-IN')}
                              </td>
                              <td className="py-2.5 text-right">
                                ₹{targetRevenue.toLocaleString('en-IN')}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-sans text-slate-700">Variable Costs</td>
                              <td className="py-2.5 text-right text-slate-600">
                                - ₹{actualVarCost.toLocaleString('en-IN')}
                              </td>
                              <td className="py-2.5 text-right text-slate-600">
                                - ₹{targetVarCost.toLocaleString('en-IN')}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-sans text-slate-700">Monthly Fixed Costs</td>
                              <td className="py-2.5 text-right text-slate-600">
                                - ₹{parsedFixed.toLocaleString('en-IN')}
                              </td>
                              <td className="py-2.5 text-right text-slate-600">
                                - ₹{parsedFixed.toLocaleString('en-IN')}
                              </td>
                            </tr>
                            <tr className="font-bold">
                              <td className="py-3 font-sans text-[#0B1F3A]">
                                Estimated Operating Surplus
                              </td>
                              <td
                                className={`py-3 text-right ${
                                  actualSurplus >= 0 ? 'text-emerald-700' : 'text-red-700'
                                }`}
                              >
                                ₹{actualSurplus.toLocaleString('en-IN')}
                              </td>
                              <td
                                className={`py-3 text-right ${
                                  targetSurplus >= 0 ? 'text-emerald-700' : 'text-red-700'
                                }`}
                              >
                                ₹{targetSurplus.toLocaleString('en-IN')}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SETTINGS & FIREBASE GUIDE TAB */}
              {activeTab === 'settings' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <form
                    onSubmit={handleSaveSettings}
                    className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4"
                  >
                    <h2 className="font-display font-bold text-base text-[#0B1F3A]">
                      WhatsApp & Contact Configuration
                    </h2>
                    <p className="text-xs text-slate-500">
                      Uses standard click-to-chat links (wa.me). No third-party WhatsApp Business API webhook is required or pretended.
                    </p>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        WhatsApp Business Number (with country code, e.g. 919876543210)
                      </label>
                      <input
                        type="text"
                        value={waNumber}
                        onChange={(e) => setWaNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Dehradun Office / Market Coverage Label
                      </label>
                      <input
                        type="text"
                        value={officeLoc}
                        onChange={(e) => setOfficeLoc(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Support Hours
                      </label>
                      <input
                        type="text"
                        value={supportHrs}
                        onChange={(e) => setSupportHrs(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
                    >
                      {savingSettings ? 'Saving...' : 'Save Contact Settings'}
                    </button>
                  </form>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                    <h2 className="font-display font-bold text-base text-[#0B1F3A]">
                      Storage Mode & Connecting Firebase Later
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Currently running with persistent server-side storage (<code className="font-mono">.data/dukaandhan-db.json</code>) and signed admin sessions because Firebase setup was skipped.
                    </p>
                    <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside leading-relaxed">
                      <li>Create a Firebase project in the Firebase Console and enable <strong>Cloud Firestore</strong> + <strong>Firebase Authentication</strong>.</li>
                      <li>Install the Firebase Web SDK (<code className="font-mono">npm install firebase</code>) and store your config in <code className="font-mono">firebase-applet-config.json</code>.</li>
                      <li>Deploy strict <code className="font-mono">firestore.rules</code> isolating <code className="font-mono">enquiries</code>, <code className="font-mono">commission</code>, and <code className="font-mono">admins</code> from public reads.</li>
                      <li>Replace the Express session login in <code className="font-mono">AdminView.tsx</code> with Firebase Auth (<code className="font-mono">signInWithPopup</code> / verified admin UID check).</li>
                    </ol>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Lead Management Modal */}
      {selectedEnquiry && dashboard && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-mono text-emerald-700 font-semibold">
                  {selectedEnquiry.enquiryId} · {selectedEnquiry.serviceRequired}
                </p>
                <h2 className="font-display font-bold text-xl text-[#0B1F3A]">
                  {selectedEnquiry.fullName} — {selectedEnquiry.businessName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedEnquiry.businessCategory} · {selectedEnquiry.businessLocation} · Income:{' '}
                  {selectedEnquiry.monthlyIncomeRange}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEnquiry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Application Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    {APPLICATION_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assign Team Member
                  </label>
                  <select
                    value={editAssignee}
                    onChange={(e) => setEditAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    {dashboard.teamMembers.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Referred Bank / Partner
                  </label>
                  <select
                    value={editPartnerId}
                    onChange={(e) => setEditPartnerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="">Not referred yet</option>
                    {dashboard.partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.verificationStatus})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer-Visible Tracking Update
                  </label>
                  <input
                    type="text"
                    value={editCustomerUpdate}
                    onChange={(e) => setEditCustomerUpdate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Add Interaction Note
                  </label>
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Record call summary, document guidance given, or bank referral feedback..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                  <label className="mt-1.5 inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noteVisible}
                      onChange={(e) => setNoteVisible(e.target.checked)}
                    />
                    <span>Also publish this note to customer tracking view</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={savingLead}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
                >
                  {savingLead ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>

            {/* Interaction History */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Interaction History ({selectedEnquiry.notes.length})
              </p>
              {selectedEnquiry.notes.length === 0 ? (
                <p className="text-xs text-slate-500">No interaction notes logged yet.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedEnquiry.notes.map((n) => (
                    <div key={n.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <p className="text-slate-800">{n.text}</p>
                      <p className="text-slate-500 mt-1 font-mono">
                        {n.author} · {new Date(n.createdAt).toLocaleString()}
                        {n.visibleToCustomer ? ' · Public Update' : ' · Internal'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Edit/Create Modal */}
      {editingProduct && dashboard && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h2 className="font-display font-bold text-lg text-[#0B1F3A]">
                {editingProduct.id ? 'Edit Financial Product' : 'Add Financial Product'}
              </h2>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'business_loan'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as ServiceCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="business_loan">Business Loan</option>
                    <option value="current_account">Current Account</option>
                    <option value="insurance">Business Insurance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Partner</label>
                  <select
                    value={editingProduct.partnerId || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, partnerId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {dashboard.partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.nameEn || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Name (Hindi) *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.nameHi || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nameHi: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount / Balance Range (English)
                </label>
                <input
                  type="text"
                  value={editingProduct.amountOrBalanceLabelEn || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      amountOrBalanceLabelEn: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount / Balance Range (Hindi)
                </label>
                <input
                  type="text"
                  value={editingProduct.amountOrBalanceLabelHi || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      amountOrBalanceLabelHi: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isVerifiedRate)}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isVerifiedRate: e.target.checked })
                    }
                  />
                  <span>Indicative rate is verified with partner bank</span>
                </label>
                {editingProduct.isVerifiedRate && (
                  <input
                    type="text"
                    placeholder="e.g. 11.5% – 14.0% p.a. (Verified)"
                    value={editingProduct.indicativeRate || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, indicativeRate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eligibility (English)
                </label>
                <input
                  type="text"
                  value={editingProduct.eligibilityEn || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, eligibilityEn: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Terms & Conditions (English)
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.termsEn || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, termsEn: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                >
                  {savingProduct ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Partner Edit/Create Modal */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h2 className="font-display font-bold text-lg text-[#0B1F3A]">
                {editingPartner.id ? 'Edit Partner' : 'Add Financial Partner'}
              </h2>
              <button
                type="button"
                onClick={() => setEditingPartner(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Partner Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingPartner.name || ''}
                  onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institution Type
                </label>
                <select
                  value={editingPartner.type || 'Public Sector Bank'}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      type: e.target.value as BankPartner['type'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Public Sector Bank">Public Sector Bank</option>
                  <option value="Private Bank">Private Bank</option>
                  <option value="Small Finance Bank">Small Finance Bank</option>
                  <option value="Authorized Insurer">Authorized Insurer</option>
                  <option value="Government Scheme Channel">Government Scheme Channel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Verification Status
                </label>
                <select
                  value={editingPartner.verificationStatus || 'Sample / Onboarding'}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      verificationStatus: e.target.value as BankPartner['verificationStatus'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Sample / Onboarding">Sample / Onboarding</option>
                  <option value="Verified Partner">Verified Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Branch / Office Location
                </label>
                <input
                  type="text"
                  value={editingPartner.branchLocation || ''}
                  onChange={(e) =>
                    setEditingPartner({ ...editingPartner, branchLocation: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPartner}
                  className="px-5 py-2 rounded-lg bg-[#0B1F3A] text-white text-xs font-semibold"
                >
                  {savingPartner ? 'Saving...' : 'Save Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
