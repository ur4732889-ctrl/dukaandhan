import type {
  AdminDashboardResponse,
  BankPartner,
  BusinessCategory,
  CommissionAssumptions,
  ContactMethod,
  CustomerEnquiry,
  FinancialProduct,
  PublicCatalogResponse,
  PublicSettings,
  PublicTrackResult,
  ServiceRequirement,
} from '../types';

const TOKEN_KEY = 'dukaandhan_admin_token';

export function getStoredAdminToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredAdminToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

async function requestJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data: unknown = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    const errMsg = (data as { error?: string }).error || `Request failed (${res.status})`;
    throw new Error(errMsg);
  }
  return data as T;
}

function adminHeaders(): Record<string, string> {
  const token = getStoredAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchPublicCatalog(): Promise<PublicCatalogResponse> {
  return requestJson<PublicCatalogResponse>('/api/public/catalog');
}

export interface CreateEnquiryPayload {
  fullName: string;
  mobile: string;
  businessName: string;
  businessCategory: BusinessCategory;
  businessLocation: string;
  monthlyIncomeRange: string;
  serviceRequired: ServiceRequirement;
  selectedProductName?: string;
  preferredLanguage: 'Hindi' | 'English';
  preferredContactMethod: ContactMethod;
  consentGiven: boolean;
}

export interface CreateEnquiryResponse {
  enquiryId: string;
  status: string;
  createdAt: string;
  fullName: string;
  businessName: string;
  serviceRequired: ServiceRequirement;
}

export async function submitCustomerEnquiry(payload: CreateEnquiryPayload): Promise<CreateEnquiryResponse> {
  return requestJson<CreateEnquiryResponse>('/api/public/enquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function trackCustomerEnquiry(enquiryId: string, mobile: string): Promise<PublicTrackResult> {
  return requestJson<PublicTrackResult>('/api/public/track', {
    method: 'POST',
    body: JSON.stringify({ enquiryId, mobile }),
  });
}

export async function adminLogin(email: string, password: string): Promise<{
  token: string;
  adminUser: { email: string; name: string; role: string };
}> {
  const data = await requestJson<{
    token: string;
    adminUser: { email: string; name: string; role: string };
  }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setStoredAdminToken(data.token);
  return data;
}

export async function fetchAdminDashboard(): Promise<AdminDashboardResponse> {
  return requestJson<AdminDashboardResponse>('/api/admin/dashboard', {
    headers: adminHeaders(),
  });
}

export async function updateAdminEnquiry(
  id: string,
  payload: {
    status?: string;
    assignedTo?: string;
    referredPartnerId?: string;
    customerVisibleUpdate?: string;
    newNoteText?: string;
    noteVisibleToCustomer?: boolean;
  }
): Promise<CustomerEnquiry> {
  return requestJson<CustomerEnquiry>(`/api/admin/enquiries/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function downloadAdminCsv(params: { service: string; status: string; q: string }): Promise<void> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/admin/enquiries/export.csv?${qs}`, {
    headers: adminHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to export CSV.');
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dukaandhan-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function createAdminProduct(payload: Partial<FinancialProduct>): Promise<FinancialProduct> {
  return requestJson<FinancialProduct>('/api/admin/products', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function updateAdminProduct(id: string, payload: Partial<FinancialProduct>): Promise<FinancialProduct> {
  return requestJson<FinancialProduct>(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminProduct(id: string): Promise<void> {
  await requestJson<{ ok: boolean }>(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
}

export async function createAdminPartner(payload: Partial<BankPartner>): Promise<BankPartner> {
  return requestJson<BankPartner>('/api/admin/partners', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function updateAdminPartner(id: string, payload: Partial<BankPartner>): Promise<BankPartner> {
  return requestJson<BankPartner>(`/api/admin/partners/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminPartner(id: string): Promise<void> {
  await requestJson<{ ok: boolean }>(`/api/admin/partners/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
}

export async function updateAdminCommission(payload: Partial<CommissionAssumptions>): Promise<CommissionAssumptions> {
  return requestJson<CommissionAssumptions>('/api/admin/commission', {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function updateAdminSettings(payload: Partial<PublicSettings>): Promise<PublicSettings> {
  return requestJson<PublicSettings>('/api/admin/settings', {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
}

export function buildWhatsAppLink(whatsappNumber: string, message: string): string {
  const cleanNumber = whatsappNumber.replace(/\D/g, '') || '919876543210';
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
