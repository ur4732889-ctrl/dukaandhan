export type Language = 'hi' | 'en';

export type PageView =
  | 'home'
  | 'services'
  | 'register'
  | 'checklist'
  | 'track'
  | 'admin';

export type ServiceCategory = 'business_loan' | 'current_account' | 'insurance';

export type ServiceRequirement =
  | 'Business Loan'
  | 'Current Account'
  | 'Insurance'
  | 'General Banking Guidance';

export type BusinessCategory =
  | 'Kirana Shop'
  | 'Vegetable/Fruit Vendor'
  | 'Tailor'
  | 'Other Small Business';

export type ContactMethod = 'Phone Call' | 'WhatsApp' | 'In-Person Visit (Dehradun)';

export type ApplicationStatus =
  | 'Enquiry Received'
  | 'Contact Pending'
  | 'Customer Contacted'
  | 'Documents Guidance Provided'
  | 'Referred to Bank'
  | 'Application Submitted'
  | 'Bank Decision Pending'
  | 'Completed'
  | 'Not Proceeding';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Enquiry Received',
  'Contact Pending',
  'Customer Contacted',
  'Documents Guidance Provided',
  'Referred to Bank',
  'Application Submitted',
  'Bank Decision Pending',
  'Completed',
  'Not Proceeding',
];

export const ACTIVE_PROGRESS_STATUSES: ApplicationStatus[] = [
  'Enquiry Received',
  'Contact Pending',
  'Customer Contacted',
  'Documents Guidance Provided',
  'Referred to Bank',
  'Application Submitted',
  'Bank Decision Pending',
  'Completed',
];

export interface FinancialProduct {
  id: string;
  category: ServiceCategory;
  subType: string;
  nameEn: string;
  nameHi: string;
  partnerId: string;
  partnerName: string;
  isVerifiedPartner: boolean;
  isVerifiedRate: boolean;
  indicativeRate?: string;
  amountOrBalanceLabelEn: string;
  amountOrBalanceLabelHi: string;
  featuresEn: string[];
  featuresHi: string[];
  eligibilityEn: string;
  eligibilityHi: string;
  documentsEn: string[];
  documentsHi: string[];
  termsEn: string;
  termsHi: string;
  isSampleTemplate: boolean;
  active: boolean;
  updatedAt: string;
}

export interface BankPartner {
  id: string;
  name: string;
  type: 'Public Sector Bank' | 'Private Bank' | 'Small Finance Bank' | 'Authorized Insurer' | 'Government Scheme Channel';
  verificationStatus: 'Verified Partner' | 'Sample / Onboarding';
  contactPerson: string;
  branchLocation: string;
  supportedCategories: ServiceCategory[];
  active: boolean;
}

export interface InteractionNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  visibleToCustomer: boolean;
}

export interface CustomerEnquiry {
  id: string;
  enquiryId: string;
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
  status: ApplicationStatus;
  assignedTo: string;
  referredPartnerId?: string;
  notes: InteractionNote[];
  customerVisibleUpdate?: string;
  isSample?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicTrackResult {
  enquiryId: string;
  fullName: string;
  businessName: string;
  businessLocation: string;
  serviceRequired: ServiceRequirement;
  status: ApplicationStatus;
  assignedAdvisor: string;
  customerVisibleUpdate: string;
  createdAt: string;
  updatedAt: string;
  isSample?: boolean;
}

export interface CommissionAssumptions {
  referralCommission: number;
  variableCostPerReferral: number;
  monthlyFixedCost: number;
  targetCustomersPerMonth: number;
  updatedAt: string;
}

export interface PublicSettings {
  whatsappNumber: string;
  officeLocation: string;
  supportHours: string;
  isDemoMode: boolean;
}

export interface PublicCatalogResponse {
  products: FinancialProduct[];
  partners: Array<Pick<BankPartner, 'id' | 'name' | 'type' | 'verificationStatus' | 'supportedCategories'>>;
  settings: PublicSettings;
}

export interface AdminDashboardResponse {
  enquiries: CustomerEnquiry[];
  products: FinancialProduct[];
  partners: BankPartner[];
  commission: CommissionAssumptions;
  settings: PublicSettings;
  teamMembers: string[];
  adminUser: {
    email: string;
    name: string;
    role: string;
  };
}
